/**
 * IATP 3D Interactive Globe
 * Three.js-powered visualization showing 890 global stations
 */

class IATPGlobe {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Globe container #${containerId} not found`);
            return;
        }

        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.globe = null;
        this.stars = null;
        this.stations = [];
        this.connections = [];
        this.isAnimating = true;
        this.autoRotate = true;
        this.mouse = { x: 0, y: 0 };

        this.init();
    }

    /**
     * Initialize the 3D scene
     */
    init() {
        this.createScene();
        this.createCamera();
        this.createRenderer();
        this.createLights();
        this.createGlobe();
        this.createStars();
        this.createStations();
        this.createConnections();
        this.setupEventListeners();
        this.animate();

        console.log('🌍 IATP 3D Globe initialized');
    }

    /**
     * Create the Three.js scene
     */
    createScene() {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x0A1628, 1, 1000);
    }

    /**
     * Create and position the camera
     */
    createCamera() {
        const aspect = this.container.clientWidth / this.container.clientHeight;
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 1000);
        this.camera.position.z = 300;
    }

    /**
     * Create the WebGL renderer
     */
    createRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setClearColor(0x0A1628, 1);

        this.container.appendChild(this.renderer.domElement);
    }

    /**
     * Add lights to the scene
     */
    createLights() {
        // Ambient light
        const ambient = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambient);

        // Directional light (sun)
        const directional = new THREE.DirectionalLight(0xffffff, 0.8);
        directional.position.set(5, 3, 5);
        this.scene.add(directional);

        // Point light (electric cyan glow)
        const pointLight = new THREE.PointLight(0x00D9FF, 1, 500);
        pointLight.position.set(0, 0, 100);
        this.scene.add(pointLight);
    }

    /**
     * Create the main globe sphere
     */
    createGlobe() {
        const geometry = new THREE.SphereGeometry(100, 64, 64);

        // texture loader
        const textureLoader = new THREE.TextureLoader();
        const earthTexture = textureLoader.load('img/earth-texture.jpg');

        // Material with texture
        const material = new THREE.MeshPhongMaterial({
            map: earthTexture,
            color: 0xaaaaaa, // Tint the texture
            specular: 0x333333,
            shininess: 15,
            transparent: true,
            opacity: 0.9
        });

        this.globe = new THREE.Mesh(geometry, material);

        // Add wireframe grid (overlay)
        const wireframe = new THREE.WireframeGeometry(geometry);
        const line = new THREE.LineSegments(wireframe);
        line.material.color.setHex(0x00D9FF);
        line.material.opacity = 0.15; // Slightly increased opacity
        line.material.transparent = true;
        this.globe.add(line);

        // Add outer glow
        const glowGeometry = new THREE.SphereGeometry(105, 32, 32);
        const glowMaterial = new THREE.ShaderMaterial({
            uniforms: {
                glowColor: { value: new THREE.Color(0x00D9FF) }
            },
            vertexShader: `
                varying vec3 vNormal;
                void main() {
                    vNormal = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 glowColor;
                varying vec3 vNormal;
                void main() {
                    float intensity = pow(0.5 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
                    gl_FragColor = vec4(glowColor, 1.0) * intensity;
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        this.globe.add(glow);

        this.scene.add(this.globe);
    }

    /**
     * Create starfield background
     */
    createStars() {
        const starGeometry = new THREE.BufferGeometry();
        const starCount = 2000;
        const positions = new Float32Array(starCount * 3);

        for (let i = 0; i < starCount * 3; i++) {
            positions[i] = (Math.random() - 0.5) * 1000;
        }

        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const starMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 1,
            transparent: true,
            opacity: 0.8
        });

        this.stars = new THREE.Points(starGeometry, starMaterial);
        this.scene.add(this.stars);
    }

    /**
     * Create 890 station markers on globe
     */
    createStations() {
        // Sample station coordinates (latitude, longitude)
        // In production, load from real data
        const stationData = this.generateStationData(890);

        stationData.forEach((station) => {
            const marker = this.createStationMarker(station);
            this.stations.push(marker);
            this.globe.add(marker);
        });
    }

    /**
     * Generate random station data for demo
     * In production, replace with real station coordinates
     */
    generateStationData(count) {
        const stations = [];
        for (let i = 0; i < count; i++) {
            stations.push({
                lat: (Math.random() - 0.5) * 180,
                lon: (Math.random() - 0.5) * 360,
                name: `Station ${i + 1}`,
                active: Math.random() > 0.7 // 30% active
            });
        }
        return stations;
    }

    /**
     * Create individual station marker
     */
    createStationMarker(station) {
        const radius = 102; // Slightly above globe surface
        const phi = (90 - station.lat) * (Math.PI / 180);
        const theta = (station.lon + 180) * (Math.PI / 180);

        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);

        // Create marker geometry
        const geometry = new THREE.SphereGeometry(0.5, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: station.active ? 0x00FF94 : 0x00D9FF,
            transparent: true,
            opacity: station.active ? 1 : 0.7
        });

        const marker = new THREE.Mesh(geometry, material);
        marker.position.set(x, y, z);
        marker.userData = station;

        // Add pulse effect for active stations
        if (station.active) {
            this.addPulseEffect(marker);
        }

        return marker;
    }

    /**
     * Add pulsing effect to active markers
     */
    addPulseEffect(marker) {
        // Create expanding ring geometry
        const ringGeometry = new THREE.RingGeometry(0.5, 1, 16);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: 0x00FF94,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5
        });

        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.position.copy(marker.position);
        ring.lookAt(0, 0, 0);

        marker.userData.pulseRing = ring;
        this.globe.add(ring);
    }

    /**
     * Create connection lines between stations
     */
    createConnections() {
        // Sample: Create 50 random connections for demo
        for (let i = 0; i < 50; i++) {
            const station1 = this.stations[Math.floor(Math.random() * this.stations.length)];
            const station2 = this.stations[Math.floor(Math.random() * this.stations.length)];

            if (station1 !== station2) {
                this.createConnectionLine(station1, station2);
            }
        }
    }

    /**
     * Create arc connection between two stations
     */
    createConnectionLine(station1, station2) {
        const start = station1.position.clone();
        const end = station2.position.clone();

        // Create curved path
        const mid = start.clone().add(end).multiplyScalar(0.5);
        mid.normalize().multiplyScalar(120); // Arc height

        const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
        const points = curve.getPoints(50);

        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: 0x0079C2,
            transparent: true,
            opacity: 0.3,
            linewidth: 1
        });

        const line = new THREE.Line(geometry, material);
        this.connections.push(line);
        this.globe.add(line);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Window resize
        window.addEventListener('resize', () => this.onWindowResize(), false);

        // Mouse move for interaction
        this.container.addEventListener('mousemove', (e) => this.onMouseMove(e), false);

        // Toggle auto-rotate on click
        this.container.addEventListener('click', () => {
            this.autoRotate = !this.autoRotate;
        });
    }

    /**
     * Handle window resize
     */
    onWindowResize() {
        const width = this.container.clientWidth;
        const height = this.container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    /**
     * Handle mouse movement
     */
    onMouseMove(event) {
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    /**
     * Animation loop
     */
    animate() {
        if (!this.isAnimating) return;

        requestAnimationFrame(() => this.animate());

        // Auto-rotate globe
        if (this.autoRotate) {
            this.globe.rotation.y += 0.001;
        }

        // Interactive rotation with mouse
        if (this.mouse.x !== 0) {
            const targetRotationY = this.mouse.x * 0.5;
            const targetRotationX = this.mouse.y * 0.3;
            this.globe.rotation.y += (targetRotationY - this.globe.rotation.y) * 0.05;
            this.globe.rotation.x += (targetRotationX - this.globe.rotation.x) * 0.05;
        }

        // Animate pulsing rings
        this.stations.forEach((station) => {
            if (station.userData.pulseRing) {
                const ring = station.userData.pulseRing;
                const scale = 1 + Math.sin(Date.now() * 0.003) * 0.3;
                ring.scale.set(scale, scale, 1);
                ring.material.opacity = 0.5 - (scale - 1) * 0.5;
            }
        });

        // Slowly rotate stars
        if (this.stars) {
            this.stars.rotation.y += 0.0001;
        }

        this.renderer.render(this.scene, this.camera);
    }

    /**
     * Destroy the globe and clean up
     */
    destroy() {
        this.isAnimating = false;

        if (this.renderer) {
            this.renderer.dispose();
            this.container.removeChild(this.renderer.domElement);
        }

        console.log('🌍 IATP Globe destroyed');
    }
}

/**
 * Initialize globe when DOM is ready
 */
function initIATPGlobe() {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded. Please include Three.js before globe.js');
        return;
    }

    const globeContainer = document.getElementById('globe-canvas');
    if (globeContainer) {
        window.iatpGlobe = new IATPGlobe('globe-canvas');
    }
}

// Auto-initialize if DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIATPGlobe);
} else {
    initIATPGlobe();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IATPGlobe;
}
