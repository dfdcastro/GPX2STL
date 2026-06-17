import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";

const sampleGpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="GPX STL Studio">
  <trk><name>Maratona</name><trkseg>
    <trkpt lat="-22.725" lon="-47.650"><ele>538</ele><time>2026-06-16T10:00:00Z</time></trkpt>
    <trkpt lat="-22.722" lon="-47.646"><ele>545</ele><time>2026-06-16T10:06:00Z</time></trkpt>
    <trkpt lat="-22.719" lon="-47.642"><ele>552</ele><time>2026-06-16T10:12:00Z</time></trkpt>
    <trkpt lat="-22.714" lon="-47.640"><ele>566</ele><time>2026-06-16T10:18:00Z</time></trkpt>
    <trkpt lat="-22.710" lon="-47.645"><ele>574</ele><time>2026-06-16T10:24:00Z</time></trkpt>
    <trkpt lat="-22.706" lon="-47.650"><ele>588</ele><time>2026-06-16T10:30:00Z</time></trkpt>
    <trkpt lat="-22.703" lon="-47.646"><ele>601</ele><time>2026-06-16T10:36:00Z</time></trkpt>
    <trkpt lat="-22.700" lon="-47.638"><ele>612</ele><time>2026-06-16T10:42:00Z</time></trkpt>
    <trkpt lat="-22.697" lon="-47.631"><ele>606</ele><time>2026-06-16T10:48:00Z</time></trkpt>
    <trkpt lat="-22.693" lon="-47.625"><ele>592</ele><time>2026-06-16T10:54:00Z</time></trkpt>
    <trkpt lat="-22.690" lon="-47.620"><ele>584</ele><time>2026-06-16T11:00:00Z</time></trkpt>
    <trkpt lat="-22.686" lon="-47.614"><ele>572</ele><time>2026-06-16T11:06:00Z</time></trkpt>
    <trkpt lat="-22.681" lon="-47.611"><ele>560</ele><time>2026-06-16T11:12:00Z</time></trkpt>
    <trkpt lat="-22.676" lon="-47.612"><ele>550</ele><time>2026-06-16T11:18:00Z</time></trkpt>
    <trkpt lat="-22.672" lon="-47.617"><ele>548</ele><time>2026-06-16T11:24:00Z</time></trkpt>
    <trkpt lat="-22.667" lon="-47.622"><ele>556</ele><time>2026-06-16T11:30:00Z</time></trkpt>
    <trkpt lat="-22.662" lon="-47.626"><ele>563</ele><time>2026-06-16T11:36:00Z</time></trkpt>
    <trkpt lat="-22.658" lon="-47.621"><ele>575</ele><time>2026-06-16T11:42:00Z</time></trkpt>
    <trkpt lat="-22.653" lon="-47.615"><ele>589</ele><time>2026-06-16T11:48:00Z</time></trkpt>
    <trkpt lat="-22.648" lon="-47.617"><ele>603</ele><time>2026-06-16T11:54:00Z</time></trkpt>
    <trkpt lat="-22.644" lon="-47.624"><ele>610</ele><time>2026-06-16T12:00:00Z</time></trkpt>
    <trkpt lat="-22.641" lon="-47.633"><ele>618</ele><time>2026-06-16T12:06:00Z</time></trkpt>
    <trkpt lat="-22.637" lon="-47.639"><ele>622</ele><time>2026-06-16T12:12:00Z</time></trkpt>
    <trkpt lat="-22.633" lon="-47.635"><ele>611</ele><time>2026-06-16T12:18:00Z</time></trkpt>
    <trkpt lat="-22.631" lon="-47.626"><ele>598</ele><time>2026-06-16T12:24:00Z</time></trkpt>
    <trkpt lat="-22.628" lon="-47.619"><ele>584</ele><time>2026-06-16T12:30:00Z</time></trkpt>
    <trkpt lat="-22.624" lon="-47.616"><ele>573</ele><time>2026-06-16T12:36:00Z</time></trkpt>
  </trkseg></trk>
</gpx>`;

const state = {
  points: [],
  font: null,
  model: null,
  stats: { distanceKm: 0, durationSeconds: 0, minEle: 0, maxEle: 0 },
};

const els = {
  viewer: document.querySelector("#viewer"),
  dropZone: document.querySelector("#dropZone"),
  fileInput: document.querySelector("#fileInput"),
  importButton: document.querySelector("#importButton"),
  exportStlButton: document.querySelector("#exportStlButton"),
  export3mfButton: document.querySelector("#export3mfButton"),
  resetCamera: document.querySelector("#resetCamera"),
  titleInput: document.querySelector("#titleInput"),
  subtitleDistance: document.querySelector("#subtitleDistance"),
  subtitleTime: document.querySelector("#subtitleTime"),
  subtitlePace: document.querySelector("#subtitlePace"),
  distanceText: document.querySelector("#distanceText"),
  timeText: document.querySelector("#timeText"),
  paceText: document.querySelector("#paceText"),
  fontSize: document.querySelector("#fontSize"),
  mapRotation: document.querySelector("#mapRotation"),
  truncate: document.querySelector("#truncate"),
  baseWidth: document.querySelector("#baseWidth"),
  baseThickness: document.querySelector("#baseThickness"),
  trackHeight: document.querySelector("#trackHeight"),
  trackWidth: document.querySelector("#trackWidth"),
  baseShape: document.querySelectorAll("input[name='baseShape']"),
  baseColor: document.querySelector("#baseColor"),
  trackColor: document.querySelector("#trackColor"),
  textColor: document.querySelector("#textColor"),
  pointCount: document.querySelector("#pointCount"),
  elevationRange: document.querySelector("#elevationRange"),
  distanceTotal: document.querySelector("#distanceTotal"),
};

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x16181b);

const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 1200);
camera.position.set(72, 74, 88);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
els.viewer.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 0, 0);

const hemi = new THREE.HemisphereLight(0xffffff, 0x1a1a1a, 2.8);
scene.add(hemi);

const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
keyLight.position.set(35, 70, 45);
keyLight.castShadow = true;
scene.add(keyLight);

const grid = new THREE.GridHelper(180, 36, 0x128dc4, 0x128dc4);
grid.material.opacity = 0.74;
grid.material.transparent = true;
grid.position.y = -0.04;
scene.add(grid);

const modelRoot = new THREE.Group();
scene.add(modelRoot);

new FontLoader().load(
  "https://unpkg.com/three@0.165.0/examples/fonts/helvetiker_bold.typeface.json",
  (font) => {
    state.font = font;
    rebuildModel();
    frameCamera();
  },
);

function currentOptions() {
  return {
    title: els.titleInput.value.trim() || "Minha corrida",
    subtitle: subtitleText(),
    fontSize: Number(els.fontSize.value),
    mapRotation: THREE.MathUtils.degToRad(Number(els.mapRotation.value)),
    truncate: Number(els.truncate.value) / 100,
    baseShape: document.querySelector("input[name='baseShape']:checked")?.value || "square",
    baseWidth: Number(els.baseWidth.value),
    baseThickness: Number(els.baseThickness.value),
    trackHeight: Number(els.trackHeight.value),
    trackWidth: Number(els.trackWidth.value),
    baseColor: els.baseColor.value,
    trackColor: els.trackColor.value,
    textColor: els.textColor.value,
  };
}

function subtitleText() {
  const parts = [];
  const distance = els.distanceText.value.trim();
  const time = els.timeText.value.trim();
  const pace = els.paceText.value.trim();
  if (els.subtitleDistance.checked && distance) {
    parts.push(distance);
  }
  if (els.subtitleTime.checked && time) {
    parts.push(time);
  }
  if (els.subtitlePace.checked && pace) {
    parts.push(pace);
  }
  return parts.join(" | ");
}

function formatDuration(totalSeconds) {
  const seconds = Math.max(0, Math.round(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

function formatPace(secondsPerKm) {
  const seconds = Math.max(0, Math.round(secondsPerKm));
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${String(secs).padStart(2, "0")}`;
}

function parseGpx(text) {
  const doc = new DOMParser().parseFromString(text, "application/xml");
  const parserError = doc.querySelector("parsererror");
  if (parserError) throw new Error("Arquivo GPX invalido.");

  const title =
    doc.querySelector("trk > name")?.textContent?.trim() ||
    doc.querySelector("rte > name")?.textContent?.trim() ||
    doc.querySelector("metadata > name")?.textContent?.trim() ||
    "";

  const nodes = [...doc.querySelectorAll("trkpt, rtept, wpt")];
  const points = nodes
    .map((node) => ({
      lat: Number(node.getAttribute("lat")),
      lon: Number(node.getAttribute("lon")),
      ele: Number(node.querySelector("ele")?.textContent ?? 0),
      time: parseGpxTime(node.querySelector("time")?.textContent),
    }))
    .filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lon));

  if (points.length < 2) throw new Error("O GPX precisa ter ao menos dois pontos.");
  return { points, title };
}

function parseGpxTime(value) {
  if (!value) return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? time : null;
}

function reducePoints(points, maxPoints = 520) {
  if (points.length <= maxPoints) return points;
  const stride = Math.ceil(points.length / maxPoints);
  const reduced = points.filter((_, index) => index % stride === 0);
  if (reduced.at(-1) !== points.at(-1)) reduced.push(points.at(-1));
  return reduced;
}

function statsFor(points) {
  let distance = 0;
  let minEle = Infinity;
  let maxEle = -Infinity;
  const times = points.map((point) => point.time).filter(Number.isFinite);
  for (let i = 0; i < points.length; i += 1) {
    minEle = Math.min(minEle, points[i].ele);
    maxEle = Math.max(maxEle, points[i].ele);
    if (i > 0) distance += haversine(points[i - 1], points[i]);
  }
  const durationSeconds = times.length >= 2 ? Math.max(0, (times.at(-1) - times[0]) / 1000) : 0;
  return { distanceKm: distance / 1000, durationSeconds, minEle, maxEle };
}

function haversine(a, b) {
  const radius = 6371000;
  const dLat = THREE.MathUtils.degToRad(b.lat - a.lat);
  const dLon = THREE.MathUtils.degToRad(b.lon - a.lon);
  const lat1 = THREE.MathUtils.degToRad(a.lat);
  const lat2 = THREE.MathUtils.degToRad(b.lat);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * radius * Math.asin(Math.sqrt(h));
}

function normalizePoints(rawPoints, options) {
  const points = reducePoints(rawPoints.slice(0, Math.max(2, Math.floor(rawPoints.length * options.truncate))));
  const layout = modelLayoutForBase(options);
  const centerLat = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
  const centerLon = points.reduce((sum, p) => sum + p.lon, 0) / points.length;
  const latMeters = 111320;
  const lonMeters = 111320 * Math.cos(THREE.MathUtils.degToRad(centerLat));
  const projected = points.map((point) => ({
    x: (point.lon - centerLon) * lonMeters,
    z: -(point.lat - centerLat) * latMeters,
    ele: point.ele,
  }));

  const rotated = projected.map((point) => {
    const x = point.x;
    const z = point.z;
    return {
      x: x * Math.cos(options.mapRotation) - z * Math.sin(options.mapRotation),
      z: x * Math.sin(options.mapRotation) + z * Math.cos(options.mapRotation),
      ele: point.ele,
    };
  });

  const bounds = rotated.reduce(
    (acc, p) => ({
      minX: Math.min(acc.minX, p.x),
      maxX: Math.max(acc.maxX, p.x),
      minZ: Math.min(acc.minZ, p.z),
      maxZ: Math.max(acc.maxZ, p.z),
    }),
    { minX: Infinity, maxX: -Infinity, minZ: Infinity, maxZ: -Infinity },
  );
  const boundsCenterX = (bounds.minX + bounds.maxX) / 2;
  const boundsCenterZ = (bounds.minZ + bounds.maxZ) / 2;
  const width = Math.max(bounds.maxX - bounds.minX, bounds.maxZ - bounds.minZ, 1);
  const scale = (options.baseWidth * layout.trackScale) / width;
  const minEle = Math.min(...points.map((p) => p.ele));
  const maxEle = Math.max(...points.map((p) => p.ele));
  const eleSpan = Math.max(maxEle - minEle, 1);

  return rotated.map((point) => {
    return {
      x: (point.x - boundsCenterX) * scale + layout.trackX,
      z: (point.z - boundsCenterZ) * scale + layout.trackZ,
      y: options.baseThickness / 2 + 0.35 + ((point.ele - minEle) / eleSpan) * options.trackHeight,
      ele: point.ele,
    };
  });
}

function makeBase(options) {
  const geometry = makeBaseGeometry(options);
  const material = new THREE.MeshStandardMaterial({ color: options.baseColor, roughness: 0.72 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = 0;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.name = "base";
  return mesh;
}

function makeBaseGeometry(options) {
  if (options.baseShape === "square") {
    const depth = options.baseWidth * 1.12;
    return new THREE.BoxGeometry(options.baseWidth, options.baseThickness, depth);
  }

  const radius = options.baseWidth * 0.64;
  const segments = options.baseShape === "hexagon" ? 6 : 96;
  const shape = new THREE.Shape();
  const angleOffset = options.baseShape === "hexagon" ? -Math.PI / 3 : -Math.PI / 2;
  for (let i = 0; i < segments; i += 1) {
    const angle = angleOffset + (i / segments) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: options.baseThickness,
    bevelEnabled: false,
    curveSegments: 24,
    steps: 1,
  });
  geometry.rotateX(Math.PI / 2);
  geometry.translate(0, options.baseThickness / 2, 0);
  return geometry;
}

function makeTrack(points, options) {
  const bottomY = options.baseThickness / 2;
  const halfWidth = options.trackWidth / 2;
  const positions = [];
  const normals = [];

  for (let i = 0; i < points.length; i += 1) {
    const prev = points[Math.max(0, i - 1)];
    const next = points[Math.min(points.length - 1, i + 1)];
    const dx = next.x - prev.x;
    const dz = next.z - prev.z;
    const len = Math.hypot(dx, dz) || 1;
    normals.push({ x: -dz / len, z: dx / len });
  }

  points.forEach((point, index) => {
    const normal = normals[index];
    positions.push(
      { x: point.x + normal.x * halfWidth, y: bottomY, z: point.z + normal.z * halfWidth },
      { x: point.x - normal.x * halfWidth, y: bottomY, z: point.z - normal.z * halfWidth },
      { x: point.x + normal.x * halfWidth, y: point.y, z: point.z + normal.z * halfWidth },
      { x: point.x - normal.x * halfWidth, y: point.y, z: point.z - normal.z * halfWidth },
    );
  });

  const vertices = [];
  const pushTri = (a, b, c) => vertices.push(...vec(positions[a]), ...vec(positions[b]), ...vec(positions[c]));
  for (let i = 0; i < points.length - 1; i += 1) {
    const a = i * 4;
    const b = (i + 1) * 4;
    pushTri(a, b, a + 2);
    pushTri(a + 2, b, b + 2);
    pushTri(a + 1, a + 3, b + 1);
    pushTri(a + 3, b + 3, b + 1);
    pushTri(a + 2, b + 2, a + 3);
    pushTri(a + 3, b + 2, b + 3);
    pushTri(a, a + 1, b);
    pushTri(a + 1, b + 1, b);
  }

  pushTri(0, 2, 1);
  pushTri(1, 2, 3);
  const last = (points.length - 1) * 4;
  pushTri(last, last + 1, last + 2);
  pushTri(last + 1, last + 3, last + 2);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
  geometry.computeVertexNormals();
  const material = new THREE.MeshStandardMaterial({ color: options.trackColor, roughness: 0.54 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  mesh.name = "elevation-track";
  return mesh;
}

function makeText(options) {
  if (!state.font) return new THREE.Group();

  const group = new THREE.Group();
  const material = new THREE.MeshStandardMaterial({ color: options.textColor, roughness: 0.48 });
  const textLayout = textLayoutForBase(options);
  const titleMesh = makeTextLine(options.title, options.fontSize, 0.85, textLayout.titleMaxWidth, material);
  titleMesh.rotation.x = -Math.PI / 2;
  titleMesh.position.set(0, options.baseThickness / 2 + 0.15, options.subtitle ? textLayout.titleZWithSubtitle : textLayout.titleZ);
  titleMesh.name = "title-text";
  group.add(titleMesh);

  if (options.subtitle) {
    const subtitleMesh = makeTextLine(options.subtitle, options.fontSize * 0.42, 0.55, textLayout.subtitleMaxWidth, material);
    subtitleMesh.rotation.x = -Math.PI / 2;
    subtitleMesh.position.set(0, options.baseThickness / 2 + 0.12, textLayout.subtitleZ);
    subtitleMesh.name = "subtitle-text";
    group.add(subtitleMesh);
  }

  return group;
}

function textLayoutForBase(options) {
  return modelLayoutForBase(options).text;
}

function modelLayoutForBase(options) {
  if (options.baseShape === "square") {
    return {
      trackScale: 0.58,
      trackX: 0,
      trackZ: -options.baseWidth * 0.1,
      text: {
        titleMaxWidth: options.baseWidth * 0.82,
        subtitleMaxWidth: options.baseWidth * 0.78,
        titleZ: options.baseWidth * 0.43,
        titleZWithSubtitle: options.baseWidth * 0.385,
        subtitleZ: options.baseWidth * 0.47,
      },
    };
  }

  const textZ = options.baseShape === "hexagon" ? 0.38 : 0.4;
  return {
    trackScale: 0.54,
    trackX: 0,
    trackZ: -options.baseWidth * 0.17,
    text: {
      titleMaxWidth: options.baseWidth * 0.62,
      subtitleMaxWidth: options.baseWidth * 0.58,
      titleZ: options.baseWidth * textZ,
      titleZWithSubtitle: options.baseWidth * (textZ - 0.04),
      subtitleZ: options.baseWidth * (textZ + 0.055),
    },
  };
}

function makeTextLine(text, size, depth, maxWidth, material) {
  const geometry = new TextGeometry(text, {
    font: state.font,
    size,
    depth,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.04,
    bevelSize: 0.04,
    bevelSegments: 1,
  });
  geometry.computeBoundingBox();
  const box = geometry.boundingBox;
  const textWidth = box.max.x - box.min.x;
  const scale = Math.min(1, maxWidth / Math.max(textWidth, 1));
  geometry.translate(-textWidth / 2, -box.min.y, 0);

  const mesh = new THREE.Mesh(geometry, material);
  mesh.scale.setScalar(scale);
  mesh.castShadow = true;
  return mesh;
}

function makeModel() {
  const options = currentOptions();
  const group = new THREE.Group();
  group.add(makeBase(options));

  if (state.points.length > 1) {
    group.add(makeTrack(normalizePoints(state.points, options), options));
  }
  group.add(makeText(options));
  return group;
}

function rebuildModel() {
  for (const child of [...modelRoot.children]) {
    modelRoot.remove(child);
    disposeObject(child);
  }
  state.model = makeModel();
  modelRoot.add(state.model);
  updateOutputs();
}

function disposeObject(object) {
  object.traverse((child) => {
    child.geometry?.dispose();
    if (Array.isArray(child.material)) child.material.forEach((mat) => mat.dispose());
    else child.material?.dispose();
  });
}

function updateOutputs() {
  for (const input of document.querySelectorAll("input[type='range']")) {
    const out = document.querySelector(`#${input.id}Out`);
    if (out) out.value = input.value;
  }
  els.pointCount.textContent = String(state.points.length);
  els.elevationRange.textContent = `${Math.round(state.stats.maxEle - state.stats.minEle)} m`;
  els.distanceTotal.textContent = `${state.stats.distanceKm.toFixed(2)} km`;
}

function updateEditableSubtitleFields() {
  els.distanceText.value = state.stats.distanceKm > 0 ? `${state.stats.distanceKm.toFixed(2)} km` : "";
  els.timeText.value = state.stats.durationSeconds > 0 ? formatDuration(state.stats.durationSeconds) : "";
  els.paceText.value =
    state.stats.durationSeconds > 0 && state.stats.distanceKm > 0
      ? `${formatPace(state.stats.durationSeconds / state.stats.distanceKm)} /km`
      : "";
}

function vec(point) {
  return [point.x, point.y, point.z];
}

async function loadGpxText(text) {
  const gpx = parseGpx(text);
  state.points = gpx.points;
  state.stats = statsFor(state.points);
  if (gpx.title) {
    els.titleInput.value = gpx.title;
  }
  updateEditableSubtitleFields();
  rebuildModel();
  frameCamera();
}

function frameCamera() {
  camera.clearViewOffset();
  if (!state.model) return;

  const box = new THREE.Box3().setFromObject(state.model);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const radius = Math.max(size.x, size.y, size.z) * 0.72;
  const verticalFov = THREE.MathUtils.degToRad(camera.fov);
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
  const fitFov = Math.min(verticalFov, horizontalFov);
  const distance = Math.max(radius / Math.sin(fitFov / 2), 95) * 2.15;
  const direction = new THREE.Vector3(0.24, 1.18, 0.82).normalize();

  camera.position.copy(center).add(direction.multiplyScalar(distance));
  controls.target.copy(center);
  controls.target.y += size.y * 0.02;
  camera.updateProjectionMatrix();
  controls.update();
}

function export3mf() {
  const model = state.model;
  model.updateWorldMatrix(true, true);
  const meshes = collectExportMeshes(model);
  const modelXml = build3mfModel(meshes);
  const files = {
    "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/>
</Types>`,
    "_rels/.rels": `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Target="/3D/3dmodel.model" Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel"/>
</Relationships>`,
    "3D/3dmodel.model": modelXml,
  };

  const filename = `${slugify(currentOptions().title) || "gpx-model"}.3mf`;
  downloadBlob(new Blob([createZip(files)], { type: "model/3mf" }), filename);
}

function exportStl() {
  const model = state.model;
  model.updateWorldMatrix(true, true);
  const meshes = collectExportMeshes(model);
  const filename = `${slugify(currentOptions().title) || "gpx-model"}.stl`;
  downloadBlob(new Blob([buildAsciiStl(meshes)], { type: "model/stl" }), filename);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function collectExportMeshes(model) {
  const buckets = {
    base: { id: 1, name: "Base", vertices: [], triangles: [], vertexIndex: new Map(), triangleIndex: new Set() },
    track: { id: 2, name: "Trajeto", vertices: [], triangles: [], vertexIndex: new Map(), triangleIndex: new Set() },
    text: { id: 3, name: "Texto", vertices: [], triangles: [], vertexIndex: new Map(), triangleIndex: new Set() },
  };

  model.traverse((child) => {
    if (!child.isMesh || !child.geometry) return;
    const bucket = exportBucketFor(child, buckets);
    if (!bucket) return;

    const geometry = child.geometry.index ? child.geometry.toNonIndexed() : child.geometry.clone();
    const pos = geometry.getAttribute("position");
    for (let i = 0; i < pos.count; i += 3) {
      const a = addExportVertex(bucket, new THREE.Vector3().fromBufferAttribute(pos, i).applyMatrix4(child.matrixWorld));
      const b = addExportVertex(bucket, new THREE.Vector3().fromBufferAttribute(pos, i + 1).applyMatrix4(child.matrixWorld));
      const c = addExportVertex(bucket, new THREE.Vector3().fromBufferAttribute(pos, i + 2).applyMatrix4(child.matrixWorld));
      if (a !== b && b !== c && c !== a) {
        addExportTriangle(bucket, a, b, c);
      }
    }
    geometry.dispose();
  });

  normalizeBuildPlate(Object.values(buckets));
  return Object.values(buckets)
    .filter((bucket) => bucket.vertices.length > 0)
    .map(({ vertexIndex, triangleIndex, ...bucket }) => bucket);
}

function addExportVertex(bucket, point) {
  const vertex = to3mfPoint(point);
  const key = `${fmt(vertex.x)},${fmt(vertex.y)},${fmt(vertex.z)}`;
  const existing = bucket.vertexIndex.get(key);
  if (existing !== undefined) return existing;
  const index = bucket.vertices.length;
  bucket.vertices.push(vertex);
  bucket.vertexIndex.set(key, index);
  return index;
}

function addExportTriangle(bucket, a, b, c) {
  const key = [a, b, c].slice().sort((left, right) => left - right).join(",");
  if (bucket.triangleIndex.has(key)) return;
  bucket.triangleIndex.add(key);
  bucket.triangles.push([a, b, c]);
}

function exportBucketFor(mesh, buckets) {
  if (mesh.name === "base") return buckets.base;
  if (mesh.name === "elevation-track") return buckets.track;
  if (mesh.name === "title-text" || mesh.name === "subtitle-text") return buckets.text;
  return null;
}

function to3mfPoint(point) {
  return { x: point.x, y: -point.z, z: point.y };
}

function normalizeBuildPlate(meshes) {
  const minZ = Math.min(...meshes.flatMap((mesh) => mesh.vertices.map((vertex) => vertex.z)));
  if (!Number.isFinite(minZ)) return;
  for (const mesh of meshes) {
    for (const vertex of mesh.vertices) {
      vertex.z -= minZ;
    }
  }
}

function build3mfModel(meshes) {
  const objects = meshes
    .map(
      (mesh) => `    <object id="${mesh.id}" type="model" partnumber="${escapeXml(mesh.name)}">
      <mesh>
        <vertices>
${mesh.vertices.map((v) => `          <vertex x="${fmt(v.x)}" y="${fmt(v.y)}" z="${fmt(v.z)}"/>`).join("\n")}
        </vertices>
        <triangles>
${mesh.triangles.map(([v1, v2, v3]) => `          <triangle v1="${v1}" v2="${v2}" v3="${v3}"/>`).join("\n")}
        </triangles>
      </mesh>
    </object>`,
    )
    .join("\n");

  const buildItems = meshes.map((mesh) => `    <item objectid="${mesh.id}"/>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<model unit="millimeter" xml:lang="pt-BR" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02">
  <metadata name="Title">${escapeXml(currentOptions().title)}</metadata>
  <resources>
${objects}
  </resources>
  <build>
${buildItems}
  </build>
</model>`;
}

function buildAsciiStl(meshes) {
  const name = slugify(currentOptions().title) || "gpx-model";
  const lines = [`solid ${name}`];

  for (const mesh of meshes) {
    for (const [a, b, c] of mesh.triangles) {
      const v1 = mesh.vertices[a];
      const v2 = mesh.vertices[b];
      const v3 = mesh.vertices[c];
      const normal = triangleNormal(v1, v2, v3);
      lines.push(
        `  facet normal ${fmt(normal.x)} ${fmt(normal.y)} ${fmt(normal.z)}`,
        "    outer loop",
        `      vertex ${fmt(v1.x)} ${fmt(v1.y)} ${fmt(v1.z)}`,
        `      vertex ${fmt(v2.x)} ${fmt(v2.y)} ${fmt(v2.z)}`,
        `      vertex ${fmt(v3.x)} ${fmt(v3.y)} ${fmt(v3.z)}`,
        "    endloop",
        "  endfacet",
      );
    }
  }

  lines.push(`endsolid ${name}`);
  return `${lines.join("\n")}\n`;
}

function triangleNormal(a, b, c) {
  const ab = { x: b.x - a.x, y: b.y - a.y, z: b.z - a.z };
  const ac = { x: c.x - a.x, y: c.y - a.y, z: c.z - a.z };
  const normal = {
    x: ab.y * ac.z - ab.z * ac.y,
    y: ab.z * ac.x - ab.x * ac.z,
    z: ab.x * ac.y - ab.y * ac.x,
  };
  const length = Math.hypot(normal.x, normal.y, normal.z) || 1;
  return { x: normal.x / length, y: normal.y / length, z: normal.z / length };
}

function createZip(files) {
  const encoder = new TextEncoder();
  const fileEntries = Object.entries(files).map(([name, content]) => ({
    name,
    nameBytes: encoder.encode(name),
    data: encoder.encode(content),
  }));
  const chunks = [];
  const central = [];
  let offset = 0;

  for (const file of fileEntries) {
    const crc = crc32(file.data);
    const localHeader = zipLocalHeader(file, crc);
    chunks.push(localHeader, file.nameBytes, file.data);
    central.push({ file, crc, offset });
    offset += localHeader.byteLength + file.nameBytes.length + file.data.length;
  }

  const centralStart = offset;
  for (const entry of central) {
    const centralHeader = zipCentralHeader(entry.file, entry.crc, entry.offset);
    chunks.push(centralHeader, entry.file.nameBytes);
    offset += centralHeader.byteLength + entry.file.nameBytes.length;
  }

  chunks.push(zipEndRecord(central.length, offset - centralStart, centralStart));
  return concatZipChunks(chunks);
}

function concatZipChunks(chunks) {
  const byteChunks = chunks.map((chunk) =>
    chunk instanceof Uint8Array ? chunk : new Uint8Array(chunk),
  );
  const size = byteChunks.reduce((sum, chunk) => sum + chunk.byteLength, 0);
  const output = new Uint8Array(size);
  let offset = 0;
  for (const chunk of byteChunks) {
    output.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return output;
}

function zipLocalHeader(file, crc) {
  const view = new DataView(new ArrayBuffer(30));
  view.setUint32(0, 0x04034b50, true);
  view.setUint16(4, 20, true);
  view.setUint16(6, 0, true);
  view.setUint16(8, 0, true);
  view.setUint16(10, 0, true);
  view.setUint16(12, 0, true);
  view.setUint32(14, crc, true);
  view.setUint32(18, file.data.length, true);
  view.setUint32(22, file.data.length, true);
  view.setUint16(26, file.nameBytes.length, true);
  view.setUint16(28, 0, true);
  return view.buffer;
}

function zipCentralHeader(file, crc, offset) {
  const view = new DataView(new ArrayBuffer(46));
  view.setUint32(0, 0x02014b50, true);
  view.setUint16(4, 20, true);
  view.setUint16(6, 20, true);
  view.setUint16(8, 0, true);
  view.setUint16(10, 0, true);
  view.setUint16(12, 0, true);
  view.setUint16(14, 0, true);
  view.setUint32(16, crc, true);
  view.setUint32(20, file.data.length, true);
  view.setUint32(24, file.data.length, true);
  view.setUint16(28, file.nameBytes.length, true);
  view.setUint16(30, 0, true);
  view.setUint16(32, 0, true);
  view.setUint16(34, 0, true);
  view.setUint16(36, 0, true);
  view.setUint32(38, 0, true);
  view.setUint32(42, offset, true);
  return view.buffer;
}

function zipEndRecord(fileCount, centralSize, centralStart) {
  const view = new DataView(new ArrayBuffer(22));
  view.setUint32(0, 0x06054b50, true);
  view.setUint16(4, 0, true);
  view.setUint16(6, 0, true);
  view.setUint16(8, fileCount, true);
  view.setUint16(10, fileCount, true);
  view.setUint32(12, centralSize, true);
  view.setUint32(16, centralStart, true);
  view.setUint16(20, 0, true);
  return view.buffer;
}

function crc32(data) {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ byte) & 0xff];
  }
  return (crc ^ 0xffffffff) >>> 0;
}

const crcTable = (() => {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i += 1) {
    let c = i;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
})();

function fmt(value) {
  return Number(value.toFixed(5));
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "");
}

function resizeRenderer() {
  window.scrollTo(0, 0);
  const { clientWidth, clientHeight } = els.viewer;
  renderer.setSize(clientWidth, clientHeight);
  camera.aspect = clientWidth / Math.max(clientHeight, 1);
  camera.updateProjectionMatrix();
  frameCamera();
}

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

for (const input of document.querySelectorAll("input:not([type='file'])")) {
  input.addEventListener("input", () => {
    rebuildModel();
    frameCamera();
  });
}

els.importButton.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    els.fileInput.click();
  }
});
els.exportStlButton.addEventListener("click", exportStl);
els.export3mfButton.addEventListener("click", export3mf);
els.resetCamera.addEventListener("click", frameCamera);

els.fileInput.addEventListener("change", async (event) => {
  const [file] = event.target.files;
  if (!file) return;
  try {
    await loadGpxText(await file.text());
  } catch (error) {
    window.alert(error.message || "Nao foi possivel ler o GPX.");
  } finally {
    event.target.value = "";
  }
});

for (const eventName of ["dragenter", "dragover"]) {
  window.addEventListener(eventName, (event) => {
    event.preventDefault();
    els.dropZone.classList.add("is-active");
  });
}

for (const eventName of ["dragleave", "drop"]) {
  window.addEventListener(eventName, (event) => {
    event.preventDefault();
    els.dropZone.classList.remove("is-active");
  });
}

window.addEventListener("drop", async (event) => {
  const [file] = event.dataTransfer.files;
  if (!file) return;
  try {
    await loadGpxText(await file.text());
  } catch (error) {
    window.alert(error.message || "Nao foi possivel ler o GPX.");
  }
});

window.addEventListener("resize", resizeRenderer);

resizeRenderer();
loadGpxText(sampleGpx);
frameCamera();
animate();
