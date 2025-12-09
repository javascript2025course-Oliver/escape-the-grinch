import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
import { PointerLockControls } from "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/PointerLockControls.js";

let scene, camera, renderer, controls;
let grinch, player;
let items = 0;
let grinchState = "patrol";

const ui = document.getElementById("ui");
const start = document.getElementById("start");

start.addEventListener("click", () => {
  controls.lock();
  start.style.display = "none";
});

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
  );

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new PointerLockControls(camera, document.body);
  scene.add(controls.getObject());

  // Floor (snow)
  const floorGeo = new THREE.PlaneGeometry(200, 200);
  const floorMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const floor = new THREE.Mesh(floorGeo, floorMat);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Light
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 20, 10);
  scene.add(light);

  // Player
  const playerGeo = new THREE.BoxGeometry(1, 2, 1);
  const playerMat = new THREE.MeshBasicMaterial({ color: 0x0000ff });
  player = new THREE.Mesh(playerGeo, playerMat);
  player.position.y = 1;
  scene.add(player);

  // Grinch
  const grinchGeo = new THREE.BoxGeometry(1.5, 2.5, 1.5);
  const grinchMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  grinch = new THREE.Mesh(grinchGeo, grinchMat);
  grinch.position.set(10, 1.25, 10);
  scene.add(grinch);

  camera.position.set(0, 2, 5);

  window.addEventListener("resize", onResize);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Movement
const keys = {};
document.addEventListener("keydown", e => keys[e.code] = true);
document.addEventListener("keyup", e => keys[e.code] = false);

function movePlayer() {
  const speed = 0.1;
  const obj = controls.getObject();

  if (keys["KeyW"]) obj.translateZ(-speed);
  if (keys["KeyS"]) obj.translateZ(speed);
  if (keys["KeyA"]) obj.translateX(-speed);
  if (keys["KeyD"]) obj.translateX(speed);

  player.position.copy(obj.position);
}

// Grinch AI
function moveGrinch() {
  const dist = grinch.position.distanceTo(player.position);

  if (dist < 6) grinchState = "chase";
  else if (dist > 12) grinchState = "patrol";

  if (grinchState === "chase") {
    grinch.lookAt(player.position);
    grinch.translateZ(0.05);
  }
}

// Loop
function animate() {
  requestAnimationFrame(animate);

  movePlayer();
  moveGrinch();

  renderer.render(scene, camera);
}
