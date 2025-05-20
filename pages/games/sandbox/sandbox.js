import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/PointerLockControls.js';

let camera, scene, renderer, controls;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let canJump = false;
let velocity = new THREE.Vector3();
let direction = new THREE.Vector3();
const GRAVITY = 9.8;
const PLAYER_HEIGHT = 1.75;
const PLAYER_RADIUS = 0.3;

const clock = new THREE.Clock();

let objects = [];         // All blocks in the world
let holdingBlock = null;  // The block currently held by the player

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, PLAYER_HEIGHT, 5);

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
  const groundMat = new THREE.MeshLambertMaterial({ color: 0x228822 });
  const groundGeo = new THREE.PlaneGeometry(200, 200);
  const ground = new THREE.Mesh(groundGeo, groundMat);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  ground.userData.isGround = true;
  scene.add(ground);

  // Spawn initial blocks randomly
  const blockGeo = new THREE.BoxGeometry(1, 1, 1);
  for (let i = 0; i < 30; i++) {
    const blockMat = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
    const block = new THREE.Mesh(blockGeo, blockMat);
    block.position.set(Math.random() * 40 - 20, 0.5, Math.random() * 40 - 20);
    block.userData.velocity = new THREE.Vector3(0, 0, 0);
    scene.add(block);
    objects.push(block);
  }

  // Events
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  window.addEventListener('resize', onWindowResize);
}

// Key handlers
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
        velocity.y = 7;
        canJump = false;
      }
      break;
    case 'KeyE': 
      if (holdingBlock) {
        placeBlock();
      } else {
        pickUpBlock();
      }
      break;
    case 'KeyQ': throwBlock(); break;
    case 'KeyR': spawnBlock(); break;
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

// Pick up closest block within 2 units
function pickUpBlock() {
  if (holdingBlock) return;
  const playerPos = controls.getObject().position;
  for (let i = 0; i < objects.length; i++) {
    const block = objects[i];
    const dist = block.position.distanceTo(playerPos);
    if (dist < 2 && block.userData.velocity.length() < 0.1) { // only pick up stationary blocks
      holdingBlock = objects.splice(i, 1)[0];
      holdingBlock.userData.velocity.set(0,0,0);
      return;
    }
  }
}

// Place block in front of player snapped to grid, if no collision
function placeBlock() {
  if (!holdingBlock) return;

  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);

  // Calculate target position 1.5 units in front of player, snapped to integer grid
  const targetPos = controls.getObject().position.clone().add(dir.multiplyScalar(1.5));
  targetPos.x = Math.round(targetPos.x);
  targetPos.y = Math.round(targetPos.y);
  targetPos.z = Math.round(targetPos.z);

  // Check collision with existing blocks or ground (we allow placing on ground or blocks)
  if (checkCollisionAt(targetPos)) {
    return; // Can't place block here
  }

  // Place block
  holdingBlock.position.copy(targetPos);
  holdingBlock.userData.velocity.set(0, 0, 0);
  scene.add(holdingBlock);
  objects.push(holdingBlock);
  holdingBlock = null;
}

// Throw block forward with velocity, remove from holding
function throwBlock() {
  if (!holdingBlock) return;
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);
  holdingBlock.position.copy(controls.getObject().position).add(dir.multiplyScalar(2));
  holdingBlock.userData.velocity = dir.multiplyScalar(8).add(new THREE.Vector3(0, 3, 0)); // forward + upward boost
  scene.add(holdingBlock);
  objects.push(holdingBlock);
  holdingBlock = null;
}

// Spawn a new block at player's feet if not holding block already
function spawnBlock() {
  if (holdingBlock) return;
  const blockGeo = new THREE.BoxGeometry(1, 1, 1);
  const blockMat = new THREE.MeshLambertMaterial({ color: Math.random() * 0xffffff });
  const block = new THREE.Mesh(blockGeo, blockMat);
  block.position.copy(controls.getObject().position);
  block.position.y = PLAYER_HEIGHT;
  block.userData.velocity = new THREE.Vector3(0, 0, 0);
  holdingBlock = block;
}

// Window resize handler
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Check collision for a 1x1x1 cube at targetPos (vector3)
function checkCollisionAt(targetPos) {
  // Check ground limit
  if (targetPos.y < 0.5) return true; // blocks can't go below ground

  // Check against all blocks
  for (const block of objects) {
    if (block.position.distanceTo(targetPos) < 0.9) {
      return true;
    }
  }
  return false;
}

// Player collision detection & resolution to prevent walking through blocks
function resolvePlayerCollisions() {
  const pos = controls.getObject().position;

  for (const block of objects) {
    const dx = pos.x - block.position.x;
    const dz = pos.z - block.position.z;

    const distX = Math.abs(dx);
    const distZ = Math.abs(dz);
    const combinedRadius = PLAYER_RADIUS + 0.5; // block half-width

    // Simple horizontal collision
    if (distX < combinedRadius && distZ < combinedRadius) {
      // Push player outside the block along x or z axis depending on penetration
      if (distX > distZ) {
        pos.x = block.position.x + Math.sign(dx) * combinedRadius;
      } else {
        pos.z = block.position.z + Math.sign(dz) * combinedRadius;
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();

  // Movement damping (friction)
  velocity.x -= velocity.x * 10.0 * delta;
  velocity.z -= velocity.z * 10.0 * delta;

  // Gravity acceleration
  velocity.y -= GRAVITY * delta;

  // Determine direction vector from input keys
  direction.z = Number(moveForward) - Number(moveBackward);
  direction.x = Number(moveRight) - Number(moveLeft);
  direction.normalize();

  // Accelerate based on input
  if (moveForward || moveBackward) velocity.z -= direction.z * 40.0 * delta;
  if (moveLeft || moveRight) velocity.x -= direction.x * 40.0 * delta;

  // Move player horizontally
  controls.moveRight(-velocity.x * delta);
  controls.moveForward(-velocity.z * delta);

  // Move player vertically
  controls.getObject().position.y += velocity.y * delta;

  // Collision with ground
  if (controls.getObject().position.y < PLAYER_HEIGHT) {
    velocity.y = 0;
    controls.getObject().position.y = PLAYER_HEIGHT;
    canJump = true;
  }

  // Player collision resolution with blocks
  resolvePlayerCollisions();

  // Move held block in front of player
  if (holdingBlock) {
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    holdingBlock.position.copy(controls.getObject().position).add(dir.multiplyScalar(1.5));
    holdingBlock.position.y = Math.round(holdingBlock.position.y); // keep y snapped for placing
  }

  // Update thrown blocks physics: velocity, gravity, collision
  for (const block of objects) {
    if (!block.userData.velocity) continue;

    // Apply gravity to block velocity
    block.userData.velocity.y -= GRAVITY * delta * 0.5; // slower gravity for floating effect

    // Update block position
    block.position.add(block.userData.velocity.clone().multiplyScalar(delta));

    // Collision with ground
    if (block.position.y < 0.5) {
      block.position.y = 0.5;
      block.userData.velocity.y = 0;
      block.userData.velocity.x *= 0.8; // friction horizontal
      block.userData.velocity.z *= 0.8;
      if (block.userData.velocity.length() < 0.01) {
        block.userData.velocity.set(0, 0, 0);
      }
    }

    // Collision with other blocks (stacking)
    for (const other of objects) {
      if (other === block) continue;
      // Only check vertical collision if block is above other
      if (block.position.y > other.position.y + 0.5) {
        const dx = block.position.x - other.position.x;
        const dz = block.position.z - other.position.z;
        if (Math.abs(dx) < 0.9 && Math.abs(dz) < 0.9) {
          // Check if block falls onto other block
          if (block.position.y - other.position.y <= 1) {
            block.position.y = other.position.y + 1;
            block.userData.velocity.y = 0;
            block.userData.velocity.x *= 0.8;
            block.userData.velocity.z *= 0.8;
            if (block.userData.velocity.length() < 0.01) {
              block.userData.velocity.set(0, 0, 0);
            }
          }
        }
      }
    }
  }

  renderer.render(scene, camera);
}
