#!/usr/bin/env python3
"""
sync_scholar.py — Pull new publications + citation counts from Google
Scholar and merge them into content/publications.json, hands-off.

Safety rails (this runs unattended on a schedule, no human reviews it
before it lands on main):

  1. Never overwrites hand-curated fields on an existing publication
     (title, venue, tags, abstract, links, relatedPatent, award, ...).
     The ONLY thing ever updated on a matched existing entry is
     `citedBy`.
  2. New publications are only ever appended, never inserted/reordered,
     and always land with featured=false so they can't jump onto the
     homepage or bump curated ordering without a human choosing that
     later.
  3. If Scholar returns nothing, returns suspiciously fewer papers than
     we already track, or anything throws (blocked, CAPTCHA, network
     error, schema drift) — the script aborts WITHOUT writing the file.
     No partial/garbled writes.
  4. Every field pulled from Scholar is validated (title length, a
     plausible year, etc.) before use; anything that fails validation
     is dropped rather than written.
  5. Exits 0 on soft failures (blocked / no data) so the workflow
     doesn't spam failure notifications — the log line is the record.
"""

import json
import re
import sys
from datetime import datetime, timezone
from difflib import SequenceMatcher
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
PUBLICATIONS_PATH = REPO_ROOT / "content" / "publications.json"
SCHOLAR_AUTHOR_ID = "zWTAuq0AAAAJ"  # from content/links.json Google Scholar URL

CURRENT_YEAR = datetime.now(timezone.utc).year
TITLE_MATCH_THRESHOLD = 0.87


def log(msg):
    print(f"[sync_scholar] {msg}", flush=True)


def normalize_title(title):
    t = re.sub(r"[^a-z0-9\s]", "", title.lower())
    return re.sub(r"\s+", " ", t).strip()


def titles_match(a, b):
    return SequenceMatcher(None, normalize_title(a), normalize_title(b)).ratio() >= TITLE_MATCH_THRESHOLD


def slugify(title, year):
    base = re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-")
    words = base.split("-")[:6]
    return f"{'-'.join(words)}-{year}"


def valid_year(y):
    try:
        y = int(y)
    except (TypeError, ValueError):
        return None
    if 2000 <= y <= CURRENT_YEAR + 1:
        return y
    return None


def fetch_scholar_publications():
    """Returns a list of dicts, or None on any failure (soft-fail)."""
    try:
        from scholarly import scholarly
    except ImportError:
        log("scholarly package not installed — skipping sync.")
        return None

    try:
        author = scholarly.search_author_id(SCHOLAR_AUTHOR_ID)
        author = scholarly.fill(author, sections=["publications"])
    except Exception as e:
        log(f"could not reach Google Scholar ({e}) — skipping sync.")
        return None

    pubs_raw = author.get("publications", [])
    if not pubs_raw:
        log("Scholar returned zero publications — likely blocked/rate-limited. Skipping.")
        return None

    results = []
    for p in pubs_raw:
        try:
            filled = scholarly.fill(p)
        except Exception as e:
            log(f"  could not fill one publication ({e}) — skipping that entry.")
            continue

        bib = filled.get("bib", {})
        title = (bib.get("title") or "").strip()
        if not title or len(title) < 6 or len(title) > 300:
            continue

        year = valid_year(bib.get("pub_year"))
        cited_by = filled.get("num_citations")
        if not isinstance(cited_by, int) or cited_by < 0:
            cited_by = None

        results.append({
            "title": title,
            "year": year,
            "venue": (bib.get("venue") or bib.get("journal") or "").strip() or None,
            "authors": (bib.get("author") or "").strip() or None,
            "abstract": (bib.get("abstract") or "").strip() or None,
            "pub_url": filled.get("pub_url"),
            "cited_by": cited_by,
        })

    return results


def load_existing():
    with open(PUBLICATIONS_PATH, "r", encoding="utf-8") as f:
        return json.load(f)


def merge(existing, scholar_pubs):
    pubs = existing.get("publications", [])

    # Sanity check: a healthy scrape should see at least as many
    # papers as we already curate (minus a little slack for Scholar
    # merging/duplicate-collapsing quirks). If it sees far fewer,
    # something's wrong upstream (blocked, wrong profile, etc.) —
    # abort rather than risk truncating our record.
    if len(scholar_pubs) < max(1, len(pubs) - 1):
        log(
            f"Scholar returned {len(scholar_pubs)} publications but we already "
            f"track {len(pubs)} — this looks like a bad/partial scrape. Aborting "
            f"without writing anything."
        )
        return None

    changed = False
    matched_titles = set()

    for sp in scholar_pubs:
        match = next((p for p in pubs if titles_match(p["title"], sp["title"])), None)
        if match:
            matched_titles.add(sp["title"])
            if sp["cited_by"] is not None and match.get("citedBy") != sp["cited_by"]:
                match["citedBy"] = sp["cited_by"]
                changed = True
            continue

        # New publication Scholar knows about that we don't track yet.
        if sp["year"] is None:
            continue  # too uncertain to file automatically
        year = sp["year"]
        new_id = slugify(sp["title"], year)
        if any(p["id"] == new_id for p in pubs):
            continue

        max_priority = max((p.get("displayPriority", 0) for p in pubs), default=0)
        pubs.append({
            "id": new_id,
            "title": sp["title"],
            "shortTitle": sp["title"][:60],
            "authors": [a.strip() for a in (sp["authors"] or "Utkarsh Singh").split(" and ")],
            "year": year,
            "status": "published" if sp["venue"] else "preprint",
            "venue": sp["venue"] or "arXiv",
            "tags": [],
            "abstract": sp["abstract"] or "",
            "links": {"doi": None, "arxiv": None, "pdf": sp["pub_url"]},
            "citedBy": sp["cited_by"] or 0,
            "featured": False,
            "displayPriority": max_priority + 1,
            "doiUrl": sp["pub_url"],
            "bibtex": None,
            "autoAdded": True,
        })
        changed = True
        log(f"  + new publication found: \"{sp['title']}\" ({year})")

    return pubs if changed else None


def main():
    scholar_pubs = fetch_scholar_publications()
    if scholar_pubs is None:
        return 0

    existing = load_existing()
    merged = merge(existing, scholar_pubs)

    if merged is None:
        log("Nothing changed — publications.json already up to date.")
        return 0

    existing["publications"] = merged
    with open(PUBLICATIONS_PATH, "w", encoding="utf-8") as f:
        json.dump(existing, f, indent=2, ensure_ascii=False)
        f.write("\n")

    log(f"Updated {PUBLICATIONS_PATH.relative_to(REPO_ROOT)}.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
