/* ===== 47_burj — Burj Khalifa (Dubaï) ===== */
function buildBurj() {
  const g = new THREE.Group();
  const glass = mat(0xa8c4d6, 0.25, 0.7);
  const tiers = [
    [120, 34], [110, 30], [100, 26], [92, 22], [84, 18], [76, 14], [68, 10],
  ];
  let y = 0;
  for (const [h, r] of tiers) {
    const t = new THREE.Mesh(new THREE.CylinderGeometry(r * 0.88, r, h, 6), glass);
    t.rotation.y = Math.PI / 6;
    put(t, 0, y + h / 2, 0, g);
    y += h;
  }
  for (let i = 0; i < 3; i++) {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(5 - i, 6 - i, 20, 6), glass);
    put(c, 0, y + 10, 0, g);
    y += 20;
  }
  for (let k = 0; k < 3; k++) {
    const fin = box(3, 380, 80, glass);
    fin.position.y = 190;
    fin.rotation.y = (k * Math.PI * 2) / 3;
    g.add(fin);
  }
  put(cyl(1.2, 2, 120, glass, 8), 0, y + 60, 0, g);
  const beacon = new THREE.Mesh(
    new THREE.SphereGeometry(2, 10, 8),
    new THREE.MeshStandardMaterial({ color: 0xff2222, emissive: 0xff2222, emissiveIntensity: 3 }),
  );
  put(beacon, 0, y + 121, 0, g);
  g.add(groundDisc(60));
  return { group: g, top: y + 120 };
}
BUILDERS.burj = buildBurj;
