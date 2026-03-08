// MegaCity6 Gang System
// Red blip enemy NPCs that spawn and attack players

class GangSystem {
    constructor(game) {
        this.game = game;
        this.gangs = new Map();
        this.maxGangs = 20;
        this.gangSpawnRate = 0.02; // 2% chance per frame
        this.gangTypes = this.generateGangTypes();
        
        // Gang behavior settings
        this.aggressionRange = 50;
        this.attackRange = 30;
        this.gangHealth = 100;
        this.gangDamage = 15;
        
        // Sound generators
        this.soundGenerators = {
            gangSpawn: this.createGangSpawnSound(),
            gangAttack: this.createGangAttackSound(),
            gangDeath: this.createGangDeathSound(),
            gangAlert: this.createGangAlertSound()
        };
        
        this.init();
    }
    
    init() {
        console.log('🔴 Gang System initialized');
        console.log(`🎯 Max gangs: ${this.maxGangs}`);
        console.log(`⚔️ Aggression range: ${this.aggressionRange}m`);
    }
    
    generateGangTypes() {
        return [
            {
                name: 'Street Thugs',
                color: 0xFF0000, // Red
                weapon: 'pistol',
                health: 80,
                damage: 10,
                speed: 4,
                aggression: 0.7,
                spawnRate: 0.4,
                reward: { xp: 50, money: 100 }
            },
            {
                name: 'Biker Crew',
                color: 0xFF4500, // Orange Red
                weapon: 'shotgun',
                health: 120,
                damage: 25,
                speed: 6,
                aggression: 0.8,
                spawnRate: 0.25,
                reward: { xp: 75, money: 200 }
            },
            {
                name: 'Cartel Members',
                color: 0x8B0000, // Dark Red
                weapon: 'rifle',
                health: 150,
                damage: 20,
                speed: 5,
                aggression: 0.9,
                spawnRate: 0.2,
                reward: { xp: 100, money: 300 }
            },
            {
                name: 'Mafia Enforcers',
                color: 0x800000, // Maroon
                weapon: 'smg',
                health: 130,
                damage: 15,
                speed: 4.5,
                aggression: 0.85,
                spawnRate: 0.15,
                reward: { xp: 125, money: 400 }
            }
        ];
    }
    
    update(deltaTime) {
        // Spawn new gangs
        if (this.gangs.size < this.maxGangs && Math.random() < this.gangSpawnRate) {
            this.spawnGang();
        }
        
        // Update existing gangs
        this.updateGangs(deltaTime);
        
        // Check for player attacks on gangs
        this.checkGangCombat();
        
        // Remove dead gangs
        this.removeDeadGangs();
    }
    
    spawnGang() {
        if (this.gangs.size >= this.maxGangs) return;
        
        // Select gang type based on spawn rates
        const gangType = this.selectGangType();
        if (!gangType) return;
        
        // Find spawn position away from player
        const spawnPosition = this.getGangSpawnPosition();
        if (!spawnPosition) return;
        
        // Create gang member
        const gangId = `gang_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const gang = {
            id: gangId,
            type: gangType,
            position: { ...spawnPosition },
            rotation: { y: Math.random() * Math.PI * 2 },
            velocity: { x: 0, y: 0, z: 0 },
            health: gangType.health,
            maxHealth: gangType.health,
            state: 'patrol', // patrol, chase, attack
            targetPlayer: null,
            lastAttack: 0,
            attackCooldown: 2000, // 2 seconds
            patrolTarget: this.getRandomPatrolTarget(),
            model: null,
            alertLevel: 0
        };
        
        // Create visual model
        gang.model = this.createGangModel(gang);
        this.game.scene.add(gang.model);
        
        this.gangs.set(gangId, gang);
        
        // Play spawn sound
        this.playSound('gangSpawn');
        
        console.log(`🔴 ${gangType.name} spawned at (${spawnPosition.x.toFixed(0)}, ${spawnPosition.z.toFixed(0)})`);
    }
    
    selectGangType() {
        const random = Math.random();
        let cumulative = 0;
        
        for (const gangType of this.gangTypes) {
            cumulative += gangType.spawnRate;
            if (random < cumulative) {
                return gangType;
            }
        }
        
        return this.gangTypes[0]; // Default to first type
    }
    
    getGangSpawnPosition() {
        const playerPosition = this.game.inVehicle ? this.game.vehicle.position : this.game.character.position;
        
        // Try to find a position 100-200m away from player
        for (let attempt = 0; attempt < 20; attempt++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 100 + Math.random() * 100;
            
            const position = {
                x: playerPosition.x + Math.cos(angle) * distance,
                y: 2,
                z: playerPosition.z + Math.sin(angle) * distance
            };
            
            // Check if position is valid (within bounds and not too close to other gangs)
            if (this.isValidGangPosition(position)) {
                return position;
            }
        }
        
        return null;
    }
    
    isValidGangPosition(position) {
        // Check bounds
        if (Math.abs(position.x) > 450 || Math.abs(position.z) > 450) {
            return false;
        }
        
        // Check distance from other gangs
        for (const gang of this.gangs.values()) {
            const distance = Math.sqrt(
                Math.pow(position.x - gang.position.x, 2) +
                Math.pow(position.z - gang.position.z, 2)
            );
            if (distance < 20) {
                return false;
            }
        }
        
        return true;
    }
    
    getRandomPatrolTarget() {
        return {
            x: (Math.random() - 0.5) * 800,
            y: 2,
            z: (Math.random() - 0.5) * 800
        };
    }
    
    createGangModel(gang) {
        const gangGroup = new THREE.Group();
        
        // Body
        const bodyGeometry = new THREE.BoxGeometry(1.5, 2, 1);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: gang.type.color });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 1.5;
        body.castShadow = true;
        gangGroup.add(body);
        
        // Head
        const headGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        const headMaterial = new THREE.MeshLambertMaterial({ color: 0xffdbac });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 2.8;
        head.castShadow = true;
        gangGroup.add(head);
        
        // Gang colors/accessories
        const bandanaGeometry = new THREE.BoxGeometry(1.6, 0.3, 0.8);
        const bandanaMaterial = new THREE.MeshLambertMaterial({ color: gang.type.color });
        const bandana = new THREE.Mesh(bandanaGeometry, bandanaMaterial);
        bandana.position.y = 3.2;
        bandana.castShadow = true;
        gangGroup.add(bandana);
        
        // Weapon model
        const weaponModel = this.createWeaponModel(gang.type.weapon);
        weaponModel.position.set(0.8, 1.5, 0);
        weaponModel.rotation.y = Math.PI / 4;
        gangGroup.add(weaponModel);
        
        // Position model
        gangGroup.position.set(gang.position.x, gang.position.y, gang.position.z);
        gangGroup.rotation.y = gang.rotation.y;
        
        return gangGroup;
    }
    
    createWeaponModel(weaponType) {
        const weaponGroup = new THREE.Group();
        
        switch (weaponType) {
            case 'pistol':
                const pistolGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.8);
                const pistolMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
                const pistol = new THREE.Mesh(pistolGeometry, pistolMaterial);
                pistol.position.z = 0.4;
                weaponGroup.add(pistol);
                break;
                
            case 'shotgun':
                const shotgunGeometry = new THREE.BoxGeometry(0.4, 0.3, 1.2);
                const shotgunMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
                const shotgun = new THREE.Mesh(shotgunGeometry, shotgunMaterial);
                shotgun.position.z = 0.6;
                weaponGroup.add(shotgun);
                break;
                
            case 'rifle':
                const rifleGeometry = new THREE.BoxGeometry(0.3, 0.25, 1.5);
                const rifleMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });
                const rifle = new THREE.Mesh(rifleGeometry, rifleMaterial);
                rifle.position.z = 0.75;
                weaponGroup.add(rifle);
                break;
                
            case 'smg':
                const smgGeometry = new THREE.BoxGeometry(0.35, 0.25, 1);
                const smgMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
                const smg = new THREE.Mesh(smgGeometry, smgMaterial);
                smg.position.z = 0.5;
                weaponGroup.add(smg);
                break;
        }
        
        return weaponGroup;
    }
    
    updateGangs(deltaTime) {
        const playerPosition = this.game.inVehicle ? this.game.vehicle.position : this.game.character.position;
        
        for (const gang of this.gangs.values()) {
            // Update gang state
            this.updateGangState(gang, playerPosition);
            
            // Update movement based on state
            this.updateGangMovement(gang, deltaTime, playerPosition);
            
            // Update visual model
            if (gang.model) {
                gang.model.position.set(gang.position.x, gang.position.y, gang.position.z);
                gang.model.rotation.y = gang.rotation.y;
            }
            
            // Check for attacks
            if (gang.state === 'attack') {
                this.checkGangAttack(gang, playerPosition);
            }
        }
    }
    
    updateGangState(gang, playerPosition) {
        const distance = this.getDistance(gang.position, playerPosition);
        
        switch (gang.state) {
            case 'patrol':
                if (distance < this.aggressionRange) {
                    gang.state = 'chase';
                    gang.targetPlayer = playerPosition;
                    gang.alertLevel = 1;
                    this.playSound('gangAlert');
                }
                break;
                
            case 'chase':
                if (distance > this.aggressionRange * 2) {
                    gang.state = 'patrol';
                    gang.targetPlayer = null;
                    gang.alertLevel = 0;
                } else if (distance < this.attackRange) {
                    gang.state = 'attack';
                }
                break;
                
            case 'attack':
                if (distance > this.attackRange) {
                    gang.state = 'chase';
                }
                break;
        }
    }
    
    updateGangMovement(gang, deltaTime, playerPosition) {
        switch (gang.state) {
            case 'patrol':
                // Patrol movement
                const patrolDirection = new THREE.Vector3();
                patrolDirection.subVectors(gang.patrolTarget, gang.position);
                patrolDirection.y = 0;
                
                const patrolDistance = patrolDirection.length();
                if (patrolDistance < 5) {
                    gang.patrolTarget = this.getRandomPatrolTarget();
                } else {
                    patrolDirection.normalize();
                    gang.velocity.x = patrolDirection.x * gang.type.speed * 0.5;
                    gang.velocity.z = patrolDirection.z * gang.type.speed * 0.5;
                }
                break;
                
            case 'chase':
            case 'attack':
                // Chase player
                const chaseDirection = new THREE.Vector3();
                chaseDirection.subVectors(playerPosition, gang.position);
                chaseDirection.y = 0;
                chaseDirection.normalize();
                
                const speed = gang.state === 'attack' ? gang.type.speed * 0.7 : gang.type.speed;
                gang.velocity.x = chaseDirection.x * speed;
                gang.velocity.z = chaseDirection.z * speed;
                
                // Update rotation to face player
                gang.rotation.y = Math.atan2(chaseDirection.x, chaseDirection.z);
                break;
        }
        
        // Apply velocity
        gang.position.x += gang.velocity.x * deltaTime;
        gang.position.z += gang.velocity.z * deltaTime;
        
        // Apply friction
        gang.velocity.x *= 0.9;
        gang.velocity.z *= 0.9;
        
        // Keep in bounds
        gang.position.x = Math.max(-450, Math.min(450, gang.position.x));
        gang.position.z = Math.max(-450, Math.min(450, gang.position.z));
    }
    
    checkGangAttack(gang, playerPosition) {
        const now = Date.now();
        if (now - gang.lastAttack < gang.attackCooldown) return;
        
        const distance = this.getDistance(gang.position, playerPosition);
        if (distance > this.attackRange) return;
        
        // Perform attack
        gang.lastAttack = now;
        
        if (this.game.inVehicle) {
            // Attack vehicle
            this.game.vehicleHealth = (this.game.vehicleHealth || 100) - gang.type.damage;
            this.showDamageIndicator(gang.type.damage);
        } else {
            // Attack player
            if (this.game.characterHealth) {
                this.game.characterHealth = Math.max(0, this.game.characterHealth - gang.type.damage);
                this.game.updateHealthDisplay();
                this.showDamageIndicator(gang.type.damage);
                
                if (this.game.characterHealth <= 0) {
                    this.handlePlayerDeathByGang(gang);
                }
            }
        }
        
        // Play attack sound
        this.playSound('gangAttack');
        
        // Visual attack effect
        this.createAttackEffect(gang);
    }
    
    checkGangCombat() {
        if (!this.game.multiplayer || !this.game.multiplayer.connected) return;
        
        // Check if player bullets hit gangs
        for (const gang of this.gangs.values()) {
            for (const [bulletId, bullet] of this.game.multiplayer.bullets.entries()) {
                const distance = this.getDistance(bullet.position, gang.position);
                if (distance < 2) {
                    // Gang hit by bullet
                    this.damageGang(gang, bullet.damage || 25);
                    
                    // Remove bullet
                    if (bullet.model) {
                        this.game.scene.remove(bullet.model);
                    }
                    this.game.multiplayer.bullets.delete(bulletId);
                    
                    break;
                }
            }
        }
    }
    
    damageGang(gang, damage) {
        gang.health = Math.max(0, gang.health - damage);
        
        // Show damage effect
        this.showGangDamage(gang, damage);
        
        if (gang.health <= 0) {
            this.handleGangDeath(gang);
        }
    }
    
    handleGangDeath(gang) {
        // Remove from gangs list
        this.gangs.delete(gang.id);
        
        // Remove visual model
        if (gang.model) {
            this.game.scene.remove(gang.model);
        }
        
        // Give rewards
        this.giveGangRewards(gang);
        
        // Play death sound
        this.playSound('gangDeath');
        
        // Show death effect
        this.createDeathEffect(gang);
        
        // Add to battle pass XP
        if (this.game.battlePass) {
            this.game.battlePass.addExperience(gang.type.reward.xp, 'gang_kill');
        }
        
        console.log(`💀 ${gang.type.name} eliminated! +${gang.type.reward.xp} XP, $${gang.type.reward.money}`);
    }
    
    giveGangRewards(gang) {
        // Add money
        if (this.game.addMoney) {
            this.game.addMoney(gang.type.reward.money);
        }
        
        // Show reward notification
        this.showRewardNotification(gang);
        
        // Update stats
        if (this.game.multiplayer) {
            this.game.multiplayer.totalKills++;
        }
    }
    
    handlePlayerDeathByGang(gang) {
        // Respawn player
        const spawnPosition = this.getSafeSpawnPosition();
        this.game.character.position.set(spawnPosition.x, spawnPosition.y, spawnPosition.z);
        this.game.characterHealth = 100;
        
        // Penalize player
        if (this.game.money > 500) {
            this.game.money -= 500;
        }
        
        // Show death message
        this.showDeathMessage(gang);
        
        // Play death sound
        if (this.game.playGunshotSound) {
            this.game.playGunshotSound();
        }
    }
    
    getSafeSpawnPosition() {
        const playerPosition = this.game.inVehicle ? this.game.vehicle.position : this.game.character.position;
        
        // Find position far from gangs
        for (let attempt = 0; attempt < 20; attempt++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 200 + Math.random() * 100;
            
            const position = {
                x: playerPosition.x + Math.cos(angle) * distance,
                y: 2,
                z: playerPosition.z + Math.sin(angle) * distance
            };
            
            // Check if safe from gangs
            let safe = true;
            for (const gang of this.gangs.values()) {
                const gangDistance = this.getDistance(position, gang.position);
                if (gangDistance < 100) {
                    safe = false;
                    break;
                }
            }
            
            if (safe && Math.abs(position.x) < 450 && Math.abs(position.z) < 450) {
                return position;
            }
        }
        
        // Fallback position
        return { x: 0, y: 2, z: 0 };
    }
    
    removeDeadGangs() {
        // This is handled in handleGangDeath, but just in case
        for (const [gangId, gang] of this.gangs.entries()) {
            if (gang.health <= 0) {
                if (gang.model) {
                    this.game.scene.remove(gang.model);
                }
                this.gangs.delete(gangId);
            }
        }
    }
    
    // Visual effects
    showDamageIndicator(damage) {
        const indicator = document.createElement('div');
        indicator.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: red;
            font-size: 32px;
            font-weight: bold;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
            pointer-events: none;
        if (typeof document !== 'undefined' && document.body) {
            document.body.appendChild(indicator);
        }
    }
    
    // Remove indicator after animation
    setTimeout(() => {
        if (indicator && indicator.parentNode) {
            indicator.parentNode.removeChild(indicator);
        }
    }, 1000);
}
    showGangDamage(gang, damage) {
        if (!gang.model) return;
        
        // Flash red
        const originalColor = gang.model.children[0].material.color.getHex();
        gang.model.children[0].material.color.setHex(0xFF0000);
        
        setTimeout(() => {
            if (gang.model && gang.model.children[0]) {
                gang.model.children[0].material.color.setHex(originalColor);
            }
        }, 200);
    }
    
    createAttackEffect(gang) {
        // Create muzzle flash effect
        const flashGeometry = new THREE.SphereGeometry(0.5, 8, 6);
        const flashMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xFFFF00, 
            transparent: true,
            opacity: 0.8
        });
        const flash = new THREE.Mesh(flashGeometry, flashMaterial);
        
        // Position at weapon
        const weaponOffset = new THREE.Vector3(0.8, 1.5, 0);
        weaponOffset.applyMatrix4(gang.model.matrixWorld);
        flash.position.copy(weaponOffset);
        
        this.game.scene.add(flash);
        
        // Animate and remove
        let opacity = 0.8;
        const animate = () => {
            opacity -= 0.05;
            flash.material.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                this.game.scene.remove(flash);
            }
        };
        animate();
    }
    
    createDeathEffect(gang) {
        // Create particle explosion
        for (let i = 0; i < 20; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.2, 4, 4);
            const particleMaterial = new THREE.MeshBasicMaterial({ 
                color: gang.type.color,
                transparent: true
            });
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            
            particle.position.copy(gang.position);
            particle.position.y += 1;
            
            const velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 10,
                Math.random() * 10,
                (Math.random() - 0.5) * 10
            );
            
            this.game.scene.add(particle);
            
            let opacity = 1;
            const animateParticle = () => {
                velocity.y -= 0.5; // Gravity
                particle.position.add(velocity.clone().multiplyScalar(0.016));
                
                opacity -= 0.02;
                particle.material.opacity = opacity;
                
                if (opacity > 0) {
                    requestAnimationFrame(animateParticle);
                } else {
                    this.game.scene.remove(particle);
                }
            };
            animateParticle();
        }
    }
    
    showRewardNotification(gang) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 150px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #8BC34A);
            color: white;
            padding: 15px;
            border-radius: 10px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            animation: slideInRight 0.5s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="font-size: 24px;">🔫</div>
                <div>
                    <div style="font-size: 16px;">${gang.type.name} Eliminated!</div>
                    <div style="font-size: 14px; opacity: 0.9;">+${gang.type.reward.xp} XP, $${gang.type.reward.money}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 4000);
    }
    
    showDeathMessage(gang) {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.8);
            color: white;
            padding: 20px;
            border-radius: 10px;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            z-index: 10001;
        `;
        
        message.innerHTML = `
            <div style="font-size: 32px; margin-bottom: 10px;">💀</div>
            <div>You were killed by ${gang.type.name}!</div>
            <div style="font-size: 14px; margin-top: 10px;">Lost $500</div>
        `;
        
        document.body.appendChild(message);
        
        setTimeout(() => {
            if (document.body.contains(message)) {
                document.body.removeChild(message);
            }
        }, 3000);
    }
    
    // Sound generators
    createGangSpawnSound() {
        return () => {
            if (!this.game.audioContext) return;
            
            const oscillator = this.game.audioContext.createOscillator();
            const gainNode = this.game.audioContext.createGain();
            
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(100, this.game.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(50, this.game.audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.2, this.game.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.game.audioContext.currentTime + 0.2);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.game.audioContext.destination);
            
            oscillator.start();
            oscillator.stop(this.game.audioContext.currentTime + 0.2);
        };
    }
    
    createGangAttackSound() {
        return () => {
            if (!this.game.audioContext) return;
            
            const oscillator = this.game.audioContext.createOscillator();
            const gainNode = this.game.audioContext.createGain();
            
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(800, this.game.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(400, this.game.audioContext.currentTime + 0.05);
            
            gainNode.gain.setValueAtTime(0.1, this.game.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.game.audioContext.currentTime + 0.1);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.game.audioContext.destination);
            
            oscillator.start();
            oscillator.stop(this.game.audioContext.currentTime + 0.1);
        };
    }
    
    createGangDeathSound() {
        return () => {
            if (!this.game.audioContext) return;
            
            const oscillator = this.game.audioContext.createOscillator();
            const gainNode = this.game.audioContext.createGain();
            
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(200, this.game.audioContext.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(50, this.game.audioContext.currentTime + 0.3);
            
            gainNode.gain.setValueAtTime(0.3, this.game.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.game.audioContext.currentTime + 0.3);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.game.audioContext.destination);
            
            oscillator.start();
            oscillator.stop(this.game.audioContext.currentTime + 0.3);
        };
    }
    
    createGangAlertSound() {
        return () => {
            if (!this.game.audioContext) return;
            
            const oscillator = this.game.audioContext.createOscillator();
            const gainNode = this.game.audioContext.createGain();
            
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(440, this.game.audioContext.currentTime); // A4
            
            gainNode.gain.setValueAtTime(0.1, this.game.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.game.audioContext.currentTime + 0.2);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.game.audioContext.destination);
            
            oscillator.start();
            oscillator.stop(this.game.audioContext.currentTime + 0.2);
        };
    }
    
    playSound(type) {
        if (this.soundGenerators[type]) {
            this.soundGenerators[type]();
        }
    }
    
    getDistance(pos1, pos2) {
        return Math.sqrt(
            Math.pow(pos1.x - pos2.x, 2) +
            Math.pow(pos1.y - pos2.y, 2) +
            Math.pow(pos1.z - pos2.z, 2)
        );
    }
    
    // Update minimap to show gangs as red blips
    updateMinimap() {
        const canvas = document.getElementById('minimapCanvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        // Draw gangs as red blips
        ctx.fillStyle = '#FF0000';
        for (const gang of this.gangs.values()) {
            const x = (gang.position.x / 1000) * 200 + 100;
            const z = (gang.position.z / 1000) * 200 + 100;
            
            ctx.beginPath();
            ctx.arc(x, z, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Add alert indicator if chasing
            if (gang.state === 'chase' || gang.state === 'attack') {
                ctx.strokeStyle = '#FF0000';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(x, z, 6, 0, Math.PI * 2);
                ctx.stroke();
            }
        }
    }
    
    // Public methods
    getGangStats() {
        return {
            totalGangs: this.gangs.size,
            maxGangs: this.maxGangs,
            gangTypes: this.gangTypes.map(type => ({
                name: type.name,
                count: Array.from(this.gangs.values()).filter(g => g.type === type).length
            }))
        };
    }
    
    // Add CSS animations
    addCSSAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes damagePulse {
                0% { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 0; }
            }
            
            @keyframes slideInRight {
                0% { transform: translateX(100%); opacity: 0; }
                100% { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize gang system when game loads
window.addEventListener('load', () => {
    if (window.game) {
        window.game.gangs = new GangSystem(window.game);
        window.game.gangs.addCSSAnimations();
        
        // Add gang update to game loop
        const originalAnimate = window.game.animate;
        window.game.animate = function() {
            originalAnimate.call(this);
            if (this.gangs) {
                this.gangs.update(this.clock.getDelta());
                this.gangs.updateMinimap();
            }
        };
        
        console.log('🔴 MegaCity6 Gang System loaded');
    }
});
