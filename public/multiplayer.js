// MegaCity6 Multiplayer Client
// Handles real-time multiplayer functionality

class MultiplayerClient {
    constructor(game) {
        this.game = game;
        this.ws = null;
        this.playerId = null;
        this.connected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 2000;
        
        // Multiplayer state
        this.remotePlayers = new Map();
        this.vehicles = new Map();
        this.policeCars = new Map();
        this.pedestrians = new Map();
        this.bullets = new Map();
        this.chatMessages = [];
        
        // Network settings
        this.serverUrl = this.getServerUrl();
        this.updateRate = 60; // Send updates 60 times per second
        this.lastUpdate = 0;
        
        // UI elements
        this.createMultiplayerUI();
        
        // Start connection
        this.connect();
        
        // Start update loop
        this.startUpdateLoop();
    }
    
    getServerUrl() {
        // Auto-detect server URL based on current domain
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        if (isLocalhost) {
            return 'ws://localhost:3001';
        } else {
            // For production, use the same domain but WebSocket port
            const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
            const host = window.location.hostname;
            return `${protocol}//${host}:3001`;
        }
    }
    
    createMultiplayerUI() {
        // Player list
        const playerList = document.createElement('div');
        playerList.id = 'player-list';
        playerList.className = 'hud-element';
        playerList.style.cssText = `
            position: absolute;
            top: 120px;
            left: 20px;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #333;
            border-radius: 5px;
            padding: 10px;
            min-width: 200px;
            max-height: 300px;
            overflow-y: auto;
            color: white;
            font-size: 14px;
        `;
        playerList.innerHTML = '<h3 style="margin: 0 0 10px 0;">Players (0/999)</h3>';
        const hud = document.getElementById('hud');
        if (hud) {
            hud.appendChild(playerList);
        }
        
        // Chat system
        const chatContainer = document.createElement('div');
        chatContainer.id = 'chat-container';
        chatContainer.className = 'hud-element';
        chatContainer.style.cssText = `
            position: absolute;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            width: 400px;
            background: rgba(0, 0, 0, 0.8);
            border: 2px solid #333;
            border-radius: 5px;
            padding: 10px;
        `;
        
        const chatMessages = document.createElement('div');
        chatMessages.id = 'chat-messages';
        chatMessages.style.cssText = `
            height: 150px;
            overflow-y: auto;
            margin-bottom: 10px;
            font-size: 12px;
            color: white;
        `;
        
        const chatInput = document.createElement('input');
        chatInput.id = 'chat-input';
        chatInput.type = 'text';
        chatInput.placeholder = 'Press T to chat...';
        chatInput.style.cssText = `
            width: 100%;
            padding: 5px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid #555;
            border-radius: 3px;
            color: white;
            font-size: 12px;
        `;
        
        chatContainer.appendChild(chatMessages);
        chatContainer.appendChild(chatInput);
        document.getElementById('hud').appendChild(chatContainer);
        
        // Connection status
        const connectionStatus = document.createElement('div');
        connectionStatus.id = 'connection-status';
        connectionStatus.className = 'hud-element';
        connectionStatus.style.cssText = `
            position: absolute;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 0, 0, 0.8);
            color: white;
            padding: 5px 15px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
        `;
        connectionStatus.textContent = 'Connecting...';
        const hudElement = document.getElementById('hud');
        if (hudElement) {
            hudElement.appendChild(connectionStatus);
        }
        
        // Chat input handling
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && chatInput.value.trim()) {
                        this.sendChat(chatInput.value.trim());
                        chatInput.value = '';
                        if (chatInput) {
                            chatInput.style.display = 'none';
                        }
                }
            });
        }
        
        // Chat toggle with T key
        if (typeof document !== 'undefined') {
            document.addEventListener('keydown', (e) => {
                if (e.code === 'KeyT' && chatInput && (!chatInput.style.display || chatInput.style.display === 'none')) {
                        e.preventDefault();
                        chatInput.style.display = 'block';
                        chatInput.focus();
                } else if (e.code === 'Escape' && chatInput) {
                        chatInput.style.display = 'none';
                        chatInput.blur();
                }
            });
        }
    }
    
    connect() {
        try {
            this.updateConnectionStatus('Connecting...', 'orange');
            
            this.ws = new WebSocket(this.serverUrl);
            
            this.ws.onopen = () => {
                console.log('Connected to MegaCity6 server');
                this.connected = true;
                this.reconnectAttempts = 0;
                this.updateConnectionStatus('Connected', 'green');
                
                // Join game with random name
                const playerName = `Player${Math.floor(Math.random() * 10000)}`;
                this.send({
                    type: 'join',
                    name: playerName
                });
            };
            
            this.ws.onmessage = (event) => {
                try {
                    const message = JSON.parse(event.data);
                    this.handleMessage(message);
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            };
            
            this.ws.onclose = () => {
                console.log('Disconnected from server');
                this.connected = false;
                this.updateConnectionStatus('Disconnected', 'red');
                
                // Attempt to reconnect
                if (this.reconnectAttempts < this.maxReconnectAttempts) {
                    setTimeout(() => {
                        this.reconnectAttempts++;
                        console.log(`Reconnecting... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
                        this.connect();
                    }, this.reconnectDelay);
                } else {
                    this.updateConnectionStatus('Connection Failed', 'red');
                }
            };
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                this.updateConnectionStatus('Connection Error', 'red');
            };
            
        } catch (error) {
            console.error('Failed to connect:', error);
            this.updateConnectionStatus('Connection Failed', 'red');
        }
    }
    
    handleMessage(message) {
        switch (message.type) {
            case 'welcome':
                this.handleWelcome(message);
                break;
                
            case 'gameState':
                this.handleGameState(message);
                break;
                
            case 'gameStateUpdate':
                this.handleGameStateUpdate(message);
                break;
                
            case 'playerJoined':
                this.handlePlayerJoined(message);
                break;
                
            case 'playerLeft':
                this.handlePlayerLeft(message);
                break;
                
            case 'playerUpdate':
                this.handlePlayerUpdate(message);
                break;
                
            case 'bulletCreated':
                this.handleBulletCreated(message);
                break;
                
            case 'bulletDestroyed':
                this.handleBulletDestroyed(message);
                break;
                
            case 'playerHit':
                this.handlePlayerHit(message);
                break;
                
            case 'playerDied':
                this.handlePlayerDied(message);
                break;
                
            case 'chatMessage':
                this.handleChatMessage(message);
                break;
                
            case 'pong':
                // Ping response handled automatically
                break;
                
            case 'error':
                console.error('Server error:', message.message);
                this.updateConnectionStatus('Server Error', 'red');
                break;
        }
    }
    
    handleWelcome(message) {
        this.playerId = message.playerId;
        console.log(`Joined game as ${message.playerData.name} (${this.playerId})`);
        
        // Update player count
        this.updatePlayerCount(message.serverInfo.playerCount);
        
        // Store initial player data
        this.localPlayerData = message.playerData;
    }
    
    handleGameState(message) {
        // Initialize game world with server state
        this.updateVehicles(message.state.vehicles);
        this.updatePoliceCars(message.state.policeCars);
        this.updatePedestrians(message.state.pedestrians);
        this.updateBullets(message.state.bullets);
        this.updateRemotePlayers(message.players);
    }
    
    handleGameStateUpdate(message) {
        // Update game world
        this.updateVehicles(message.state.vehicles);
        this.updatePoliceCars(message.state.policeCars);
        this.updatePedestrians(message.state.pedestrians);
        this.updateBullets(message.state.bullets);
    }
    
    handlePlayerJoined(message) {
        console.log(`${message.player.name} joined the game`);
        this.updatePlayerCount(message.playerCount);
        this.addChatMessage(message.player.name, 'joined the game!', 'system');
    }
    
    handlePlayerLeft(message) {
        console.log('Player left the game');
        this.updatePlayerCount(message.playerCount);
        
        // Remove remote player
        if (this.remotePlayers.has(message.playerId)) {
            const player = this.remotePlayers.get(message.playerId);
            this.removeRemotePlayerModel(message.playerId);
            this.remotePlayers.delete(message.playerId);
            this.addChatMessage(player.name, 'left the game!', 'system');
        }
    }
    
    handlePlayerUpdate(message) {
        if (message.playerId === this.playerId) return; // Skip local player
        
        let remotePlayer = this.remotePlayers.get(message.playerId);
        
        if (!remotePlayer) {
            // Create new remote player
            remotePlayer = {
                id: message.playerId,
                position: message.position,
                rotation: message.rotation,
                velocity: message.velocity,
                inVehicle: message.inVehicle,
                vehicleId: message.vehicleId,
                model: null
            };
            this.remotePlayers.set(message.playerId, remotePlayer);
            this.createRemotePlayerModel(remotePlayer);
        } else {
            // Update existing remote player
            remotePlayer.position = message.position;
            remotePlayer.rotation = message.rotation;
            remotePlayer.velocity = message.velocity;
            remotePlayer.inVehicle = message.inVehicle;
            remotePlayer.vehicleId = message.vehicleId;
            
            if (remotePlayer.model) {
                remotePlayer.model.position.set(message.position.x, message.position.y, message.position.z);
                remotePlayer.model.rotation.y = message.rotation.y;
            }
        }
    }
    
    handleBulletCreated(message) {
        this.createBulletModel(message.bullet);
        this.bullets.set(message.bullet.id, message.bullet);
    }
    
    handleBulletDestroyed(message) {
        this.removeBulletModel(message.bulletId);
        this.bullets.delete(message.bulletId);
    }
    
    handlePlayerHit(message) {
        if (message.playerId === this.playerId) {
            // Local player was hit
            this.game.characterHealth = message.health;
            this.game.updateHealthDisplay();
            
            // Screen shake effect
            this.addScreenShake();
        }
        
        // Show hit notification
        this.showHitNotification(message.playerId, message.damage);
    }
    
    handlePlayerDied(message) {
        if (message.playerId === this.playerId) {
            // Local player died
            this.game.character.position.set(message.newPosition.x, message.newPosition.y, message.newPosition.z);
            this.game.characterHealth = 100;
            this.game.updateHealthDisplay();
            
            this.addChatMessage('You', 'were eliminated!', 'death');
        } else {
            // Remote player died
            const attacker = message.attackerId === this.playerId ? 'You' : this.getRemotePlayerName(message.attackerId);
            const victim = this.getRemotePlayerName(message.playerId);
            
            this.addChatMessage(attacker, `eliminated ${victim}!`, 'kill');
        }
    }
    
    handleChatMessage(message) {
        this.addChatMessage(message.chat.sender, message.chat.message, message.chat.type);
    }
    
    createRemotePlayerModel(remotePlayer) {
        // Create a simple model for remote players
        const geometry = new THREE.BoxGeometry(1.5, 2, 1);
        const material = new THREE.MeshLambertMaterial({ 
            color: new THREE.Color(Math.random(), Math.random(), Math.random())
        });
        const model = new THREE.Mesh(geometry, material);
        model.position.set(remotePlayer.position.x, remotePlayer.position.y, remotePlayer.position.z);
        model.castShadow = true;
        
        // Add name tag
        const nameTag = this.createNameTag(remotePlayer.id);
        model.add(nameTag);
        
        this.game.scene.add(model);
        remotePlayer.model = model;
    }
    
    createNameTag(playerId) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const context = canvas.getContext('2d');
        
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, 256, 64);
        
        context.fillStyle = 'white';
        context.font = '20px Arial';
        context.textAlign = 'center';
        context.fillText(this.getRemotePlayerName(playerId), 128, 40);
        
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({ 
            map: texture, 
            transparent: true,
            side: THREE.DoubleSide
        });
        const geometry = new THREE.PlaneGeometry(4, 1);
        const nameTag = new THREE.Mesh(geometry, material);
        nameTag.position.y = 3;
        
        return nameTag;
    }
    
    removeRemotePlayerModel(playerId) {
        const remotePlayer = this.remotePlayers.get(playerId);
        if (remotePlayer && remotePlayer.model) {
            this.game.scene.remove(remotePlayer.model);
        }
    }
    
    createBulletModel(bullet) {
        const geometry = new THREE.SphereGeometry(0.1, 8, 6);
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const model = new THREE.Mesh(geometry, material);
        model.position.set(bullet.position.x, bullet.position.y, bullet.position.z);
        
        this.game.scene.add(model);
        bullet.model = model;
    }
    
    removeBulletModel(bulletId) {
        const bullet = this.bullets.get(bulletId);
        if (bullet && bullet.model) {
            this.game.scene.remove(bullet.model);
        }
    }
    
    updateVehicles(vehicles) {
        // Update traffic vehicles
        for (const [id, data] of Object.entries(vehicles)) {
            let vehicle = this.vehicles.get(id);
            
            if (!vehicle) {
                vehicle = this.createTrafficVehicle(data);
                this.vehicles.set(id, vehicle);
            } else {
                vehicle.position.set(data.position.x, data.position.y, data.position.z);
                vehicle.rotation.y = data.rotation.y;
            }
        }
    }
    
    updatePoliceCars(policeCars) {
        // Update police cars
        for (const [id, data] of Object.entries(policeCars)) {
            let policeCar = this.policeCars.get(id);
            
            if (!policeCar) {
                policeCar = this.createPoliceCar(data);
                this.policeCars.set(id, policeCar);
            } else {
                policeCar.position.set(data.position.x, data.position.y, data.position.z);
                policeCar.rotation.y = data.rotation.y;
                
                // Flash lights when chasing
                if (data.isChasing) {
                    const flash = Math.sin(Date.now() * 0.01) > 0;
                    policeCar.children.forEach(child => {
                        if (child.material && child.material.color) {
                            if (child.material.color.getHex() === 0xff0000) {
                                child.visible = flash;
                            } else if (child.material.color.getHex() === 0x0000ff) {
                                child.visible = !flash;
                            }
                        }
                    });
                }
            }
        }
    }
    
    updatePedestrians(pedestrians) {
        // Update pedestrians
        for (const [id, data] of Object.entries(pedestrians)) {
            let pedestrian = this.pedestrians.get(id);
            
            if (!pedestrian) {
                pedestrian = this.createPedestrian(data);
                this.pedestrians.set(id, pedestrian);
            } else {
                pedestrian.position.set(data.position.x, data.position.y, data.position.z);
                pedestrian.rotation.y = data.rotation.y;
            }
        }
    }
    
    updateBullets(bullets) {
        // Update bullets
        for (const [id, data] of Object.entries(bullets)) {
            let bullet = this.bullets.get(id);
            
            if (!bullet) {
                this.createBulletModel(data);
                this.bullets.set(id, data);
            } else {
                if (bullet.model) {
                    bullet.model.position.set(data.position.x, data.position.y, data.position.z);
                }
                bullet.position = data.position;
            }
        }
    }
    
    updateRemotePlayers(players) {
        // Update remote players
        for (const [id, data] of Object.entries(players)) {
            if (id === this.playerId) continue;
            
            let remotePlayer = this.remotePlayers.get(id);
            
            if (!remotePlayer) {
                remotePlayer = {
                    id: id,
                    name: data.name,
                    position: data.position,
                    rotation: data.rotation,
                    model: null
                };
                this.remotePlayers.set(id, remotePlayer);
                this.createRemotePlayerModel(remotePlayer);
            } else {
                remotePlayer.position = data.position;
                remotePlayer.rotation = data.rotation;
                
                if (remotePlayer.model) {
                    remotePlayer.model.position.set(data.position.x, data.position.y, data.position.z);
                    remotePlayer.model.rotation.y = data.rotation.y;
                }
            }
        }
    }
    
    createTrafficVehicle(data) {
        const carGroup = new THREE.Group();
        
        const bodyGeometry = new THREE.BoxGeometry(6, 2, 12);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: data.color || 0x888888 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.5;
        body.castShadow = true;
        carGroup.add(body);
        
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
        
        carGroup.position.set(data.position.x, data.position.y, data.position.z);
        carGroup.rotation.y = data.rotation.y;
        
        this.game.scene.add(carGroup);
        return carGroup;
    }
    
    createPoliceCar(data) {
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
        
        carGroup.position.set(data.position.x, data.position.y, data.position.z);
        carGroup.rotation.y = data.rotation.y;
        
        this.game.scene.add(carGroup);
        return carGroup;
    }
    
    createPedestrian(data) {
        const pedestrianGroup = new THREE.Group();
        
        // Body
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
        
        pedestrianGroup.position.set(data.position.x, data.position.y, data.position.z);
        pedestrianGroup.rotation.y = data.rotation.y;
        
        this.game.scene.add(pedestrianGroup);
        return pedestrianGroup;
    }
    
    send(data) {
        if (this.connected && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify(data));
        }
    }
    
    sendUpdate() {
        if (!this.connected || !this.playerId) return;
        
        const now = Date.now();
        if (now - this.lastUpdate < 1000 / this.updateRate) return;
        
        this.lastUpdate = now;
        
        const playerPosition = this.game.inVehicle ? this.game.vehicle.position : this.game.character.position;
        const playerRotation = this.game.inVehicle ? this.game.vehicle.rotation : this.game.character.rotation;
        
        this.send({
            type: 'update',
            data: {
                position: {
                    x: playerPosition.x,
                    y: playerPosition.y,
                    z: playerPosition.z
                },
                rotation: {
                    y: playerRotation.y
                },
                velocity: {
                    x: this.game.velocity.x,
                    y: this.game.velocity.y,
                    z: this.game.velocity.z
                },
                health: this.game.characterHealth || 100,
                armor: this.game.characterArmor || 0,
                money: this.game.money,
                wantedLevel: this.game.wantedLevel,
                currentWeapon: this.game.currentWeapon,
                ammo: this.game.weapons[this.game.currentWeapon]?.ammo || 0,
                inVehicle: this.game.inVehicle,
                vehicleId: this.game.inVehicle ? 'player_vehicle' : null,
                isRunning: this.game.isRunning,
                isJumping: this.game.isJumping,
                cameraMode: this.game.cameraMode
            }
        });
    }
    
    sendShoot(bulletData) {
        if (!this.connected || !this.playerId) return;
        
        this.send({
            type: 'shoot',
            data: {
                position: bulletData.position,
                velocity: bulletData.velocity,
                damage: bulletData.damage,
                range: bulletData.range,
                weapon: this.game.currentWeapon
            }
        });
    }
    
    sendChat(message) {
        if (!this.connected || !this.playerId) return;
        
        this.send({
            type: 'chat',
            message: message
        });
    }
    
    startUpdateLoop() {
        setInterval(() => {
            this.sendUpdate();
        }, 1000 / this.updateRate);
        
        // Send ping every 5 seconds
        setInterval(() => {
            if (this.connected) {
                this.send({
                    type: 'ping',
                    timestamp: Date.now()
                });
            }
        }, 5000);
    }
    
    updateConnectionStatus(text, color) {
        const status = document.getElementById('connection-status');
        if (status) {
            status.textContent = text;
            status.style.background = color === 'green' ? 'rgba(0, 255, 0, 0.8)' :
                                   color === 'orange' ? 'rgba(255, 165, 0, 0.8)' :
                                   'rgba(255, 0, 0, 0.8)';
        }
    }
    
    updatePlayerCount(count) {
        const playerList = document.getElementById('player-list');
        if (playerList) {
            playerList.querySelector('h3').textContent = `Players (${count}/999)`;
        }
    }
    
    addChatMessage(sender, message, type = 'player') {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            margin-bottom: 2px;
            padding: 2px 5px;
            border-radius: 3px;
            background: ${type === 'system' ? 'rgba(255, 255, 0, 0.1)' : 
                         type === 'kill' ? 'rgba(255, 0, 0, 0.1)' : 
                         'rgba(255, 255, 255, 0.05)'};
        `;
        
        const timestamp = new Date().toLocaleTimeString();
        const senderColor = type === 'system' ? '#ffff00' :
                           type === 'kill' ? '#ff0000' :
                           '#00ff00';
        
        messageDiv.innerHTML = `<span style="color: #888; font-size: 10px;">[${timestamp}]</span> <span style="color: ${senderColor}; font-weight: bold;">${sender}:</span> ${message}`;
        
        if (chatMessages) {
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
        
        // Limit message history
        while (chatMessages.children.length > 50) {
            chatMessages.removeChild(chatMessages.firstChild);
        }
    }
    
    getRemotePlayerName(playerId) {
        const player = this.remotePlayers.get(playerId);
        return player ? player.name : 'Unknown';
    }
    
    addScreenShake() {
        // Simple screen shake effect
        const originalPosition = this.game.camera.position.clone();
        const shakeIntensity = 0.5;
        const shakeDuration = 200;
        const startTime = Date.now();
        
        const shake = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed < shakeDuration) {
                const progress = elapsed / shakeDuration;
                const intensity = shakeIntensity * (1 - progress);
                
                this.game.camera.position.x = originalPosition.x + (Math.random() - 0.5) * intensity;
                this.game.camera.position.y = originalPosition.y + (Math.random() - 0.5) * intensity;
                
                requestAnimationFrame(shake);
            } else {
                this.game.camera.position.copy(originalPosition);
            }
        };
        
        shake();
    }
    
    showHitNotification(playerId, damage) {
        // Show damage indicator
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: red;
            font-size: 24px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            pointer-events: none;
            z-index: 10000;
        `;
        notification.textContent = `-${damage}`;
        
        if (typeof document !== 'undefined' && document.body) {
            document.body.appendChild(notification);
        }
        
        // Remove notification after animation
        setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 1000);
    }
}

// Initialize multiplayer when game loads
window.addEventListener('load', () => {
    if (window.game) {
        window.game.multiplayer = new MultiplayerClient(window.game);
        console.log('🌐 MegaCity6 Multiplayer initialized');
    }
});
