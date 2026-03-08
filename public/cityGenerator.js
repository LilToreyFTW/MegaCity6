// MEGACITY6 - COMPLETE CITY GENERATION SYSTEM
// Generates roads, buildings, landscape, and entire city infrastructure

class CityGenerator {
    constructor(game) {
        this.game = game;
        this.citySize = 5000; // 5km x 5km city
        this.blockSize = 200; // City blocks
        this.buildings = [];
        this.roads = [];
        this.trees = [];
        this.lights = [];
        this.vehicles = [];
        this.pedestrians = [];
        this.soundscape = null;
        
        console.log('🏙️ Initializing MegaCity6 Generator...');
    }

    // Generate complete city
    generateCompleteCity() {
        console.log('🌆 Generating complete MegaCity6...');
        
        try {
            // 1. Generate terrain and landscape
            this.generateTerrain();
            
            // 2. Generate road network
            this.generateRoadNetwork();
            
            // 3. Generate city districts
            this.generateCityDistricts();
            
            // 4. Generate buildings
            this.generateBuildings();
            
            // 5. Generate infrastructure
            this.generateInfrastructure();
            
            // 6. Generate vegetation
            this.generateVegetation();
            
            // 7. Generate vehicles and traffic
            this.generateTraffic();
            
            // 8. Generate pedestrians
            this.generatePedestrians();
            
            // 9. Generate lighting
            this.generateLighting();
            
            // 10. Generate soundscape
            this.generateSoundscape();
            
            // 11. Generate landmarks
            this.generateLandmarks();
            
            // 12. Generate water features
            this.generateWaterFeatures();
            
            console.log('✅ MegaCity6 generation complete!');
            console.log(`📊 Generated: ${this.buildings.length} buildings, ${this.roads.length} roads, ${this.trees.length} trees`);
            
        } catch (error) {
            console.error('❌ City generation failed:', error);
        }
    }

    // 1. Generate terrain and landscape
    generateTerrain() {
        console.log('🏔️ Generating terrain...');
        
        // Create ground plane with varied elevation
        const groundGeometry = new THREE.PlaneGeometry(this.citySize, this.citySize, 100, 100);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x3a5f3a,
            transparent: true,
            opacity: 0.8
        });
        
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        
        // Add terrain variation
        const vertices = groundGeometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const y = vertices[i + 1];
            // Add gentle hills and valleys
            vertices[i + 2] = Math.sin(x * 0.001) * Math.cos(y * 0.001) * 10 + 
                              Math.random() * 2;
        }
        
        groundGeometry.attributes.position.needsUpdate = true;
        groundGeometry.computeVertexNormals();
        
        this.game.scene.add(ground);
        
        // Create grass texture patches
        for (let i = 0; i < 50; i++) {
            const patchGeometry = new THREE.CircleGeometry(Math.random() * 50 + 20, 8);
            const patchMaterial = new THREE.MeshLambertMaterial({ 
                color: new THREE.Color().setHSL(0.3, 0.7, 0.3 + Math.random() * 0.2)
            });
            const patch = new THREE.Mesh(patchGeometry, patchMaterial);
            patch.rotation.x = -Math.PI / 2;
            patch.position.set(
                (Math.random() - 0.5) * this.citySize * 0.8,
                0.1,
                (Math.random() - 0.5) * this.citySize * 0.8
            );
            this.game.scene.add(patch);
        }
    }

    // 2. Generate road network
    generateRoadNetwork() {
        console.log('🛣️ Generating road network...');
        
        // Main highways (4-lane)
        const highways = [
            { start: [-this.citySize/2, 0, 0], end: [this.citySize/2, 0, 0], width: 40 },
            { start: [0, 0, -this.citySize/2], end: [0, 0, this.citySize/2], width: 40 },
            { start: [-this.citySize/2, 0, -this.citySize/2], end: [this.citySize/2, 0, this.citySize/2], width: 40 },
            { start: [this.citySize/2, 0, -this.citySize/2], end: [-this.citySize/2, 0, this.citySize/2], width: 40 }
        ];
        
        highways.forEach(highway => {
            this.createRoad(highway.start, highway.end, highway.width, 'highway');
        });
        
        // City grid streets
        const gridSize = Math.floor(this.citySize / this.blockSize);
        
        for (let x = -gridSize/2; x <= gridSize/2; x++) {
            for (let z = -gridSize/2; z <= gridSize/2; z++) {
                // Horizontal streets
                if (x !== 0) { // Skip highway positions
                    this.createRoad(
                        [x * this.blockSize, 0, -this.citySize/2],
                        [x * this.blockSize, 0, this.citySize/2],
                        20,
                        'street'
                    );
                }
                
                // Vertical streets
                if (z !== 0) { // Skip highway positions
                    this.createRoad(
                        [-this.citySize/2, 0, z * this.blockSize],
                        [this.citySize/2, 0, z * this.blockSize],
                        20,
                        'street'
                    );
                }
            }
        }
        
        // Alleys and smaller roads
        for (let x = -gridSize; x <= gridSize; x++) {
            for (let z = -gridSize; z <= gridSize; z++) {
                if (Math.random() > 0.7) {
                    this.createRoad(
                        [x * this.blockSize/2, 0, z * this.blockSize/2],
                        [(x + 1) * this.blockSize/2, 0, z * this.blockSize/2],
                        8,
                        'alley'
                    );
                }
            }
        }
    }

    // Create individual road
    createRoad(start, end, width, type) {
        const length = Math.sqrt(
            Math.pow(end[0] - start[0], 2) + 
            Math.pow(end[2] - start[2], 2)
        );
        
        const roadGeometry = new THREE.PlaneGeometry(length, width);
        const roadMaterial = new THREE.MeshLambertMaterial({ 
            color: type === 'highway' ? 0x333333 : type === 'street' ? 0x444444 : 0x555555
        });
        
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        
        // Position and rotate road
        road.position.set(
            (start[0] + end[0]) / 2,
            0.05,
            (start[2] + end[2]) / 2
        );
        
        const angle = Math.atan2(end[2] - start[2], end[0] - start[0]);
        road.rotation.z = angle;
        
        this.game.scene.add(road);
        this.roads.push(road);
        
        // Add road markings
        if (type === 'highway' || type === 'street') {
            this.createRoadMarkings(start, end, width, type);
        }
        
        // Add sidewalks
        this.createSidewalks(start, end, width);
        
        // Add street lights
        this.createStreetLights(start, end, width);
    }

    // Create road markings
    createRoadMarkings(start, end, width, type) {
        const markingGeometry = new THREE.PlaneGeometry(
            Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[2] - start[2], 2)),
            0.5
        );
        const markingMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        
        const marking = new THREE.Mesh(markingGeometry, markingMaterial);
        marking.rotation.x = -Math.PI / 2;
        marking.position.set(
            (start[0] + end[0]) / 2,
            0.1,
            (start[2] + end[2]) / 2
        );
        
        const angle = Math.atan2(end[2] - start[2], end[0] - start[0]);
        marking.rotation.z = angle;
        
        this.game.scene.add(marking);
    }

    // Create sidewalks
    createSidewalks(start, end, roadWidth) {
        const sidewalkWidth = 3;
        const length = Math.sqrt(
            Math.pow(end[0] - start[0], 2) + 
            Math.pow(end[2] - start[2], 2)
        );
        
        // Left sidewalk
        const leftSidewalk = new THREE.Mesh(
            new THREE.PlaneGeometry(length, sidewalkWidth),
            new THREE.MeshLambertMaterial({ color: 0x888888 })
        );
        leftSidewalk.rotation.x = -Math.PI / 2;
        leftSidewalk.position.set(
            (start[0] + end[0]) / 2,
            0.1,
            (start[2] + end[2]) / 2 - (roadWidth + sidewalkWidth) / 2
        );
        
        const angle = Math.atan2(end[2] - start[2], end[0] - start[0]);
        leftSidewalk.rotation.z = angle;
        
        this.game.scene.add(leftSidewalk);
        
        // Right sidewalk
        const rightSidewalk = leftSidewalk.clone();
        rightSidewalk.position.z += roadWidth + sidewalkWidth;
        this.game.scene.add(rightSidewalk);
    }

    // Create street lights
    createStreetLights(start, end, roadWidth) {
        const lightSpacing = 50;
        const length = Math.sqrt(
            Math.pow(end[0] - start[0], 2) + 
            Math.pow(end[2] - start[2], 2)
        );
        const numLights = Math.floor(length / lightSpacing);
        
        for (let i = 0; i <= numLights; i++) {
            const t = i / numLights;
            const x = start[0] + (end[0] - start[0]) * t;
            const z = start[2] + (end[2] - start[2]) * t;
            
            // Left side light
            this.createStreetLight(x, z - roadWidth/2 - 5);
            
            // Right side light
            this.createStreetLight(x, z + roadWidth/2 + 5);
        }
    }

    // Create individual street light
    createStreetLight(x, z) {
        // Pole
        const poleGeometry = new THREE.CylinderGeometry(0.2, 0.2, 8);
        const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.set(x, 4, z);
        pole.castShadow = true;
        this.game.scene.add(pole);
        
        // Light
        const lightGeometry = new THREE.SphereGeometry(0.5);
        const lightMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffcc,
            emissive: 0xffffcc,
            emissiveIntensity: 0.5
        });
        const lightMesh = new THREE.Mesh(lightGeometry, lightMaterial);
        lightMesh.position.set(x, 7.5, z);
        this.game.scene.add(lightMesh);
        
        // Actual light source
        const light = new THREE.PointLight(0xffffcc, 0.5, 30);
        light.position.set(x, 7.5, z);
        light.castShadow = true;
        this.game.scene.add(light);
        this.lights.push(light);
    }

    // 3. Generate city districts
    generateCityDistricts() {
        console.log('🏘️ Generating city districts...');
        
        const districts = [
            { name: 'Downtown', center: [0, 0, 0], size: 800, type: 'commercial' },
            { name: 'Financial District', center: [1000, 0, 0], size: 600, type: 'commercial' },
            { name: 'Industrial Zone', center: [-1000, 0, 0], size: 700, type: 'industrial' },
            { name: 'Residential North', center: [0, 0, 1000], size: 900, type: 'residential' },
            { name: 'Residential South', center: [0, 0, -1000], size: 900, type: 'residential' },
            { name: 'Entertainment District', center: [800, 0, 800], size: 500, type: 'entertainment' },
            { name: 'Chinatown', center: [-800, 0, 800], size: 400, type: 'cultural' },
            { name: 'Beachfront', center: [0, 0, -1500], size: 600, type: 'recreational' }
        ];
        
        districts.forEach(district => {
            this.generateDistrict(district);
        });
    }

    // Generate individual district
    generateDistrict(district) {
        // Create district marker
        const markerGeometry = new THREE.BoxGeometry(district.size, 0.1, district.size);
        const markerMaterial = new THREE.MeshBasicMaterial({ 
            color: this.getDistrictColor(district.type),
            transparent: true,
            opacity: 0.1
        });
        const marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.set(district.center[0], 0.05, district.center[2]);
        this.game.scene.add(marker);
        
        // Generate district-specific buildings
        const buildingCount = Math.floor(district.size / 50);
        for (let i = 0; i < buildingCount; i++) {
            const x = district.center[0] + (Math.random() - 0.5) * district.size * 0.8;
            const z = district.center[2] + (Math.random() - 0.5) * district.size * 0.8;
            
            this.generateBuilding(x, z, district.type);
        }
    }

    // Get district color
    getDistrictColor(type) {
        const colors = {
            commercial: 0x4444ff,
            residential: 0x44ff44,
            industrial: 0xff4444,
            entertainment: 0xff44ff,
            cultural: 0xffff44,
            recreational: 0x44ffff
        };
        return colors[type] || 0x888888;
    }

    // 4. Generate buildings
    generateBuildings() {
        console.log('🏢 Generating buildings...');
        
        const gridSize = Math.floor(this.citySize / this.blockSize);
        
        for (let x = -gridSize/2; x < gridSize/2; x++) {
            for (let z = -gridSize/2; z < gridSize/2; z++) {
                // Skip road intersections
                if (x % 2 === 0 && z % 2 === 0) continue;
                
                // Generate buildings in city blocks
                const buildingsPerBlock = Math.floor(Math.random() * 3) + 1;
                
                for (let b = 0; b < buildingsPerBlock; b++) {
                    const blockX = x * this.blockSize + (Math.random() - 0.5) * this.blockSize * 0.8;
                    const blockZ = z * this.blockSize + (Math.random() - 0.5) * this.blockSize * 0.8;
                    
                    // Determine building type based on location
                    const distanceFromCenter = Math.sqrt(blockX * blockX + blockZ * blockZ);
                    let buildingType = 'residential';
                    
                    if (distanceFromCenter < 500) {
                        buildingType = 'commercial';
                    } else if (distanceFromCenter > 1500) {
                        buildingType = 'residential';
                    } else if (Math.abs(blockX) > 1000) {
                        buildingType = 'industrial';
                    }
                    
                    this.generateBuilding(blockX, blockZ, buildingType);
                }
            }
        }
    }

    // Generate individual building
    generateBuilding(x, z, type) {
        const buildingTypes = {
            residential: {
                height: () => Math.random() * 30 + 10,
                width: () => Math.random() * 20 + 15,
                depth: () => Math.random() * 20 + 15,
                color: () => new THREE.Color().setHSL(0.6, 0.3, 0.5 + Math.random() * 0.2)
            },
            commercial: {
                height: () => Math.random() * 80 + 40,
                width: () => Math.random() * 30 + 25,
                depth: () => Math.random() * 30 + 25,
                color: () => new THREE.Color().setHSL(0.55, 0.4, 0.4 + Math.random() * 0.2)
            },
            industrial: {
                height: () => Math.random() * 20 + 15,
                width: () => Math.random() * 40 + 30,
                depth: () => Math.random() * 40 + 30,
                color: () => new THREE.Color().setHSL(0.05, 0.3, 0.3 + Math.random() * 0.2)
            }
        };
        
        const buildingType = buildingTypes[type] || buildingTypes.residential;
        const height = buildingType.height();
        const width = buildingType.width();
        const depth = buildingType.depth();
        const color = buildingType.color();
        
        // Main building structure
        const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
        const buildingMaterial = new THREE.MeshLambertMaterial({ color });
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        
        building.position.set(x, height / 2, z);
        building.castShadow = true;
        building.receiveShadow = true;
        
        this.game.scene.add(building);
        this.buildings.push(building);
        
        // Add windows
        this.generateWindows(building, width, height, depth);
        
        // Add roof details
        this.generateRoof(building, width, height, depth, type);
        
        // Add entrance
        this.generateEntrance(building, width, height, depth);
    }

    // Generate windows for buildings
    generateWindows(building, width, height, depth) {
        const windowGeometry = new THREE.BoxGeometry(1, 1.5, 0.1);
        const windowMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffcc,
            emissive: 0xffffcc,
            emissiveIntensity: Math.random() * 0.3
        });
        
        const windowRows = Math.floor(height / 3);
        const windowCols = Math.floor(width / 4);
        
        for (let row = 0; row < windowRows; row++) {
            for (let col = 0; col < windowCols; col++) {
                const window = new THREE.Mesh(windowGeometry, windowMaterial);
                window.position.set(
                    building.position.x - width/2 + (col + 0.5) * (width / windowCols),
                    building.position.y - height/2 + (row + 0.5) * (height / windowRows),
                    building.position.z + depth/2 + 0.1
                );
                this.game.scene.add(window);
                
                // Back windows
                const backWindow = window.clone();
                backWindow.position.z = building.position.z - depth/2 - 0.1;
                this.game.scene.add(backWindow);
            }
        }
    }

    // Generate roof details
    generateRoof(building, width, height, depth, type) {
        if (type === 'residential' && Math.random() > 0.5) {
            // Add rooftop units
            const unitGeometry = new THREE.BoxGeometry(width * 0.3, 3, depth * 0.3);
            const unitMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
            const unit = new THREE.Mesh(unitGeometry, unitMaterial);
            unit.position.set(
                building.position.x + (Math.random() - 0.5) * width * 0.5,
                building.position.y + height/2 + 1.5,
                building.position.z + (Math.random() - 0.5) * depth * 0.5
            );
            this.game.scene.add(unit);
        } else if (type === 'commercial') {
            // Add rooftop AC units
            for (let i = 0; i < 3; i++) {
                const acGeometry = new THREE.BoxGeometry(3, 1, 2);
                const acMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
                const ac = new THREE.Mesh(acGeometry, acMaterial);
                ac.position.set(
                    building.position.x + (Math.random() - 0.5) * width * 0.8,
                    building.position.y + height/2 + 0.5,
                    building.position.z + (Math.random() - 0.5) * depth * 0.8
                );
                this.game.scene.add(ac);
            }
        }
    }

    // Generate entrance
    generateEntrance(building, width, height, depth) {
        const entranceGeometry = new THREE.BoxGeometry(width * 0.3, height * 0.2, 0.5);
        const entranceMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });
        const entrance = new THREE.Mesh(entranceGeometry, entranceMaterial);
        entrance.position.set(
            building.position.x,
            building.position.y - height/2 + height * 0.1,
            building.position.z + depth/2 + 0.3
        );
        this.game.scene.add(entrance);
    }

    // 5. Generate infrastructure
    generateInfrastructure() {
        console.log('🏗️ Generating infrastructure...');
        
        // Generate parking lots
        this.generateParkingLots();
        
        // Generate parks
        this.generateParks();
        
        // Generate bridges
        this.generateBridges();
        
        // Generate tunnels
        this.generateTunnels();
        
        // Generate train stations
        this.generateTrainStations();
        
        // Generate airports
        this.generateAirport();
    }

    // Generate parking lots
    generateParkingLots() {
        for (let i = 0; i < 20; i++) {
            const x = (Math.random() - 0.5) * this.citySize * 0.8;
            const z = (Math.random() - 0.5) * this.citySize * 0.8;
            
            const lotGeometry = new THREE.PlaneGeometry(100, 80);
            const lotMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
            const lot = new THREE.Mesh(lotGeometry, lotMaterial);
            lot.rotation.x = -Math.PI / 2;
            lot.position.set(x, 0.1, z);
            this.game.scene.add(lot);
            
            // Add parking lines
            this.generateParkingLines(x, z);
        }
    }

    // Generate parking lines
    generateParkingLines(x, z) {
        const lineGeometry = new THREE.PlaneGeometry(10, 0.2);
        const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 4; j++) {
                const line = new THREE.Mesh(lineGeometry, lineMaterial);
                line.rotation.x = -Math.PI / 2;
                line.position.set(
                    x - 40 + i * 10,
                    0.11,
                    z - 30 + j * 20
                );
                this.game.scene.add(line);
            }
        }
    }

    // Generate parks
    generateParks() {
        for (let i = 0; i < 10; i++) {
            const x = (Math.random() - 0.5) * this.citySize * 0.8;
            const z = (Math.random() - 0.5) * this.citySize * 0.8;
            const radius = Math.random() * 50 + 30;
            
            // Park grass area
            const parkGeometry = new THREE.CircleGeometry(radius, 16);
            const parkMaterial = new THREE.MeshLambertMaterial({ color: 0x2d5016 });
            const park = new THREE.Mesh(parkGeometry, parkMaterial);
            park.rotation.x = -Math.PI / 2;
            park.position.set(x, 0.1, z);
            this.game.scene.add(park);
            
            // Add trees in park
            const treeCount = Math.floor(radius / 5);
            for (let t = 0; t < treeCount; t++) {
                const treeX = x + (Math.random() - 0.5) * radius * 1.5;
                const treeZ = z + (Math.random() - 0.5) * radius * 1.5;
                this.generateTree(treeX, treeZ);
            }
            
            // Add park benches
            this.generateBenches(x, z, radius);
        }
    }

    // Generate trees
    generateTree(x, z) {
        // Tree trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.8, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(x, 4, z);
        trunk.castShadow = true;
        this.game.scene.add(trunk);
        
        // Tree foliage
        const foliageGeometry = new THREE.SphereGeometry(4, 8, 6);
        const foliageMaterial = new THREE.MeshLambertMaterial({ 
            color: new THREE.Color().setHSL(0.3, 0.7, 0.3 + Math.random() * 0.2)
        });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.set(x, 10, z);
        foliage.castShadow = true;
        this.game.scene.add(foliage);
        
        this.trees.push({ trunk, foliage });
    }

    // Generate benches
    generateBenches(centerX, centerZ, radius) {
        const benchCount = Math.floor(radius / 15);
        
        for (let i = 0; i < benchCount; i++) {
            const angle = (i / benchCount) * Math.PI * 2;
            const x = centerX + Math.cos(angle) * radius * 0.7;
            const z = centerZ + Math.sin(angle) * radius * 0.7;
            
            const benchGeometry = new THREE.BoxGeometry(3, 0.5, 1);
            const benchMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
            const bench = new THREE.Mesh(benchGeometry, benchMaterial);
            bench.position.set(x, 0.25, z);
            bench.rotation.y = angle + Math.PI / 2;
            this.game.scene.add(bench);
        }
    }

    // Generate bridges
    generateBridges() {
        // Main city bridge over highway
        const bridgeGeometry = new THREE.BoxGeometry(60, 2, 200);
        const bridgeMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
        const bridge = new THREE.Mesh(bridgeGeometry, bridgeMaterial);
        bridge.position.set(0, 10, 0);
        this.game.scene.add(bridge);
        
        // Bridge supports
        for (let i = 0; i < 4; i++) {
            const supportGeometry = new THREE.CylinderGeometry(2, 3, 20);
            const supportMaterial = new THREE.MeshLambertMaterial({ color: 0x555555 });
            const support = new THREE.Mesh(supportGeometry, supportMaterial);
            support.position.set(
                (i - 1.5) * 20,
                0,
                (i % 2 === 0 ? 80 : -80)
            );
            this.game.scene.add(support);
        }
    }

    // Generate tunnels
    generateTunnels() {
        // Underpass tunnel
        const tunnelGeometry = new THREE.CylinderGeometry(15, 15, 100, 16, 1, true, Math.PI / 2, Math.PI);
        const tunnelMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x444444,
            side: THREE.DoubleSide
        });
        const tunnel = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
        tunnel.rotation.z = Math.PI / 2;
        tunnel.position.set(0, -5, 0);
        this.game.scene.add(tunnel);
    }

    // Generate train stations
    generateTrainStations() {
        const stations = [
            { x: 0, z: 500, name: 'Central Station' },
            { x: 800, z: 0, name: 'East Station' },
            { x: -800, z: 0, name: 'West Station' },
            { x: 0, z: -500, name: 'South Station' }
        ];
        
        stations.forEach(station => {
            // Station building
            const stationGeometry = new THREE.BoxGeometry(80, 15, 40);
            const stationMaterial = new THREE.MeshLambertMaterial({ color: 0x8b7355 });
            const stationBuilding = new THREE.Mesh(stationGeometry, stationMaterial);
            stationBuilding.position.set(station.x, 7.5, station.z);
            this.game.scene.add(stationBuilding);
            
            // Platform
            const platformGeometry = new THREE.BoxGeometry(100, 0.5, 60);
            const platformMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
            const platform = new THREE.Mesh(platformGeometry, platformMaterial);
            platform.position.set(station.x, 0.25, station.z);
            this.game.scene.add(platform);
            
            // Station sign
            this.generateStationSign(station.x, station.z, station.name);
        });
    }

    // Generate station sign
    generateStationSign(x, z, name) {
        const signGeometry = new THREE.BoxGeometry(30, 5, 1);
        const signMaterial = new THREE.MeshBasicMaterial({ color: 0x0066cc });
        const sign = new THREE.Mesh(signGeometry, signMaterial);
        sign.position.set(x, 20, z);
        this.game.scene.add(sign);
    }

    // Generate airport
    generateAirport() {
        const airportX = 2000;
        const airportZ = 2000;
        
        // Runway
        const runwayGeometry = new THREE.PlaneGeometry(300, 50);
        const runwayMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const runway = new THREE.Mesh(runwayGeometry, runwayMaterial);
        runway.rotation.x = -Math.PI / 2;
        runway.position.set(airportX, 0.1, airportZ);
        this.game.scene.add(runway);
        
        // Runway markings
        for (let i = 0; i < 10; i++) {
            const markingGeometry = new THREE.PlaneGeometry(20, 2);
            const markingMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const marking = new THREE.Mesh(markingGeometry, markingMaterial);
            marking.rotation.x = -Math.PI / 2;
            marking.position.set(
                airportX - 120 + i * 30,
                0.11,
                airportZ
            );
            this.game.scene.add(marking);
        }
        
        // Terminal building
        const terminalGeometry = new THREE.BoxGeometry(100, 20, 60);
        const terminalMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
        const terminal = new THREE.Mesh(terminalGeometry, terminalMaterial);
        terminal.position.set(airportX, 10, airportZ - 100);
        this.game.scene.add(terminal);
        
        // Control tower
        const towerGeometry = new THREE.CylinderGeometry(5, 8, 60);
        const towerMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const tower = new THREE.Mesh(towerGeometry, towerMaterial);
        tower.position.set(airportX + 80, 30, airportZ - 50);
        this.game.scene.add(tower);
    }

    // 6. Generate vegetation
    generateVegetation() {
        console.log('🌳 Generating vegetation...');
        
        // Generate trees along roads
        this.roads.forEach(road => {
            if (Math.random() > 0.7) {
                const treeX = road.position.x + (Math.random() - 0.5) * 20;
                const treeZ = road.position.z + (Math.random() - 0.5) * 20;
                this.generateTree(treeX, treeZ);
            }
        });
        
        // Generate random vegetation
        for (let i = 0; i < 200; i++) {
            const x = (Math.random() - 0.5) * this.citySize;
            const z = (Math.random() - 0.5) * this.citySize;
            
            // Check if position is not on a road
            if (this.isPositionClear(x, z, 10)) {
                this.generateTree(x, z);
            }
        }
        
        // Generate bushes and shrubs
        for (let i = 0; i < 100; i++) {
            const x = (Math.random() - 0.5) * this.citySize;
            const z = (Math.random() - 0.5) * this.citySize;
            
            if (this.isPositionClear(x, z, 5)) {
                this.generateBush(x, z);
            }
        }
    }

    // Generate bush
    generateBush(x, z) {
        const bushGeometry = new THREE.SphereGeometry(1.5, 6, 4);
        const bushMaterial = new THREE.MeshLambertMaterial({ 
            color: new THREE.Color().setHSL(0.3, 0.6, 0.3 + Math.random() * 0.2)
        });
        const bush = new THREE.Mesh(bushGeometry, bushMaterial);
        bush.position.set(x, 0.75, z);
        bush.castShadow = true;
        this.game.scene.add(bush);
    }

    // Check if position is clear
    isPositionClear(x, z, radius) {
        // Simple check - in real implementation would check against roads, buildings, etc.
        return Math.abs(x) > 50 || Math.abs(z) > 50;
    }

    // 7. Generate traffic
    generateTraffic() {
        console.log('🚗 Generating traffic...');
        
        // Generate different types of vehicles
        const vehicleTypes = ['car', 'truck', 'bus', 'motorcycle', 'sports'];
        
        for (let i = 0; i < 50; i++) {
            const type = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
            const x = (Math.random() - 0.5) * this.citySize;
            const z = (Math.random() - 0.5) * this.citySize;
            
            this.generateVehicle(x, z, type);
        }
    }

    // Generate individual vehicle
    generateVehicle(x, z, type) {
        const vehicleConfigs = {
            car: { width: 4, height: 1.5, depth: 8, color: 0x0066cc },
            truck: { width: 6, height: 3, depth: 12, color: 0xffffff },
            bus: { width: 5, height: 3, depth: 15, color: 0xffff00 },
            motorcycle: { width: 2, height: 1, depth: 3, color: 0xff0000 },
            sports: { width: 4.5, height: 1, depth: 9, color: 0xff0066 }
        };
        
        const config = vehicleConfigs[type] || vehicleConfigs.car;
        
        const vehicleGeometry = new THREE.BoxGeometry(config.width, config.height, config.depth);
        const vehicleMaterial = new THREE.MeshLambertMaterial({ color: config.color });
        const vehicle = new THREE.Mesh(vehicleGeometry, vehicleMaterial);
        
        vehicle.position.set(x, config.height / 2, z);
        vehicle.rotation.y = Math.random() * Math.PI * 2;
        vehicle.castShadow = true;
        
        this.game.scene.add(vehicle);
        this.vehicles.push(vehicle);
        
        // Add wheels
        this.generateWheels(vehicle, config);
        
        // Add windows
        this.generateVehicleWindows(vehicle, config);
    }

    // Generate wheels for vehicle
    generateWheels(vehicle, config) {
        const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.3);
        const wheelMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        
        const wheelPositions = [
            [-config.width/2, -config.height/2, config.depth/3],
            [config.width/2, -config.height/2, config.depth/3],
            [-config.width/2, -config.height/2, -config.depth/3],
            [config.width/2, -config.height/2, -config.depth/3]
        ];
        
        wheelPositions.forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
            wheel.position.set(
                vehicle.position.x + pos[0],
                vehicle.position.y + pos[1],
                vehicle.position.z + pos[2]
            );
            wheel.rotation.z = Math.PI / 2;
            this.game.scene.add(wheel);
        });
    }

    // Generate windows for vehicle
    generateVehicleWindows(vehicle, config) {
        const windowGeometry = new THREE.BoxGeometry(config.width * 0.8, config.height * 0.4, config.depth * 0.3);
        const windowMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x4444ff,
            transparent: true,
            opacity: 0.7
        });
        
        const windows = new THREE.Mesh(windowGeometry, windowMaterial);
        windows.position.set(
            vehicle.position.x,
            vehicle.position.y + config.height * 0.2,
            vehicle.position.z
        );
        this.game.scene.add(windows);
    }

    // 8. Generate pedestrians
    generatePedestrians() {
        console.log('🚶 Generating pedestrians...');
        
        for (let i = 0; i < 30; i++) {
            const x = (Math.random() - 0.5) * this.citySize;
            const z = (Math.random() - 0.5) * this.citySize;
            
            this.generatePedestrian(x, z);
        }
    }

    // Generate individual pedestrian
    generatePedestrian(x, z) {
        // Body
        const bodyGeometry = new THREE.CylinderGeometry(0.3, 0.4, 1.5);
        const bodyMaterial = new THREE.MeshLambertMaterial({ 
            color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5)
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.set(x, 1.25, z);
        body.castShadow = true;
        this.game.scene.add(body);
        
        // Head
        const headGeometry = new THREE.SphereGeometry(0.3);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xffdbac });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.set(x, 2.2, z);
        head.castShadow = true;
        this.game.scene.add(head);
        
        this.pedestrians.push({ body, head });
    }

    // 9. Generate lighting
    generateLighting() {
        console.log('💡 Generating lighting...');
        
        // Ambient lighting
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        this.game.scene.add(ambientLight);
        
        // Sunlight
        const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
        sunLight.position.set(100, 200, 100);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.near = 0.5;
        sunLight.shadow.camera.far = 500;
        sunLight.shadow.camera.left = -1000;
        sunLight.shadow.camera.right = 1000;
        sunLight.shadow.camera.top = 1000;
        sunLight.shadow.camera.bottom = -1000;
        this.game.scene.add(sunLight);
        
        // Street lights already generated with roads
        
        // Building lights
        this.buildings.forEach(building => {
            if (Math.random() > 0.3) {
                this.generateBuildingLights(building);
            }
        });
    }

    // Generate building lights
    generateBuildingLights(building) {
        const lightGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.1);
        const lightMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffcc,
            emissive: 0xffffcc,
            emissiveIntensity: 0.5
        });
        
        const floors = Math.floor(building.geometry.parameters.height / 3);
        const windowsPerFloor = Math.floor(building.geometry.parameters.width / 4);
        
        for (let floor = 0; floor < floors; floor++) {
            for (let window = 0; window < windowsPerFloor; window++) {
                if (Math.random() > 0.3) {
                    const light = new THREE.Mesh(lightGeometry, lightMaterial);
                    light.position.set(
                        building.position.x - building.geometry.parameters.width/2 + (window + 0.5) * (building.geometry.parameters.width / windowsPerFloor),
                        building.position.y - building.geometry.parameters.height/2 + (floor + 0.5) * (building.geometry.parameters.height / floors),
                        building.position.z + building.geometry.parameters.depth/2 + 0.1
                    );
                    this.game.scene.add(light);
                }
            }
        }
    }

    // 10. Generate soundscape
    generateSoundscape() {
        console.log('🔊 Generating soundscape...');
        
        // Initialize audio context if not already done
        if (!this.game.audioContext) {
            this.game.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        // Create ambient city sounds
        this.soundscape = {
            traffic: this.createTrafficSound(),
            people: this.createPeopleSound(),
            wind: this.createWindSound(),
            music: this.createMusicSound(),
            sirens: this.createSirenSound()
        };
        
        // Start ambient sounds
        this.startAmbientSounds();
    }

    // Create traffic sound
    createTrafficSound() {
        const bufferSize = 4096;
        const buffer = this.game.audioContext.createBuffer(1, bufferSize, this.game.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() - 0.5) * 0.1;
        }
        
        const source = this.game.audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        
        const gainNode = this.game.audioContext.createGain();
        gainNode.gain.value = 0.1;
        
        source.connect(gainNode);
        gainNode.connect(this.game.audioContext.destination);
        
        return { source, gainNode };
    }

    // Create people sound
    createPeopleSound() {
        const bufferSize = 4096;
        const buffer = this.game.audioContext.createBuffer(1, bufferSize, this.game.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() - 0.5) * 0.05;
        }
        
        const source = this.game.audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        
        const gainNode = this.game.audioContext.createGain();
        gainNode.gain.value = 0.05;
        
        source.connect(gainNode);
        gainNode.connect(this.game.audioContext.destination);
        
        return { source, gainNode };
    }

    // Create wind sound
    createWindSound() {
        const bufferSize = 4096;
        const buffer = this.game.audioContext.createBuffer(1, bufferSize, this.game.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.sin(i * 0.01) * (Math.random() - 0.5) * 0.02;
        }
        
        const source = this.game.audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        
        const gainNode = this.game.audioContext.createGain();
        gainNode.gain.value = 0.02;
        
        source.connect(gainNode);
        gainNode.connect(this.game.audioContext.destination);
        
        return { source, gainNode };
    }

    // Create music sound
    createMusicSound() {
        const bufferSize = 4096;
        const buffer = this.game.audioContext.createBuffer(1, bufferSize, this.game.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.sin(i * 0.004) * 0.01 + Math.sin(i * 0.006) * 0.005;
        }
        
        const source = this.game.audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        
        const gainNode = this.game.audioContext.createGain();
        gainNode.gain.value = 0.01;
        
        source.connect(gainNode);
        gainNode.connect(this.game.audioContext.destination);
        
        return { source, gainNode };
    }

    // Create siren sound
    createSirenSound() {
        const bufferSize = 4096;
        const buffer = this.game.audioContext.createBuffer(1, bufferSize, this.game.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            const frequency = 800 + Math.sin(i * 0.01) * 400;
            data[i] = Math.sin(i * frequency * 0.001) * 0.1;
        }
        
        const source = this.game.audioContext.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        
        const gainNode = this.game.audioContext.createGain();
        gainNode.gain.value = 0;
        
        source.connect(gainNode);
        gainNode.connect(this.game.audioContext.destination);
        
        return { source, gainNode };
    }

    // Start ambient sounds
    startAmbientSounds() {
        if (this.soundscape.traffic) {
            this.soundscape.traffic.source.start(0);
        }
        if (this.soundscape.people) {
            this.soundscape.people.source.start(0);
        }
        if (this.soundscape.wind) {
            this.soundscape.wind.source.start(0);
        }
        if (this.soundscape.music) {
            this.soundscape.music.source.start(0);
        }
        if (this.soundscape.sirens) {
            this.soundscape.sirens.source.start(0);
        }
        
        // Randomly trigger sirens
        setInterval(() => {
            if (this.soundscape.sirens && Math.random() > 0.95) {
                this.soundscape.sirens.gainNode.gain.value = 0.1;
                setTimeout(() => {
                    if (this.soundscape.sirens) {
                        this.soundscape.sirens.gainNode.gain.value = 0;
                    }
                }, 3000);
            }
        }, 10000);
    }

    // 11. Generate landmarks
    generateLandmarks() {
        console.log('🏛️ Generating landmarks...');
        
        // City Hall
        this.generateCityHall();
        
        // Skyscrapers
        this.generateSkyscrapers();
        
        // Monument
        this.generateMonument();
        
        // Fountain
        this.generateFountain();
        
        // Stadium
        this.generateStadium();
    }

    // Generate city hall
    generateCityHall() {
        const cityHallGeometry = new THREE.BoxGeometry(100, 60, 80);
        const cityHallMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const cityHall = new THREE.Mesh(cityHallGeometry, cityHallMaterial);
        cityHall.position.set(0, 30, 300);
        cityHall.castShadow = true;
        this.game.scene.add(cityHall);
        
        // Dome
        const domeGeometry = new THREE.SphereGeometry(40, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const domeMaterial = new THREE.MeshLambertMaterial({ color: 0xffd700 });
        const dome = new THREE.Mesh(domeGeometry, domeMaterial);
        dome.position.set(0, 60, 300);
        this.game.scene.add(dome);
        
        // Columns
        for (let i = 0; i < 8; i++) {
            const columnGeometry = new THREE.CylinderGeometry(3, 3, 70);
            const columnMaterial = new THREE.MeshLambertMaterial({ color: 0xf0f0f0 });
            const column = new THREE.Mesh(columnGeometry, columnMaterial);
            column.position.set(
                (i - 3.5) * 15,
                35,
                300
            );
            column.castShadow = true;
            this.game.scene.add(column);
        }
    }

    // Generate skyscrapers
    generateSkyscrapers() {
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
            this.game.scene.add(skyscraper);
            
            // Add spire
            const spireGeometry = new THREE.ConeGeometry(5, 20, 8);
            const spireMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
            const spire = new THREE.Mesh(spireGeometry, spireMaterial);
            spire.position.set(pos.x, pos.height + 10, pos.z);
            this.game.scene.add(spire);
        });
    }

    // Generate monument
    generateMonument() {
        // Base
        const baseGeometry = new THREE.BoxGeometry(30, 10, 30);
        const baseMaterial = new THREE.MeshLambertMaterial({ color: 0x888888 });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.set(0, 5, -400);
        this.game.scene.add(base);
        
        // Statue
        const statueGeometry = new THREE.CylinderGeometry(5, 5, 30);
        const statueMaterial = new THREE.MeshLambertMaterial({ color: 0xffd700 });
        const statue = new THREE.Mesh(statueGeometry, statueMaterial);
        statue.position.set(0, 25, -400);
        statue.castShadow = true;
        this.game.scene.add(statue);
        
        // Plaque
        const plaqueGeometry = new THREE.BoxGeometry(20, 1, 5);
        const plaqueMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
        const plaque = new THREE.Mesh(plaqueGeometry, plaqueMaterial);
        plaque.position.set(0, 16, -385);
        this.game.scene.add(plaque);
    }

    // Generate fountain
    generateFountain() {
        // Fountain base
        const fountainBaseGeometry = new THREE.CylinderGeometry(20, 20, 2);
        const fountainBaseMaterial = new THREE.MeshLambertMaterial({ color: 0x87ceeb });
        const fountainBase = new THREE.Mesh(fountainBaseGeometry, fountainBaseMaterial);
        fountainBase.position.set(400, 1, 0);
        this.game.scene.add(fountainBase);
        
        // Water jets (particle effect simulation)
        for (let i = 0; i < 10; i++) {
            const jetGeometry = new THREE.SphereGeometry(0.5);
            const jetMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x87ceeb,
                transparent: true,
                opacity: 0.7
            });
            const jet = new THREE.Mesh(jetGeometry, jetMaterial);
            jet.position.set(
                400 + (Math.random() - 0.5) * 10,
                5 + Math.random() * 10,
                (Math.random() - 0.5) * 10
            );
            this.game.scene.add(jet);
        }
    }

    // Generate stadium
    generateStadium() {
        // Stadium structure
        const stadiumGeometry = new THREE.CylinderGeometry(80, 80, 30, 32, 1, true, 0, Math.PI * 2);
        const stadiumMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x444444,
            side: THREE.DoubleSide
        });
        const stadium = new THREE.Mesh(stadiumGeometry, stadiumMaterial);
        stadium.position.set(-400, 15, -400);
        this.game.scene.add(stadium);
        
        // Field
        const fieldGeometry = new THREE.CylinderGeometry(60, 60, 0.5);
        const fieldMaterial = new THREE.MeshLambertMaterial({ color: 0x2d5016 });
        const field = new THREE.Mesh(fieldGeometry, fieldMaterial);
        field.position.set(-400, 0.25, -400);
        this.game.scene.add(field);
        
        // Field lines
        for (let i = 0; i < 4; i++) {
            const lineGeometry = new THREE.BoxGeometry(120, 0.1, 2);
            const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const line = new THREE.Mesh(lineGeometry, lineMaterial);
            line.position.set(-400, 0.3, -400);
            line.rotation.y = (i * Math.PI / 4);
            this.game.scene.add(line);
        }
    }

    // 12. Generate water features
    generateWaterFeatures() {
        console.log('🌊 Generating water features...');
        
        // River
        this.generateRiver();
        
        // Lakes
        this.generateLakes();
        
        // Beach
        this.generateBeach();
    }

    // Generate river
    generateRiver() {
        const riverCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-2000, 0, -1000),
            new THREE.Vector3(-1000, 0, -500),
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(1000, 0, 500),
            new THREE.Vector3(2000, 0, 1000)
        ]);
        
        const riverGeometry = new THREE.TubeGeometry(riverCurve, 100, 50, 8, false);
        const riverMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4682b4,
            transparent: true,
            opacity: 0.8
        });
        const river = new THREE.Mesh(riverGeometry, riverMaterial);
        river.position.y = -0.5;
        this.game.scene.add(river);
    }

    // Generate lakes
    generateLakes() {
        const lakePositions = [
            { x: 800, z: 800, radius: 100 },
            { x: -800, z: -800, radius: 80 },
            { x: 1200, z: -600, radius: 60 }
        ];
        
        lakePositions.forEach(lake => {
            const lakeGeometry = new THREE.CircleGeometry(lake.radius, 32);
            const lakeMaterial = new THREE.MeshLambertMaterial({ 
                color: 0x4682b4,
                transparent: true,
                opacity: 0.8
            });
            const lakeMesh = new THREE.Mesh(lakeGeometry, lakeMaterial);
            lakeMesh.rotation.x = -Math.PI / 2;
            lakeMesh.position.set(lake.x, 0.1, lake.z);
            this.game.scene.add(lakeMesh);
        });
    }

    // Generate beach
    generateBeach() {
        // Beach sand
        const beachGeometry = new THREE.PlaneGeometry(400, 200);
        const beachMaterial = new THREE.MeshLambertMaterial({ color: 0xf4e4c1 });
        const beach = new THREE.Mesh(beachGeometry, beachMaterial);
        beach.rotation.x = -Math.PI / 2;
        beach.position.set(0, 0.1, -1800);
        this.game.scene.add(beach);
        
        // Palm trees on beach
        for (let i = 0; i < 8; i++) {
            const x = (Math.random() - 0.5) * 300;
            const z = -1800 + (Math.random() - 0.5) * 150;
            this.generatePalmTree(x, z);
        }
    }

    // Generate palm tree
    generatePalmTree(x, z) {
        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.5, 1, 15);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(x, 7.5, z);
        trunk.castShadow = true;
        this.game.scene.add(trunk);
        
        // Palm leaves
        for (let i = 0; i < 6; i++) {
            const leafGeometry = new THREE.ConeGeometry(8, 20, 3);
            const leafMaterial = new THREE.MeshLambertMaterial({ color: 0x2d5016 });
            const leaf = new THREE.Mesh(leafGeometry, leafMaterial);
            leaf.position.set(x, 18, z);
            leaf.rotation.x = Math.PI / 2;
            leaf.rotation.z = (i * Math.PI / 3);
            leaf.castShadow = true;
            this.game.scene.add(leaf);
        }
    }

    // Update animations for dynamic elements
    update(deltaTime) {
        // Animate vehicles
        this.vehicles.forEach(vehicle => {
            if (Math.random() > 0.98) {
                vehicle.rotation.y += (Math.random() - 0.5) * 0.1;
            }
            vehicle.position.x += Math.sin(vehicle.rotation.y) * 0.5;
            vehicle.position.z += Math.cos(vehicle.rotation.y) * 0.5;
        });
        
        // Animate pedestrians
        this.pedestrians.forEach(pedestrian => {
            if (Math.random() > 0.95) {
                const angle = Math.random() * Math.PI * 2;
                pedestrian.body.position.x += Math.cos(angle) * 0.2;
                pedestrian.body.position.z += Math.sin(angle) * 0.2;
                pedestrian.head.position.x = pedestrian.body.position.x;
                pedestrian.head.position.z = pedestrian.body.position.z;
            }
        });
        
        // Animate water
        if (this.game.audioContext) {
            // Dynamic sound levels based on time of day
            const hour = new Date().getHours();
            const isNight = hour < 6 || hour > 20;
            
            if (this.soundscape.traffic) {
                this.soundscape.traffic.gainNode.gain.value = isNight ? 0.05 : 0.1;
            }
            
            if (this.soundscape.people) {
                this.soundscape.people.gainNode.gain.value = isNight ? 0.02 : 0.05;
            }
        }
    }

    // Get city statistics
    getCityStats() {
        return {
            buildings: this.buildings.length,
            roads: this.roads.length,
            trees: this.trees.length,
            lights: this.lights.length,
            vehicles: this.vehicles.length,
            pedestrians: this.pedestrians.length,
            citySize: this.citySize,
            blockSize: this.blockSize
        };
    }
}

// Export for use in game
if (typeof window !== 'undefined') {
    window.CityGenerator = CityGenerator;
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = CityGenerator;
}
