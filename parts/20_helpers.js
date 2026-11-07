/* ===== 20_helpers — shared builders (no duplicated logic) ===== */
function showError(msg) {
  const el = document.getElementById('err');
  el.style.display = 'block';
  el.textContent = msg;
}
window.addEventListener('error', (e) => showError('Erreur : ' + (e.message || e.type)));
window.addEventListener('unhandledrejection', (e) =>
  showError('Erreur : ' + (e.reason && e.reason.message ? e.reason.message : e.reason)));

// Convert lat/lon (deg) to a point on a sphere of radius r.
// Matches THREE.SphereGeometry UVs + equirectangular textures (u=0 at lon -180).
function latLonToVec3(lat, lon, r, out) {
  const theta = ((90 - lat) * Math.PI) / 180;
  const phi = ((lon + 180) * Math.PI) / 180;
  out.set(
    -r * Math.sin(theta) * Math.cos(phi),
    r * Math.cos(theta),
    r * Math.sin(theta) * Math.sin(phi),
  );
  return out;
}

const _up = new THREE.Vector3(0, 1, 0);
const _n = new THREE.Vector3();

// Stand a group upright on the globe at lat/lon, facing rotated by faceDeg.
function placeOnGlobe(group, lat, lon, faceDeg, mult) {
  latLonToVec3(lat, lon, GLOBE_R - 0.0002, group.position);
  _n.copy(group.position).normalize();
  group.quaternion.setFromUnitVectors(_up, _n);
  group.rotateY((faceDeg * Math.PI) / 180);
  group.scale.setScalar(SCALE * mult);
  return group;
}

function mat(color, rough = 0.85, metal = 0.0, extra = {}) {
  return new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra });
}

function box(w, h, d, material) {
  return new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
}

function cyl(rt, rb, h, material, seg = 20) {
  return new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), material);
}

function put(mesh, x, y, z, parent) {
  mesh.position.set(x, y, z);
  parent.add(mesh);
  return mesh;
}

// Tapered beam between two points (legs, arms, braces).
function beamBetween(a, b, r1, r2, material) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const len = dir.length();
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r2, r1, len, 10), material);
  mesh.position.copy(a).addScaledVector(dir, 0.5);
  mesh.quaternion.setFromUnitVectors(_up, dir.normalize());
  return mesh;
}

// Flat arch panel (rectangle + round top), facing +Z, base at y=0.
function archPanel(w, h, material) {
  const r = w / 2;
  const s = new THREE.Shape();
  s.moveTo(-r, 0);
  s.lineTo(-r, h - r);
  s.absarc(0, h - r, r, Math.PI, 0, true);
  s.lineTo(r, 0);
  s.closePath();
  return new THREE.Mesh(new THREE.ShapeGeometry(s, 12), material);
}

// Soft fake-AO disc to ground a monument on the globe.
function groundDisc(radius, opacity = 0.42) {
  const m = new THREE.Mesh(
    new THREE.CircleGeometry(radius, 40),
    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity, depthWrite: false }),
  );
  m.rotation.x = -Math.PI / 2;
  m.position.y = 2.5;
  return m;
}

function canvasTexture(size, draw) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  draw(c.getContext('2d'), size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
