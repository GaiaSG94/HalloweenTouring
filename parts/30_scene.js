/* ===== 30_scene — renderer, lights, earth, atmosphere, stars ===== */
let _seed = 7;
function srand() {
  _seed = (_seed * 1664525 + 1013904223) >>> 0;
  return _seed / 4294967296;
}

let renderer, scene, camera, tiltGroup, spinGroup, earthMat;

function makeRenderer() {
  const r = new THREE.WebGLRenderer({ antialias: true });
  r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  r.setSize(window.innerWidth, window.innerHeight);
  r.toneMapping = THREE.ACESFilmicToneMapping;
  r.toneMappingExposure = 1.1;
  document.body.appendChild(r.domElement);
  return r;
}

function makeLights(s) {
  const sun = new THREE.DirectionalLight(0xfff2df, 2.4);
  sun.position.set(5, 1.6, 2.6);
  s.add(sun);
  s.userData.sun = sun;
  s.add(new THREE.AmbientLight(0x8fb4d8, 0.38));
}

function makeEarth(s) {
  earthMat = new THREE.MeshStandardMaterial({
    color: 0x0d3a5c, roughness: 1.0, metalness: 0.0,
    emissive: 0xffffff, emissiveIntensity: 0.45,
  });
  const earth = new THREE.Mesh(new THREE.SphereGeometry(GLOBE_R, 96, 96), earthMat);
  spinGroup.add(earth);
  new THREE.TextureLoader().load(
    EARTH_TEXTURE_URL,
    (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      earthMat.map = tex;
      earthMat.color.set(0xffffff);
      earthMat.needsUpdate = true;
    },
    undefined,
    () => showError('Texture Terre introuvable : ' + EARTH_TEXTURE_URL),
  );
  new THREE.TextureLoader().load(
    EARTH_NIGHT_URL,
    (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      earthMat.emissiveMap = tex;
      earthMat.needsUpdate = true;
    },
    undefined,
    () => showError('Texture nuit introuvable : ' + EARTH_NIGHT_URL),
  );
}

// Blue halo shell (fresnel falloff), slightly larger than the globe.
function makeAtmosphere(s) {
  const material = new THREE.ShaderMaterial({
    uniforms: { glowColor: { value: new THREE.Color(0x4d9fff) } },
    vertexShader: [
      'varying vec3 vNormal;',
      'void main() {',
      '  vNormal = normalize(normalMatrix * normal);',
      '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
      '}',
    ].join('\n'),
    fragmentShader: [
      'uniform vec3 glowColor;',
      'varying vec3 vNormal;',
      'void main() {',
      '  float rim = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.2);',
      '  gl_FragColor = vec4(glowColor, 1.0) * rim;',
      '}',
    ].join('\n'),
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
  });
  const halo = new THREE.Mesh(new THREE.SphereGeometry(GLOBE_R * 1.18, 64, 64), material);
  s.add(halo);
}

function starSprite() {
  return canvasTexture(64, (ctx, size) => {
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.35, 'rgba(255,255,255,0.85)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  });
}

function makeStarShell(radius, count, size) {
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const tints = [[1, 1, 1], [1, 1, 1], [1, 1, 1], [0.74, 0.82, 1], [1, 0.89, 0.75]];
  const v = new THREE.Vector3();
  for (let i = 0; i < count; i++) {
    v.set(srand() * 2 - 1, srand() * 2 - 1, srand() * 2 - 1).normalize().multiplyScalar(radius);
    pos.set([v.x, v.y, v.z], i * 3);
    col.set(tints[Math.floor(srand() * tints.length)], i * 3);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const points = new THREE.Points(
    geo,
    new THREE.PointsMaterial({
      size, map: starSprite(), vertexColors: true, opacity: 0.9,
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    }),
  );
  points.frustumCulled = false;
  return points;
}

// Small glowing dots on monument sites so they read at globe distance.
function makeMarkers() {
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(MONUMENTS.length * 3);
  const v = new THREE.Vector3();
  MONUMENTS.forEach((m, i) => {
    latLonToVec3(m.lat, m.lon, GLOBE_R + 0.004, v);
    pos.set([v.x, v.y, v.z], i * 3);
  });
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const points = new THREE.Points(geo, new THREE.PointsMaterial({
    size: 8, sizeAttenuation: false, map: starSprite(), color: 0xff9a2e,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  }));
  points.frustumCulled = false;
  spinGroup.add(points);
}

function buildScene() {
  renderer = makeRenderer();
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x01030a);
  camera = new THREE.PerspectiveCamera(CAM.fov, window.innerWidth / window.innerHeight, CAM.near, CAM.far);
  camera.position.set(0, 0, CAM.z0);
  makeLights(scene);
  tiltGroup = new THREE.Group();
  spinGroup = new THREE.Group();
  spinGroup.rotation.y = SPIN0;
  tiltGroup.add(spinGroup);
  scene.add(tiltGroup);
  makeEarth(scene);
  makeAtmosphere(scene);
  scene.add(makeStarShell(30, 1400, 0.5));
  scene.add(makeStarShell(70, 2200, 0.9));
  makeMarkers();
}
