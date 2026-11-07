/* ===== 44_bigben — Big Ben / Elizabeth Tower (Londres) ===== */
const CLOCK_TEX = canvasTexture(128, (ctx) => {
  ctx.fillStyle = '#f2ead6';
  ctx.beginPath();
  ctx.arc(64, 64, 60, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#2c2c34';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(64, 64, 58, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#2c2c34';
  ctx.lineWidth = 4;
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(64 + Math.cos(a) * 46, 64 + Math.sin(a) * 46);
    ctx.lineTo(64 + Math.cos(a) * 55, 64 + Math.sin(a) * 55);
    ctx.stroke();
  }
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(64, 64);
  ctx.lineTo(64 + 26, 64 - 14);
  ctx.stroke();
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(64, 64);
  ctx.lineTo(64, 64 - 42);
  ctx.stroke();
});

function bigbenClocks(g) {
  const faceMat = new THREE.MeshStandardMaterial({ map: CLOCK_TEX, roughness: 0.6 });
  for (let k = 0; k < 4; k++) {
    const holder = new THREE.Group();
    const dial = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), faceMat);
    dial.position.set(0, 64.5, 7.9);
    holder.add(dial);
    holder.rotation.y = (k * Math.PI) / 2;
    g.add(holder);
  }
}

function buildBigben() {
  const g = new THREE.Group();
  const stone = mat(0xc9b586, 0.9, 0);
  const light = mat(0xd8c9a0, 0.85, 0);
  const dark = mat(0x43434f, 0.8, 0.1);
  put(box(18, 2, 18, stone), 0, 1, 0, g);
  put(box(14, 58, 14, stone), 0, 31, 0, g);
  put(box(15.5, 9, 15.5, light), 0, 64.5, 0, g);
  bigbenClocks(g);
  put(box(11, 8, 11, stone), 0, 73, 0, g);
  const spire = new THREE.Mesh(new THREE.ConeGeometry(7, 22, 8), dark);
  put(spire, 0, 88, 0, g);
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const pin = new THREE.Mesh(new THREE.ConeGeometry(1.2, 6, 6), dark);
    put(pin, sx * 6, 80, sz * 6, g);
  }
  put(new THREE.Mesh(new THREE.SphereGeometry(0.9, 10, 8), dark), 0, 100.5, 0, g);
  g.add(groundDisc(16));
  return { group: g, top: 102 };
}
BUILDERS.bigben = buildBigben;
