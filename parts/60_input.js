/* ===== 60_input — drag to spin, wheel/pinch to zoom ===== */
const input = { dragging: false, lastX: 0, lastY: 0, lastEnd: 0, pinchD: 0 };

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

function zoomBy(f) {
  camera.position.z = clamp(camera.position.z * f, CAM.zMin, CAM.zMax);
}

function pinchDist(m) {
  const [a, b] = [...m.values()];
  return Math.hypot(a[0] - b[0], a[1] - b[1]);
}

function setupInput() {
  const el = renderer.domElement;
  const pointers = new Map();
  el.addEventListener('pointerdown', (e) => {
    el.setPointerCapture(e.pointerId);
    pointers.set(e.pointerId, [e.clientX, e.clientY]);
    if (pointers.size === 1) {
      input.dragging = true;
      input.lastX = e.clientX;
      input.lastY = e.clientY;
    } else if (pointers.size === 2) {
      input.dragging = false;
      input.pinchD = pinchDist(pointers);
    }
  });
  el.addEventListener('pointermove', (e) => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, [e.clientX, e.clientY]);
    if (pointers.size === 1 && input.dragging) {
      const dx = e.clientX - input.lastX;
      const dy = e.clientY - input.lastY;
      input.lastX = e.clientX;
      input.lastY = e.clientY;
      spinGroup.rotation.y += dx * 0.0055;
      tiltGroup.rotation.x = clamp(tiltGroup.rotation.x + dy * 0.004, -TILT_MAX, TILT_MAX);
    } else if (pointers.size === 2) {
      const d = pinchDist(pointers);
      if (input.pinchD > 0 && d > 0) zoomBy(input.pinchD / d);
      input.pinchD = d;
    }
  });
  const up = (e) => {
    pointers.delete(e.pointerId);
    if (pointers.size === 0) {
      input.dragging = false;
      input.lastEnd = performance.now();
    } else if (pointers.size === 1) {
      const [x, y] = [...pointers.values()][0];
      input.dragging = true;
      input.lastX = x;
      input.lastY = y;
    }
  };
  el.addEventListener('pointerup', up);
  el.addEventListener('pointercancel', up);
  el.addEventListener('wheel', (e) => {
    e.preventDefault();
    zoomBy(1 + e.deltaY * 0.0011);
  }, { passive: false });
}
