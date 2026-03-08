class GTA6Game {
    constructor() {
        console.log('Initializing GTA6Game...')
        
        // Game properties
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.vehicle = null;
        this.character = null;
        this.city = null;
        this.pedestrians = [];
        this.traffic = [];
        this.controls = {};
        this.clock = new THREE.Clock();
        this.velocity = new THREE.Vector3();
        this.characterVelocity = new THREE.Vector3();
        this.acceleration = 0;
        this.steerAngle = 0;
        this.speed = 0;
        this.maxSpeed = 50;
        this.inVehicle = true;
        // Camera system
        this.cameraMode = 'third_person'; // third_person, first_person, cinematic, side_view, overhead
        this.cameraModes = ['third_person', 'first_person', 'cinematic', 'side_view', 'overhead'];
        this.currentCameraIndex = 0;
        this.cameraTransition = 0;
        this.cameraTransitionSpeed = 0.1;
        
        // Game name
        this.gameName = 'MegaCity6';
        this.mission = "Welcome to MegaCity6";
        this.audioContext = null;
        this.sounds = {};
        this.characterSpeed = 5;
        this.runSpeed = 10;
        this.isRunning = false;
        this.stamina = 100;
        this.maxStamina = 100;
        this.jumpVelocity = 0;
        this.isJumping = false;
        this.gravity = -9.8;
        
        // Weapons system
        this.weapons = {
            pistol: { name: 'Pistol', damage: 25, range: 50, fireRate: 500, ammo: 999, maxAmmo: 999, automatic: false },
            shotgun: { name: 'Shotgun', damage: 75, range: 30, fireRate: 1000, ammo: 50, maxAmmo: 50, automatic: false },
            rifle: { name: 'Rifle', damage: 35, range: 100, fireRate: 150, ammo: 300, maxAmmo: 300, automatic: true },
            smg: { name: 'SMG', damage: 20, range: 60, fireRate: 100, ammo: 500, maxAmmo: 500, automatic: true },
            sniper: { name: 'Sniper', damage: 100, range: 200, fireRate: 2000, ammo: 20, maxAmmo: 20, automatic: false },
            rpg: { name: 'RPG', damage: 200, range: 150, fireRate: 3000, ammo: 5, maxAmmo: 5, automatic: false }
        };
        this.currentWeapon = 'pistol';
        this.lastShotTime = 0;
        this.bullets = [];
        
        // Money system
        this.money = 1000;
        this.bankMoney = 5000;
        
        // Police system
        this.wantedLevel = 0;
        this.maxWantedLevel = 6;
        this.policeCars = [];
        this.policeOfficers = [];
        this.lastCrimeTime = 0;
        // Multiplayer integration
        this.multiplayer = null;
        this.characterHealth = 100;
        this.characterArmor = 0;
        
        // Override shooting for multiplayer
        this.originalShoot = this.shoot;
        this.shoot = this.multiplayerShoot;
        
        // Gang system integration
        this.gangs = null;
        this.battlePass = null;
        this.paused = false;
        
        // Special effects
        this.doubleXP = false;
        this.godMode = false;
        this.vip = false;
        
        // Character animation system integration
        this.characterAnimations = null;
        
        // Animation states
        this.isJumping = false;
        this.isShooting = false;
        this.isDriving = false;
        this.isDancing = false;
        this.isWaving = false;
        this.isSurrendering = false;
        
        this.init();
    }
    
    init() {
        this.setupScene();
        this.setupLighting();
        this.createCity();
        this.createCharacter();
        this.createVehicle();
        this.setupControls();
        this.setupCamera();
        this.createAudio();
        this.animate();
        
        setTimeout(() => {
            const loadingEl = document.getElementById('loading-screen')
            if (loadingEl) {
                loadingEl.textContent = 'Loading MegaCity6...'
            }
        }, 1000);
        
        setTimeout(() => {
            const loadingEl = document.getElementById('loading-screen')
            if (loadingEl) {
                loadingEl.style.display = 'none'
            }
        }, 2000);
    }
    
    setupScene() {
        try {
            console.log('Setting up scene...')
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
            
            console.log('Scene setup complete')
        } catch (error) {
            console.error('Scene setup failed:', error);
            throw error;
        }
    }
    
    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(100, 100, 50);
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
    
    createCity() {
        const cityGroup = new THREE.Group();
        
        // Ground
        const groundGeometry = new THREE.PlaneGeometry(1000, 1000);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        cityGroup.add(ground);
        
        // Roads
        this.createRoads(cityGroup);
        
        // Buildings
        this.createBuildings(cityGroup);
        
        // Environment objects
        this.createEnvironment(cityGroup);
        
        this.city = cityGroup;
        this.scene.add(cityGroup);
    }
    
    createRoads(cityGroup) {
        const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });
        
        // Main roads
        for (let i = -5; i <= 5; i++) {
            // Horizontal roads
            const hRoad = new THREE.Mesh(
                new THREE.PlaneGeometry(1000, 20),
                roadMaterial
            );
            hRoad.rotation.x = -Math.PI / 2;
            hRoad.position.y = 0.01;
            hRoad.position.z = i * 100;
            cityGroup.add(hRoad);
            
            // Vertical roads
            const vRoad = new THREE.Mesh(
                new THREE.PlaneGeometry(20, 1000),
                roadMaterial
            );
            vRoad.rotation.x = -Math.PI / 2;
            vRoad.position.y = 0.01;
            vRoad.position.x = i * 100;
            cityGroup.add(vRoad);
        }
        
        // Road lines
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        for (let i = -5; i <= 5; i++) {
            for (let j = -10; j <= 10; j += 2) {
                const line = new THREE.Mesh(
                    new THREE.PlaneGeometry(4, 1),
                    lineMaterial
                );
                line.rotation.x = -Math.PI / 2;
                line.position.y = 0.02;
                line.position.x = j * 50;
                line.position.z = i * 100;
                cityGroup.add(line);
                
                const line2 = new THREE.Mesh(
                    new THREE.PlaneGeometry(1, 4),
                    lineMaterial
                );
                line2.rotation.x = -Math.PI / 2;
                line2.position.y = 0.02;
                line2.position.x = i * 100;
                line2.position.z = j * 50;
                cityGroup.add(line2);
            }
        }
    }
    
    createBuildings(cityGroup) {
        const buildingColors = [0x8B4513, 0x696969, 0x2F4F4F, 0x800020, 0x483D8B];
        
        for (let x = -4; x <= 4; x++) {
            for (let z = -4; z <= 4; z++) {
                if (Math.random() > 0.3) {
                    const width = 30 + Math.random() * 40;
                    const height = 20 + Math.random() * 80;
                    const depth = 30 + Math.random() * 40;
                    
                    const geometry = new THREE.BoxGeometry(width, height, depth);
                    const material = new THREE.MeshLambertMaterial({ 
                        color: buildingColors[Math.floor(Math.random() * buildingColors.length)]
                    });
                    
                    const building = new THREE.Mesh(geometry, material);
                    building.position.set(
                        x * 100 + (Math.random() - 0.5) * 40,
                        height / 2,
                        z * 100 + (Math.random() - 0.5) * 40
                    );
                    building.castShadow = true;
                    building.receiveShadow = true;
                    
                    // Windows
                    this.addWindows(building, width, height, depth);
                    
                    cityGroup.add(building);
                }
            }
        }
    }
    
    addWindows(building, width, height, depth) {
        const windowMaterial = new THREE.MeshBasicMaterial({ 
            color: Math.random() > 0.5 ? 0xffff00 : 0x000080 
        });
        
        const windowSize = 3;
        const windowSpacing = 8;
        
        for (let y = 5; y < height - 5; y += windowSpacing) {
            for (let x = -width/2 + 5; x < width/2 - 5; x += windowSpacing) {
                const window = new THREE.Mesh(
                    new THREE.PlaneGeometry(windowSize, windowSize),
                    windowMaterial
                );
                window.position.set(x, y - height/2, depth/2 + 0.1);
                building.add(window);
                
                const window2 = new THREE.Mesh(
                    new THREE.PlaneGeometry(windowSize, windowSize),
                    windowMaterial
                );
                window2.position.set(x, y - height/2, -depth/2 - 0.1);
                window2.rotation.y = Math.PI;
                building.add(window2);
            }
        }
    }
    
    createEnvironment(cityGroup) {
        // Trees
        for (let i = 0; i < 50; i++) {
            const tree = this.createTree();
            tree.position.set(
                (Math.random() - 0.5) * 800,
                0,
                (Math.random() - 0.5) * 800
            );
            cityGroup.add(tree);
        }
        
        // Street lights
        for (let i = -5; i <= 5; i++) {
            for (let j = -5; j <= 5; j++) {
                if (Math.random() > 0.7) {
                    const lightPole = this.createStreetLight();
                    lightPole.position.set(i * 100 + 20, 0, j * 100 + 20);
                    cityGroup.add(lightPole);
                }
            }
        }
    }
    
    createTree() {
        const treeGroup = new THREE.Group();
        
        // Trunk
        const trunk = new THREE.Mesh(
            new THREE.CylinderGeometry(1, 1.5, 8),
            new THREE.MeshLambertMaterial({ color: 0x8B4513 })
        );
        trunk.position.y = 4;
        trunk.castShadow = true;
        treeGroup.add(trunk);
        
        // Leaves
        const leaves = new THREE.Mesh(
            new THREE.SphereGeometry(4, 8, 6),
            new THREE.MeshLambertMaterial({ color: 0x228B22 })
        );
        leaves.position.y = 10;
        leaves.castShadow = true;
        treeGroup.add(leaves);
        
        return treeGroup;
    }
    
    createStreetLight() {
        const lightGroup = new THREE.Group();
        
        // Pole
        const pole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.2, 0.2, 10),
            new THREE.MeshLambertMaterial({ color: 0x696969 })
        );
        pole.position.y = 5;
        lightGroup.add(pole);
        
        // Light
        const light = new THREE.PointLight(0xffff00, 0.5, 50);
        light.position.y = 9;
        lightGroup.add(light);
        
        // Light bulb
        const bulb = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 8, 6),
            new THREE.MeshBasicMaterial({ color: 0xffff00 })
        );
        bulb.position.y = 9;
        lightGroup.add(bulb);
        
        return lightGroup;
    }
    
    createCharacter() {
        const characterGroup = new THREE.Group();
        
        // Head
        const headGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xffdbac });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 5.5;
        head.castShadow = true;
        characterGroup.add(head);
        
        // Hair
        const hairGeometry = new THREE.BoxGeometry(1.6, 0.8, 1.6);
        const hairMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const hair = new THREE.Mesh(hairGeometry, hairMaterial);
        hair.position.y = 6.2;
        hair.castShadow = true;
        characterGroup.add(hair);
        
        // Body
        const bodyGeometry = new THREE.BoxGeometry(2, 2.5, 1);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x0066cc });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 3.5;
        body.castShadow = true;
        characterGroup.add(body);
        
        // Arms
        const armGeometry = new THREE.BoxGeometry(0.8, 2, 0.8);
        const armMaterial = new THREE.MeshLambertMaterial({ color: 0xffdbac });
        
        const leftArm = new THREE.Mesh(armGeometry, armMaterial);
        leftArm.position.set(-1.5, 3.5, 0);
        leftArm.castShadow = true;
        characterGroup.add(leftArm);
        
        const rightArm = new THREE.Mesh(armGeometry, armMaterial);
        rightArm.position.set(1.5, 3.5, 0);
        rightArm.castShadow = true;
        characterGroup.add(rightArm);
        
        // Legs
        const legGeometry = new THREE.BoxGeometry(0.8, 2.5, 0.8);
        const legMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.5, 1, 0);
        leftLeg.castShadow = true;
        characterGroup.add(leftLeg);
        
        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.5, 1, 0);
        rightLeg.castShadow = true;
        characterGroup.add(rightLeg);
        
        // Shoes
        const shoeGeometry = new THREE.BoxGeometry(1, 0.3, 1.5);
        const shoeMaterial = new THREE.MeshLambertMaterial({ color: 0x000000 });
        
        const leftShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
        leftShoe.position.set(-0.5, 0.2, 0.2);
        leftShoe.castShadow = true;
        characterGroup.add(leftShoe);
        
        const rightShoe = new THREE.Mesh(shoeGeometry, shoeMaterial);
        rightShoe.position.set(0.5, 0.2, 0.2);
        rightShoe.castShadow = true;
        characterGroup.add(rightShoe);
        
        this.character = characterGroup;
        this.character.position.set(0, 2, 5);
        this.character.visible = false;
        this.scene.add(this.character);
    }
    
    createVehicle() {
        const vehicleGroup = new THREE.Group();
        
        // Car body
        const bodyGeometry = new THREE.BoxGeometry(8, 3, 15);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 2;
        body.castShadow = true;
        vehicleGroup.add(body);
        
        // Car roof
        const roofGeometry = new THREE.BoxGeometry(6, 2, 8);
        const roof = new THREE.Mesh(roofGeometry, bodyMaterial);
        roof.position.y = 4;
        roof.position.z = -1;
        roof.castShadow = true;
        vehicleGroup.add(roof);
        
        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(1, 1, 0.5);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        
        const wheelPositions = [
            { x: 2.5, y: 1, z: 4 },
            { x: -2.5, y: 1, z: 4 },
            { x: 2.5, y: 1, z: -4 },
            { x: -2.5, y: 1, z: -4 }
        ];
        
        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.position.set(pos.x, pos.y, pos.z);
            wheel.rotation.z = Math.PI / 2;
            wheel.castShadow = true;
            vehicleGroup.add(wheel);
        });
        
        // Headlights
        const headlightGeometry = new THREE.BoxGeometry(1, 0.5, 0.5);
        const headlightMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        
        const leftHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        leftHeadlight.position.set(2, 2, 7.5);
        vehicleGroup.add(leftHeadlight);
        
        const rightHeadlight = new THREE.Mesh(headlightGeometry, headlightMaterial);
        rightHeadlight.position.set(-2, 2, 7.5);
        vehicleGroup.add(rightHeadlight);
        
        // Headlight lights
        const leftLight = new THREE.SpotLight(0xffffff, 0.5, 100, Math.PI / 6, 0.5);
        leftLight.position.set(2, 2, 7.5);
        leftLight.target.position.set(2, 0, 20);
        vehicleGroup.add(leftLight);
        vehicleGroup.add(leftLight.target);
        
        const rightLight = new THREE.SpotLight(0xffffff, 0.5, 100, Math.PI / 6, 0.5);
        rightLight.position.set(-2, 2, 7.5);
        rightLight.target.position.set(-2, 0, 20);
        vehicleGroup.add(rightLight);
        vehicleGroup.add(rightLight.target);
        
        this.vehicle = vehicleGroup;
        this.vehicle.position.set(0, 1, 0);
        this.scene.add(this.vehicle);
        
        // Create some traffic vehicles
        this.createTraffic();
        
        // Create pedestrians
        this.createPedestrians();
        this.createPolice();
        this.setupWeaponSystem();
    }
    
    createPedestrians() {
        for (let i = 0; i < 15; i++) {
            const pedestrian = this.createPedestrian();
            pedestrian.position.set(
                (Math.random() - 0.5) * 800,
                2,
                (Math.random() - 0.5) * 800
            );
            this.pedestrians.push(pedestrian);
            this.scene.add(pedestrian);
        }
    }
    
    createPedestrian() {
        const pedestrianGroup = new THREE.Group();
        
        // Simple pedestrian body
        const bodyGeometry = new THREE.BoxGeometry(1.5, 2, 1);
        const bodyMaterial = new THREE.MeshLambertMaterial({ 
            color: new THREE.Color(Math.random(), Math.random(), Math.random())
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.5;
        body.castShadow = true;
        pedestrianGroup.add(body);
        
        // Head
        const headGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xffdbac });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2.8;
        head.castShadow = true;
        pedestrianGroup.add(head);
        
        // Legs
        const legGeometry = new THREE.BoxGeometry(0.4, 1.5, 0.4);
        const legMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        
        const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
        leftLeg.position.set(-0.3, 0.75, 0);
        leftLeg.castShadow = true;
        pedestrianGroup.add(leftLeg);
        
        const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
        rightLeg.position.set(0.3, 0.75, 0);
        rightLeg.castShadow = true;
        pedestrianGroup.add(rightLeg);
        
        pedestrianGroup.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 3,
                0,
                (Math.random() - 0.5) * 3
            ),
            targetPosition: new THREE.Vector3(
                (Math.random() - 0.5) * 800,
                2,
                (Math.random() - 0.5) * 800
            ),
            walkSpeed: 2 + Math.random() * 2
        };
        
        return pedestrianGroup;
    }
    
    createTraffic() {
        for (let i = 0; i < 10; i++) {
            const trafficVehicle = this.createTrafficVehicle();
            trafficVehicle.position.set(
                (Math.random() - 0.5) * 800,
                1,
                (Math.random() - 0.5) * 800
            );
            this.traffic.push(trafficVehicle);
            this.scene.add(trafficVehicle);
        }
    }
    
    createTrafficVehicle() {
        const vehicleGroup = new THREE.Group();
        
        // Simple car body
        const bodyGeometry = new THREE.BoxGeometry(6, 2, 12);
        const bodyMaterial = new THREE.MeshLambertMaterial({ 
            color: new THREE.Color(Math.random(), Math.random(), Math.random())
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.5;
        body.castShadow = true;
        vehicleGroup.add(body);
        
        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.4);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        
        const wheelPositions = [
            { x: 2, y: 0.8, z: 3 },
            { x: -2, y: 0.8, z: 3 },
            { x: 2, y: 0.8, z: -3 },
            { x: -2, y: 0.8, z: -3 }
        ];
        
        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.position.set(pos.x, pos.y, pos.z);
            wheel.rotation.z = Math.PI / 2;
            wheel.castShadow = true;
            vehicleGroup.add(wheel);
        });
        
        vehicleGroup.userData = {
            velocity: new THREE.Vector3(
                (Math.random() - 0.5) * 10,
                0,
                (Math.random() - 0.5) * 10
            ),
            targetPosition: new THREE.Vector3(
                (Math.random() - 0.5) * 800,
                1,
                (Math.random() - 0.5) * 800
            )
        };
        
        return vehicleGroup;
    }
    
    setupControls() {
        document.addEventListener('keydown', (e) => {
            this.controls[e.code] = true;
            
            if (e.code === 'KeyE') {
                this.toggleVehicle();
            }
            
            if (e.code === 'Space' && !this.inVehicle && !this.isJumping) {
                this.jump();
            }
            
            if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
                this.startRunning();
            }
            
            // Camera switching
            if (e.code === 'KeyV') {
                this.switchCameraMode();
            }
            
            // Weapon switching
            if (e.code === 'Digit1') this.switchWeapon('pistol');
            if (e.code === 'Digit2') this.switchWeapon('shotgun');
            if (e.code === 'Digit3') this.switchWeapon('rifle');
            if (e.code === 'Digit4') this.switchWeapon('smg');
            if (e.code === 'Digit5') this.switchWeapon('sniper');
            if (e.code === 'Digit6') this.switchWeapon('rpg');
            
            // Shooting
            if (e.code === 'Mouse0') {
                this.shoot();
            }
            
            // Money cheats (for testing)
            if (e.code === 'KeyM') {
                this.addMoney(1000);
                this.mission = "+$1000";
            }
            
            // Increase wanted level
            if (e.code === 'KeyP') {
                this.increaseWantedLevel();
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.controls[e.code] = false;
            
            if (e.code === 'ShiftLeft' || e.code === 'ShiftRight') {
                this.stopRunning();
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.inVehicle) {
                const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
                const mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
                
                // Rotate vehicle based on mouse position (normal direction)
                this.steerAngle = -mouseX * 0.3;
            } else if (this.character) {
                const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
                
                // Rotate character based on mouse position (normal direction)
                this.character.rotation.y = -mouseX * Math.PI;
            }
        });
        
        document.addEventListener('mousedown', (e) => {
            if (e.button === 0) { // Left click
                this.controls['Mouse0'] = true;
            }
        });
        
        document.addEventListener('mouseup', (e) => {
            if (e.button === 0) { // Left click
                this.controls['Mouse0'] = false;
            }
        });
    }
    
    toggleVehicle() {
        if (this.inVehicle) {
            // Exit vehicle
            this.inVehicle = false;
            this.character.visible = true;
            this.character.position.copy(this.vehicle.position);
            this.character.position.x += 2;
            this.character.position.z += 2;
            this.mission = "On Foot";
            this.isDriving = false;
            
            // Trigger idle animation
            if (this.characterAnimations) {
                this.characterAnimations.setAnimation('idle');
            }
        } else {
            // Enter vehicle
            const distance = this.character.position.distanceTo(this.vehicle.position);
            if (distance < 10) {
                this.inVehicle = true;
                this.character.visible = false;
                this.mission = "In Vehicle";
                this.isDriving = true;
                
                // Trigger driving animation
                if (this.characterAnimations) {
                    this.characterAnimations.setAnimation('drive');
                }
            } else {
                this.mission = "Too far from vehicle";
            }
        }
    }
    
    multiplayerShoot() {
        if (!this.character || this.inVehicle) return;
        
        const weapon = this.weapons[this.currentWeapon];
        const currentTime = Date.now();
        
        // Check fire rate
        if (currentTime - this.lastShotTime < weapon.fireRate) return;
        
        // Check ammo
        if (weapon.ammo <= 0) {
            this.mission = "Out of ammo!";
            return;
        }
        
        // Shoot
        weapon.ammo--;
        this.lastShotTime = currentTime;
        
        // Trigger shoot animation
        if (this.characterAnimations) {
            this.characterAnimations.setAnimation('shoot');
        }
        
        // Create bullet data for multiplayer
        const bulletData = {
            position: {
                x: this.character.position.x,
                y: this.character.position.y + 3.5,
                z: this.character.position.z
            },
            velocity: {
                x: 0,
                y: 0,
                z: -50
            },
            damage: weapon.damage,
            range: weapon.range,
            weapon: this.currentWeapon
        };
        
        // Apply character rotation to bullet velocity
        const forward = new THREE.Vector3(0, 0, -50);
        forward.applyQuaternion(this.character.quaternion);
        bulletData.velocity.x = forward.x;
        bulletData.velocity.y = forward.y;
        bulletData.velocity.z = forward.z;
        
        // Send to multiplayer server
        if (this.multiplayer && this.multiplayer.connected) {
            this.multiplayer.sendShoot(bulletData);
        } else {
            // Single player bullet creation
            this.createBullet();
        }
        
        // Play gunshot sound
        this.playGunshotSound();
        
        // Add recoil
        this.addRecoil();
        
        // Check for crime
        if (this.currentWeapon !== 'pistol') {
            this.commitCrime('shooting');
        }
        
        this.mission = `${weapon.name} - Ammo: ${weapon.ammo}`;
    }
    
    updateHealthDisplay() {
        // Update health display if needed
        const healthDisplay = document.getElementById('health') || this.createHealthDisplay();
        if (healthDisplay) {
            healthDisplay.textContent = `Health: ${this.characterHealth}`;
            healthDisplay.style.color = this.characterHealth > 50 ? '#00ff00' : 
                                       this.characterHealth > 25 ? '#ffff00' : '#ff0000';
        }
    }
    
    createHealthDisplay() {
        const healthDiv = document.createElement('div');
        healthDiv.id = 'health';
        healthDiv.className = 'hud-element';
        healthDiv.style.top = '60px';
        healthDiv.style.right = '20px';
        healthDiv.style.fontSize = '18px';
        healthDiv.style.fontWeight = 'bold';
        healthDiv.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8)';
        document.getElementById('hud').appendChild(healthDiv);
        return healthDiv;
    }
    
    jump() {
        this.isJumping = true;
        this.jumpVelocity = 8;
        this.mission = "Jumping!";
        
        // Trigger jump animation
        if (this.characterAnimations) {
            this.characterAnimations.setAnimation('jump');
        }
    }
    
    stopRunning() {
        this.isRunning = false;
        this.mission = "On Foot";
        
        // Return to idle animation
        if (this.characterAnimations) {
            this.characterAnimations.setAnimation('idle');
        }
    }
    
    startRunning() {
        if (this.stamina > 10) {
            this.isRunning = true;
            this.mission = "Running!";
            
            // Trigger run animation
            if (this.characterAnimations) {
                this.characterAnimations.setAnimation('run');
            }
        }
    }
    
    setupWeaponSystem() {
        // Initialize weapon models and sounds
        this.createWeaponModels();
    }
    
    createWeaponModels() {
        // Create visual representations of weapons
        this.weaponModels = {};
        
        Object.keys(this.weapons).forEach(weaponType => {
            const weaponGroup = new THREE.Group();
            
            // Simple gun model
            const gunGeometry = new THREE.BoxGeometry(0.3, 0.2, 1);
            const gunMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
            const gun = new THREE.Mesh(gunGeometry, gunMaterial);
            gun.position.z = 0.5;
            weaponGroup.add(gun);
            
            // Barrel
            const barrelGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.5);
            const barrel = new THREE.Mesh(barrelGeometry, gunMaterial);
            barrel.rotation.x = Math.PI / 2;
            barrel.position.z = 1;
            weaponGroup.add(barrel);
            
            this.weaponModels[weaponType] = weaponGroup;
            weaponGroup.visible = false;
            this.scene.add(weaponGroup);
        });
    }
    
    switchWeapon(weaponType) {
        if (this.weapons[weaponType]) {
            // Hide current weapon
            if (this.weaponModels[this.currentWeapon]) {
                this.weaponModels[this.currentWeapon].visible = false;
            }
            
            this.currentWeapon = weaponType;
            this.mission = `Equipped ${this.weapons[weaponType].name}`;
            
            // Show new weapon
            if (this.weaponModels[this.currentWeapon]) {
                this.weaponModels[this.currentWeapon].visible = true;
                this.updateWeaponPosition();
            }
        }
    }
    
    updateWeaponPosition() {
        if (this.character && this.weaponModels[this.currentWeapon]) {
            const weapon = this.weaponModels[this.currentWeapon];
            weapon.position.copy(this.character.position);
            weapon.position.y += 3.5;
            weapon.rotation.copy(this.character.rotation);
        }
    }
    
    shoot() {
        if (!this.character || this.inVehicle) return;
        
        const weapon = this.weapons[this.currentWeapon];
        const currentTime = Date.now();
        
        // Check fire rate
        if (currentTime - this.lastShotTime < weapon.fireRate) return;
        
        // Check ammo
        if (weapon.ammo <= 0) {
            this.mission = "Out of ammo!";
            return;
        }
        
        // Shoot
        weapon.ammo--;
        this.lastShotTime = currentTime;
        
        // Create bullet
        this.createBullet();
        
        // Play gunshot sound
        this.playGunshotSound();
        
        // Add recoil
        this.addRecoil();
        
        // Check for crime
        if (this.currentWeapon !== 'pistol') {
            this.commitCrime('shooting');
        }
        
        this.mission = `${weapon.name} - Ammo: ${weapon.ammo}`;
    }
    
    createBullet() {
        const bulletGeometry = new THREE.SphereGeometry(0.1, 8, 6);
        const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);
        
        bullet.position.copy(this.character.position);
        bullet.position.y += 3.5;
        
        const weapon = this.weapons[this.currentWeapon];
        bullet.userData = {
            velocity: new THREE.Vector3(0, 0, -50).applyQuaternion(this.character.quaternion),
            damage: weapon.damage,
            range: weapon.range,
            distanceTraveled: 0
        };
        
        this.bullets.push(bullet);
        this.scene.add(bullet);
    }
    
    updateBullets(deltaTime) {
        this.bullets = this.bullets.filter(bullet => {
            const userData = bullet.userData;
            
            // Move bullet
            bullet.position.add(userData.velocity.clone().multiplyScalar(deltaTime));
            userData.distanceTraveled += userData.velocity.length() * deltaTime;
            
            // Check range
            if (userData.distanceTraveled > userData.range) {
                this.scene.remove(bullet);
                return false;
            }
            
            // Check collisions
            if (this.checkBulletCollision(bullet)) {
                this.scene.remove(bullet);
                return false;
            }
            
            return true;
        });
    }
    
    checkBulletCollision(bullet) {
        const userData = bullet.userData;
        
        // Check pedestrian collisions
        this.pedestrians.forEach(pedestrian => {
            const distance = bullet.position.distanceTo(pedestrian.position);
            if (distance < 2) {
                this.damagePedestrian(pedestrian, userData.damage);
                return true;
            }
        });
        
        // Check police collisions
        this.policeOfficers.forEach(officer => {
            const distance = bullet.position.distanceTo(officer.position);
            if (distance < 2) {
                this.damagePolice(officer, userData.damage);
                return true;
            }
        });
        
        // Check building collisions (simple)
        if (bullet.position.y < 1) {
            return true;
        }
        
        return false;
    }
    
    damagePedestrian(pedestrian, damage) {
        // Simple damage system - remove pedestrian
        const index = this.pedestrians.indexOf(pedestrian);
        if (index > -1) {
            this.pedestrians.splice(index, 1);
            this.scene.remove(pedestrian);
            this.addMoney(50);
            this.commitCrime('assault');
            this.mission = "+$50 - Crime committed!";
        }
    }
    
    damagePolice(officer, damage) {
        // Damage police officer
        officer.userData.health -= damage;
        if (officer.userData.health <= 0) {
            const index = this.policeOfficers.indexOf(officer);
            if (index > -1) {
                this.policeOfficers.splice(index, 1);
                this.scene.remove(officer);
                this.addMoney(200);
                this.increaseWantedLevel(2);
                this.mission = "+$200 - Officer down!";
            }
        }
    }
    
    addRecoil() {
        if (this.character) {
            // Add visual recoil effect
            this.character.rotation.x += (Math.random() - 0.5) * 0.1;
        }
    }
    
    playGunshotSound() {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }
    
    // Money functions
    addMoney(amount) {
        this.money += amount;
        this.updateMoneyDisplay();
    }
    
    spendMoney(amount) {
        if (this.money >= amount) {
            this.money -= amount;
            this.updateMoneyDisplay();
            return true;
        }
        return false;
    }
    
    depositMoney(amount) {
        if (this.money >= amount) {
            this.money -= amount;
            this.bankMoney += amount;
            this.updateMoneyDisplay();
            return true;
        }
        return false;
    }
    
    withdrawMoney(amount) {
        if (this.bankMoney >= amount) {
            this.bankMoney -= amount;
            this.money += amount;
            this.updateMoneyDisplay();
            return true;
        }
        return false;
    }
    
    updateMoneyDisplay() {
        // Update HUD with money display
        const moneyDisplay = document.getElementById('money') || this.createMoneyDisplay();
        if (moneyDisplay) {
            moneyDisplay.textContent = `$${this.money} | Bank: $${this.bankMoney}`;
        }
    }
    
    createMoneyDisplay() {
        const moneyDiv = document.createElement('div');
        moneyDiv.id = 'money';
        moneyDiv.className = 'hud-element';
        moneyDiv.style.top = '60px';
        moneyDiv.style.left = '20px';
        moneyDiv.style.fontSize = '18px';
        moneyDiv.style.color = '#00ff00';
        document.getElementById('hud').appendChild(moneyDiv);
        return moneyDiv;
    }
    
    // Police system
    createPolice() {
        // Create initial police presence
        for (let i = 0; i < 3; i++) {
            this.spawnPoliceCar();
        }
    }
    
    spawnPoliceCar() {
        const policeCar = this.createPoliceCar();
        policeCar.position.set(
            (Math.random() - 0.5) * 800,
            1,
            (Math.random() - 0.5) * 800
        );
        this.policeCars.push(policeCar);
        this.scene.add(policeCar);
    }
    
    createPoliceCar() {
        const carGroup = new THREE.Group();
        
        // Police car body
        const bodyGeometry = new THREE.BoxGeometry(6, 2, 12);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x0000ff });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.5;
        body.castShadow = true;
        carGroup.add(body);
        
        // Police lights
        const lightGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
        const redLightMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const blueLightMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
        
        const redLight = new THREE.Mesh(lightGeometry, redLightMaterial);
        redLight.position.set(0, 3, 6);
        carGroup.add(redLight);
        
        const blueLight = new THREE.Mesh(lightGeometry, blueLightMaterial);
        blueLight.position.set(0, 3, 6);
        carGroup.add(blueLight);
        
        // Wheels
        const wheelGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.4);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        
        const wheelPositions = [
            { x: 2, y: 0.8, z: 3 },
            { x: -2, y: 0.8, z: 3 },
            { x: 2, y: 0.8, z: -3 },
            { x: -2, y: 0.8, z: -3 }
        ];
        
        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.position.set(pos.x, pos.y, pos.z);
            wheel.rotation.z = Math.PI / 2;
            wheel.castShadow = true;
            carGroup.add(wheel);
        });
        
        carGroup.userData = {
            velocity: new THREE.Vector3(0, 0, 0),
            targetPosition: new THREE.Vector3(0, 1, 0),
            isChasing: false,
            health: 100
        };
        
        return carGroup;
    }
    
    spawnPoliceOfficer() {
        const officer = this.createPoliceOfficer();
        officer.position.set(
            (Math.random() - 0.5) * 800,
            2,
            (Math.random() - 0.5) * 800
        );
        this.policeOfficers.push(officer);
        this.scene.add(officer);
    }
    
    createPoliceOfficer() {
        const officerGroup = new THREE.Group();
        
        // Police officer body
        const bodyGeometry = new THREE.BoxGeometry(1.5, 2, 1);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x000080 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.5;
        body.castShadow = true;
        officerGroup.add(body);
        
        // Head
        const headGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xffdbac });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2.8;
        head.castShadow = true;
        officerGroup.add(head);
        
        // Police hat
        const hatGeometry = new THREE.BoxGeometry(1, 0.3, 1.2);
        const hatMaterial = new THREE.MeshLambertMaterial({ color: 0x000080 });
        const hat = new THREE.Mesh(hatGeometry, hatMaterial);
        hat.position.y = 3.3;
        hat.castShadow = true;
        officerGroup.add(hat);
        
        officerGroup.userData = {
            velocity: new THREE.Vector3(0, 0, 0),
            targetPosition: new THREE.Vector3(0, 2, 0),
            health: 100,
            isChasing: false
        };
        
        return officerGroup;
    }
    
    commitCrime(crimeType) {
        const currentTime = Date.now();
        if (currentTime - this.lastCrimeTime < this.crimeCooldown) return;
        
        this.lastCrimeTime = currentTime;
        
        switch(crimeType) {
            case 'shooting':
                this.increaseWantedLevel(1);
                break;
            case 'assault':
                this.increaseWantedLevel(2);
                break;
            case 'theft':
                this.increaseWantedLevel(1);
                break;
            default:
                this.increaseWantedLevel(1);
        }
    }
    
    increaseWantedLevel(amount = 1) {
        this.wantedLevel = Math.min(this.wantedLevel + amount, this.maxWantedLevel);
        this.updateWantedLevel();
        this.mission = `Wanted Level: ${this.wantedLevel} stars`;
    }
    
    decreaseWantedLevel() {
        if (this.wantedLevel > 0) {
            this.wantedLevel--;
            this.updateWantedLevel();
        }
    }
    
    updateWantedLevel() {
        // Adjust police presence based on wanted level
        const targetPoliceCars = Math.min(this.wantedLevel * 2, 10);
        const targetPoliceOfficers = Math.min(this.wantedLevel * 3, 15);
        
        // Spawn more police if needed
        while (this.policeCars.length < targetPoliceCars) {
            this.spawnPoliceCar();
        }
        
        while (this.policeOfficers.length < targetPoliceOfficers) {
            this.spawnPoliceOfficer();
        }
        
        // Remove excess police if wanted level decreased
        while (this.policeCars.length > targetPoliceCars && this.policeCars.length > 0) {
            const car = this.policeCars.pop();
            this.scene.remove(car);
        }
        
        while (this.policeOfficers.length > targetPoliceOfficers && this.policeOfficers.length > 0) {
            const officer = this.policeOfficers.pop();
            this.scene.remove(officer);
        }
        
        // Update wanted level display
        this.updateWantedDisplay();
    }
    
    updateWantedDisplay() {
        const wantedDisplay = document.getElementById('wanted') || this.createWantedDisplay();
        if (wantedDisplay) {
            wantedDisplay.innerHTML = '';
            
            for (let i = 0; i < this.wantedLevel; i++) {
                const star = document.createElement('span');
                star.textContent = '⭐';
                star.style.marginRight = '5px';
                wantedDisplay.appendChild(star);
            }
        }
    }
    
    createWantedDisplay() {
        const wantedDiv = document.createElement('div');
        wantedDiv.id = 'wanted';
        wantedDiv.className = 'hud-element';
        wantedDiv.style.top = '90px';
        wantedDiv.style.left = '20px';
        wantedDiv.style.fontSize = '20px';
        wantedDiv.style.color = '#ffff00';
        document.getElementById('hud').appendChild(wantedDiv);
        return wantedDiv;
    }
    
    updatePolice(deltaTime) {
        const playerPosition = this.inVehicle ? this.vehicle.position : this.character?.position;
        if (!playerPosition) return;
        
        // Update police cars
        this.policeCars.forEach(car => {
            const userData = car.userData;
            
            if (this.wantedLevel > 0) {
                // Chase player
                userData.isChasing = true;
                userData.targetPosition.copy(playerPosition);
                
                const direction = new THREE.Vector3();
                direction.subVectors(userData.targetPosition, car.position);
                direction.y = 0;
                direction.normalize();
                
                const chaseSpeed = 15 + (this.wantedLevel * 2);
                userData.velocity.lerp(direction.multiplyScalar(chaseSpeed), deltaTime * 0.1);
            } else {
                // Patrol
                userData.isChasing = false;
                if (car.position.distanceTo(userData.targetPosition) < 10) {
                    userData.targetPosition.set(
                        (Math.random() - 0.5) * 800,
                        1,
                        (Math.random() - 0.5) * 800
                    );
                }
                
                const direction = new THREE.Vector3();
                direction.subVectors(userData.targetPosition, car.position);
                direction.y = 0;
                direction.normalize();
                
                userData.velocity.lerp(direction.multiplyScalar(8), deltaTime * 0.1);
            }
            
            car.position.add(userData.velocity.clone().multiplyScalar(deltaTime));
            car.position.y = 1;
            
            // Rotate to face movement
            if (userData.velocity.length() > 0.1) {
                const angle = Math.atan2(userData.velocity.x, userData.velocity.z);
                car.rotation.y = angle;
            }
            
            // Flash lights when chasing
            if (userData.isChasing) {
                const flash = Math.sin(Date.now() * 0.01) > 0;
                car.children.forEach(child => {
                    if (child.material && child.material.color) {
                        if (child.material.color.getHex() === 0xff0000) {
                            child.visible = flash;
                        } else if (child.material.color.getHex() === 0x0000ff) {
                            child.visible = !flash;
                        }
                    }
                });
            }
        });
        
        // Update police officers
        this.policeOfficers.forEach(officer => {
            const userData = officer.userData;
            
            if (this.wantedLevel > 2) {
                // Chase player on foot
                userData.isChasing = true;
                userData.targetPosition.copy(playerPosition);
                
                const direction = new THREE.Vector3();
                direction.subVectors(userData.targetPosition, officer.position);
                direction.y = 0;
                direction.normalize();
                
                const chaseSpeed = 6 + this.wantedLevel;
                userData.velocity.lerp(direction.multiplyScalar(chaseSpeed), deltaTime * 0.1);
            } else {
                // Patrol
                userData.isChasing = false;
                if (officer.position.distanceTo(userData.targetPosition) < 5) {
                    userData.targetPosition.set(
                        (Math.random() - 0.5) * 800,
                        2,
                        (Math.random() - 0.5) * 800
                    );
                }
                
                const direction = new THREE.Vector3();
                direction.subVectors(userData.targetPosition, officer.position);
                direction.y = 0;
                direction.normalize();
                
                userData.velocity.lerp(direction.multiplyScalar(3), deltaTime * 0.1);
            }
            
            officer.position.add(userData.velocity.clone().multiplyScalar(deltaTime));
            officer.position.y = 2;
            
            // Rotate to face movement
            if (userData.velocity.length() > 0.1) {
                const angle = Math.atan2(userData.velocity.x, userData.velocity.z);
                officer.rotation.y = angle;
            }
        });
    }
    
    setupCamera() {
        this.camera.position.set(0, 10, 20);
        this.camera.lookAt(this.vehicle.position);
    }
    
    updateCharacter(deltaTime) {
        if (this.inVehicle || !this.character) return;
        
        // Handle character movement
        const moveVector = new THREE.Vector3();
        let currentSpeed = this.characterSpeed;
        let isMoving = false;
        
        if (this.controls['KeyW']) {
            moveVector.z -= 1;
            isMoving = true;
        }
        if (this.controls['KeyS']) {
            moveVector.z += 1;
            isMoving = true;
        }
        if (this.controls['KeyA']) {
            moveVector.x -= 1;
            isMoving = true;
        }
        if (this.controls['KeyD']) {
            moveVector.x += 1;
            isMoving = true;
        }
        
        // Handle running
        if (this.isRunning && this.stamina > 0) {
            currentSpeed = this.runSpeed;
            this.stamina = Math.max(0, this.stamina - deltaTime * 20);
            
            // Add running animation
            const runCycle = Date.now() * 0.01;
            this.character.rotation.x = Math.sin(runCycle) * 0.2;
        } else {
            // Regenerate stamina
            this.stamina = Math.min(this.maxStamina, this.stamina + deltaTime * 10);
            
            // Stop running if out of stamina
            if (this.stamina <= 0) {
                this.isRunning = false;
            }
            
            // Normal walk animation
            const walkCycle = Date.now() * 0.005;
            this.character.rotation.x = Math.sin(walkCycle) * 0.05;
        }
        
        // Update animation based on movement
        if (this.characterAnimations) {
            if (isMoving) {
                if (this.isRunning) {
                    this.characterAnimations.setAnimation('run');
                } else {
                    this.characterAnimations.setAnimation('walk');
                }
            } else if (!this.isJumping) {
                this.characterAnimations.setAnimation('idle');
            }
        }
        
        // Normalize and apply speed
        if (moveVector.length() > 0) {
            moveVector.normalize();
            moveVector.multiplyScalar(currentSpeed * deltaTime);
            moveVector.applyQuaternion(this.character.quaternion);
            this.character.position.add(moveVector);
        }
        
        // Handle jumping
        if (this.isJumping) {
            this.character.position.y += this.jumpVelocity * deltaTime;
            this.jumpVelocity += this.gravity * deltaTime;
            
            if (this.character.position.y <= 2) {
                this.character.position.y = 2;
                this.isJumping = false;
                this.jumpVelocity = 0;
                
                // Return to idle animation after landing
                if (this.characterAnimations) {
                    this.characterAnimations.setAnimation('idle');
                }
            }
        }
        
        // Keep character in bounds
        this.character.position.x = Math.max(-490, Math.min(490, this.character.position.x));
        this.character.position.z = Math.max(-490, Math.min(490, this.character.position.z));
        
        // Update weapon position
        this.updateWeaponPosition();
        
        // Update camera to follow character
        this.updateCamera();
        
        // Update stamina display
        this.updateStaminaDisplay();
    }
    
    updateStaminaDisplay() {
        const staminaDisplay = document.getElementById('stamina') || this.createStaminaDisplay();
        const staminaPercent = (this.stamina / this.maxStamina) * 100;
        staminaDisplay.style.width = `${staminaPercent}%`;
        staminaDisplay.style.backgroundColor = staminaPercent > 30 ? '#00ff00' : '#ff0000';
    }
    
    createStaminaDisplay() {
        const staminaContainer = document.createElement('div');
        staminaContainer.id = 'stamina-container';
        staminaContainer.className = 'hud-element';
        staminaContainer.style.bottom = '100px';
        staminaContainer.style.left = '20px';
        staminaContainer.style.width = '200px';
        staminaContainer.style.height = '20px';
        staminaContainer.style.border = '2px solid white';
        staminaContainer.style.backgroundColor = 'rgba(0,0,0,0.5)';
        
        const staminaBar = document.createElement('div');
        staminaBar.id = 'stamina';
        staminaBar.style.width = '100%';
        staminaBar.style.height = '100%';
        staminaBar.style.backgroundColor = '#00ff00';
        staminaBar.style.transition = 'width 0.3s, background-color 0.3s';
        
        staminaContainer.appendChild(staminaBar);
        document.getElementById('hud').appendChild(staminaContainer);
        
        return staminaBar;
    }
    
    
    createAudio() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext());
        
        // Create engine sound
        this.createEngineSound();
        
        // Create background music
        this.createBackgroundMusic();
    }
    
    createEngineSound() {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(100, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        
        this.sounds.engine = { oscillator, gainNode };
    }
    
    createBackgroundMusic() {
        // Create simple background music using multiple oscillators
        const musicGain = this.audioContext.createGain();
        musicGain.gain.setValueAtTime(0.05, this.audioContext.currentTime);
        musicGain.connect(this.audioContext.destination);
        
        // Bass line
        const bass = this.audioContext.createOscillator();
        bass.type = 'sine';
        bass.frequency.setValueAtTime(55, this.audioContext.currentTime); // A1
        bass.connect(musicGain);
        bass.start();
        
        // Melody
        const melody = this.audioContext.createOscillator();
        melody.type = 'square';
        melody.frequency.setValueAtTime(220, this.audioContext.currentTime); // A3
        melody.connect(musicGain);
        melody.start();
        
        // Create simple melody pattern
        const melodyNotes = [220, 246.94, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00];
        let noteIndex = 0;
        
        setInterval(() => {
            melody.frequency.setValueAtTime(
                melodyNotes[noteIndex % melodyNotes.length], 
                this.audioContext.currentTime
            );
            noteIndex++;
        }, 500);
        
        this.sounds.music = { bass, melody, gain: musicGain };
    }
    
    updateVehicle(deltaTime) {
        if (!this.inVehicle || !this.vehicle) return;
        
        // Handle input
        if (this.controls['KeyW']) {
            this.acceleration = Math.min(this.acceleration + deltaTime * 20, 15);
        } else if (this.controls['KeyS']) {
            this.acceleration = Math.max(this.acceleration - deltaTime * 20, -8);
        } else {
            this.acceleration *= 0.95;
        }
        
        if (this.controls['Space']) {
            this.acceleration *= 0.9;
            this.speed *= 0.95;
        }
        
        // Update speed
        this.speed += this.acceleration * deltaTime;
        this.speed = Math.max(-20, Math.min(this.speed, this.maxSpeed));
        this.speed *= 0.98; // Friction
        
        // Calculate movement
        const forward = new THREE.Vector3(0, 0, -1);
        forward.applyQuaternion(this.vehicle.quaternion);
        forward.multiplyScalar(this.speed * deltaTime);
        
        // Apply steering
        if (Math.abs(this.speed) > 0.1) {
            this.vehicle.rotation.y += this.steerAngle * this.speed * deltaTime * 0.02;
        }
        
        // Update position
        this.vehicle.position.add(forward);
        
        // Keep vehicle on ground
        this.vehicle.position.y = 1;
        
        // Update engine sound
        if (this.sounds.engine) {
            const frequency = 80 + Math.abs(this.speed) * 3;
            this.sounds.engine.oscillator.frequency.setValueAtTime(
                frequency, 
                this.audioContext.currentTime
            );
        }
        
        // Update speedometer
        const mph = Math.abs(this.speed * 2).toFixed(0);
        const speedometerEl = document.getElementById('speedometer')
        if (speedometerEl) {
            speedometerEl.textContent = `${mph} mph`;
        }
        
        // Update camera to follow vehicle
        this.updateCamera();
    }
    
    switchCameraMode() {
        this.currentCameraIndex = (this.currentCameraIndex + 1) % this.cameraModes.length;
        this.cameraMode = this.cameraModes[this.currentCameraIndex];
        this.cameraTransition = 0;
        
        const modeNames = {
            'third_person': 'Third Person',
            'first_person': 'First Person',
            'cinematic': 'Cinematic',
            'side_view': 'Side View',
            'overhead': 'Overhead'
        };
        
        this.mission = `Camera: ${modeNames[this.cameraMode]}`;
    }
    
    updateCamera() {
        const targetPosition = this.inVehicle ? this.vehicle.position : this.character?.position;
        if (!targetPosition) return;
        
        // Smooth transition
        this.cameraTransition = Math.min(1, this.cameraTransition + this.cameraTransitionSpeed);
        
        let idealOffset, lookAtTarget;
        
        switch (this.cameraMode) {
            case 'third_person':
                if (this.inVehicle && this.vehicle) {
                    idealOffset = new THREE.Vector3(0, 8, 15);
                    idealOffset.applyMatrix4(this.vehicle.matrixWorld);
                    
                    lookAtTarget = new THREE.Vector3(0, 2, -10);
                    lookAtTarget.applyMatrix4(this.vehicle.matrixWorld);
                } else if (this.character) {
                    idealOffset = new THREE.Vector3(0, 5, 8);
                    idealOffset.applyMatrix4(this.character.matrixWorld);
                    
                    lookAtTarget = new THREE.Vector3(0, 2, -2);
                    lookAtTarget.applyMatrix4(this.character.matrixWorld);
                }
                break;
                
            case 'first_person':
                if (this.inVehicle && this.vehicle) {
                    idealOffset = new THREE.Vector3(0, 3, 2);
                    idealOffset.applyMatrix4(this.vehicle.matrixWorld);
                    
                    lookAtTarget = new THREE.Vector3(0, 3, -20);
                    lookAtTarget.applyMatrix4(this.vehicle.matrixWorld);
                } else if (this.character) {
                    idealOffset = new THREE.Vector3(0, 5.5, 0.5);
                    idealOffset.applyMatrix4(this.character.matrixWorld);
                    
                    lookAtTarget = new THREE.Vector3(0, 5.5, -20);
                    lookAtTarget.applyMatrix4(this.character.matrixWorld);
                }
                break;
                
            case 'cinematic':
                if (this.inVehicle && this.vehicle) {
                    const angle = Date.now() * 0.0005;
                    const distance = 25;
                    idealOffset = new THREE.Vector3(
                        Math.sin(angle) * distance,
                        15,
                        Math.cos(angle) * distance
                    );
                    idealOffset.add(this.vehicle.position);
                    
                    lookAtTarget = this.vehicle.position.clone();
                    lookAtTarget.y += 2;
                } else if (this.character) {
                    const angle = Date.now() * 0.0003;
                    const distance = 15;
                    idealOffset = new THREE.Vector3(
                        Math.sin(angle) * distance,
                        10,
                        Math.cos(angle) * distance
                    );
                    idealOffset.add(this.character.position);
                    
                    lookAtTarget = this.character.position.clone();
                    lookAtTarget.y += 2;
                }
                break;
                
            case 'side_view':
                if (this.inVehicle && this.vehicle) {
                    const right = new THREE.Vector3(1, 0, 0);
                    right.applyQuaternion(this.vehicle.quaternion);
                    idealOffset = this.vehicle.position.clone();
                    idealOffset.add(right.multiplyScalar(20));
                    idealOffset.y += 10;
                    
                    lookAtTarget = this.vehicle.position.clone();
                    lookAtTarget.y += 2;
                } else if (this.character) {
                    const right = new THREE.Vector3(1, 0, 0);
                    right.applyQuaternion(this.character.quaternion);
                    idealOffset = this.character.position.clone();
                    idealOffset.add(right.multiplyScalar(15));
                    idealOffset.y += 8;
                    
                    lookAtTarget = this.character.position.clone();
                    lookAtTarget.y += 2;
                }
                break;
                
            case 'overhead':
                if (this.inVehicle && this.vehicle) {
                    idealOffset = this.vehicle.position.clone();
                    idealOffset.y += 50;
                    
                    lookAtTarget = this.vehicle.position.clone();
                    lookAtTarget.y += 2;
                } else if (this.character) {
                    idealOffset = this.character.position.clone();
                    idealOffset.y += 40;
                    
                    lookAtTarget = this.character.position.clone();
                    lookAtTarget.y += 2;
                }
                break;
        }
        
        if (idealOffset && lookAtTarget) {
            // Smooth camera movement
            this.camera.position.lerp(idealOffset, this.cameraTransition);
            this.camera.lookAt(lookAtTarget);
        }
    }
    
    updateTraffic(deltaTime) {
        this.traffic.forEach(vehicle => {
            const userData = vehicle.userData;
            
            // Simple AI: move towards target position
            const direction = new THREE.Vector3();
            direction.subVectors(userData.targetPosition, vehicle.position);
            direction.y = 0;
            direction.normalize();
            
            userData.velocity.lerp(direction.multiplyScalar(10), deltaTime * 0.1);
            vehicle.position.add(userData.velocity.clone().multiplyScalar(deltaTime));
            vehicle.position.y = 1;
            
            // Rotate to face movement direction
            if (userData.velocity.length() > 0.1) {
                const angle = Math.atan2(userData.velocity.x, userData.velocity.z);
                vehicle.rotation.y = angle;
            }
            
            // Set new target when reached
            if (vehicle.position.distanceTo(userData.targetPosition) < 10) {
                userData.targetPosition.set(
                    (Math.random() - 0.5) * 800,
                    1,
                    (Math.random() - 0.5) * 800
                );
            }
        });
    }
    
    updatePedestrians(deltaTime) {
        this.pedestrians.forEach(pedestrian => {
            const userData = pedestrian.userData;
            
            // Simple AI: move towards target position
            const direction = new THREE.Vector3();
            direction.subVectors(userData.targetPosition, pedestrian.position);
            direction.y = 0;
            direction.normalize();
            
            userData.velocity.lerp(direction.multiplyScalar(userData.walkSpeed), deltaTime * 0.1);
            pedestrian.position.add(userData.velocity.clone().multiplyScalar(deltaTime));
            pedestrian.position.y = 2;
            
            // Rotate to face movement direction
            if (userData.velocity.length() > 0.1) {
                const angle = Math.atan2(userData.velocity.x, userData.velocity.z);
                pedestrian.rotation.y = angle;
            }
            
            // Walking animation
            const walkCycle = Date.now() * 0.005;
            pedestrian.rotation.x = Math.sin(walkCycle) * 0.1;
            
            // Set new target when reached
            if (pedestrian.position.distanceTo(userData.targetPosition) < 5) {
                userData.targetPosition.set(
                    (Math.random() - 0.5) * 800,
                    2,
                    (Math.random() - 0.5) * 800
                );
            }
        });
    }
    
    unlockCosmetic(cosmetic) {
        // Store unlocked cosmetics
        if (!this.unlockedCosmetics) {
            this.unlockedCosmetics = new Set();
        }
        this.unlockedCosmetics.add(cosmetic.name);
        
        // Apply cosmetic to character model
        this.applyCosmeticToCharacter(cosmetic);
        
        console.log(`👔 Unlocked cosmetic: ${cosmetic.name}`);
    }
    
    applyCosmeticToCharacter(cosmetic) {
        if (!this.character) return;
        
        // Create cosmetic accessory
        const accessory = this.createCosmeticAccessory(cosmetic);
        if (accessory) {
            this.character.add(accessory);
        }
    }
    
    createCosmeticAccessory(cosmetic) {
        const accessoryGroup = new THREE.Group();
        
        switch (cosmetic.slot) {
            case 'head':
                const headwear = new THREE.Mesh(
                    new THREE.BoxGeometry(1.6, 0.3, 1.6),
                    new THREE.MeshLambertMaterial({ color: this.getCosmeticColor(cosmetic.rarity) })
                );
                headwear.position.y = 3.3;
                accessoryGroup.add(headwear);
                break;
                
            case 'neck':
                const necklace = new THREE.Mesh(
                    new THREE.TorusGeometry(0.5, 0.05, 8, 16),
                    new THREE.MeshLambertMaterial({ color: this.getCosmeticColor(cosmetic.rarity) })
                );
                necklace.position.y = 2.8;
                necklace.rotation.x = Math.PI / 2;
                accessoryGroup.add(necklace);
                break;
                
            case 'wrist':
                const watch = new THREE.Mesh(
                    new THREE.BoxGeometry(0.8, 0.1, 0.8),
                    new THREE.MeshLambertMaterial({ color: this.getCosmeticColor(cosmetic.rarity) })
                );
                watch.position.set(0.8, 1.2, 0);
                accessoryGroup.add(watch);
                break;
                
            case 'body':
                const tattoo = new THREE.Mesh(
                    new THREE.PlaneGeometry(1.5, 2),
                    new THREE.MeshBasicMaterial({ 
                        color: this.getCosmeticColor(cosmetic.rarity),
                        transparent: true,
                        opacity: 0.7
                    })
                );
                tattoo.position.z = 0.51;
                accessoryGroup.add(tattoo);
                break;
                
            case 'back':
                const wings = this.createWings(cosmetic.rarity);
                accessoryGroup.add(wings);
                break;
        }
        
        return accessoryGroup.children.length > 0 ? accessoryGroup : null;
    }
    
    createWings(rarity) {
        const wingsGroup = new THREE.Group();
        const wingGeometry = new THREE.ConeGeometry(1, 2, 8);
        const wingMaterial = new THREE.MeshLambertMaterial({ 
            color: this.getCosmeticColor(rarity),
            transparent: true,
            opacity: 0.8
        });
        
        // Left wing
        const leftWing = new THREE.Mesh(wingGeometry, wingMaterial);
        leftWing.position.set(-1.5, 2.5, 0);
        leftWing.rotation.z = -Math.PI / 6;
        wingsGroup.add(leftWing);
        
        // Right wing
        const rightWing = new THREE.Mesh(wingGeometry, wingMaterial);
        rightWing.position.set(1.5, 2.5, 0);
        rightWing.rotation.z = Math.PI / 6;
        wingsGroup.add(rightWing);
        
        return wingsGroup;
    }
    
    getCosmeticColor(rarity) {
        const colors = {
            common: 0x888888,
            rare: 0x4CAF50,
            epic: 0x9C27B0,
            legendary: 0xFF9800,
            mythic: 0xF44336
        };
        return colors[rarity] || 0xffffff;
    }
    
    unlockVehicle(vehicle) {
        // Store unlocked vehicles
        if (!this.unlockedVehicles) {
            this.unlockedVehicles = new Set();
        }
        this.unlockedVehicles.add(vehicle.name);
        
        console.log(`🚗 Unlocked vehicle: ${vehicle.name}`);
    }
    
    // Battle pass integration
    addBattlePassXP(amount) {
        if (this.battlePass) {
            const multiplier = this.doubleXP ? 2 : 1;
            this.battlePass.addExperience(amount * multiplier, 'kill');
        }
    }
    
    updateMinimap() {
        const canvas = document.getElementById('minimapCanvas');
        const ctx = canvas.getContext('2d');
        
        ctx.clearRect(0, 0, 200, 200);
        
        // Draw background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, 200, 200);
        
        // Draw grid (roads)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i <= 200; i += 40) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, 200);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(200, i);
            ctx.stroke();
        }
        
        // Draw player (vehicle or character)
        let playerPosition = this.inVehicle ? this.vehicle?.position : this.character?.position;
        if (playerPosition) {
            const playerX = (playerPosition.x / 1000) * 200 + 100;
            const playerZ = (playerPosition.z / 1000) * 200 + 100;
            
            ctx.fillStyle = this.inVehicle ? '#00ff00' : '#ff00ff';
            ctx.beginPath();
            ctx.arc(playerX, playerZ, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw player direction
            ctx.strokeStyle = this.inVehicle ? '#00ff00' : '#ff00ff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(playerX, playerZ);
            
            let dirX, dirZ;
            if (this.inVehicle && this.vehicle) {
                dirX = playerX + Math.sin(this.vehicle.rotation.y) * 10;
                dirZ = playerZ - Math.cos(this.vehicle.rotation.y) * 10;
            } else if (this.character) {
                dirX = playerX + Math.sin(this.character.rotation.y) * 10;
                dirZ = playerZ - Math.cos(this.character.rotation.y) * 10;
            }
            
            ctx.lineTo(dirX, dirZ);
            ctx.stroke();
        }
        
        // Draw traffic
        ctx.fillStyle = '#ffff00';
        this.traffic.forEach(vehicle => {
            const x = (vehicle.position.x / 1000) * 200 + 100;
            const z = (vehicle.position.z / 1000) * 200 + 100;
            
            ctx.fillRect(x - 2, z - 1, 4, 2);
        });
        
        // Draw police officers
        ctx.fillStyle = '#808080';
        this.policeOfficers.forEach(officer => {
            const x = (officer.position.x / 1000) * 200 + 100;
            const z = (officer.position.z / 1000) * 200 + 100;
            
            ctx.beginPath();
            ctx.arc(x, z, 1, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Draw bullets
        ctx.fillStyle = '#ffff00';
        this.bullets.forEach(bullet => {
            const x = (bullet.position.x / 1000) * 200 + 100;
            const z = (bullet.position.z / 1000) * 200 + 100;
            
            ctx.beginPath();
            ctx.arc(x, z, 0.5, 0, Math.PI * 2);
            ctx.fill();
        });
    }
    
    animate() {
        if (this.paused) {
            requestAnimationFrame(() => this.animate());
            return;
        }
        
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = this.clock.getDelta();
        
        this.updateVehicle(deltaTime);
        this.updateCharacter(deltaTime);
        this.updateTraffic(deltaTime);
        this.updatePedestrians(deltaTime);
        this.updateBullets(deltaTime);
        this.updatePolice(deltaTime);
        this.updateMinimap();
        
        // Update mission display
        const missionEl = document.getElementById('mission')
        if (missionEl) {
            missionEl.textContent = this.mission;
        }
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    if (window.game) {
        window.game.camera.aspect = window.innerWidth / window.innerHeight;
        window.game.camera.updateProjectionMatrix();
        window.game.renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Start the game
window.addEventListener('load', () => {
    window.game = new GTA6Game();
});
