/* ===== 40_eiffel — Tour Eiffel (Paris) ===== */
function eiffelLegs(g, iron) {
  const feet = [[-21, -21], [21, -21], [-21, 21], [21, 21]];
  for (const [fx, fz] of feet) {
    const sx = Math.sign(fx) * 11;
    const sz = Math.sign(fz) * 11;
    g.add(beamBetween(new THREE.Vector3(fx, 0, fz), new THREE.Vector3(sx, 57, sz), 5.5, 3.4, iron));
    put(box(9, 4, 9, iron), fx, 2, fz, g);
  }
  for (let k = 0; k < 4; k++) {
    const arch = new THREE.Mesh(new THREE.TorusGeometry(16, 2.6, 10, 24, Math.PI), iron);
    arch.position.set(0, 9, 20);
    const holder = new THREE.Group();
    holder.add(arch);
    holder.rotation.y = (k * Math.PI) / 2;
    g.add(holder);
  }
}

function eiffelBraces(g, iron) {
  const levels = [10, 22, 34, 46];
  const halfAt = (y) => 21 - (10 * y) / 57;
  for (const y of levels) {
    const x1 = halfAt(y);
    const x2 = halfAt(y + 10);
    const faces = [
      [new THREE.Vector3(-x1, y, x1), new THREE.Vector3(x2, y + 10, x2), new THREE.Vector3(x1, y, x1), new THREE.Vector3(-x2, y + 10, x2)],
      [new THREE.Vector3(-x1, y, -x1), new THREE.Vector3(x2, y + 10, -x2), new THREE.Vector3(x1, y, -x1), new THREE.Vector3(-x2, y + 10, -x2)],
      [new THREE.Vector3(x1, y, -x1), new THREE.Vector3(x2, y + 10, x2), new THREE.Vector3(x1, y, x1), new THREE.Vector3(x2, y + 10, -x2)],
      [new THREE.Vector3(-x1, y, -x1), new THREE.Vector3(-x2, y + 10, x2), new THREE.Vector3(-x1, y, x1), new THREE.Vector3(-x2, y + 10, -x2)],
    ];
    for (const [a, b, c, d] of faces) {
      g.add(beamBetween(a, b, 1.3, 1.3, iron));
      g.add(beamBetween(c, d, 1.3, 1.3, iron));
    }
  }
}

function eiffelUpper(g, iron) {
  put(box(54, 5, 54, iron), 0, 59.5, 0, g);
  for (const z of [-26, 26]) put(box(54, 2.4, 1, iron), 0, 63, z, g);
  for (const x of [-26, 26]) put(box(1, 2.4, 54, iron), x, 63, 0, g);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    g.add(beamBetween(new THREE.Vector3(sx * 11, 62, sz * 11), new THREE.Vector3(sx * 4.5, 115, sz * 4.5), 2.8, 1.8, iron));
  }
  put(box(26, 4, 26, iron), 0, 117, 0, g);
  put(cyl(4, 5.5, 150, iron, 12), 0, 194, 0, g);
  put(box(12, 10, 12, iron), 0, 272, 0, g);
  put(cyl(1.4, 1.8, 30, iron, 8), 0, 292, 0, g);
}

function buildEiffel() {
  const g = new THREE.Group();
  const iron = mat(0x5a4128, 0.9, 0.05);
  eiffelLegs(g, iron);
  eiffelBraces(g, iron);
  eiffelUpper(g, iron);
  g.add(groundDisc(38));
  return { group: g, top: 308 };
}
BUILDERS.eiffel = buildEiffel;
