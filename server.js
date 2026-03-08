// MegaCity6 Multiplayer Server
// Supports up to 999 players in one game lobby

const WebSocket = require('ws');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Server configuration
const PORT = process.env.PORT || 3000;
const WS_PORT = process.env.WS_PORT || 3001;
const MAX_PLAYERS = 999;
const TICK_RATE = 60; // Updates per second

// Game state
class GameServer {
    constructor() {
        this.players = new Map(); // playerId -> player data
        this.playerIdCounter = 0;
        this.gameState = {
            vehicles: new Map(),
            bullets: new Map(),
            policeCars: new Map(),
            pedestrians: new Map(),
            worldTime: Date.now()
        };
        this.chatMessages = [];
        this.maxChatMessages = 100;
        
        // Initialize world objects
        this.initializeWorld();
        
        // Start game loop
        this.startGameLoop();
        
        console.log(`🎮 MegaCity6 Server initialized`);
        console.log(`🚀 Max players: ${MAX_PLAYERS}`);
        console.log(`⚡ Tick rate: ${TICK_RATE} Hz`);
    }
    
    initializeWorld() {
        // Initialize traffic vehicles
        for (let i = 0; i < 50; i++) {
            const vehicleId = `traffic_${i}`;
            this.gameState.vehicles.set(vehicleId, {
                id: vehicleId,
                position: {
                    x: (Math.random() - 0.5) * 800,
                    y: 1,
                    z: (Math.random() - 0.5) * 800
                },
                rotation: { y: Math.random() * Math.PI * 2 },
                velocity: { x: 0, y: 0, z: 0 },
                color: `hsl(${Math.random() * 360}, 70%, 50%)`,
                type: 'traffic'
            });
        }
        
        // Initialize police cars
        for (let i = 0; i < 20; i++) {
            const policeId = `police_${i}`;
            this.gameState.policeCars.set(policeId, {
                id: policeId,
                position: {
                    x: (Math.random() - 0.5) * 800,
                    y: 1,
                    z: (Math.random() - 0.5) * 800
                },
                rotation: { y: 0 },
                velocity: { x: 0, y: 0, z: 0 },
                isChasing: false,
                targetPlayer: null,
                type: 'police'
            });
        }
        
        // Initialize pedestrians
        for (let i = 0; i < 100; i++) {
            const pedestrianId = `pedestrian_${i}`;
            this.gameState.pedestrians.set(pedestrianId, {
                id: pedestrianId,
                position: {
                    x: (Math.random() - 0.5) * 800,
                    y: 2,
                    z: (Math.random() - 0.5) * 800
                },
                rotation: { y: Math.random() * Math.PI * 2 },
                velocity: { x: 0, y: 0, z: 0 },
                health: 100,
                type: 'pedestrian'
            });
        }
    }
    
    addPlayer(ws, playerName) {
        if (this.players.size >= MAX_PLAYERS) {
            ws.send(JSON.stringify({
                type: 'error',
                message: 'Server is full! Please try again later.'
            }));
            return null;
        }
        
        const playerId = `player_${this.playerIdCounter++}`;
        const spawnPosition = this.getSpawnPosition();
        
        const player = {
            id: playerId,
            name: playerName || `Player${this.playerIdCounter}`,
            ws: ws,
            position: spawnPosition,
            rotation: { y: 0 },
            velocity: { x: 0, y: 0, z: 0 },
            health: 100,
            armor: 0,
            money: 1000,
            wantedLevel: 0,
            currentWeapon: 'pistol',
            ammo: {
                pistol: 999,
                shotgun: 50,
                rifle: 300,
                smg: 500,
                sniper: 20,
                rpg: 5
            },
            inVehicle: false,
            vehicleId: null,
            isRunning: false,
            isJumping: false,
            cameraMode: 'third_person',
            lastUpdate: Date.now(),
            ping: 0,
            score: 0,
            kills: 0,
            deaths: 0
        };
        
        this.players.set(playerId, player);
        
        // Send welcome message
        ws.send(JSON.stringify({
            type: 'welcome',
            playerId: playerId,
            playerData: player,
            serverInfo: {
                playerCount: this.players.size,
                maxPlayers: MAX_PLAYERS,
                tickRate: TICK_RATE
            }
        }));
        
        // Broadcast new player join
        this.broadcast({
            type: 'playerJoined',
            player: {
                id: playerId,
                name: player.name,
                position: player.position,
                playerCount: this.players.size
            }
        }, playerId);
        
        // Send initial game state
        ws.send(JSON.stringify({
            type: 'gameState',
            state: this.getGameState(),
            players: this.getAllPlayersData()
        }));
        
        // Add join message to chat
        this.addChatMessage('System', `${player.name} joined the game! (${this.players.size}/${MAX_PLAYERS})`, 'system');
        
        console.log(`👤 Player joined: ${player.name} (${playerId}) - ${this.players.size}/${MAX_PLAYERS} players`);
        
        return playerId;
    }
    
    removePlayer(playerId) {
        const player = this.players.get(playerId);
        if (!player) return;
        
        // Remove from vehicle if in one
        if (player.inVehicle && player.vehicleId) {
            const vehicle = this.gameState.vehicles.get(player.vehicleId);
            if (vehicle) {
                vehicle.occupied = false;
                vehicle.occupant = null;
            }
        }
        
        this.players.delete(playerId);
        
        // Broadcast player leave
        this.broadcast({
            type: 'playerLeft',
            playerId: playerId,
            playerCount: this.players.size
        });
        
        // Add leave message to chat
        this.addChatMessage('System', `${player.name} left the game! (${this.players.size}/${MAX_PLAYERS})`, 'system');
        
        console.log(`👋 Player left: ${player.name} (${playerId}) - ${this.players.size}/${MAX_PLAYERS} players`);
    }
    
    getSpawnPosition() {
        // Find a safe spawn position away from other players
        let attempts = 0;
        while (attempts < 100) {
            const position = {
                x: (Math.random() - 0.5) * 600,
                y: 2,
                z: (Math.random() - 0.5) * 600
            };
            
            // Check distance from other players
            let tooClose = false;
            for (const player of this.players.values()) {
                const distance = Math.sqrt(
                    Math.pow(position.x - player.position.x, 2) +
                    Math.pow(position.z - player.position.z, 2)
                );
                if (distance < 20) {
                    tooClose = true;
                    break;
                }
            }
            
            if (!tooClose) {
                return position;
            }
            
            attempts++;
        }
        
        // Fallback position
        return { x: 0, y: 2, z: 0 };
    }
    
    handlePlayerUpdate(playerId, data) {
        const player = this.players.get(playerId);
        if (!player) return;
        
        // Update player data
        if (data.position) player.position = data.position;
        if (data.rotation) player.rotation = data.rotation;
        if (data.velocity) player.velocity = data.velocity;
        if (data.health !== undefined) player.health = data.health;
        if (data.armor !== undefined) player.armor = data.armor;
        if (data.money !== undefined) player.money = data.money;
        if (data.wantedLevel !== undefined) player.wantedLevel = data.wantedLevel;
        if (data.currentWeapon) player.currentWeapon = data.currentWeapon;
        if (data.ammo) player.ammo = { ...player.ammo, ...data.ammo };
        if (data.inVehicle !== undefined) player.inVehicle = data.inVehicle;
        if (data.vehicleId) player.vehicleId = data.vehicleId;
        if (data.isRunning !== undefined) player.isRunning = data.isRunning;
        if (data.isJumping !== undefined) player.isJumping = data.isJumping;
        if (data.cameraMode) player.cameraMode = data.cameraMode;
        
        player.lastUpdate = Date.now();
        
        // Broadcast to other players (optimized - only send what changed)
        const updateData = {
            type: 'playerUpdate',
            playerId: playerId,
            position: player.position,
            rotation: player.rotation,
            velocity: player.velocity,
            inVehicle: player.inVehicle,
            vehicleId: player.vehicleId
        };
        
        this.broadcast(updateData, playerId);
    }
    
    handlePlayerShoot(playerId, data) {
        const player = this.players.get(playerId);
        if (!player) return;
        
        const bulletId = `bullet_${Date.now()}_${playerId}`;
        const bullet = {
            id: bulletId,
            playerId: playerId,
            position: { ...data.position },
            velocity: { ...data.velocity },
            damage: data.damage || 25,
            range: data.range || 50,
            distanceTraveled: 0,
            weapon: data.weapon || 'pistol',
            createdAt: Date.now()
        };
        
        this.gameState.bullets.set(bulletId, bullet);
        
        // Broadcast bullet creation
        this.broadcast({
            type: 'bulletCreated',
            bullet: bullet
        });
        
        // Remove bullet after timeout
        setTimeout(() => {
            this.gameState.bullets.delete(bulletId);
            this.broadcast({
                type: 'bulletDestroyed',
                bulletId: bulletId
            });
        }, 2000);
    }
    
    handlePlayerChat(playerId, message) {
        const player = this.players.get(playerId);
        if (!player) return;
        
        // Filter inappropriate content
        const filteredMessage = this.filterChat(message);
        if (!filteredMessage) return;
        
        this.addChatMessage(player.name, filteredMessage, 'player');
    }
    
    addChatMessage(sender, message, type = 'player') {
        const chatMessage = {
            id: Date.now(),
            sender: sender,
            message: message,
            type: type,
            timestamp: Date.now()
        };
        
        this.chatMessages.push(chatMessage);
        
        // Keep only recent messages
        if (this.chatMessages.length > this.maxChatMessages) {
            this.chatMessages.shift();
        }
        
        // Broadcast chat message
        this.broadcast({
            type: 'chatMessage',
            chat: chatMessage
        });
    }
    
    filterChat(message) {
        // Basic chat filtering
        if (!message || typeof message !== 'string') return null;
        
        // Remove excessive whitespace
        let filtered = message.trim().substring(0, 100);
        
        // Basic profanity filter (add more as needed)
        const badWords = ['fuck', 'shit', 'ass', 'bitch', 'crap'];
        badWords.forEach(word => {
            filtered = filtered.replace(new RegExp(word, 'gi'), '*'.repeat(word.length));
        });
        
        return filtered || null;
    }
    
    startGameLoop() {
        setInterval(() => {
            this.updateGame();
        }, 1000 / TICK_RATE);
    }
    
    updateGame() {
        const now = Date.now();
        this.gameState.worldTime = now;
        
        // Update traffic vehicles
        for (const vehicle of this.gameState.vehicles.values()) {
            this.updateTrafficVehicle(vehicle);
        }
        
        // Update police cars
        for (const policeCar of this.gameState.policeCars.values()) {
            this.updatePoliceCar(policeCar);
        }
        
        // Update pedestrians
        for (const pedestrian of this.gameState.pedestrians.values()) {
            this.updatePedestrian(pedestrian);
        }
        
        // Update bullets
        for (const bullet of this.gameState.bullets.values()) {
            this.updateBullet(bullet);
        }
        
        // Check for inactive players
        this.checkInactivePlayers();
        
        // Broadcast game state updates (less frequently)
        if (now % (1000 / 30) < 16) { // 30 times per second
            this.broadcast({
                type: 'gameStateUpdate',
                state: {
                    vehicles: this.serializeMap(this.gameState.vehicles),
                    policeCars: this.serializeMap(this.gameState.policeCars),
                    pedestrians: this.serializeMap(this.gameState.pedestrians),
                    bullets: this.serializeMap(this.gameState.bullets)
                }
            });
        }
    }
    
    updateTrafficVehicle(vehicle) {
        // Simple AI movement
        if (Math.random() < 0.01) {
            vehicle.velocity.x = (Math.random() - 0.5) * 10;
            vehicle.velocity.z = (Math.random() - 0.5) * 10;
        }
        
        // Update position
        vehicle.position.x += vehicle.velocity.x * 0.016;
        vehicle.position.z += vehicle.velocity.z * 0.016;
        
        // Keep in bounds
        if (Math.abs(vehicle.position.x) > 400) vehicle.velocity.x *= -1;
        if (Math.abs(vehicle.position.z) > 400) vehicle.velocity.z *= -1;
        
        // Update rotation
        if (vehicle.velocity.x !== 0 || vehicle.velocity.z !== 0) {
            vehicle.rotation.y = Math.atan2(vehicle.velocity.x, vehicle.velocity.z);
        }
        
        // Friction
        vehicle.velocity.x *= 0.98;
        vehicle.velocity.z *= 0.98;
    }
    
    updatePoliceCar(policeCar) {
        // Find nearest player with wanted level
        let nearestPlayer = null;
        let nearestDistance = Infinity;
        
        for (const player of this.players.values()) {
            if (player.wantedLevel > 0) {
                const distance = Math.sqrt(
                    Math.pow(player.position.x - policeCar.position.x, 2) +
                    Math.pow(player.position.z - policeCar.position.z, 2)
                );
                if (distance < nearestDistance) {
                    nearestDistance = distance;
                    nearestPlayer = player;
                }
            }
        }
        
        if (nearestPlayer && nearestDistance < 300) {
            // Chase player
            policeCar.isChasing = true;
            policeCar.targetPlayer = nearestPlayer.id;
            
            const dx = nearestPlayer.position.x - policeCar.position.x;
            const dz = nearestPlayer.position.z - policeCar.position.z;
            const distance = Math.sqrt(dx * dx + dz * dz);
            
            if (distance > 5) {
                policeCar.velocity.x = (dx / distance) * 15;
                policeCar.velocity.z = (dz / distance) * 15;
            } else {
                policeCar.velocity.x *= 0.9;
                policeCar.velocity.z *= 0.9;
            }
            
            policeCar.rotation.y = Math.atan2(dx, dz);
        } else {
            // Patrol
            policeCar.isChasing = false;
            policeCar.targetPlayer = null;
            
            if (Math.random() < 0.01) {
                policeCar.velocity.x = (Math.random() - 0.5) * 8;
                policeCar.velocity.z = (Math.random() - 0.5) * 8;
            }
            
            policeCar.velocity.x *= 0.95;
            policeCar.velocity.z *= 0.95;
        }
        
        // Update position
        policeCar.position.x += policeCar.velocity.x * 0.016;
        policeCar.position.z += policeCar.velocity.z * 0.016;
        
        // Keep in bounds
        if (Math.abs(policeCar.position.x) > 450) policeCar.velocity.x *= -1;
        if (Math.abs(policeCar.position.z) > 450) policeCar.velocity.z *= -1;
    }
    
    updatePedestrian(pedestrian) {
        // Random walk
        if (Math.random() < 0.02) {
            pedestrian.velocity.x = (Math.random() - 0.5) * 3;
            pedestrian.velocity.z = (Math.random() - 0.5) * 3;
        }
        
        // Update position
        pedestrian.position.x += pedestrian.velocity.x * 0.016;
        pedestrian.position.z += pedestrian.velocity.z * 0.016;
        
        // Keep in bounds
        if (Math.abs(pedestrian.position.x) > 450) pedestrian.velocity.x *= -1;
        if (Math.abs(pedestrian.position.z) > 450) pedestrian.velocity.z *= -1;
        
        // Update rotation
        if (pedestrian.velocity.x !== 0 || pedestrian.velocity.z !== 0) {
            pedestrian.rotation.y = Math.atan2(pedestrian.velocity.x, pedestrian.velocity.z);
        }
        
        // Friction
        pedestrian.velocity.x *= 0.95;
        pedestrian.velocity.z *= 0.95;
    }
    
    updateBullet(bullet) {
        // Update position
        bullet.position.x += bullet.velocity.x * 0.016;
        bullet.position.y += bullet.velocity.y * 0.016;
        bullet.position.z += bullet.velocity.z * 0.016;
        
        // Update distance traveled
        bullet.distanceTraveled += Math.sqrt(
            bullet.velocity.x * bullet.velocity.x +
            bullet.velocity.y * bullet.velocity.y +
            bullet.velocity.z * bullet.velocity.z
        ) * 0.016;
        
        // Check if bullet should be destroyed
        if (bullet.distanceTraveled > bullet.range || 
            bullet.position.y < 0 ||
            Math.abs(bullet.position.x) > 500 ||
            Math.abs(bullet.position.z) > 500) {
            this.gameState.bullets.delete(bullet.id);
            this.broadcast({
                type: 'bulletDestroyed',
                bulletId: bullet.id
            });
            return;
        }
        
        // Check collisions with players
        for (const player of this.players.values()) {
            const distance = Math.sqrt(
                Math.pow(bullet.position.x - player.position.x, 2) +
                Math.pow(bullet.position.y - player.position.y, 2) +
                Math.pow(bullet.position.z - player.position.z, 2)
            );
            
            if (distance < 2 && player.id !== bullet.playerId) {
                // Hit player
                player.health = Math.max(0, player.health - bullet.damage);
                
                // Broadcast hit
                this.broadcast({
                    type: 'playerHit',
                    playerId: player.id,
                    damage: bullet.damage,
                    health: player.health,
                    attackerId: bullet.playerId
                });
                
                // Remove bullet
                this.gameState.bullets.delete(bullet.id);
                this.broadcast({
                    type: 'bulletDestroyed',
                    bulletId: bullet.id
                });
                
                // Check if player died
                if (player.health <= 0) {
                    this.handlePlayerDeath(player.id, bullet.playerId);
                }
                
                return;
            }
        }
    }
    
    handlePlayerDeath(playerId, attackerId) {
        const player = this.players.get(playerId);
        const attacker = this.players.get(attackerId);
        
        if (!player) return;
        
        // Update stats
        player.deaths++;
        player.health = 100;
        player.position = this.getSpawnPosition();
        player.money = Math.max(0, player.money - 100);
        
        if (attacker) {
            attacker.kills++;
            attacker.score += 100;
            attacker.money += 200;
            
            this.addChatMessage('System', `${attacker.name} eliminated ${player.name}!`, 'kill');
        }
        
        // Broadcast death
        this.broadcast({
            type: 'playerDied',
            playerId: playerId,
            attackerId: attackerId,
            newPosition: player.position
        });
    }
    
    checkInactivePlayers() {
        const now = Date.now();
        const timeout = 30000; // 30 seconds
        
        for (const [playerId, player] of this.players.entries()) {
            if (now - player.lastUpdate > timeout) {
                console.log(`⏰ Removing inactive player: ${player.name}`);
                this.removePlayer(playerId);
            }
        }
    }
    
    getGameState() {
        return {
            vehicles: this.serializeMap(this.gameState.vehicles),
            policeCars: this.serializeMap(this.gameState.policeCars),
            pedestrians: this.serializeMap(this.gameState.pedestrians),
            bullets: this.serializeMap(this.gameState.bullets),
            worldTime: this.gameState.worldTime
        };
    }
    
    getAllPlayersData() {
        const players = {};
        for (const [id, player] of this.players.entries()) {
            players[id] = {
                id: player.id,
                name: player.name,
                position: player.position,
                rotation: player.rotation,
                health: player.health,
                armor: player.armor,
                wantedLevel: player.wantedLevel,
                inVehicle: player.inVehicle,
                vehicleId: player.vehicleId,
                score: player.score,
                kills: player.kills,
                deaths: player.deaths,
                ping: player.ping
            };
        }
        return players;
    }
    
    serializeMap(map) {
        const obj = {};
        for (const [key, value] of map.entries()) {
            obj[key] = value;
        }
        return obj;
    }
    
    broadcast(message, excludePlayerId = null) {
        const messageStr = JSON.stringify(message);
        
        for (const [playerId, player] of this.players.entries()) {
            if (playerId !== excludePlayerId && player.ws.readyState === WebSocket.OPEN) {
                try {
                    player.ws.send(messageStr);
                } catch (error) {
                    console.error(`Error sending to player ${playerId}:`, error);
                    this.removePlayer(playerId);
                }
            }
        }
    }
    
    getServerStats() {
        return {
            playerCount: this.players.size,
            maxPlayers: MAX_PLAYERS,
            tickRate: TICK_RATE,
            uptime: Date.now() - this.startTime,
            vehicles: this.gameState.vehicles.size,
            policeCars: this.gameState.policeCars.size,
            pedestrians: this.gameState.pedestrians.size,
            bullets: this.gameState.bullets.size
        };
    }
}

// Create HTTP server for static files and API
const httpServer = http.createServer((req, res) => {
    const url = req.url === '/' ? '/index.html' : req.url;
    const filePath = path.join(__dirname, url);
    
    // Serve static files
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath);
        const contentType = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.ico': 'image/x-icon'
        }[ext] || 'text/plain';
        
        fs.readFile(filePath, (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Server Error');
                return;
            }
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    } else {
        // API endpoint for server stats
        if (url === '/api/stats') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(gameServer.getServerStats()));
        } else {
            res.writeHead(404);
            res.end('Not Found');
        }
    }
});

// Create WebSocket server
const wss = new WebSocket.Server({ port: WS_PORT });

const gameServer = new GameServer();
gameServer.startTime = Date.now();

// Handle WebSocket connections
wss.on('connection', (ws, req) => {
    console.log('🔗 New WebSocket connection');
    
    let playerId = null;
    
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            
            switch (message.type) {
                case 'join':
                    playerId = gameServer.addPlayer(ws, message.name);
                    break;
                    
                case 'update':
                    if (playerId) {
                        gameServer.handlePlayerUpdate(playerId, message.data);
                    }
                    break;
                    
                case 'shoot':
                    if (playerId) {
                        gameServer.handlePlayerShoot(playerId, message.data);
                    }
                    break;
                    
                case 'chat':
                    if (playerId) {
                        gameServer.handlePlayerChat(playerId, message.message);
                    }
                    break;
                    
                case 'ping':
                    if (playerId) {
                        const player = gameServer.players.get(playerId);
                        if (player) {
                            player.ping = Date.now() - message.timestamp;
                            ws.send(JSON.stringify({
                                type: 'pong',
                                timestamp: Date.now()
                            }));
                        }
                    }
                    break;
            }
        } catch (error) {
            console.error('Error handling message:', error);
        }
    });
    
    ws.on('close', () => {
        if (playerId) {
            gameServer.removePlayer(playerId);
        }
    });
    
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        if (playerId) {
            gameServer.removePlayer(playerId);
        }
    });
});

// Start servers
httpServer.listen(PORT, () => {
    console.log(`🌐 HTTP Server running on port ${PORT}`);
    console.log(`🔌 WebSocket Server running on port ${WS_PORT}`);
    console.log(`🎮 MegaCity6 Multiplayer Server ready!`);
    console.log(`📊 Server stats: http://localhost:${PORT}/api/stats`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down server...');
    
    wss.close(() => {
        httpServer.close(() => {
            console.log('✅ Server shut down gracefully');
            process.exit(0);
        });
    });
});
