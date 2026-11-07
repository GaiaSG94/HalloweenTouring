/* ===== 50_labels — monument name tags projected each frame ===== */
const labelLayer = document.getElementById('labels');
const labelItems = []; // { el, group, topLocal }
function addLabel(name, group, topLocal) {
  const el = document.createElement('div');
  el.className = 'lbl';
  el.textContent = name;
  labelLayer.appendChild(el);
  labelItems.push({ el, group, topLocal });
}

const _lv = new THREE.Vector3();
const _lw = new THREE.Vector3();
const _ln = new THREE.Vector3();
const _lc = new THREE.Vector3();

function uiZones() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const narrow = w < 640;
  return [
    { x0: 0, y0: 0, x1: narrow ? 230 : 360, y1: narrow ? 40 : 64 },
    { x0: w / 2 - 220, y0: h - 58, x1: w / 2 + 220, y1: h },
  ];
}

function labelBox(el, x, y) {
  const bw = el._bw || 18 + el.textContent.length * 6.4;
  const bh = 26;
  let cx = clamp(x, bw / 2 + 6, window.innerWidth - bw / 2 - 6);
  let cy = clamp(y, bh + 8, window.innerHeight - 10);
  const [header, hint] = uiZones();
  let box = { x0: cx - bw / 2, y0: cy - bh, x1: cx + bw / 2, y1: cy };
  if (boxesOverlap(box, header)) {
    cy = header.y1 + bh;
    box = { x0: cx - bw / 2, y0: cy - bh, x1: cx + bw / 2, y1: cy };
  }
  if (boxesOverlap(box, hint)) {
    cy = hint.y0 - 4;
    box = { x0: cx - bw / 2, y0: cy - bh, x1: cx + bw / 2, y1: cy };
  }
  return { ...box, cx, cy };
}

function boxesOverlap(a, b) {
  return !(a.x1 < b.x0 || a.x0 > b.x1 || a.y1 < b.y0 || a.y0 > b.y1);
}

function updateLabels() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const cands = [];
  for (const { el, group, topLocal } of labelItems) {
    group.getWorldPosition(_lw);
    _ln.copy(_lw).normalize();
    _lc.copy(camera.position).sub(_lw).normalize();
    const facing = _ln.dot(_lc);
    _lv.set(0, topLocal, 0).applyMatrix4(group.matrixWorld).project(camera);
    if (facing > 0.3 && _lv.z < 1) {
      cands.push({ el, facing, x: (_lv.x * 0.5 + 0.5) * w, y: (-_lv.y * 0.5 + 0.5) * h });
    } else {
      el.style.display = 'none';
    }
  }
  cands.sort((a, b) => b.facing - a.facing);
  const placed = [];
  for (const c of cands) {
    let box = labelBox(c.el, c.x, c.y);
    if (placed.some((p) => boxesOverlap(box, p))) {
      c.el.style.display = 'none';
    } else {
      placed.push(box);
      c.el.style.display = 'block';
      if (!c.el._bw && c.el.offsetWidth) {
        c.el._bw = c.el.offsetWidth + 2;
        box = labelBox(c.el, c.x, c.y);
      }
      c.el.style.transform =
        `translate(${box.cx.toFixed(1)}px, ${box.cy.toFixed(1)}px) translate(-50%,-100%)`;
    }
  }
}
