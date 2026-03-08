// MegaCity6 Battle Pass System
// 100 tiers of unlockable content with procedural generation

class BattlePassSystem {
    constructor(game) {
        this.game = game;
        this.currentTier = 1;
        this.maxTier = 100;
        this.experience = 0;
        this.experienceToNextTier = 1000;
        this.totalKills = 0;
        this.unlockedRewards = new Set();
        
        // Battle pass data structure
        this.battlePassTiers = this.generateBattlePassTiers();
        
        // UI elements
        this.battlePassUI = null;
        this.isBattlePassOpen = false;
        
        // Sound generators
        this.soundGenerators = {
            unlock: this.createUnlockSoundGenerator(),
            levelUp: this.createLevelUpSoundGenerator(),
            tierComplete: this.createTierCompleteSoundGenerator()
        };
        
        // Initialize
        this.init();
    }
    
    init() {
        this.createBattlePassUI();
        this.setupEventListeners();
        this.loadBattlePassProgress();
        
        console.log('🏆 Battle Pass System initialized');
        console.log(`📊 Current Tier: ${this.currentTier}/${this.maxTier}`);
    }
    
    generateBattlePassTiers() {
        const tiers = [];
        
        // Reward categories
        const weaponRewards = [
            { name: 'Golden Pistol', type: 'weapon', rarity: 'common' },
            { name: 'Silver Shotgun', type: 'weapon', rarity: 'common' },
            { name: 'Platinum Rifle', type: 'weapon', rarity: 'rare' },
            { name: 'Diamond SMG', type: 'weapon', rarity: 'epic' },
            { name: 'Crystal Sniper', type: 'weapon', rarity: 'legendary' },
            { name: 'Dragon RPG', type: 'weapon', rarity: 'mythic' }
        ];
        
        const cosmeticRewards = [
            { name: 'Red Bandana', type: 'cosmetic', slot: 'head', rarity: 'common' },
            { name: 'Gold Chain', type: 'cosmetic', slot: 'neck', rarity: 'rare' },
            { name: 'Diamond Watch', type: 'cosmetic', slot: 'wrist', rarity: 'epic' },
            { name: 'Dragon Tattoo', type: 'cosmetic', slot: 'body', rarity: 'legendary' },
            { name: 'Phoenix Wings', type: 'cosmetic', slot: 'back', rarity: 'mythic' }
        ];
        
        const vehicleRewards = [
            { name: 'Sports Car', type: 'vehicle', rarity: 'rare' },
            { name: 'Armored Truck', type: 'vehicle', rarity: 'epic' },
            { name: 'Racing Bike', type: 'vehicle', rarity: 'legendary' },
            { name: 'Helicopter', type: 'vehicle', rarity: 'mythic' }
        ];
        
        const moneyRewards = [
            { name: '$1,000', type: 'money', amount: 1000, rarity: 'common' },
            { name: '$5,000', type: 'money', amount: 5000, rarity: 'rare' },
            { name: '$10,000', type: 'money', amount: 10000, rarity: 'epic' },
            { name: '$25,000', type: 'money', amount: 25000, rarity: 'legendary' },
            { name: '$100,000', type: 'money', amount: 100000, rarity: 'mythic' }
        ];
        
        const specialRewards = [
            { name: 'Double XP Weekend', type: 'special', duration: '48h', rarity: 'epic' },
            { name: 'Exclusive Emote', type: 'emote', rarity: 'rare' },
            { name: 'Player Title', type: 'title', text: 'MegaLegend', rarity: 'legendary' },
            { name: 'Custom License Plate', type: 'custom', rarity: 'common' },
            { name: 'VIP Status', type: 'status', duration: '7d', rarity: 'mythic' }
        ];
        
        // Generate 100 tiers
        for (let tier = 1; tier <= 100; tier++) {
            const rewards = [];
            const pageIndex = Math.ceil(tier / 10) - 1; // 0-9 for 10 pages
            
            // Tier progression rewards
            if (tier % 5 === 0) {
                // Every 5 tiers: Weapon or Vehicle
                if (tier % 10 === 0) {
                    // Every 10 tiers: Vehicle
                    const vehicle = vehicleRewards[Math.floor(Math.random() * vehicleRewards.length)];
                    rewards.push({ ...vehicle, tier: tier, page: pageIndex });
                } else {
                    // Every 5 tiers (but not 10): Weapon
                    const weapon = weaponRewards[Math.floor(Math.random() * weaponRewards.length)];
                    rewards.push({ ...weapon, tier: tier, page: pageIndex });
                }
            } else if (tier % 3 === 0) {
                // Every 3 tiers: Cosmetic
                const cosmetic = cosmeticRewards[Math.floor(Math.random() * cosmeticRewards.length)];
                rewards.push({ ...cosmetic, tier: tier, page: pageIndex });
            } else if (tier % 2 === 0) {
                // Every 2 tiers: Money
                const money = moneyRewards[Math.floor(Math.random() * moneyRewards.length)];
                rewards.push({ ...money, tier: tier, page: pageIndex });
            } else {
                // Other tiers: Special or common rewards
                if (Math.random() < 0.3) {
                    const special = specialRewards[Math.floor(Math.random() * specialRewards.length)];
                    rewards.push({ ...special, tier: tier, page: pageIndex });
                } else {
                    const money = moneyRewards[0]; // Common money reward
                    rewards.push({ ...money, tier: tier, page: pageIndex });
                }
            }
            
            // Add bonus rewards at milestone tiers
            if (tier === 25) {
                rewards.push({ name: 'MegaCity Champion', type: 'title', rarity: 'legendary', tier: tier, page: pageIndex });
            }
            if (tier === 50) {
                rewards.push({ name: 'Mythic Beast', type: 'vehicle', rarity: 'mythic', tier: tier, page: pageIndex });
            }
            if (tier === 75) {
                rewards.push({ name: 'God Mode Access', type: 'special', duration: '1h', rarity: 'mythic', tier: tier, page: pageIndex });
            }
            if (tier === 100) {
                rewards.push({ name: 'MegaCity Ruler', type: 'title', rarity: 'mythic', tier: tier, page: pageIndex });
                rewards.push({ name: 'Golden Throne', type: 'vehicle', rarity: 'mythic', tier: tier, page: pageIndex });
            }
            
            tiers.push({
                tier: tier,
                page: pageIndex,
                rewards: rewards,
                requiredXP: tier * 1000,
                unlocked: false
            });
        }
        
        return tiers;
    }
    
    createBattlePassUI() {
        // Battle pass container
        const battlePassContainer = document.createElement('div');
        battlePassContainer.id = 'battlepass-container';
        battlePassContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: none;
            z-index: 10000;
            overflow-y: auto;
        `;
        
        // Battle pass header
        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
            position: relative;
        `;
        
        header.innerHTML = `
            <h1 style="margin: 0; font-size: 32px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">🏆 MegaCity6 Battle Pass</h1>
            <p style="margin: 10px 0; font-size: 18px;">Tier ${this.currentTier} / ${this.maxTier}</p>
            <div style="background: rgba(255,255,255,0.2); border-radius: 10px; padding: 10px; margin: 10px 0;">
                <div style="background: linear-gradient(90deg, #4CAF50, #8BC34A, #CDDC39, #FFC107, #FF9800, #FF5722); height: 20px; border-radius: 10px; width: ${(this.currentTier / this.maxTier) * 100}%; transition: width 0.5s ease;"></div>
            </div>
            <p style="margin: 5px 0;">XP: ${this.experience} / ${this.experienceToNextTier}</p>
            <button id="close-battlepass" style="position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.2); border: none; color: white; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-size: 16px;">✕</button>
        `;
        
        battlePassContainer.appendChild(header);
        
        // Battle pass content
        const content = document.createElement('div');
        content.id = 'battlepass-content';
        content.style.cssText = `
            padding: 20px;
            max-width: 1200px;
            margin: 0 auto;
        `;
        
        battlePassContainer.appendChild(content);
        
        document.body.appendChild(battlePassContainer);
        this.battlePassUI = battlePassContainer;
        
        // Render initial content
        this.renderBattlePassContent();
        
        // Close button event
        document.getElementById('close-battlepass').addEventListener('click', () => {
            this.closeBattlePass();
        });
    }
    
    renderBattlePassContent() {
        const content = document.getElementById('battlepass-content');
        if (!content) return;
        
        content.innerHTML = '';
        
        // Create page navigation
        const nav = document.createElement('div');
        nav.style.cssText = `
            display: flex;
            justify-content: center;
            margin-bottom: 20px;
            gap: 10px;
        `;
        
        for (let page = 0; page < 10; page++) {
            const pageBtn = document.createElement('button');
            const startTier = page * 10 + 1;
            const endTier = Math.min((page + 1) * 10, 100);
            
            pageBtn.textContent = `Page ${page + 1} (${startTier}-${endTier})`;
            pageBtn.style.cssText = `
                background: ${this.getCurrentPage() === page ? '#4CAF50' : '#333'};
                color: white;
                border: none;
                padding: 10px 15px;
                border-radius: 5px;
                cursor: pointer;
                transition: background 0.3s ease;
            `;
            
            pageBtn.addEventListener('click', () => {
                this.showPage(page);
            });
            
            nav.appendChild(pageBtn);
        }
        
        content.appendChild(nav);
        
        // Show current page
        this.showPage(this.getCurrentPage());
    }
    
    getCurrentPage() {
        return Math.floor((this.currentTier - 1) / 10);
    }
    
    showPage(pageIndex) {
        const content = document.getElementById('battlepass-content');
        if (!content) return;
        
        // Remove existing tiers display
        const existingTiers = content.querySelector('.tiers-container');
        if (existingTiers) {
            existingTiers.remove();
        }
        
        // Create tiers container
        const tiersContainer = document.createElement('div');
        tiersContainer.className = 'tiers-container';
        tiersContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        `;
        
        // Add tiers for this page
        const startTier = pageIndex * 10 + 1;
        const endTier = Math.min((pageIndex + 1) * 10, 100);
        
        for (let tier = startTier; tier <= endTier; tier++) {
            const tierData = this.battlePassTiers[tier - 1];
            const tierElement = this.createTierElement(tierData);
            tiersContainer.appendChild(tierElement);
        }
        
        content.appendChild(tiersContainer);
        
        // Update page buttons
        const pageButtons = content.querySelectorAll('nav button');
        pageButtons.forEach((btn, index) => {
            btn.style.background = index === pageIndex ? '#4CAF50' : '#333';
        });
    }
    
    createTierElement(tierData) {
        const tierDiv = document.createElement('div');
        const isUnlocked = tierData.tier <= this.currentTier;
        const isCurrentTier = tierData.tier === this.currentTier;
        
        tierDiv.style.cssText = `
            background: ${isCurrentTier ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 
                        isUnlocked ? 'linear-gradient(135deg, #4CAF50 0%, #8BC34A 100%)' : 
                        'linear-gradient(135deg, #333 0%, #555 100%)'};
            border: 2px solid ${isCurrentTier ? '#FFD700' : isUnlocked ? '#4CAF50' : '#666'};
            border-radius: 10px;
            padding: 15px;
            color: white;
            position: relative;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        `;
        
        tierDiv.addEventListener('mouseenter', () => {
            tierDiv.style.transform = 'translateY(-5px)';
            tierDiv.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
        });
        
        tierDiv.addEventListener('mouseleave', () => {
            tierDiv.style.transform = 'translateY(0)';
            tierDiv.style.boxShadow = 'none';
        });
        
        // Tier header
        const tierHeader = document.createElement('div');
        tierHeader.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        `;
        
        tierHeader.innerHTML = `
            <h3 style="margin: 0; font-size: 20px;">Tier ${tierData.tier}</h3>
            ${isCurrentTier ? '<span style="background: #FFD700; color: #333; padding: 5px 10px; border-radius: 15px; font-size: 12px; font-weight: bold;">CURRENT</span>' : 
              isUnlocked ? '<span style="background: #4CAF50; color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px;">✓ UNLOCKED</span>' : 
              '<span style="background: #666; color: white; padding: 5px 10px; border-radius: 15px; font-size: 12px;">LOCKED</span>'}
        `;
        
        tierDiv.appendChild(tierHeader);
        
        // Rewards
        const rewardsDiv = document.createElement('div');
        rewardsDiv.style.cssText = `
            margin-top: 10px;
        `;
        
        tierData.rewards.forEach((reward, index) => {
            const rewardDiv = document.createElement('div');
            rewardDiv.style.cssText = `
                background: rgba(255,255,255,0.1);
                border-radius: 5px;
                padding: 8px;
                margin-bottom: 5px;
                display: flex;
                align-items: center;
                gap: 10px;
            `;
            
            const rarityColors = {
                common: '#888',
                rare: '#4CAF50',
                epic: '#9C27B0',
                legendary: '#FF9800',
                mythic: '#F44336'
            };
            
            const icons = {
                weapon: '🔫',
                cosmetic: '👔',
                vehicle: '🚗',
                money: '💰',
                special: '⭐',
                emote: '💃',
                title: '👑',
                custom: '🎨',
                status: '⭐'
            };
            
            rewardDiv.innerHTML = `
                <span style="font-size: 20px;">${icons[reward.type] || '🎁'}</span>
                <div style="flex: 1;">
                    <div style="font-weight: bold; color: ${rarityColors[reward.rarity] || '#fff'};">${reward.name}</div>
                    <div style="font-size: 12px; opacity: 0.8;">${reward.type.charAt(0).toUpperCase() + reward.type.slice(1)}</div>
                </div>
                ${reward.amount ? `<span style="color: #4CAF50;">+${reward.amount}</span>` : ''}
            `;
            
            rewardsDiv.appendChild(rewardDiv);
        });
        
        tierDiv.appendChild(rewardsDiv);
        
        // XP requirement
        const xpDiv = document.createElement('div');
        xpDiv.style.cssText = `
            margin-top: 10px;
            font-size: 12px;
            opacity: 0.8;
            text-align: center;
        `;
        xpDiv.textContent = `Requires ${tierData.requiredXP} XP`;
        tierDiv.appendChild(xpDiv);
        
        return tierDiv;
    }
    
    setupEventListeners() {
        // Battle pass toggle key (B key)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'KeyB') {
                this.toggleBattlePass();
            }
        });
    }
    
    toggleBattlePass() {
        if (this.isBattlePassOpen) {
            this.closeBattlePass();
        } else {
            this.openBattlePass();
        }
    }
    
    openBattlePass() {
        this.battlePassUI.style.display = 'block';
        this.isBattlePassOpen = true;
        this.renderBattlePassContent();
        
        // Pause game when battle pass is open
        if (this.game) {
            this.game.paused = true;
        }
    }
    
    closeBattlePass() {
        this.battlePassUI.style.display = 'none';
        this.isBattlePassOpen = false;
        
        // Resume game when battle pass is closed
        if (this.game) {
            this.game.paused = false;
        }
    }
    
    addExperience(amount, source = 'kill') {
        if (this.currentTier >= this.maxTier) return;
        
        this.experience += amount;
        
        // Check for tier up
        while (this.experience >= this.experienceToNextTier && this.currentTier < this.maxTier) {
            this.experience -= this.experienceToNextTier;
            this.levelUp();
        }
        
        // Save progress
        this.saveBattlePassProgress();
        
        // Update UI
        this.updateBattlePassUI();
        
        console.log(`🎯 Added ${amount} XP from ${source}. Current: Tier ${this.currentTier}, XP: ${this.experience}/${this.experienceToNextTier}`);
    }
    
    levelUp() {
        this.currentTier++;
        this.experienceToNextTier = this.currentTier * 1000;
        
        // Unlock rewards for new tier
        const tierData = this.battlePassTiers[this.currentTier - 1];
        if (tierData) {
            tierData.unlocked = true;
            this.unlockRewards(tierData.rewards);
        }
        
        // Play level up sound
        this.playSound('levelUp');
        
        // Show notification
        this.showLevelUpNotification(this.currentTier);
        
        // Add celebration effect
        this.celebrateTierUp();
        
        console.log(`🎉 Tier Up! Now tier ${this.currentTier}`);
    }
    
    unlockRewards(rewards) {
        rewards.forEach(reward => {
            this.unlockedRewards.add(`${reward.tier}-${reward.name}`);
            
            // Apply reward effects
            this.applyReward(reward);
            
            // Play unlock sound
            this.playSound('unlock');
            
            // Show unlock notification
            this.showUnlockNotification(reward);
        });
    }
    
    applyReward(reward) {
        switch (reward.type) {
            case 'money':
                if (this.game) {
                    this.game.addMoney(reward.amount || 0);
                }
                break;
                
            case 'weapon':
                if (this.game && this.game.weapons) {
                    // Add new weapon to inventory
                    const weaponKey = reward.name.toLowerCase().replace(/\s+/g, '_');
                    this.game.weapons[weaponKey] = {
                        name: reward.name,
                        damage: 50 + (this.currentTier * 2),
                        range: 50 + (this.currentTier),
                        fireRate: 500 - (this.currentTier * 3),
                        ammo: 999,
                        maxAmmo: 999,
                        automatic: reward.name.includes('SMG') || reward.name.includes('Rifle'),
                        unlocked: true,
                        rarity: reward.rarity
                    };
                }
                break;
                
            case 'cosmetic':
                // Add cosmetic to player
                if (this.game && this.game.character) {
                    this.game.unlockCosmetic(reward);
                }
                break;
                
            case 'vehicle':
                // Add vehicle to garage
                if (this.game) {
                    this.game.unlockVehicle(reward);
                }
                break;
                
            case 'special':
                // Apply special effects
                this.applySpecialReward(reward);
                break;
        }
    }
    
    applySpecialReward(reward) {
        switch (reward.name) {
            case 'Double XP Weekend':
                this.activateDoubleXP(reward.duration || 48);
                break;
            case 'God Mode Access':
                this.activateGodMode(reward.duration || 1);
                break;
            case 'VIP Status':
                this.activateVIP(reward.duration || 7);
                break;
        }
    }
    
    activateDoubleXP(hours) {
        const endTime = Date.now() + (hours * 60 * 60 * 1000);
        localStorage.setItem('doubleXP', endTime.toString());
        
        if (this.game) {
            this.game.doubleXP = true;
            this.game.doubleXPEndTime = endTime;
        }
        
        this.showNotification('Double XP Activated!', `${hours} hours of double XP`, 'special');
    }
    
    activateGodMode(hours) {
        const endTime = Date.now() + (hours * 60 * 60 * 1000);
        localStorage.setItem('godMode', endTime.toString());
        
        if (this.game) {
            this.game.godMode = true;
            this.game.godModeEndTime = endTime;
            this.game.characterHealth = 999999;
        }
        
        this.showNotification('God Mode Activated!', `Invincible for ${hours} hours`, 'mythic');
    }
    
    activateVIP(days) {
        const endTime = Date.now() + (days * 24 * 60 * 60 * 1000);
        localStorage.setItem('vipStatus', endTime.toString());
        
        if (this.game) {
            this.game.vip = true;
            this.game.vipEndTime = endTime;
        }
        
        this.showNotification('VIP Status Activated!', `${days} days of VIP benefits`, 'legendary');
    }
    
    showLevelUpNotification(tier) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #FFD700, #FFA500);
            color: #333;
            padding: 30px;
            border-radius: 15px;
            font-size: 24px;
            font-weight: bold;
            text-align: center;
            z-index: 10001;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            animation: levelUpPulse 2s ease-in-out;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 48px; margin-bottom: 10px;">🎉</div>
            <div>TIER ${tier} UNLOCKED!</div>
            <div style="font-size: 16px; margin-top: 10px;">Check your new rewards!</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 3000);
    }
    
    showUnlockNotification(reward) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #4CAF50, #8BC34A);
            color: white;
            padding: 15px;
            border-radius: 10px;
            font-weight: bold;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            animation: slideInRight 0.5s ease-out;
        `;
        
        const rarityColors = {
            common: '#888',
            rare: '#4CAF50',
            epic: '#9C27B0',
            legendary: '#FF9800',
            mythic: '#F44336'
        };
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="font-size: 24px;">🎁</div>
                <div>
                    <div style="font-size: 16px;">${reward.name}</div>
                    <div style="font-size: 12px; opacity: 0.8; color: ${rarityColors[reward.rarity]};">${reward.rarity.toUpperCase()}</div>
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
    
    showNotification(title, message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'special' ? '#9C27B0' : type === 'mythic' ? '#F44336' : type === 'legendary' ? '#FF9800' : '#4CAF50'};
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-weight: bold;
            z-index: 10000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            animation: slideInDown 0.5s ease-out;
        `;
        
        notification.innerHTML = `
            <div style="font-size: 16px; margin-bottom: 5px;">${title}</div>
            <div style="font-size: 14px; opacity: 0.9;">${message}</div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 5000);
    }
    
    celebrateTierUp() {
        // Create celebration particles
        for (let i = 0; i < 50; i++) {
            setTimeout(() => {
                this.createCelebrationParticle();
            }, i * 50);
        }
    }
    
    createCelebrationParticle() {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${['#FFD700', '#FFA500', '#FF6347', '#32CD32', '#1E90FF'][Math.floor(Math.random() * 5)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10002;
            animation: celebrateParticle 2s ease-out forwards;
        `;
        
        particle.style.left = Math.random() * window.innerWidth + 'px';
        particle.style.top = Math.random() * window.innerHeight + 'px';
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (document.body.contains(particle)) {
                document.body.removeChild(particle);
            }
        }, 2000);
    }
    
    updateBattlePassUI() {
        // Update header
        const header = this.battlePassUI.querySelector('h1');
        if (header) {
            header.parentElement.querySelector('p').textContent = `Tier ${this.currentTier} / ${this.maxTier}`;
        }
        
        // Update progress bar
        const progressBar = this.battlePassUI.querySelector('div[style*="background: linear-gradient"]');
        if (progressBar) {
            progressBar.style.width = `${(this.currentTier / this.maxTier) * 100}%`;
        }
        
        // Update XP text
        const xpText = this.battlePassUI.querySelector('p[style*="margin: 5px 0;"]');
        if (xpText) {
            xpText.textContent = `XP: ${this.experience} / ${this.experienceToNextTier}`;
        }
    }
    
    // Sound generators
    createUnlockSoundGenerator() {
        return () => {
            if (!this.game || !this.game.audioContext) return;
            
            const oscillator = this.game.audioContext.createOscillator();
            const gainNode = this.game.audioContext.createGain();
            
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(523.25, this.game.audioContext.currentTime); // C5
            oscillator.frequency.exponentialRampToValueAtTime(1046.50, this.game.audioContext.currentTime + 0.1); // C6
            
            gainNode.gain.setValueAtTime(0.3, this.game.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.game.audioContext.currentTime + 0.3);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.game.audioContext.destination);
            
            oscillator.start();
            oscillator.stop(this.game.audioContext.currentTime + 0.3);
        };
    }
    
    createLevelUpSoundGenerator() {
        return () => {
            if (!this.game || !this.game.audioContext) return;
            
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            
            notes.forEach((frequency, index) => {
                setTimeout(() => {
                    const oscillator = this.game.audioContext.createOscillator();
                    const gainNode = this.game.audioContext.createGain();
                    
                    oscillator.type = 'triangle';
                    oscillator.frequency.setValueAtTime(frequency, this.game.audioContext.currentTime);
                    
                    gainNode.gain.setValueAtTime(0.2, this.game.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.game.audioContext.currentTime + 0.5);
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.game.audioContext.destination);
                    
                    oscillator.start();
                    oscillator.stop(this.game.audioContext.currentTime + 0.5);
                }, index * 100);
            });
        };
    }
    
    createTierCompleteSoundGenerator() {
        return () => {
            if (!this.game || !this.game.audioContext) return;
            
            const oscillator = this.game.audioContext.createOscillator();
            const gainNode = this.game.audioContext.createGain();
            
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(130.81, this.game.audioContext.currentTime); // C3
            oscillator.frequency.exponentialRampToValueAtTime(523.25, this.game.audioContext.currentTime + 0.2); // C5
            
            gainNode.gain.setValueAtTime(0.4, this.game.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.game.audioContext.currentTime + 0.5);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.game.audioContext.destination);
            
            oscillator.start();
            oscillator.stop(this.game.audioContext.currentTime + 0.5);
        };
    }
    
    playSound(type) {
        if (this.soundGenerators[type]) {
            this.soundGenerators[type]();
        }
    }
    
    // Save/Load system
    saveBattlePassProgress() {
        const saveData = {
            currentTier: this.currentTier,
            experience: this.experience,
            experienceToNextTier: this.experienceToNextTier,
            totalKills: this.totalKills,
            unlockedRewards: Array.from(this.unlockedRewards),
            timestamp: Date.now()
        };
        
        localStorage.setItem('megacity6_battlepass', JSON.stringify(saveData));
    }
    
    loadBattlePassProgress() {
        const saveData = localStorage.getItem('megacity6_battlepass');
        if (saveData) {
            try {
                const data = JSON.parse(saveData);
                this.currentTier = data.currentTier || 1;
                this.experience = data.experience || 0;
                this.experienceToNextTier = data.experienceToNextTier || 1000;
                this.totalKills = data.totalKills || 0;
                this.unlockedRewards = new Set(data.unlockedRewards || []);
                
                // Restore unlocked status
                this.battlePassTiers.forEach((tier, index) => {
                    if (index < this.currentTier - 1) {
                        tier.unlocked = true;
                    }
                });
                
                console.log('📂 Battle pass progress loaded');
            } catch (error) {
                console.error('Error loading battle pass progress:', error);
            }
        }
    }
    
    // Public methods
    getBattlePassStats() {
        return {
            currentTier: this.currentTier,
            maxTier: this.maxTier,
            experience: this.experience,
            experienceToNextTier: this.experienceToNextTier,
            totalKills: this.totalKills,
            unlockedRewards: this.unlockedRewards.size,
            completionPercentage: (this.currentTier / this.maxTier) * 100
        };
    }
    
    // Add CSS animations
    addCSSAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes levelUpPulse {
                0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
                50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
                100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            }
            
            @keyframes slideInRight {
                0% { transform: translateX(100%); opacity: 0; }
                100% { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideInDown {
                0% { transform: translate(-50%, -100%); opacity: 0; }
                100% { transform: translate(-50%, 0); opacity: 1; }
            }
            
            @keyframes celebrateParticle {
                0% { transform: translateY(0) scale(1); opacity: 1; }
                100% { transform: translateY(-100px) scale(0); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize battle pass when game loads
window.addEventListener('load', () => {
    if (window.game) {
        window.game.battlePass = new BattlePassSystem(window.game);
        window.game.battlePass.addCSSAnimations();
        console.log('🏆 MegaCity6 Battle Pass System loaded');
    }
});
