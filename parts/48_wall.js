/* ===== 48_wall — Grande Muraille de Chine (Badaling) ===== */
// A representative 800 m section snaking over a rocky ridge. The ridge also
// lifts the short wall clear of the globe-sink burial (no round AO disc fits).
function wallPath() {
  const pts = [];
  for (let x = -400; x <= 400; x += 20) {
    const z = 90 * Math.sin(x / 130) + 30 * Math.sin(x / 47);
    pts.push(new THREE.Vector3(x, 0, z));
  }
  return pts;
}

// Drop of the globe surface below the tangent plane (local units).
function wallCurveY(p) {
  return (-(p.x * p.x + p.z * p.z) * SCALE) / 2;
}

function wallYaw(a, b) {
  return Math.atan2(-(b.z - a.z), b.x - a.x);
}

function wallEndDip(i, n) {
  return i === 0 || i === n - 2 ? 7 : 0;
}

function wallRidge(g, pts, rocks) {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const seg = box(26, 24, 34, rocks[i % 2]);
    seg.position.set((a.x + b.x) / 2, 12 + wallCurveY(a) - wallEndDip(i, pts.length), (a.z + b.z) / 2);
    seg.rotation.y = wallYaw(a, b);
    g.add(seg);
  }
}

function wallBody(g, pts, stones) {
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const seg = box(20.5, 8, 6.5, stones[i % 3]);
    seg.position.set((a.x + b.x) / 2, 28 + wallCurveY(a) - wallEndDip(i, pts.length), (a.z + b.z) / 2);
    seg.rotation.y = wallYaw(a, b);
    g.add(seg);
  }
}

function wallTowers(g, pts, stone, roofMat) {
  for (let i = 4; i < pts.length - 1; i += 8) {
    const a = pts[i];
    const b = pts[i + 1];
    const y = wallCurveY(a);
    const t = box(13, 15, 13, stone);
    t.position.set(a.x, 31.5 + y, a.z);
    t.rotation.y = wallYaw(a, b);
    g.add(t);
    const roof = new THREE.Mesh(new THREE.ConeGeometry(10.5, 6, 4), roofMat);
    roof.rotation.y = wallYaw(a, b) + Math.PI / 4;
    roof.position.set(a.x, 42 + y, a.z);
    g.add(roof);
  }
}

function wallCrenels(g, pts, stone) {
  const geo = new THREE.BoxGeometry(2.2, 1.6, 1.2);
  const per = 5;
  const inst = new THREE.InstancedMesh(geo, stone, (pts.length - 1) * 2 * per);
  const dummy = new THREE.Object3D();
  let k = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const a = pts[i];
    const b = pts[i + 1];
    const yaw = wallYaw(a, b);
    const dx = (b.x - a.x) / per;
    const dz = (b.z - a.z) / per;
    const len = Math.hypot(b.x - a.x, b.z - a.z);
    const nx = (-(b.z - a.z) / len) * 3.2;
    const nz = ((b.x - a.x) / len) * 3.2;
    for (let s = 0; s < per; s++) {
      const px = a.x + dx * (s + 0.5);
      const pz = a.z + dz * (s + 0.5);
      for (const side of [-1, 1]) {
        dummy.position.set(px + nx * side, 32.8 + wallCurveY(a), pz + nz * side);
        dummy.rotation.set(0, yaw, 0);
        dummy.updateMatrix();
        inst.setMatrixAt(k++, dummy.matrix);
      }
    }
  }
  inst.instanceMatrix.needsUpdate = true;
  g.add(inst);
}

function buildWall() {
  const g = new THREE.Group();
  const pts = wallPath();
  const rocks = [mat(0x6b6257, 1, 0), mat(0x756c5e, 1, 0)];
  const stones = [mat(0x9a938a, 0.95, 0), mat(0x8f887e, 0.95, 0), mat(0xa39c90, 0.95, 0)];
  wallRidge(g, pts, rocks);
  wallBody(g, pts, stones);
  wallTowers(g, pts, stones[0], mat(0x4a5a6a, 0.8, 0));
  wallCrenels(g, pts, stones[1]);
  return { group: g, top: 48 };
}
BUILDERS.wall = buildWall;
