/* ===== 45_sydney — Opéra de Sydney ===== */
function sydneyShell(r, yScale, material) {
  const geo = new THREE.SphereGeometry(r, 28, 14, 0, Math.PI * 0.6, 0, Math.PI * 0.52);
  const m = new THREE.Mesh(geo, material);
  m.scale.set(1, yScale, 0.7);
  m.rotation.y = Math.PI * 0.2;
  return m;
}

function buildSydney() {
  const g = new THREE.Group();
  const shell = mat(0xf4f1e8, 0.5, 0, { side: THREE.DoubleSide });
  const granite = mat(0x7d7468, 0.9, 0);
  const glass = mat(0x1f2a33, 0.25, 0.6);
  put(box(130, 10, 70, granite), 0, 5, 0, g);
  put(box(120, 3, 64, granite), 0, 11.5, 0, g);
  for (const x of [-32, 0, 32]) {
    put(box(26, 8, 24, granite), x, 14, 2, g);
    const s = sydneyShell(22, 1.5, shell);
    s.position.set(x, 12, 2);
    g.add(s);
  }
  for (const x of [-16, 16]) {
    put(box(16, 8, 16, granite), x, 14, -26, g);
    const s = sydneyShell(13, 1.45, shell);
    s.position.set(x, 12, -26);
    g.add(s);
  }
  g.add(groundDisc(85));
  return { group: g, top: 58 };
}
BUILDERS.sydney = buildSydney;
