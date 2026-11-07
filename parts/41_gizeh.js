/* ===== 41_gizeh — Pyramides de Gizeh ===== */
function pyramid(base, h, material) {
  const m = new THREE.Mesh(new THREE.ConeGeometry(base * Math.SQRT1_2, h, 4, 1), material);
  m.rotation.y = Math.PI / 4;
  m.position.y = h / 2;
  return m;
}

function buildGizeh() {
  const g = new THREE.Group();
  const stone = mat(0xd9c9a3, 0.95, 0);
  const capstone = mat(0xb3a482, 0.95, 0);
  put(cyl(300, 320, 6, mat(0xe0cf9e, 1, 0), 48), 0, -3, 0, g);
  g.add(pyramid(230, 146, stone));
  const khephren = pyramid(215, 136, stone);
  khephren.position.set(-190, 68, -110);
  g.add(khephren);
  const cap = pyramid(215 * 0.15, 136 * 0.15, capstone);
  cap.position.set(-190, 136 * 0.925, -110);
  g.add(cap);
  const mykerinos = pyramid(105, 65, stone);
  mykerinos.position.set(170, 32.5, 160);
  g.add(mykerinos);
  for (let i = 0; i < 3; i++) {
    const q = pyramid(48, 32, stone);
    q.position.set(30 + i * 48, 16, 205);
    g.add(q);
  }
  g.add(groundDisc(330, 0.22));
  return { group: g, top: 150 };
}
BUILDERS.gizeh = buildGizeh;
