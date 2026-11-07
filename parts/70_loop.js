/* ===== 70_loop — monuments, resize, main loop, boot ===== */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function buildMonuments() {
  for (const m of MONUMENTS) {
    const { group, top } = BUILDERS[m.id]();
    placeOnGlobe(group, m.lat, m.lon, m.face, m.mult);
    spinGroup.add(group);
    addLabel(m.name, group, top);
  }
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Distance fitting the whole globe on narrow portrait screens.
function portraitFitZ() {
  const vHalf = (CAM.fov * Math.PI) / 360;
  const aspect = window.innerWidth / window.innerHeight;
  return Math.min(CAM.zMax, 1.32 / (Math.tan(vHalf) * aspect));
}

let prevT = performance.now();
function animate() {
  requestAnimationFrame(animate);
  const now = performance.now();
  const dt = Math.min((now - prevT) / 1000, 0.1);
  prevT = now;
  if (!reduceMotion && !input.dragging && now - input.lastEnd > RESUME_MS) {
    spinGroup.rotation.y += AUTO_SPEED * dt;
  }
  renderer.render(scene, camera);
  updateLabels();
}

try {
  buildScene();
  setupInput();
  buildMonuments();
  if (window.innerWidth < window.innerHeight) camera.position.z = portraitFitZ();
  if (window.matchMedia('(pointer: coarse)').matches) {
    document.getElementById('hint').textContent = 'Glisser : tourner · Pincer : zoomer';
  }
  onResize();
  window.addEventListener('resize', onResize);
  animate();
} catch (err) {
  showError('Erreur au démarrage : ' + (err && err.message ? err.message : err));
}
