/* ===== 46_colosse — Colisée (Rome) ===== */
function colosseArches(g, dark) {
  const geo = new THREE.ShapeGeometry(archPanelShape(7, 13), 8);
  const dummy = new THREE.Object3D();
  for (const baseY of [4, 22]) {
    const inst = new THREE.InstancedMesh(geo, dark, 40);
    for (let i = 0; i < 40; i++) {
      const t = (i / 40) * Math.PI * 2;
      const r = 84 - (6 * (baseY + 6)) / 48;
      const x = Math.cos(t) * r * 1.25;
      const z = Math.sin(t) * r;
      dummy.position.set(x, baseY, z);
      dummy.lookAt(x * 2, baseY, z * 2);
      dummy.updateMatrix();
      inst.setMatrixAt(i, dummy.matrix);
    }
    inst.instanceMatrix.needsUpdate = true;
    g.add(inst);
  }
}

function archPanelShape(w, h) {
  const r = w / 2;
  const s = new THREE.Shape();
  s.moveTo(-r, 0);
  s.lineTo(-r, h - r);
  s.absarc(0, h - r, r, Math.PI, 0, true);
  s.lineTo(r, 0);
  s.closePath();
  return s;
}

function colosseAttic(g, dark) {
  const geo = new THREE.BoxGeometry(3, 4, 0.6);
  const inst = new THREE.InstancedMesh(geo, dark, 40);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 40; i++) {
    const t = ((i + 0.5) / 40) * Math.PI * 2;
    const x = Math.cos(t) * 79 * 1.25;
    const z = Math.sin(t) * 79;
    dummy.position.set(x, 41, z);
    dummy.lookAt(x * 2, 41, z * 2);
    dummy.updateMatrix();
    inst.setMatrixAt(i, dummy.matrix);
  }
  inst.instanceMatrix.needsUpdate = true;
  g.add(inst);
}

function buildColosse() {
  const g = new THREE.Group();
  const travertine = mat(0xd6c7a3, 0.9, 0, { side: THREE.DoubleSide });
  const dark = mat(0x2b2724, 0.95, 0);
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(78, 84, 48, 72, 1, true), travertine);
  wall.scale.x = 1.25;
  put(wall, 0, 24, 0, g);
  colosseArches(g, dark);
  colosseAttic(g, dark);
  const floor = new THREE.Mesh(new THREE.CircleGeometry(52, 48), mat(0xc7a86b, 1, 0));
  floor.rotation.x = -Math.PI / 2;
  floor.scale.x = 1.25;
  floor.position.y = 2.5;
  g.add(floor);
  const inner = new THREE.Mesh(
    new THREE.CylinderGeometry(54, 56, 22, 48, 1, true), mat(0xbfae87, 0.95, 0, { side: THREE.DoubleSide }));
  inner.scale.x = 1.25;
  put(inner, 0, 11, 0, g);
  put(box(46, 2, 26, dark), 0, 3.5, 0, g);
  put(box(40, 4, 2, dark), 0, 5, 8, g);
  put(box(40, 4, 2, dark), 0, 5, -8, g);
  g.add(groundDisc(115));
  return { group: g, top: 50 };
}
BUILDERS.colosse = buildColosse;
