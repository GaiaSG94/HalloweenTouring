/* ===== 10_config — constants, data ===== */
const EARTH_TEXTURE_URL =
  'https://unpkg.com/three-globe@2.45.6/example/img/earth-blue-marble.jpg';
const EARTH_NIGHT_URL =
  'https://unpkg.com/three-globe@2.45.6/example/img/earth-night.jpg';
const SCALE = 0.0001; // 1 local unit (1 m) -> globe radii; monuments ~x640 exaggerated
const GLOBE_R = 1;
const CAM = { fov: 42, z0: 3.0, zMin: 1.35, zMax: 8.0, near: 0.05, far: 400 };
const SPIN0 = (255 * Math.PI) / 180; // initial view faces Europe/Africa
const AUTO_SPEED = 0.05; // rad/s idle rotation
const RESUME_MS = 2500;
const TILT_MAX = 1.0;

// Famous monuments: real latitude/longitude, local-Y facing (deg), size multiplier.
const MONUMENTS = [
  { id: 'eiffel',  name: 'Tour Eiffel',          lat: 48.8584,  lon: 2.2945,    face: 0, mult: 1.0 },
  { id: 'gizeh',   name: 'Pyramides de Gizeh',   lat: 29.9792,  lon: 31.1342,   face: 0, mult: 1.0 },
  { id: 'wall',    name: 'Grande Muraille',      lat: 40.43,    lon: 116.57,    face: 0, mult: 1.0 },
  { id: 'liberty', name: 'Statue de la Liberté', lat: 40.6892,  lon: -74.0445,  face: 0, mult: 1.0 },
  { id: 'taj',     name: 'Taj Mahal',            lat: 27.1751,   lon: 78.0421,   face: 0, mult: 1.0 },
  { id: 'bigben',  name: 'Big Ben',              lat: 51.5007,   lon: -0.1246,   face: 0, mult: 1.0 },
  { id: 'sydney',  name: 'Opéra de Sydney',      lat: -33.8568, lon: 151.2153,  face: 0, mult: 1.0 },
  { id: 'colosse', name: 'Colisée',              lat: 41.8902,   lon: 12.4922,   face: 0, mult: 1.0 },
  { id: 'burj',    name: 'Burj Khalifa',         lat: 24.95,     lon: 55.55,     face: 0, mult: 0.35 },
];
const BUILDERS = {}; // id -> () => { group, top } (top = local height for labels)
