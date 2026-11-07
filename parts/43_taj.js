/* ===== 43_taj — Taj Mahal (Agra) ===== */
function tajOnion(r, h, material) {
  const pts = [
    [r, 0], [r * 1.06, h * 0.18], [r * 0.9, h * 0.45],
    [r * 0.55, h * 0.72], [r * 0.24, h * 0.88], [r * 0.08, h * 0.97], [0.05, h],
  ].map(([x, y]) => new THREE.Vector2(Math.max(x, 0.05), y));
  return new THREE.Mesh(new THREE.LatheGeometry(pts, 28), material);
}

function tajMinaret(g, x, z, marble) {
  put(box(10, 6, 10, marble), x, 8, z, g);
  put(cyl(2.6, 3.4, 42, marble), x, 32, z, g);
  put(cyl(4.4, 4.4, 2, marble), x, 54, z, g);
  const kiosk = tajOnion(3, 5, marble);
  kiosk.position.set(x, 55, z);
  g.add(kiosk);
}

function tajIwan(g, marble, dark) {
  for (let k = 0; k < 4; k++) {
    const holder = new THREE.Group();
    const frame = archPanel(17, 23, marble);
    frame.position.set(0, 5, 29.2);
    const inset = archPanel(11.5, 18, dark);
    inset.position.set(0, 5, 29.6);
    holder.add(frame, inset);
    holder.rotation.y = (k * Math.PI) / 2;
    g.add(holder);
  }
}

function buildTaj() {
  const g = new THREE.Group();
  const marble = mat(0xf2ede2, 0.55, 0);
  const dark = mat(0x2e2a26, 0.9, 0);
  const red = mat(0xa34a32, 0.85, 0);
  const gold = mat(0xc9a227, 0.35, 0.8);
  put(box(110, 5, 110, marble), 0, 2.5, 0, g);
  put(box(58, 24, 58, marble), 0, 17, 0, g);
  put(cyl(15, 15, 9, marble, 28), 0, 33.5, 0, g);
  const dome = tajOnion(16, 31, marble);
  dome.position.y = 38;
  g.add(dome);
  put(cyl(0.6, 0.6, 8, gold, 8), 0, 72, 0, g);
  put(new THREE.Mesh(new THREE.SphereGeometry(1.6, 12, 10), gold), 0, 75, 0, g);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    put(cyl(4, 4, 4, marble, 16), sx * 22, 31, sz * 22, g);
    const mini = tajOnion(4.2, 7, marble);
    mini.position.set(sx * 22, 33, sz * 22);
    g.add(mini);
    tajMinaret(g, sx * 48, sz * 48, marble);
  }
  tajIwan(g, marble, dark);
  for (const sx of [-1, 1]) {
    put(box(22, 14, 34, red), sx * 42, 12, 0, g);
    const w = tajOnion(5, 8, marble);
    w.position.set(sx * 42, 19, 0);
    g.add(w);
  }
  g.add(groundDisc(80));
  return { group: g, top: 79 };
}
BUILDERS.taj = buildTaj;
