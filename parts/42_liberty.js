/* ===== 42_liberty — Statue de la Liberté (New York) ===== */
function libertyPedestal(g, stone) {
  put(box(40, 8, 40, stone), 0, 4, 0, g);
  const shaft = cyl(10, 14, 34, stone, 4);
  shaft.rotation.y = Math.PI / 4;
  put(shaft, 0, 25, 0, g);
  put(box(26, 5, 26, stone), 0, 44.5, 0, g);
}

function libertyRobe(g, patina) {
  const pts = [
    [0.1, 0], [8.5, 0], [8, 7], [6.5, 18], [5.2, 28], [4.4, 35], [3.2, 40], [2.8, 44],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  put(new THREE.Mesh(new THREE.LatheGeometry(pts, 24), patina), 0, 47, 0, g);
  put(new THREE.Mesh(new THREE.SphereGeometry(3.8, 20, 16), patina), 0, 93.5, 0, g);
}

function libertyCrown(g, patina) {
  put(cyl(4.2, 4.2, 2, patina, 16), 0, 96, 0, g);
  for (let i = 0; i < 7; i++) {
    const a = ((i - 3) / 3) * 1.05;
    const spike = new THREE.Mesh(new THREE.ConeGeometry(0.8, 7, 8), patina);
    spike.position.set(Math.sin(a) * 4.2, 99, Math.cos(a) * 1.2 - 0.6);
    spike.rotation.z = -a * 0.55;
    spike.rotation.x = 0.12;
    g.add(spike);
  }
}

function libertyArms(g, patina) {
  g.add(beamBetween(new THREE.Vector3(5, 87, 0), new THREE.Vector3(17, 112, 0), 2.6, 2.0, patina));
  put(cyl(1, 1.3, 10, patina, 10), 17, 116, 0, g);
  const flame = new THREE.Mesh(
    new THREE.ConeGeometry(3, 9, 12),
    new THREE.MeshStandardMaterial({ color: 0xff7a1a, emissive: 0xff8c2a, emissiveIntensity: 2.6, roughness: 0.5 }),
  );
  put(flame, 17, 124, 0, g);
  const glow = libertyGlow(0xffa040, 18);
  glow.position.set(17, 124, 0);
  g.add(glow);
  g.add(beamBetween(new THREE.Vector3(-5, 87, 0), new THREE.Vector3(-11, 76, 6), 2.6, 2.0, patina));
  const tablet = put(box(8, 10, 1.6, patina), -11.5, 79, 9, g);
  tablet.rotation.x = -0.25;
}

function libertyGlow(color, scale) {
  const tex = canvasTexture(128, (ctx) => {
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(255,255,255,0.55)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
  });
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({
    map: tex, color, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false,
  }));
  sp.scale.setScalar(scale);
  return sp;
}

function buildLiberty() {
  const g = new THREE.Group();
  const stone = mat(0xb3a58c, 0.9, 0);
  const patina = mat(0x3e9c8b, 0.65, 0.15);
  libertyPedestal(g, stone);
  libertyRobe(g, patina);
  libertyCrown(g, patina);
  libertyArms(g, patina);
  g.add(groundDisc(36));
  return { group: g, top: 125 };
}
BUILDERS.liberty = buildLiberty;
