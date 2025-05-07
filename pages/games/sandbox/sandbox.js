import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/PointerLockControls.js';

let camera, scene, renderer, controls;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let canJump = false;
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
let objects = [];
let holdingBlock = null;

const clock = new THREE.Clock();
let playerCollider = { height: 1.75, radius: 0.3, y: 2.0 };

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, playerCollider.y, 5);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new PointerLockControls(camera, document.body);
  document.body.addEventListener('click', () => controls.lock());
  scene.add(controls.getObject());

  // Lights
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
  hemiLight.position.set(0, 200, 0);
  scene.add(hemiLight);

  const dirLight = new THREE.DirectionalLight(0xffffff);
  dirLight.position.set(-5, 10, -5);
  scene.add(dirLight);

  // Ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(200, 200),
    new THREE.MeshLambertMaterial({ color: 0x228822 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);

  // Blocks
  const blockGeo = new THREE.BoxGeometry(1, 1, 1);
  for (let i = 0; i < 30; i++) {
    const blockMat = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
    const block = new THREE.Mesh(blockGeo, blockMat);
    block.position.set(Math.random() * 40 - 20, 0.5, Math.random() * 40 - 20);
    scene.add(block);
    objects.push(block);
  }

  // Events
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  window.addEventListener('resize', onWindowResize);
}

function onKeyDown(e) {
  switch (e.code) {
    case 'ArrowUp':
    case 'KeyW': moveForward = true; break;
    case 'ArrowLeft':
    case 'KeyA': moveLeft = true; break;
    case 'ArrowDown':
    case 'KeyS': moveBackward = true; break;
    case 'ArrowRight':
    case 'KeyD': moveRight = true; break;
    case 'Space':
      if (canJump) {
        velocity.y += 8;
        canJump = false;
      }
      break;
    case 'KeyE': pickUpBlock(); break;
    case 'KeyQ': throwBlock(); break;
  }
}

function onKeyUp(e) {
  switch (e.code) {
    case 'ArrowUp':
    case 'KeyW': moveForward = false; break;
    case 'ArrowLeft':
    case 'KeyA': moveLeft = false; break;
    case 'ArrowDown':
    case 'KeyS': moveBackward = false; break;
    case 'ArrowRight':
    case 'KeyD': moveRight = false; break;
  }
}

function pickUpBlock() {
  if (holdingBlock) return;
  const playerPos = controls.getObject().position;
  for (let i = 0; i < objects.length; i++) {
    const block = objects[i];
    if (block.position.distanceTo(playerPos) < 2) {
      holdingBlock = objects.splice(i, 1)[0];
      return;
    }
  }
}

function throwBlock() {
  if (!holdingBlock) return;
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  holdingBlock.position.copy(controls.getObject().position).add(dir.clone().multiplyScalar(2));
  holdingBlock.userData.velocity = dir.clone().multiplyScalar(10);
  scene.add(holdingBlock);
  objects.push(holdingBlock);
  holdingBlock = null;
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  // Movement
  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;
  velocity.y -= 9.8 * delta; // gravity

  direction.z = Number(moveForward) - Number(moveBackward);
  direction.x = Number(moveRight) - Number(moveLeft);
  direction.normalize();

  if (moveForward || moveBackward) velocity.z -= direction.z * 40.0 * delta;
  if (moveLeft || moveRight) velocity.x -= direction.x * 40.0 * delta;

  controls.moveRight(-velocity.x * delta);
  controls.moveForward(-velocity.z * delta);
  controls.getObject().position.y += velocity.y * delta;

  // Ground collision
  if (controls.getObject().position.y < playerCollider.height) {
    velocity.y = 0;
    controls.getObject().position.y = playerCollider.height;
    canJump = true;
  }

  // Follow with block
  if (holdingBlock) {
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    holdingBlock.position.copy(controls.getObject().position).add(dir.clone().multiplyScalar(1.5));
  }

  // Thrown blocks motion
  for (const obj of objects) {
    if (obj.userData.velocity) {
      obj.position.add(obj.userData.velocity.clone().multiplyScalar(delta));
      obj.userData.velocity.multiplyScalar(0.98); // friction
    }
  }

  renderer.render(scene, camera);
}
