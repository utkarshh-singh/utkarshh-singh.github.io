/* =============================================================
   HERO-SCENE.JS — WebGL constellation sphere for the homepage hero.

   A particle sphere (fibonacci distribution) wrapped in a faint
   constellation mesh, orbited by two counter-rotating wireframe
   polyhedra. Slow autorotation + mouse parallax. Pauses when the
   tab is hidden or the canvas scrolls off screen. Skipped entirely
   for prefers-reduced-motion or missing WebGL.
   ============================================================= */

export async function initHeroScene(canvas) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let THREE;
  try {
    THREE = await import('https://unpkg.com/three@0.160.0/build/three.module.js');
  } catch {
    return; // offline / CDN blocked — CSS fallback glow stays visible
  }

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return;
  }

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
  camera.position.set(0, 0, 9.5);

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.setClearColor(0x000000, 0);

  const group = new THREE.Group();
  scene.add(group);

  /* ─── Colors sourced from the live CSS theme ─────────────── */
  function themeColors() {
    const s = getComputedStyle(document.documentElement);
    return {
      cyan: new THREE.Color(s.getPropertyValue('--accent-cyan').trim() || '#2af5d0'),
      violet: new THREE.Color(s.getPropertyValue('--accent-violet').trim() || '#9b6bff'),
      magenta: new THREE.Color(s.getPropertyValue('--accent-magenta').trim() || '#ff5fc4'),
    };
  }
  let colors = themeColors();

  /* ─── Soft circular sprite for points ─────────────────────── */
  function makeSprite() {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const ctx = c.getContext('2d');
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.4, 'rgba(255,255,255,0.6)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
  }
  const sprite = makeSprite();

  /* ─── Fibonacci sphere particle field ─────────────────────── */
  const COUNT = 260;
  const RADIUS = 3.4;
  const positions = new Float32Array(COUNT * 3);
  const colorAttr = new Float32Array(COUNT * 3);
  const pts = [];
  const phi = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < COUNT; i++) {
    const y = 1 - (i / (COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = phi * i;
    const x = Math.cos(theta) * r;
    const z = Math.sin(theta) * r;
    const v = new THREE.Vector3(x, y, z).multiplyScalar(RADIUS * (0.94 + Math.random() * 0.12));
    pts.push(v);
    positions[i * 3] = v.x;
    positions[i * 3 + 1] = v.y;
    positions[i * 3 + 2] = v.z;

    const mix = Math.random();
    const col = mix < 0.5
      ? colors.cyan.clone().lerp(colors.violet, mix * 2)
      : colors.violet.clone().lerp(colors.magenta, (mix - 0.5) * 2);
    colorAttr[i * 3] = col.r;
    colorAttr[i * 3 + 1] = col.g;
    colorAttr[i * 3 + 2] = col.b;
  }

  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pointsGeo.setAttribute('color', new THREE.BufferAttribute(colorAttr, 3));
  const pointsMat = new THREE.PointsMaterial({
    size: 0.085,
    map: sprite,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });
  const pointCloud = new THREE.Points(pointsGeo, pointsMat);
  group.add(pointCloud);

  /* ─── Static constellation lines between near neighbors ───── */
  const linePositions = [];
  const MAX_DIST = 1.55;
  const MAX_LINKS_PER_POINT = 3;
  for (let i = 0; i < pts.length; i++) {
    let links = 0;
    for (let j = i + 1; j < pts.length && links < MAX_LINKS_PER_POINT; j++) {
      if (pts[i].distanceTo(pts[j]) < MAX_DIST) {
        linePositions.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
        links++;
      }
    }
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePositions), 3));
  const lineMat = new THREE.LineBasicMaterial({
    color: colors.cyan,
    transparent: true,
    opacity: 0.12,
  });
  const lines = new THREE.LineSegments(lineGeo, lineMat);
  group.add(lines);

  /* ─── Orbiting wireframe polyhedra for depth ───────────────── */
  const inner = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.7, 0),
    new THREE.MeshBasicMaterial({ color: colors.violet, wireframe: true, transparent: true, opacity: 0.35 })
  );
  group.add(inner);

  const outer = new THREE.Mesh(
    new THREE.IcosahedronGeometry(4.7, 1),
    new THREE.MeshBasicMaterial({ color: colors.magenta, wireframe: true, transparent: true, opacity: 0.08 })
  );
  group.add(outer);

  /* ─── Resize handling ───────────────────────────────────────── */
  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    const w = rect.width, h = rect.height;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  /* ─── Mouse parallax ─────────────────────────────────────────── */
  let targetRotX = 0, targetRotY = 0;
  window.addEventListener('pointermove', (e) => {
    targetRotY = (e.clientX / window.innerWidth - 0.5) * 0.5;
    targetRotX = (e.clientY / window.innerHeight - 0.5) * 0.3;
  }, { passive: true });

  /* ─── Visibility gating (viewport + tab) ───────────────────── */
  let inView = true;
  const io = new IntersectionObserver(([entry]) => { inView = entry.isIntersecting; }, { threshold: 0.01 });
  io.observe(canvas);

  let running = true;
  document.addEventListener('visibilitychange', () => {
    running = document.visibilityState === 'visible';
  });

  /* ─── React to theme toggles ─────────────────────────────────── */
  const observer = new MutationObserver(() => {
    colors = themeColors();
    lineMat.color = colors.cyan;
    inner.material.color = colors.violet;
    outer.material.color = colors.magenta;
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

  /* ─── Render loop ───────────────────────────────────────────── */
  let frame = 0;
  function animate() {
    requestAnimationFrame(animate);
    if (!running || !inView) return;
    frame++;

    group.rotation.y += 0.0016;
    group.rotation.x += (targetRotX - group.rotation.x) * 0.02;
    inner.rotation.y -= 0.003;
    inner.rotation.x += 0.0012;
    outer.rotation.y += 0.0008;
    outer.rotation.x -= 0.0006;

    camera.position.x += (targetRotY * 1.6 - camera.position.x) * 0.03;
    camera.position.y += (-targetRotX * 1.2 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }

  canvas.classList.add('is-ready');
  animate();
}
