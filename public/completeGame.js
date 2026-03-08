// MEGACITY6 - COMPLETE GAME WITH CITY GENERATION AND SOUND EFFECTS
// This is the complete, working game with all features

class CompleteMegaCity6 {
    constructor() {
        console.log('🎮 Initializing Complete MegaCity6...');
        
        // Game properties
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.vehicle = null;
        this.character = null;
        this.city = null;
        this.cityGenerator = null;
        this.soundEffects = null;
        
        // Game state
        this.money = 1000;
        this.bankMoney = 5000;
        this.characterHealth = 100;
        this.characterArmor = 0;
        this.wantedLevel = 0;
        this.currentWeapon = 'pistol';
        this.experience = 0;
        this.isPaused = false;
        this.isDriving = false;
        
        // Controls
        this.keys = {};
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();
        
        // Animation
        this.clock = new THREE.Clock();
        
        // Initialize game
        this.init();
    }
    
    init() {
        console.log('🚀 Starting game initialization...');
        
        // Setup scene
        this.setupScene();
        
        // Setup lighting
        this.setupLighting();
        
        // Generate complete city
        this.generateCompleteCity();
        
        // Create character
        this.createCharacter();
        
        // Create vehicle
        this.createVehicle();
        
        // Setup controls
        this.setupControls();
        
        // Setup camera
        this.setupCamera();
        
        // Initialize sound system
        this.initializeSounds();
        
        // Start game loop
        this.animate();
        
        console.log('✅ Game initialization complete!');
    }
    
    setupScene() {
        console.log('🎬 Setting up scene...');
        
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x87CEEB, 100, 1000);
        
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            2000
        );
        
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: document.getElementById('gameCanvas'),
            antialias: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x87CEEB);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    setupLighting() {
        console.log('💡 Setting up lighting...');
        
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        // Directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(100, 200, 100);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 500;
        directionalLight.shadow.camera.left = -200;
        directionalLight.shadow.camera.right = 200;
        directionalLight.shadow.camera.top = 200;
        directionalLight.shadow.camera.bottom = -200;
        this.scene.add(directionalLight);
    }
    
    generateCompleteCity() {
        console.log('🏙️ Generating complete city...');
        
        // Create ground
        const groundGeometry = new THREE.PlaneGeometry(5000, 5000);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x3a5f3a });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Generate roads
        this.generateRoads();
        
        // Generate buildings
        this.generateBuildings();
        
        // Generate trees
        this.generateTrees();
        
        // Generate vehicles
        this.generateTraffic();
        
        // Generate street lights
        this.generateStreetLights();
        
        // Generate landmarks
        this.generateLandmarks();
        
        console.log('✅ City generation complete!');
    }
    
    generateRoads() {
        console.log('🛣️ Generating roads...');
        
        // Main highway
        const highwayGeometry = new THREE.PlaneGeometry(5000, 40);
        const highwayMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const highway = new THREE.Mesh(highwayGeometry, highwayMaterial);
        highway.rotation.x = -Math.PI / 2;
        highway.position.y = 0.1;
        this.scene.add(highway);
        
        // Cross highway
        const crossHighway = new THREE.Mesh(highwayGeometry, highwayMaterial);
        crossHighway.rotation.x = -Math.PI / 2;
        crossHighway.rotation.z = Math.PI / 2;
        crossHighway.position.y = 0.1;
        this.scene.add(crossHighway);
        
        // City grid streets
        for (let i = -10; i <= 10; i++) {
            if (i !== 0) {
                // Horizontal streets
                const streetGeometry = new THREE.PlaneGeometry(5000, 20);
                const street = new THREE.Mesh(streetGeometry, highwayMaterial);
                street.rotation.x = -Math.PI / 2;
                street.position.set(0, 0.1, i * 200);
                this.scene.add(street);
                
                // Vertical streets
                const verticalStreet = new THREE.Mesh(streetGeometry, highwayMaterial);
                verticalStreet.rotation.x = -Math.PI / 2;
                verticalStreet.rotation.z = Math.PI / 2;
                verticalStreet.position.set(i * 200, 0.1, 0);
                this.scene.add(verticalStreet);
            }
        }
        
        // Road markings
        this.generateRoadMarkings();
    }
    
    generateRoadMarkings() {
        const markingGeometry = new THREE.PlaneGeometry(5000, 1);
        const markingMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        
        // Center line
        const centerLine = new THREE.Mesh(markingGeometry, markingMaterial);
        centerLine.rotation.x = -Math.PI / 2;
        centerLine.position.y = 0.11;
        centerLine.position.z = 0;
        this.scene.add(centerLine);
        
        // Cross center line
        const crossCenterLine = new THREE.Mesh(markingGeometry, markingMaterial);
        crossCenterLine.rotation.x = -Math.PI / 2;
        crossCenterLine.rotation.z = Math.PI / 2;
        crossCenterLine.position.y = 0.11;
        crossCenterLine.position.x = 0;
        this.scene.add(crossCenterLine);
    }
    
    generateBuildings() {
        console.log('🏢 Generating buildings...');
        
        for (let x = -10; x <= 10; x++) {
            for (let z = -10; z <= 10; z++) {
                // Skip road intersections
                if (Math.abs(x) <= 1 && Math.abs(z) <= 1) continue;
                
                // Generate building
                const buildingX = x * 200 + (Math.random() - 0.5) * 100;
                const buildingZ = z * 200 + (Math.random() - 0.5) * 100;
                
                this.generateBuilding(buildingX, buildingZ);
            }
        }
    }
    
    generateBuilding(x, z) {
        const height = Math.random() * 80 + 20;
        const width = Math.random() * 30 + 20;
        const depth = Math.random() * 30 + 20;
        
        const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
        const buildingMaterial = new THREE.MeshLambertMaterial({ 
            color: new THREE.Color().setHSL(Math.random() * 0.1, 0.3, 0.5 + Math.random() * 0.3)
        });
        
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.position.set(x, height / 2, z);
        building.castShadow = true;
        building.receiveShadow = true;
        
        this.scene.add(building);
        
        // Add windows
        this.generateWindows(building, width, height, depth);
    }
    
    generateWindows(building, width, height, depth) {
        const windowGeometry = new THREE.BoxGeometry(1, 1.5, 0.1);
        const windowMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffcc,
            emissive: 0xffffcc,
            emissiveIntensity: Math.random() * 0.5
        });
        
        const windowRows = Math.floor(height / 3);
        const windowCols = Math.floor(width / 4);
        
        for (let row = 0; row < windowRows; row++) {
            for (let col = 0; col < windowCols; col++) {
                if (Math.random() > 0.3) {
                    const window = new THREE.Mesh(windowGeometry, windowMaterial);
                    window.position.set(
                        building.position.x - width/2 + (col + 0.5) * (width / windowCols),
                        building.position.y - height/2 + (row + 0.5) * (height / windowRows),
                        building.position.z + depth/2 + 0.1
                    );
                    this.scene.add(window);
                }
            }
        }
    }
    
    generateTrees() {
        console.log('🌳 Generating trees...');
        
        for (let i = 0; i < 200; i++) {
            const x = (Math.random() - 0.5) * 4000;
            const z = (Math.random() - 0.5) * 4000;
            
            // Don't place trees on roads
            if (Math.abs(x) < 100 || Math.abs(z) < 100) continue;
            
            this.generateTree(x, z);
        }
    }
    
    generateTree(x, z) {
        // Tree trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(x, 4, z);
        trunk.castShadow = true;
        this.scene.add(trunk);
        
        // Tree foliage
        const foliageGeometry = new THREE.SphereGeometry(4, 8, 6);
        const foliageMaterial = new THREE.MeshLambertMaterial({ 
            color: new THREE.Color().setHSL(0.3, 0.7, 0.3 + Math.random() * 0.2)
        });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.set(x, 10, z);
        foliage.castShadow = true;
        this.scene.add(foliage);
    }
    
    generateTraffic() {
        console.log('🚗 Generating traffic...');
        
        for (let i = 0; i < 30; i++) {
            const x = (Math.random() - 0.5) * 4000;
            const z = (Math.random() - 0.5) * 4000;
            
            // Place vehicles on roads
            if (Math.abs(x) < 50 || Math.abs(z) < 50) {
                this.generateVehicle(x, z);
            }
        }
    }
    
    generateVehicle(x, z) {
        const vehicleTypes = ['car', 'truck', 'bus'];
        const type = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
        
        const configs = {
            car: { width: 4, height: 1.5, depth: 8, color: 0x0066cc },
            truck: { width: 6, height: 3, depth: 12, color: 0xffffff },
            bus: { width: 5, height: 3, depth: 15, color: 0xffff00 }
        };
        
        const config = configs[type] || configs.car;
        
        const vehicleGeometry = new THREE.BoxGeometry(config.width, config.height, config.depth);
        const vehicleMaterial = new THREE.MeshLambertMaterial({ color: config.color });
        const vehicle = new THREE.Mesh(vehicleGeometry, vehicleMaterial);
        
        vehicle.position.set(x, config.height / 2, z);
        vehicle.rotation.y = Math.random() * Math.PI * 2;
        vehicle.castShadow = true;
        
        this.scene.add(vehicle);
    }
    
    generateStreetLights() {
        console.log('💡 Generating street lights...');
        
        // Place street lights along main roads
        for (let i = -20; i <= 20; i++) {
            // Along main highway
            this.generateStreetLight(i * 100, 50);
            this.generateStreetLight(i * 100, -50);
            
            // Along cross highway
            this.generateStreetLight(50, i * 100);
            this.generateStreetLight(-50, i * 100);
        }
    }
    
    generateStreetLight(x, z) {
        // Pole
        const poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 12);
        const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.set(x, 6, z);
        pole.castShadow = true;
        this.scene.add(pole);
        
        // Light
        const lightGeometry = new THREE.SphereGeometry(0.5);
        const lightMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffcc,
            emissive: 0xffffcc,
            emissiveIntensity: 0.5
        });
        const lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);
        lightMesh.position.set(x, 11.5, z);
        this.scene.add(lightMesh);
        
        // Actual light source
        const light = new THREE.PointLight(0xffffcc, 0.5, 50);
        light.position.set(x, 11.5, z);
        light.castShadow = true;
        this.scene.add(light);
    }
    
    generateLandmarks() {
        console.log('🏛️ Generating landmarks...');
        
        // City hall
        const cityHallGeometry = new THREE.BoxGeometry(100, 60, 80);
        const cityHallMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const cityHall = new THREE.Mesh(cityHallGeometry, cityHallMaterial);
        cityHall.position.set(0, 30, 300);
        cityHall.castShadow = true;
        this.scene.add(cityHall);
        
        // Dome
        const domeGeometry = new THREE.SphereGeometry(40, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const domeMaterial = new THREE.MeshLambertMaterial({ color: 0xffd700 });
        const dome = new THREE.Mesh(domeGeometry, domeMaterial);
        dome.position.set(0, 60, 300);
        this.scene.add(dome);
        
        // Skyscrapers
        const skyscraperPositions = [
            { x: 200, z: 200, height: 120 },
            { x: -200, z: 200, height: 100 },
            { x: 200, z: -200, height: 110 },
            { x: -200, z: -200, height: 90 }
        ];
        
        skyscraperPositions.forEach(pos => {
            const skyscraperGeometry = new THREE.BoxGeometry(60, pos.height, 60);
            const skyscraperMaterial = new THREE.MeshLambertMaterial({ 
                color: new THREE.Color().setHSL(0.6, 0.3, 0.4)
            });
            const skyscraper = new THREE.Mesh(skyscraperGeometry, skyscraperMaterial);
            skyscraper.position.set(pos.x, pos.height / 2, pos.z);
            skyscraper.castShadow = true;
            this.scene.add(skyscraper);
            
            // Spire
            const spireGeometry = new THREE.ConeGeometry(5, 20, 8);
            const spireMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
            const spire = new THREE.Mesh(spireGeometry, spireMaterial);
            spire.position.set(pos.x, pos.height + 10, pos.z);
            this.scene.add(spire);
        });
    }
    
    createCharacter() {
        console.log('👤 Creating character...');
        
        // Create character group
        this.characterGroup = new THREE.Group();
        this.characterGroup.position.set(0, 1, 50);
        this.scene.add(this.characterGroup);
        
        // Body (torso)
        const bodyGeometry = new THREE.CapsuleGeometry(0.3, 1.2, 4, 8);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x0066cc });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.6;
        body.castShadow = true;
        this.characterGroup.add(body);
        this.characterBody = body;
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.25, 16, 16);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xffdbac });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 1.6;
        head.castShadow = true;
        this.characterGroup.add(head);
        this.characterHead = head;
        
        // Arms
        const armGeometry = new THREE.CapsuleGeometry(0.1, 0.8, 4, 8);
        const armMaterial = new THREE.MeshLambertMaterial({ color: 0x0066cc });
        
        // Left arm
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-0.4, 0.8, 0);
        leftArm.rotation.z = 0.2;
        leftArm.castShadow = true;
        this.characterGroup.add(leftArm);
        this.leftArm = leftArm;
        
        // Right arm
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(0.4, 0.8, 0);
        rightArm.rotation.z = -0.2;
        rightArm.castShadow = true;
        this.characterGroup.add(rightArm);
        this.rightArm = rightArm;
        
        // Legs
        const legGeometry = new THREE.CapsuleGeometry(0.15, 1, 4, 8);
        const legMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        
        // Left leg
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.2, -0.3, 0);
        leftLeg.castShadow = true;
        this.characterGroup.add(leftLeg);
        this.leftLeg = leftLeg;
        
        // Right leg
        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.2, -0.3, 0);
        rightLeg.castShadow = true;
        this.characterGroup.add(rightLeg);
        this.rightLeg = rightLeg;
        
        // Walking animation properties
        this.walkCycle = 0;
        this.isWalking = false;
        this.walkSpeed = 0;
        this.targetWalkSpeed = 0;
        
        // GTA 5 walking speed (approximately 6 km/h = 1.67 m/s)
        this.gtaWalkSpeed = 1.67;
        this.gtaRunSpeed = 5.0;
        
        // Store character reference
        this.character = this.characterGroup;
    }
    
    createVehicle() {
        console.log('🚗 Creating player vehicle...');
        
        // Car body
        const carBodyGeometry = new THREE.BoxGeometry(4, 1.5, 8);
        const carBodyMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        this.vehicle = new THREE.Mesh(carBodyGeometry, carBodyMaterial);
        this.vehicle.position.set(0, 1, 100);
        this.vehicle.castShadow = true;
        this.scene.add(this.vehicle);
        
        // Car roof
        const carRoofGeometry = new THREE.BoxGeometry(3.5, 1, 4);
        const carRoofMaterial = new THREE.MeshLambertMaterial({ color: 0xcc0000 });
        const carRoof = new THREE.Mesh(carRoofGeometry, carRoofMaterial);
        carRoof.position.set(0, 2.25, 100);
        carRoof.castShadow = true;
        this.scene.add(carRoof);
        
        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        
        const wheelPositions = [
            [-1.5, 0.5, 2.5],
            [1.5, 0.5, 2.5],
            [-1.5, 0.5, -2.5],
            [1.5, 0.5, -2.5]
        ];
        
        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.position.set(
                this.vehicle.position.x + pos[0],
                this.vehicle.position.y + pos[1],
                this.vehicle.position.z + pos[2]
            );
            wheel.rotation.z = Math.PI / 2;
            this.scene.add(wheel);
        });
        
        // Initialize sound effects
        this.soundEffects = new SoundEffectsSystem(this);
        this.soundEffects.initialize().then(() => {
            console.log('🔊 Sound system ready');
            // Start ambient sounds
            this.soundEffects.playAmbient('trafficHum');
            this.soundEffects.playAmbient('crowdMurmur');
            this.soundEffects.playAmbient('wind');
        });
        
        // Initialize advanced animation system
        this.animationSystem = new AdvancedAnimationSystem(this);
        console.log('🎭 Animation system ready');
        
        // Initialize emote menu
        this.emoteMenu = new EmoteMenu(this.animationSystem);
        console.log('🎭 Emote menu ready');
        
        // Initialize emote assets
        this.emoteAssets = new EmoteAssetsGenerator();
        console.log('🎨 Emote assets ready');
        
        // Setup emote controls
        this.setupEmoteControls();
        
        // Initially hide vehicle
        this.vehicle.visible = false;
    }
    
    setupControls() {
        console.log('🎮 Setting up controls...');
        
        // Movement state
        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.isRunning = false;
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            
            // Movement keys
            if (e.code === 'KeyW' || e.code === 'ArrowUp') {
                this.moveForward = true;
                e.preventDefault();
            }
            if (e.code === 'KeyS' || e.code === 'ArrowDown') {
                this.moveBackward = true;
                e.preventDefault();
            }
            if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
                this.moveLeft = true;
                e.preventDefault();
            }
            if (e.code === 'KeyD' || e.code === 'ArrowRight') {
                this.moveRight = true;
                e.preventDefault();
            }
            
            // Run modifier (Shift)
            if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
                this.isRunning = true;
                e.preventDefault();
            }
            
            // Enter/exit vehicle
            if (e.code === 'KeyE') {
                this.toggleVehicle();
                e.preventDefault();
            }
            
            // Shoot
            if (e.code === 'Space') {
                this.shoot();
                e.preventDefault();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
            
            // Movement keys
            if (e.code === 'KeyW' || e.code === 'ArrowUp') {
                this.moveForward = false;
            }
            if (e.code === 'KeyS' || e.code === 'ArrowDown') {
                this.moveBackward = false;
            }
            if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
                this.moveLeft = false;
            }
            if (e.code === 'KeyD' || e.code === 'ArrowRight') {
                this.moveRight = false;
            }
            
            // Run modifier
            if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
                this.isRunning = false;
            }
        });
        
        // Mouse controls for camera
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
        });
        
        document.addEventListener('click', (e) => {
            if (e.target === document.getElementById('gameCanvas')) {
                this.shoot();
            }
        });
        
        // Prevent context menu on right click
        document.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    // Setup emote controls
    setupEmoteControls() {
        console.log('🎭 Setting up emote controls...');
        
        // Emote menu toggle (B key)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'b' || e.key === 'B') {
                if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
                    e.preventDefault();
                    this.toggleEmoteMenu();
                }
            }
            
            // Quick emote shortcuts (number keys)
            if (e.key >= '1' && e.key <= '9') {
                if (e.ctrlKey) {
                    e.preventDefault();
                    this.playQuickEmote(parseInt(e.key));
                }
            }
            
            // Random emote (R key)
            if (e.key === 'r' || e.key === 'R') {
                if (e.ctrlKey && !e.altKey && !e.shiftKey) {
                    e.preventDefault();
                    this.playRandomEmote();
                }
            }
        });
        
        // Add emote button to UI
        this.addEmoteButton();
    }
    
    // Toggle emote menu
    toggleEmoteMenu() {
        if (this.emoteMenu) {
            this.emoteMenu.toggle();
        }
    }
    
    // Play quick emote
    playQuickEmote(slotNumber) {
        const quickEmotes = [
            'wave', 'thumbs_up', 'dance', 'happy', 'punch', 'kick', 'sit', 'sleep', 'meditate'
        ];
        
        if (slotNumber >= 1 && slotNumber <= quickEmotes.length) {
            const emoteName = quickEmotes[slotNumber - 1];
            this.playEmote(emoteName);
        }
    }
    
    // Play random emote
    playRandomEmote() {
        if (this.animationSystem && this.animationSystem.animations) {
            const emoteNames = Array.from(this.animationSystem.animations.keys());
            const randomEmote = emoteNames[Math.floor(Math.random() * emoteNames.length)];
            this.playEmote(randomEmote);
        }
    }
    
    // Play emote
    playEmote(emoteName) {
        if (this.animationSystem) {
            const character = this.character;
            const success = this.animationSystem.playEmote(emoteName, character);
            
            if (success) {
                console.log(`🎭 Playing emote: ${emoteName}`);
                this.showEmoteNotification(emoteName);
            }
        }
    }
    
    // Show emote notification
    showEmoteNotification(emoteName) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 25px;
            border-radius: 25px;
            font-size: 16px;
            font-weight: bold;
            z-index: 1000;
            animation: emoteNotification 2s ease-out forwards;
            border: 2px solid #e94560;
            box-shadow: 0 5px 15px rgba(233, 69, 96, 0.3);
        `;
        
        // Get emote prefix
        const animation = this.animationSystem.animations.get(emoteName);
        const prefix = animation ? animation.prefix : '🎭';
        
        notification.innerHTML = `
            <span style="font-size: 20px; margin-right: 10px;">${prefix}</span>
            ${emoteName.replace(/_/g, ' ')}
        `;
        
        // Add animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes emoteNotification {
                0% { opacity: 0; transform: translateX(-50%) translateY(-20px) scale(0.8); }
                20% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1.1); }
                80% { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-20px) scale(0.9); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(notification);
        
        // Remove after animation
        setTimeout(() => {
            document.body.removeChild(notification);
            document.head.removeChild(style);
        }, 2000);
    }
    
    // Add emote button to UI
    addEmoteButton() {
        const emoteButton = document.createElement('button');
        emoteButton.id = 'emote-menu-button';
        emoteButton.innerHTML = '🎭 Emotes';
        emoteButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #e94560 0%, #ff6b6b 100%);
            color: white;
            border: none;
            border-radius: 25px;
            padding: 15px 25px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s ease;
            box-shadow: 0 5px 15px rgba(233, 69, 96, 0.3);
            text-transform: uppercase;
            letter-spacing: 1px;
        `;
        
        emoteButton.addEventListener('mouseenter', () => {
            emoteButton.style.transform = 'translateY(-3px) scale(1.05)';
            emoteButton.style.boxShadow = '0 8px 25px rgba(233, 69, 96, 0.4)';
        });
        
        emoteButton.addEventListener('mouseleave', () => {
            emoteButton.style.transform = 'translateY(0) scale(1)';
            emoteButton.style.boxShadow = '0 5px 15px rgba(233, 69, 96, 0.3)';
        });
        
        emoteButton.addEventListener('click', () => {
            this.toggleEmoteMenu();
        });
        
        // Add tooltip
        emoteButton.title = 'Press B to toggle emote menu';
        
        document.body.appendChild(emoteButton);
    }
    
    setupCamera() {
        console.log('📷 Setting up camera...');
        
        // Position camera behind character
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(this.character.position);
        
        // Camera modes
        this.cameraMode = 'thirdPerson';
        this.cameraModes = ['thirdPerson', 'firstPerson', 'cinematic'];
        this.currentCameraIndex = 0;
    }
    
    initializeSounds() {
        console.log('🔊 Initializing sound system...');
        
        // Create simple sound effects using Web Audio API
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create simple sounds
            this.sounds = {
                engine: this.createEngineSound(),
                gunshot: this.createGunshotSound(),
                footstep: this.createFootstepSound()
            };
            
            console.log('✅ Sound system initialized');
        } catch (error) {
            console.warn('⚠️ Sound system not available:', error);
        }
    }
    
    createEngineSound() {
        const duration = 2.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            const freq = 100 + Math.sin(t * 2) * 50;
            data[i] = Math.sin(2 * Math.PI * freq * t) * 0.3;
        }
        
        return buffer;
    }
    
    createGunshotSound() {
        const duration = 0.1;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            data[i] = (Math.random() - 0.5) * 0.9 * Math.exp(-t * 20);
        }
        
        return buffer;
    }
    
    createFootstepSound() {
        const duration = 0.2;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            data[i] = (Math.random() - 0.5) * 0.5 * Math.exp(-t * 10);
        }
        
        return buffer;
    }
    
    playSound(soundName) {
        if (!this.audioContext || !this.sounds[soundName]) return;
        
        const source = this.audioContext.createBufferSource();
        source.buffer = this.sounds[soundName];
        source.connect(this.audioContext.destination);
        source.start(0);
    }
    
    toggleVehicle() {
        if (this.isDriving) {
            // Exit vehicle
            this.isDriving = false;
            this.character.visible = true;
            this.vehicle.visible = false;
            
            // Position character near vehicle
            this.character.position.set(
                this.vehicle.position.x - 5,
                1,
                this.vehicle.position.z
            );
        } else {
            // Enter vehicle
            const distance = this.character.position.distanceTo(this.vehicle.position);
            if (distance < 10) {
                this.isDriving = true;
                this.character.visible = false;
                this.vehicle.visible = true;
                
                // Play engine sound
                this.playSound('engine');
            }
        }
    }
    
    shoot() {
        console.log('🔫 Shooting!');
        this.playSound('gunshot');
        
        // Create visual effect
        const muzzleFlash = new THREE.PointLight(0xffff00, 2, 10);
        const flashPosition = this.isDriving ? this.vehicle.position : this.character.position;
        muzzleFlash.position.copy(flashPosition);
        muzzleFlash.position.y += this.isDriving ? 2 : 3;
        this.scene.add(muzzleFlash);
        
        // Remove flash after short time
        setTimeout(() => {
            this.scene.remove(muzzleFlash);
        }, 100);
    }
    
    update(deltaTime) {
        // Update character/vehicle movement with GTA 5 style mechanics
        if (this.isDriving) {
            this.updateVehicleMovement(deltaTime);
        } else {
            this.updateCharacterMovement(deltaTime);
        }
        
        // Update camera
        this.updateCamera();
        
        // Update UI
        this.updateUI();
    }
    
    updateCharacterMovement(deltaTime) {
        // Calculate movement direction
        let moveX = 0;
        let moveZ = 0;
        
        if (this.moveForward) moveZ -= 1;
        if (this.moveBackward) moveZ += 1;
        if (this.moveLeft) moveX -= 1;
        if (this.moveRight) moveX += 1;
        
        // Normalize diagonal movement
        if (moveX !== 0 && moveZ !== 0) {
            moveX *= 0.707;
            moveZ *= 0.707;
        }
        
        // Determine if character is moving
        this.isWalking = (moveX !== 0 || moveZ !== 0);
        
        // Set target speed based on movement state
        if (this.isWalking) {
            this.targetWalkSpeed = this.isRunning ? this.gtaRunSpeed : this.gtaWalkSpeed;
        } else {
            this.targetWalkSpeed = 0;
        }
        
        // Smooth speed transitions
        const acceleration = this.isRunning ? 8.0 : 4.0;
        const deceleration = 6.0;
        
        if (this.walkSpeed < this.targetWalkSpeed) {
            this.walkSpeed = Math.min(this.walkSpeed + acceleration * deltaTime, this.targetWalkSpeed);
        } else if (this.walkSpeed > this.targetWalkSpeed) {
            this.walkSpeed = Math.max(this.walkSpeed - deceleration * deltaTime, this.targetWalkSpeed);
        }
        
        // Apply movement if speed > 0
        if (this.walkSpeed > 0.01) {
            // Calculate movement vector
            const moveMagnitude = this.walkSpeed * deltaTime;
            
            // Get character's current rotation
            const currentRotation = this.characterGroup.rotation.y;
            
            // Calculate target rotation based on input direction
            let targetRotation = currentRotation;
            
            if (moveX !== 0 || moveZ !== 0) {
                // Calculate angle from movement direction
                targetRotation = Math.atan2(moveX, moveZ);
                
                // Smooth rotation transition
                const rotationSpeed = 8.0; // radians per second
                let rotationDiff = targetRotation - currentRotation;
                
                // Handle angle wrapping
                while (rotationDiff > Math.PI) rotationDiff -= 2 * Math.PI;
                while (rotationDiff < -Math.PI) rotationDiff += 2 * Math.PI;
                
                const maxRotation = rotationSpeed * deltaTime;
                if (Math.abs(rotationDiff) < maxRotation) {
                    this.characterGroup.rotation.y = targetRotation;
                } else {
                    this.characterGroup.rotation.y += Math.sign(rotationDiff) * maxRotation;
                }
            }
            
            // Apply movement in the direction the character is facing
            const finalRotation = this.characterGroup.rotation.y;
            this.characterGroup.position.x += Math.sin(finalRotation) * moveMagnitude;
            this.characterGroup.position.z += Math.cos(finalRotation) * moveMagnitude;
            
            // Update walk cycle animation
            this.walkCycle += this.walkSpeed * deltaTime * 4; // Animation speed based on movement speed
            this.updateWalkAnimation();
            
            // Play footstep sounds
            this.updateFootstepSounds();
        } else {
            // Reset to idle pose when not moving
            this.resetToIdlePose();
        }
    }
    
    updateWalkAnimation() {
        if (!this.characterGroup) return;
        
        const walkCycle = this.walkCycle;
        const bobAmount = 0.05;
        const swayAmount = 0.03;
        const legSwing = Math.sin(walkCycle) * 0.4;
        const armSwing = Math.sin(walkCycle) * 0.3;
        
        // Head bobbing
        if (this.characterHead) {
            this.characterHead.position.y = 1.6 + Math.sin(walkCycle * 2) * bobAmount;
            this.characterHead.position.x = Math.sin(walkCycle) * swayAmount;
        }
        
        // Body slight bob
        if (this.characterBody) {
            this.characterBody.position.y = 0.6 + Math.sin(walkCycle * 2) * bobAmount * 0.5;
        }
        
        // Leg animations
        if (this.leftLeg && this.rightLeg) {
            // Left leg
            this.leftLeg.rotation.x = Math.sin(walkCycle) * legSwing;
            this.leftLeg.position.x = -0.2 + Math.sin(walkCycle) * 0.05;
            
            // Right leg (opposite phase)
            this.rightLeg.rotation.x = Math.sin(walkCycle + Math.PI) * legSwing;
            this.rightLeg.position.x = 0.2 + Math.sin(walkCycle + Math.PI) * 0.05;
        }
        
        // Arm animations
        if (this.leftArm && this.rightArm) {
            // Left arm (opposite to right leg)
            this.leftArm.rotation.x = Math.sin(walkCycle + Math.PI) * armSwing;
            this.leftArm.rotation.z = 0.2 + Math.sin(walkCycle) * 0.1;
            
            // Right arm (opposite to left leg)
            this.rightArm.rotation.x = Math.sin(walkCycle) * armSwing;
            this.rightArm.rotation.z = -0.2 + Math.sin(walkCycle + Math.PI) * 0.1;
        }
        
        // Body sway
        if (this.characterGroup) {
            this.characterGroup.rotation.z = Math.sin(walkCycle * 2) * 0.02;
        }
    }
    
    resetToIdlePose() {
        if (!this.characterGroup) return;
        
        // Reset head position
        if (this.characterHead) {
            this.characterHead.position.y = 1.6;
            this.characterHead.position.x = 0;
        }
        
        // Reset body position
        if (this.characterBody) {
            this.characterBody.position.y = 0.6;
        }
        
        // Reset legs
        if (this.leftLeg && this.rightLeg) {
            this.leftLeg.rotation.x = 0;
            this.leftLeg.position.x = -0.2;
            this.rightLeg.rotation.x = 0;
            this.rightLeg.position.x = 0.2;
        }
        
        // Reset arms
        if (this.leftArm && this.rightArm) {
            this.leftArm.rotation.x = 0;
            this.leftArm.rotation.z = 0.2;
            this.rightArm.rotation.x = 0;
            this.rightArm.rotation.z = -0.2;
        }
        
        // Reset body rotation
        this.characterGroup.rotation.z = 0;
    }
    
    updateFootstepSounds() {
        if (!this.isWalking || this.walkSpeed < 0.5) return;
        
        // Play footstep sound based on walk cycle
        const stepInterval = this.isRunning ? 0.3 : 0.5; // Faster steps when running
        const lastStep = this.lastFootstep || 0;
        const currentTime = Date.now() / 1000;
        
        if (currentTime - lastStep > stepInterval) {
            // Alternate foot sounds
            const footSound = Math.floor(this.walkCycle) % 2 === 0 ? 'footstep' : 'footstep';
            this.playSound(footSound);
            this.lastFootstep = currentTime;
        }
    }
    
    updateVehicleMovement(deltaTime) {
        // Simple vehicle movement
        const speed = this.isRunning ? 8.0 : 4.0; // Faster when running (boost)
        
        if (this.moveForward) {
            this.vehicle.position.z -= speed * deltaTime;
        }
        if (this.moveBackward) {
            this.vehicle.position.z += speed * deltaTime * 0.5; // Reverse is slower
        }
        if (this.moveLeft) {
            this.vehicle.position.x -= speed * deltaTime;
            this.vehicle.rotation.y = Math.PI / 2;
        }
        if (this.moveRight) {
            this.vehicle.position.x += speed * deltaTime;
            this.vehicle.rotation.y = -Math.PI / 2;
        }
        
        // Play engine sound when moving
        if (this.moveForward || this.moveBackward) {
            if (Math.random() > 0.95) {
                this.playSound('engine');
            }
        }
    }
    
    updateCamera() {
        const target = this.isDriving ? this.vehicle : this.character;
        
        if (this.cameraMode === 'thirdPerson') {
            // Follow behind
            const offset = new THREE.Vector3(0, 5, 10);
            offset.applyQuaternion(target.quaternion);
            this.camera.position.lerp(
                target.position.clone().add(offset),
                0.1
            );
            this.camera.lookAt(target.position);
        } else if (this.cameraMode === 'firstPerson') {
            // Inside vehicle or over shoulder
            const offset = this.isDriving ? 
                new THREE.Vector3(0, 2, 2) : 
                new THREE.Vector3(0, 3, 1);
            offset.applyQuaternion(target.quaternion);
            this.camera.position.lerp(
                target.position.clone().add(offset),
                0.1
            );
            this.camera.lookAt(
                target.position.clone().add(
                    new THREE.Vector3(0, 0, -10).applyQuaternion(target.quaternion)
                )
            );
        }
    }
    
    updateUI() {
        // Update UI elements
        if (typeof window !== 'undefined' && window.safeSetText) {
            window.safeSetText('health', this.characterHealth);
            window.safeSetText('armor', this.characterArmor);
            window.safeSetText('money', this.money);
            window.safeSetText('wanted', this.wantedLevel);
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = this.clock.getDelta();
        
        this.update(deltaTime);
        
        this.renderer.render(this.scene, this.camera);
    }
    
    // Get game statistics
    getStats() {
        return {
            scene: this.scene.children.length,
            position: this.isDriving ? this.vehicle.position : this.character.position,
            isDriving: this.isDriving,
            health: this.characterHealth,
            money: this.money,
            wantedLevel: this.wantedLevel
        };
    }
}

// Initialize game when page loads
if (typeof window !== 'undefined') {
    window.CompleteMegaCity6 = CompleteMegaCity6;
    
    // Auto-start game
    window.addEventListener('load', () => {
        console.log('🎮 Loading Complete MegaCity6...');
        
        // Wait for Three.js
        let attempts = 0;
        const checkThreeJS = () => {
            if (typeof THREE !== 'undefined') {
                console.log('✅ Three.js loaded, starting game...');
                window.game = new CompleteMegaCity6();
            } else if (attempts < 50) {
                attempts++;
                setTimeout(checkThreeJS, 100);
            } else {
                console.error('❌ Three.js failed to load');
            }
        };
        
        checkThreeJS();
    });
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = CompleteMegaCity6;
}
