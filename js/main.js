import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class Game {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.player = null;
        this.arena = null;
    }

    init() {
        // Set up scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000020);
        this.scene.fog = new THREE.Fog(0x000020, 50, 200);

        // Set up camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.set(0, 15, 25);
        this.camera.lookAt(0, 0, 0);

        // Set up renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('game-container').appendChild(this.renderer.domElement);

        // Set up orbit controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.maxPolarAngle = Math.PI / 2; // Prevent camera from going below ground

        // Add lights
        this.addLights();

        // Create arena
        this.createArena();

        // Create player
        this.createPlayer();

        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);

        // Start animation loop
        this.animate();
    }

    addLights() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
        this.scene.add(ambientLight);

        // Directional light (sun-like)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(50, 100, 50);
        directionalLight.castShadow = true;
        directionalLight.shadow.camera.left = -50;
        directionalLight.shadow.camera.right = 50;
        directionalLight.shadow.camera.top = 50;
        directionalLight.shadow.camera.bottom = -50;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        this.scene.add(directionalLight);

        // Point light for dramatic effect
        const pointLight = new THREE.PointLight(0x00ffff, 0.5, 100);
        pointLight.position.set(0, 20, 0);
        this.scene.add(pointLight);
    }

    createArena() {
        // Create a group to hold all arena elements
        this.arena = new THREE.Group();

        // Ground plane
        const groundGeometry = new THREE.PlaneGeometry(100, 100);
        const groundMaterial = new THREE.MeshStandardMaterial({
            color: 0x1a1a2e,
            roughness: 0.8,
            metalness: 0.2
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.arena.add(ground);

        // Grid helper
        const gridHelper = new THREE.GridHelper(100, 50, 0x00ffff, 0x004466);
        gridHelper.position.y = 0.01; // Slightly above ground to prevent z-fighting
        this.arena.add(gridHelper);

        // Arena boundaries (walls)
        const wallHeight = 5;
        const wallThickness = 1;
        const arenaSize = 50;

        const wallMaterial = new THREE.MeshStandardMaterial({
            color: 0x0066cc,
            transparent: true,
            opacity: 0.3,
            roughness: 0.5,
            metalness: 0.5
        });

        // North wall
        const northWall = new THREE.Mesh(
            new THREE.BoxGeometry(arenaSize * 2, wallHeight, wallThickness),
            wallMaterial
        );
        northWall.position.set(0, wallHeight / 2, -arenaSize);
        northWall.castShadow = true;
        this.arena.add(northWall);

        // South wall
        const southWall = new THREE.Mesh(
            new THREE.BoxGeometry(arenaSize * 2, wallHeight, wallThickness),
            wallMaterial
        );
        southWall.position.set(0, wallHeight / 2, arenaSize);
        southWall.castShadow = true;
        this.arena.add(southWall);

        // East wall
        const eastWall = new THREE.Mesh(
            new THREE.BoxGeometry(wallThickness, wallHeight, arenaSize * 2),
            wallMaterial
        );
        eastWall.position.set(arenaSize, wallHeight / 2, 0);
        eastWall.castShadow = true;
        this.arena.add(eastWall);

        // West wall
        const westWall = new THREE.Mesh(
            new THREE.BoxGeometry(wallThickness, wallHeight, arenaSize * 2),
            wallMaterial
        );
        westWall.position.set(-arenaSize, wallHeight / 2, 0);
        westWall.castShadow = true;
        this.arena.add(westWall);

        this.scene.add(this.arena);
    }

    createPlayer() {
        // Create a group for the player spaceship
        this.player = new THREE.Group();

        // Main body (cockpit) - a small tetrahedron/cone shape
        const bodyGeometry = new THREE.ConeGeometry(0.8, 2, 4);
        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0x00ff88,
            emissive: 0x003322,
            metalness: 0.7,
            roughness: 0.3
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.rotation.x = Math.PI / 2; // Point forward along Z axis
        body.castShadow = true;
        this.player.add(body);

        // Wings - two flat triangular shapes
        const wingGeometry = new THREE.ConeGeometry(0.5, 1.5, 3);
        const wingMaterial = new THREE.MeshStandardMaterial({
            color: 0x0088ff,
            emissive: 0x002244,
            metalness: 0.6,
            roughness: 0.4
        });

        // Left wing
        const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
        leftWing.rotation.z = Math.PI / 2;
        leftWing.rotation.y = Math.PI / 2;
        leftWing.position.set(-1, 0, -0.3);
        leftWing.scale.set(0.5, 0.5, 0.5);
        leftWing.castShadow = true;
        this.player.add(leftWing);

        // Right wing
        const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
        rightWing.rotation.z = -Math.PI / 2;
        rightWing.rotation.y = -Math.PI / 2;
        rightWing.position.set(1, 0, -0.3);
        rightWing.scale.set(0.5, 0.5, 0.5);
        rightWing.castShadow = true;
        this.player.add(rightWing);

        // Engine glow (small sphere at back)
        const engineGeometry = new THREE.SphereGeometry(0.3, 16, 16);
        const engineMaterial = new THREE.MeshBasicMaterial({
            color: 0xff4400
        });
        const engine = new THREE.Mesh(engineGeometry, engineMaterial);
        engine.position.set(0, 0, -1.2);
        this.player.add(engine);

        // Add point light for engine glow
        const engineLight = new THREE.PointLight(0xff4400, 1, 10);
        engineLight.position.set(0, 0, -1.2);
        this.player.add(engineLight);

        // Position the player in the arena
        this.player.position.set(0, 2, 0);

        this.scene.add(this.player);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Update controls
        this.controls.update();

        // Optional: Add a subtle floating animation to the player
        if (this.player) {
            const time = Date.now() * 0.001;
            this.player.position.y = 2 + Math.sin(time) * 0.2;
            this.player.rotation.y = Math.sin(time * 0.5) * 0.1;
        }

        // Render the scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize the game when the page loads
window.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.init();
});
