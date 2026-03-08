// MEGACITY6 - COMPREHENSIVE SOUND EFFECTS SYSTEM
// Generates all game sounds, ambient effects, and audio environment

class SoundEffectsSystem {
    constructor(game) {
        this.game = game;
        this.audioContext = null;
        this.sounds = {};
        this.musicTracks = {};
        this.ambientSounds = {};
        this.sfxVolume = 0.7;
        this.musicVolume = 0.5;
        this.ambientVolume = 0.3;
        this.masterVolume = 1.0;
        this.isInitialized = false;
        
        console.log('🔊 Initializing Sound Effects System...');
    }

    // Initialize audio system
    async initialize() {
        try {
            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Create master gain node
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = this.masterVolume;
            this.masterGain.connect(this.audioContext.destination);
            
            // Create individual gain nodes
            this.sfxGain = this.audioContext.createGain();
            this.sfxGain.gain.value = this.sfxVolume;
            this.sfxGain.connect(this.masterGain);
            
            this.musicGain = this.audioContext.createGain();
            this.musicGain.gain.value = this.musicVolume;
            this.musicGain.connect(this.masterGain);
            
            this.ambientGain = this.audioContext.createGain();
            this.ambientGain.gain.value = this.ambientVolume;
            this.ambientGain.connect(this.masterGain);
            
            // Generate all sounds
            await this.generateAllSounds();
            
            this.isInitialized = true;
            console.log('✅ Sound Effects System initialized');
            
        } catch (error) {
            console.error('❌ Failed to initialize sound system:', error);
        }
    }

    // Generate all game sounds
    async generateAllSounds() {
        console.log('🎵 Generating all game sounds...');
        
        // Vehicle sounds
        await this.generateVehicleSounds();
        
        // Weapon sounds
        await this.generateWeaponSounds();
        
        // Ambient city sounds
        await this.generateAmbientSounds();
        
        // Music tracks
        await this.generateMusicTracks();
        
        // UI sounds
        await this.generateUISounds();
        
        // Footstep sounds
        await this.generateFootstepSounds();
        
        // Environment sounds
        await this.generateEnvironmentSounds();
        
        // Voice sounds
        await this.generateVoiceSounds();
        
        // Special effects
        await this.generateSpecialEffects();
    }

    // 1. Generate vehicle sounds
    async generateVehicleSounds() {
        console.log('🚗 Generating vehicle sounds...');
        
        // Car engine sounds
        this.sounds.carEngine = await this.createEngineSound(100, 200, 0.3);
        this.sounds.carEngineIdle = await this.createEngineSound(50, 100, 0.2);
        this.sounds.carEngineRev = await this.createEngineSound(200, 400, 0.4);
        
        // Truck engine sounds
        this.sounds.truckEngine = await this.createEngineSound(80, 150, 0.5);
        this.sounds.truckEngineIdle = await this.createEngineSound(40, 80, 0.3);
        
        // Motorcycle engine sounds
        this.sounds.motorcycleEngine = await this.createEngineSound(150, 300, 0.2);
        this.sounds.motorcycleRev = await this.createEngineSound(300, 600, 0.3);
        
        // Vehicle movement sounds
        this.sounds.carHorn = await this.createHornSound(400, 0.3);
        this.sounds.truckHorn = await this.createHornSound(200, 0.5);
        this.sounds.siren = await this.createSirenSound();
        this.sounds.brakeSqueal = await this.createBrakeSound();
        this.sounds.tireScreech = await this.createTireScreechSound();
        
        // Door sounds
        this.sounds.carDoorOpen = await this.createDoorSound(true);
        this.sounds.carDoorClose = await this.createDoorSound(false);
        
        // Crash sounds
        this.sounds.carCrash = await this.createCrashSound('metal');
        this.sounds.glassBreak = await this.createCrashSound('glass');
    }

    // Create engine sound
    async createEngineSound(minFreq, maxFreq, volume) {
        const duration = 2.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            const freq = minFreq + (maxFreq - minFreq) * Math.sin(t * 2 * Math.PI);
            
            // Complex engine harmonics
            let sample = 0;
            sample += Math.sin(2 * Math.PI * freq * t) * 0.5;
            sample += Math.sin(4 * Math.PI * freq * t) * 0.3;
            sample += Math.sin(6 * Math.PI * freq * t) * 0.2;
            
            // Add some noise for realism
            sample += (Math.random() - 0.5) * 0.1;
            
            // Apply envelope
            const envelope = Math.exp(-t * 0.5);
            data[i] = sample * envelope * volume;
        }
        
        return buffer;
    }

    // Create horn sound
    async createHornSound(frequency, volume) {
        const duration = 0.5;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            data[i] = Math.sin(2 * Math.PI * frequency * t) * volume * Math.exp(-t * 3);
        }
        
        return buffer;
    }

    // Create siren sound
    async createSirenSound() {
        const duration = 3.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            const freq = 600 + Math.sin(t * 4) * 400;
            data[i] = Math.sin(2 * Math.PI * freq * t) * 0.3;
        }
        
        return buffer;
    }

    // Create brake sound
    async createBrakeSound() {
        const duration = 1.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            const noise = (Math.random() - 0.5) * 0.8;
            const envelope = Math.exp(-t * 2);
            data[i] = noise * envelope * 0.5;
        }
        
        return buffer;
    }

    // Create tire screech sound
    async createTireScreechSound() {
        const duration = 1.5;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            const freq = 2000 + Math.random() * 1000;
            const noise = (Math.random() - 0.5) * 0.9;
            data[i] = (Math.sin(2 * Math.PI * freq * t) * 0.5 + noise * 0.5) * Math.exp(-t * 0.5) * 0.7;
        }
        
        return buffer;
    }

    // Create door sound
    async createDoorSound(isOpen) {
        const duration = 0.3;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            if (isOpen) {
                data[i] = (Math.random() - 0.5) * 0.3 * Math.exp(-t * 5);
            } else {
                data[i] = (Math.random() - 0.5) * 0.5 * Math.exp(-t * 10);
            }
        }
        
        return buffer;
    }

    // Create crash sound
    async createCrashSound(type) {
        const duration = 1.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            let sample = (Math.random() - 0.5) * 0.9;
            
            if (type === 'metal') {
                sample += Math.sin(2 * Math.PI * 200 * t) * 0.3;
                sample += Math.sin(2 * Math.PI * 400 * t) * 0.2;
            } else if (type === 'glass') {
                sample += Math.sin(2 * Math.PI * 2000 * t) * 0.5;
                sample += Math.sin(2 * Math.PI * 4000 * t) * 0.3;
            }
            
            data[i] = sample * Math.exp(-t * 3) * 0.8;
        }
        
        return buffer;
    }

    // 2. Generate weapon sounds
    async generateWeaponSounds() {
        console.log('🔫 Generating weapon sounds...');
        
        // Pistol sounds
        this.sounds.pistolFire = await this.createGunshotSound('pistol');
        this.sounds.pistolReload = await this.createReloadSound('pistol');
        this.sounds.pistolEmpty = await this.createEmptySound();
        
        // Shotgun sounds
        this.sounds.shotgunFire = await this.createGunshotSound('shotgun');
        this.sounds.shotgunReload = await this.createReloadSound('shotgun');
        this.sounds.shotgunPump = await this.createPumpSound();
        
        // Rifle sounds
        this.sounds.rifleFire = await this.createGunshotSound('rifle');
        this.sounds.rifleReload = await this.createReloadSound('rifle');
        this.sounds.rifleBurst = await this.createBurstSound();
        
        // SMG sounds
        this.sounds.smgFire = await this.createGunshotSound('smg');
        this.sounds.smgReload = await this.createReloadSound('smg');
        
        // Sniper sounds
        this.sounds.sniperFire = await this.createGunshotSound('sniper');
        this.sounds.sniperReload = await this.createReloadSound('sniper');
        
        // RPG sounds
        this.sounds.rpgFire = await this.createExplosionSound('small');
        this.sounds.rpgReload = await this.createReloadSound('rpg');
        
        // Explosion sounds
        this.sounds.explosionSmall = await this.createExplosionSound('small');
        this.sounds.explosionMedium = await this.createExplosionSound('medium');
        this.sounds.explosionLarge = await this.createExplosionSound('large');
        
        // Impact sounds
        this.sounds.bulletImpact = await this.createImpactSound('bullet');
        this.sounds.meleeHit = await this.createImpactSound('melee');
        this.sounds.headshot = await this.createHeadshotSound();
    }

    // Create gunshot sound
    async createGunshotSound(type) {
        const configs = {
            pistol: { duration: 0.1, freq: 800, volume: 0.8 },
            shotgun: { duration: 0.3, freq: 400, volume: 1.0 },
            rifle: { duration: 0.15, freq: 1200, volume: 0.9 },
            smg: { duration: 0.08, freq: 1500, volume: 0.7 },
            sniper: { duration: 0.2, freq: 600, volume: 1.0 },
            rpg: { duration: 0.5, freq: 200, volume: 1.2 }
        };
        
        const config = configs[type] || configs.pistol;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, config.duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            // Gunshot with harmonics
            let sample = Math.sin(2 * Math.PI * config.freq * t) * 0.8;
            sample += Math.sin(4 * Math.PI * config.freq * t) * 0.4;
            sample += Math.sin(6 * Math.PI * config.freq * t) * 0.2;
            
            // Add noise for muzzle blast
            sample += (Math.random() - 0.5) * 0.5;
            
            // Sharp envelope
            const envelope = Math.exp(-t * 20);
            data[i] = sample * envelope * config.volume;
        }
        
        return buffer;
    }

    // Create reload sound
    async createReloadSound(type) {
        const duration = 1.5;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            // Metallic click sounds
            let sample = 0;
            
            // Magazine release
            if (t < 0.1) {
                sample += (Math.random() - 0.5) * 0.8;
            }
            // Magazine insertion
            else if (t > 0.3 && t < 0.4) {
                sample += (Math.random() - 0.5) * 0.6;
            }
            // Bolt action
            else if (t > 0.8 && t < 0.9) {
                sample += (Math.random() - 0.5) * 0.7;
            }
            
            data[i] = sample * 0.5;
        }
        
        return buffer;
    }

    // Create empty sound
    async createEmptySound() {
        const duration = 0.2;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            data[i] = (Math.random() - 0.5) * 0.3 * Math.exp(-t * 10);
        }
        
        return buffer;
    }

    // Create pump sound
    async createPumpSound() {
        const duration = 0.4;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            if (t < 0.1) {
                data[i] = (Math.random() - 0.5) * 0.7;
            } else if (t > 0.2 && t < 0.3) {
                data[i] = (Math.random() - 0.5) * 0.8;
            } else {
                data[i] = 0;
            }
        }
        
        return buffer;
    }

    // Create burst sound
    async createBurstSound() {
        const duration = 0.3;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            const burstTime = t * 10;
            const burst = Math.floor(burstTime);
            const burstPhase = burstTime - burst;
            
            if (burst < 3 && burstPhase < 0.1) {
                data[i] = (Math.random() - 0.5) * 0.9;
            } else {
                data[i] = 0;
            }
        }
        
        return buffer;
    }

    // Create explosion sound
    async createExplosionSound(size) {
        const configs = {
            small: { duration: 0.5, volume: 0.8 },
            medium: { duration: 1.0, volume: 1.0 },
            large: { duration: 2.0, volume: 1.2 }
        };
        
        const config = configs[size] || configs.medium;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, config.duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            // Low frequency boom
            let sample = Math.sin(2 * Math.PI * 50 * t) * 0.8;
            sample += Math.sin(2 * Math.PI * 100 * t) * 0.6;
            sample += Math.sin(2 * Math.PI * 200 * t) * 0.4;
            
            // Add noise
            sample += (Math.random() - 0.5) * 0.9;
            
            // Explosion envelope
            const envelope = Math.exp(-t * 2);
            data[i] = sample * envelope * config.volume;
        }
        
        return buffer;
    }

    // Create impact sound
    async createImpactSound(type) {
        const duration = 0.1;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            let sample = (Math.random() - 0.5) * 0.9;
            
            if (type === 'bullet') {
                sample += Math.sin(2 * Math.PI * 3000 * t) * 0.3;
            } else if (type === 'melee') {
                sample += Math.sin(2 * Math.PI * 200 * t) * 0.5;
            }
            
            data[i] = sample * Math.exp(-t * 20) * 0.7;
        }
        
        return buffer;
    }

    // Create headshot sound
    async createHeadshotSound() {
        const duration = 0.3;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            // Splat sound
            let sample = (Math.random() - 0.5) * 0.8;
            sample += Math.sin(2 * Math.PI * 800 * t) * 0.4;
            
            data[i] = sample * Math.exp(-t * 5) * 0.9;
        }
        
        return buffer;
    }

    // 3. Generate ambient city sounds
    async generateAmbientSounds() {
        console.log('🏙️ Generating ambient city sounds...');
        
        // Traffic sounds
        this.ambientSounds.trafficHum = await this.createTrafficHum();
        this.ambientSounds.carPassing = await this.createCarPassingSound();
        this.ambientSounds.honking = await this.createRandomHonks();
        
        // People sounds
        this.ambientSounds.crowdMurmur = await this.createCrowdMurmur();
        this.ambientSounds.footsteps = await this.createCrowdFootsteps();
        this.ambientSounds.conversation = await this.createConversationSound();
        
        // Nature sounds
        this.ambientSounds.wind = await this.createWindSound();
        this.ambientSounds.birds = await this.createBirdSounds();
        this.ambientSounds.rain = await this.createRainSound();
        
        // Industrial sounds
        this.ambientSounds.construction = await this.createConstructionSound();
        this.ambientSounds.factory = await this.createFactorySound();
        this.ambientSounds.train = await this.createTrainSound();
    }

    // Create traffic hum
    async createTrafficHum() {
        const duration = 10.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            // Low frequency traffic rumble
            let sample = Math.sin(2 * Math.PI * 80 * t) * 0.3;
            sample += Math.sin(2 * Math.PI * 120 * t) * 0.2;
            sample += Math.sin(2 * Math.PI * 200 * t) * 0.1;
            
            // Add some noise
            sample += (Math.random() - 0.5) * 0.1;
            
            data[i] = sample * 0.3;
        }
        
        return buffer;
    }

    // Create car passing sound
    async createCarPassingSound() {
        const duration = 3.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            // Doppler effect simulation
            const position = (t - 1.5) * 100; // Car passes at t=1.5
            const distance = Math.abs(position);
            const doppler = position > 0 ? 1.1 : 0.9;
            
            // Engine sound with doppler
            let sample = Math.sin(2 * Math.PI * 150 * doppler * t) * 0.5;
            sample += (Math.random() - 0.5) * 0.2;
            
            // Volume based on distance
            const volume = Math.max(0, 1 - distance / 200);
            data[i] = sample * volume * 0.4;
        }
        
        return buffer;
    }

    // Create random honks
    async createRandomHonks() {
        const duration = 8.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            data[i] = 0;
        }
        
        // Add random honks
        for (let i = 0; i < 5; i++) {
            const honkTime = Math.random() * duration;
            const honkFreq = 300 + Math.random() * 200;
            const honkDuration = 0.3;
            
            const startSample = Math.floor(honkTime * sampleRate);
            const endSample = Math.floor((honkTime + honkDuration) * sampleRate);
            
            for (let j = startSample; j < endSample && j < buffer.length; j++) {
                const t = (j - startSample) / sampleRate;
                data[j] += Math.sin(2 * Math.PI * honkFreq * t) * Math.exp(-t * 3) * 0.3;
            }
        }
        
        return buffer;
    }

    // Create crowd murmur
    async createCrowdMurmur() {
        const duration = 10.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            // Multiple voice frequencies
            let sample = 0;
            for (let voice = 0; voice < 20; voice++) {
                const freq = 100 + Math.random() * 400;
                sample += Math.sin(2 * Math.PI * freq * t) * 0.05;
            }
            
            // Add noise
            sample += (Math.random() - 0.5) * 0.1;
            
            data[i] = sample * 0.2;
        }
        
        return buffer;
    }

    // Create crowd footsteps
    async createCrowdFootsteps() {
        const duration = 8.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            data[i] = 0;
        }
        
        // Add random footsteps
        for (let i = 0; i < 50; i++) {
            const stepTime = Math.random() * duration;
            const stepDuration = 0.1;
            
            const startSample = Math.floor(stepTime * sampleRate);
            const endSample = Math.floor((stepTime + stepDuration) * sampleRate);
            
            for (let j = startSample; j < endSample && j < buffer.length; j++) {
                data[j] += (Math.random() - 0.5) * 0.1;
            }
        }
        
        return buffer;
    }

    // Create conversation sound
    async createConversationSound() {
        const duration = 5.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            // Speech-like frequencies
            let sample = Math.sin(2 * Math.PI * 200 * t) * Math.sin(2 * Math.PI * 3 * t) * 0.3;
            sample += Math.sin(2 * Math.PI * 400 * t) * Math.sin(2 * Math.PI * 5 * t) * 0.2;
            sample += (Math.random() - 0.5) * 0.1;
            
            data[i] = sample * 0.15;
        }
        
        return buffer;
    }

    // Create wind sound
    async createWindSound() {
        const duration = 10.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            // Wind with varying intensity
            const intensity = Math.sin(t * 0.1) * 0.5 + 0.5;
            let sample = (Math.random() - 0.5) * intensity;
            sample += Math.sin(2 * Math.PI * 50 * t) * intensity * 0.3;
            
            data[i] = sample * 0.2;
        }
        
        return buffer;
    }

    // Create bird sounds
    async createBirdSounds() {
        const duration = 6.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            data[i] = 0;
        }
        
        // Add random bird chirps
        for (let i = 0; i < 8; i++) {
            const chirpTime = Math.random() * duration;
            const chirpFreq = 2000 + Math.random() * 2000;
            const chirpDuration = 0.2;
            
            const startSample = Math.floor(chirpTime * sampleRate);
            const endSample = Math.floor((chirpTime + chirpDuration) * sampleRate);
            
            for (let j = startSample; j < endSample && j < buffer.length; j++) {
                const t = (j - startSample) / sampleRate;
                data[j] += Math.sin(2 * Math.PI * chirpFreq * t) * Math.exp(-t * 10) * 0.1;
            }
        }
        
        return buffer;
    }

    // Create rain sound
    async createRainSound() {
        const duration = 8.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            // Rain drops
            let sample = 0;
            for (let drop = 0; drop < 5; drop++) {
                if (Math.random() > 0.98) {
                    sample += (Math.random() - 0.5) * 0.3;
                }
            }
            
            // General rain noise
            sample += (Math.random() - 0.5) * 0.05;
            
            data[i] = sample * 0.3;
        }
        
        return buffer;
    }

    // Create construction sound
    async createConstructionSound() {
        const duration = 4.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            // Construction equipment
            let sample = (Math.random() - 0.5) * 0.6;
            sample += Math.sin(2 * Math.PI * 60 * t) * 0.3;
            sample += Math.sin(2 * Math.PI * 120 * t) * 0.2;
            
            // Random hammering
            if (Math.random() > 0.95) {
                sample += (Math.random() - 0.5) * 0.8;
            }
            
            data[i] = sample * 0.3;
        }
        
        return buffer;
    }

    // Create factory sound
    async createFactorySound() {
        const duration = 6.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            // Machinery hum
            let sample = Math.sin(2 * Math.PI * 100 * t) * 0.4;
            sample += Math.sin(2 * Math.PI * 200 * t) * 0.3;
            sample += (Math.random() - 0.5) * 0.2;
            
            data[i] = sample * 0.3;
        }
        
        return buffer;
    }

    // Create train sound
    async createTrainSound() {
        const duration = 5.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            // Train rumble
            let sample = Math.sin(2 * Math.PI * 80 * t) * 0.6;
            sample += Math.sin(2 * Math.PI * 160 * t) * 0.4;
            sample += (Math.random() - 0.5) * 0.3;
            
            // Clickety-clack
            const clickFreq = 10;
            sample += Math.sin(2 * Math.PI * clickFreq * t) * 0.2;
            
            data[i] = sample * 0.4;
        }
        
        return buffer;
    }

    // 4. Generate music tracks
    async generateMusicTracks() {
        console.log('🎵 Generating music tracks...');
        
        // Different music genres for different areas
        this.musicTracks.ambient = await this.createAmbientMusic();
        this.musicTracks.action = await this.createActionMusic();
        this.musicTracks.chill = await this.createChillMusic();
        this.musicTracks.nightlife = await this.createNightlifeMusic();
        this.musicTracks.drama = await this.createDramaMusic();
    }

    // Create ambient music
    async createAmbientMusic() {
        const duration = 30.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(2, duration * sampleRate, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            
            for (let i = 0; i < buffer.length; i++) {
                const t = i / sampleRate;
                
                // Ambient pads
                let sample = Math.sin(2 * Math.PI * 110 * t) * 0.2;
                sample += Math.sin(2 * Math.PI * 220 * t) * 0.15;
                sample += Math.sin(2 * Math.PI * 55 * t) * 0.25;
                
                // Slow modulation
                sample *= Math.sin(t * 0.1) * 0.5 + 0.5;
                
                data[i] = sample;
            }
        }
        
        return buffer;
    }

    // Create action music
    async createActionMusic() {
        const duration = 20.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(2, duration * sampleRate, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            
            for (let i = 0; i < buffer.length; i++) {
                const t = i / sampleRate;
                
                // Driving rhythm
                let sample = Math.sin(2 * Math.PI * 130 * t) * 0.3;
                sample += Math.sin(2 * Math.PI * 260 * t) * 0.2;
                
                // Bass line
                sample += Math.sin(2 * Math.PI * 65 * t) * 0.4;
                
                // Percussion
                if (Math.sin(t * 4) > 0.8) {
                    sample += (Math.random() - 0.5) * 0.3;
                }
                
                data[i] = sample;
            }
        }
        
        return buffer;
    }

    // Create chill music
    async createChillMusic() {
        const duration = 25.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(2, duration * sampleRate, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            
            for (let i = 0; i < buffer.length; i++) {
                const t = i / sampleRate;
                
                // Relaxing melody
                let sample = Math.sin(2 * Math.PI * 440 * t) * 0.2;
                sample += Math.sin(2 * Math.PI * 880 * t) * 0.1;
                
                // Soft chords
                sample += Math.sin(2 * Math.PI * 220 * t) * 0.15;
                sample += Math.sin(2 * Math.PI * 330 * t) * 0.15;
                
                // Gentle modulation
                sample *= Math.sin(t * 0.05) * 0.3 + 0.7;
                
                data[i] = sample;
            }
        }
        
        return buffer;
    }

    // Create nightlife music
    async createNightlifeMusic() {
        const duration = 15.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(2, duration * sampleRate, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            
            for (let i = 0; i < buffer.length; i++) {
                const t = i / sampleRate;
                
                // Electronic beat
                let sample = 0;
                
                // Kick drum
                if (Math.sin(t * 8) > 0.9) {
                    sample += Math.sin(2 * Math.PI * 60 * t) * 0.5;
                }
                
                // Hi-hat
                if (Math.sin(t * 16) > 0.7) {
                    sample += (Math.random() - 0.5) * 0.2;
                }
                
                // Synth melody
                sample += Math.sin(2 * Math.PI * 800 * t) * 0.1;
                sample += Math.sin(2 * Math.PI * 1200 * t) * 0.05;
                
                data[i] = sample;
            }
        }
        
        return buffer;
    }

    // Create drama music
    async createDramaMusic() {
        const duration = 18.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(2, duration * sampleRate, sampleRate);
        
        for (let channel = 0; channel < 2; channel++) {
            const data = buffer.getChannelData(channel);
            
            for (let i = 0; i < buffer.length; i++) {
                const t = i / sampleRate;
                
                // Tension building
                let sample = Math.sin(2 * Math.PI * 80 * t) * 0.3;
                sample += Math.sin(2 * Math.PI * 160 * t) * 0.2;
                
                // Rising pitch
                const risingFreq = 100 + t * 50;
                sample += Math.sin(2 * Math.PI * risingFreq * t) * 0.2;
                
                // Staccato strings
                if (Math.sin(t * 2) > 0.8) {
                    sample += Math.sin(2 * Math.PI * 440 * t) * 0.3;
                }
                
                data[i] = sample;
            }
        }
        
        return buffer;
    }

    // 5. Generate UI sounds
    async generateUISounds() {
        console.log('🎮 Generating UI sounds...');
        
        this.sounds.uiClick = await this.createClickSound();
        this.sounds.uiHover = await this.createHoverSound();
        this.sounds.uiBack = await this.createBackSound();
        this.sounds.uiConfirm = await this.createConfirmSound();
        this.sounds.uiError = await this.createErrorSound();
        this.sounds.uiSuccess = await this.createSuccessSound();
        this.sounds.uiNotification = await this.createNotificationSound();
    }

    // Create click sound
    async createClickSound() {
        const duration = 0.05;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            data[i] = Math.sin(2 * Math.PI * 1000 * t) * Math.exp(-t * 50) * 0.5;
        }
        
        return buffer;
    }

    // Create hover sound
    async createHoverSound() {
        const duration = 0.03;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            data[i] = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 30) * 0.3;
        }
        
        return buffer;
    }

    // Create back sound
    async createBackSound() {
        const duration = 0.1;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            data[i] = Math.sin(2 * Math.PI * 600 * t) * Math.exp(-t * 20) * 0.4;
        }
        
        return buffer;
    }

    // Create confirm sound
    async createConfirmSound() {
        const duration = 0.2;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            let sample = Math.sin(2 * Math.PI * 523 * t) * 0.3; // C5
            sample += Math.sin(2 * Math.PI * 659 * t) * 0.3; // E5
            sample += Math.sin(2 * Math.PI * 784 * t) * 0.4; // G5
            data[i] = sample * Math.exp(-t * 5);
        }
        
        return buffer;
    }

    // Create error sound
    async createErrorSound() {
        const duration = 0.3;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            data[i] = Math.sin(2 * Math.PI * 200 * t) * Math.exp(-t * 3) * 0.5;
        }
        
        return buffer;
    }

    // Create success sound
    async createSuccessSound() {
        const duration = 0.4;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            let sample = Math.sin(2 * Math.PI * 523 * t) * 0.3; // C5
            if (t > 0.1) {
                sample += Math.sin(2 * Math.PI * 659 * t) * 0.3; // E5
            }
            if (t > 0.2) {
                sample += Math.sin(2 * Math.PI * 784 * t) * 0.4; // G5
            }
            data[i] = sample * Math.exp(-t * 2);
        }
        
        return buffer;
    }

    // Create notification sound
    async createNotificationSound() {
        const duration = 0.15;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            data[i] = Math.sin(2 * Math.PI * 880 * t) * Math.exp(-t * 10) * 0.4;
        }
        
        return buffer;
    }

    // 6. Generate footstep sounds
    async generateFootstepSounds() {
        console.log('👟 Generating footstep sounds...');
        
        this.sounds.footstepConcrete = await this.createFootstepSound('concrete');
        this.sounds.footstepGrass = await this.createFootstepSound('grass');
        this.sounds.footstepMetal = await this.createFootstepSound('metal');
        this.sounds.footstepWood = await this.createFootstepSound('wood');
        this.sounds.footstepWater = await this.createFootstepSound('water');
        this.sounds.footstepSand = await this.createFootstepSound('sand');
    }

    // Create footstep sound
    async createFootstepSound(surface) {
        const duration = 0.2;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        const surfaceConfigs = {
            concrete: { freq: 200, noise: 0.8, decay: 0.9 },
            grass: { freq: 150, noise: 0.3, decay: 0.7 },
            metal: { freq: 300, noise: 0.5, decay: 0.95 },
            wood: { freq: 180, noise: 0.4, decay: 0.8 },
            water: { freq: 100, noise: 0.6, decay: 0.5 },
            sand: { freq: 120, noise: 0.2, decay: 0.6 }
        };
        
        const config = surfaceConfigs[surface] || surfaceConfigs.concrete;
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            let sample = Math.sin(2 * Math.PI * config.freq * t) * 0.5;
            sample += (Math.random() - 0.5) * config.noise;
            
            data[i] = sample * Math.exp(-t * 10) * config.decay;
        }
        
        return buffer;
    }

    // 7. Generate environment sounds
    async generateEnvironmentSounds() {
        console.log('🌳 Generating environment sounds...');
        
        this.sounds.waterSplash = await this.createWaterSplash();
        this.sounds.doorCreak = await this.createDoorCreak();
        this.sounds.elevatorDing = await this.createElevatorDing();
        this.sounds.atmosphericHum = await this.createAtmosphericHum();
        this.sounds.thunder = await this.createThunderSound();
    }

    // Create water splash sound
    async createWaterSplash() {
        const duration = 0.8;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            let sample = (Math.random() - 0.5) * 0.8;
            sample += Math.sin(2 * Math.PI * 200 * t) * 0.3;
            
            data[i] = sample * Math.exp(-t * 3) * 0.6;
        }
        
        return buffer;
    }

    // Create door creak sound
    async createDoorCreak() {
        const duration = 1.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            const freq = 100 + Math.sin(t * 2) * 50;
            const sample = Math.sin(2 * Math.PI * freq * t) * 0.5;
            const noise = (Math.random() - 0.5) * 0.3;
            
            data[i] = (sample + noise) * Math.exp(-t * 2) * 0.7;
        }
        
        return buffer;
    }

    // Create elevator ding sound
    async createElevatorDing() {
        const duration = 0.5;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            let sample = Math.sin(2 * Math.PI * 800 * t) * 0.5;
            sample += Math.sin(2 * Math.PI * 1200 * t) * 0.3;
            
            data[i] = sample * Math.exp(-t * 5) * 0.6;
        }
        
        return buffer;
    }

    // Create atmospheric hum
    async createAtmosphericHum() {
        const duration = 8.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            let sample = Math.sin(2 * Math.PI * 50 * t) * 0.4;
            sample += Math.sin(2 * Math.PI * 100 * t) * 0.3;
            sample += (Math.random() - 0.5) * 0.1;
            
            data[i] = sample * 0.2;
        }
        
        return buffer;
    }

    // Create thunder sound
    async createThunderSound() {
        const duration = 3.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            let sample = (Math.random() - 0.5) * 0.9;
            sample += Math.sin(2 * Math.PI * 40 * t) * 0.5;
            sample += Math.sin(2 * Math.PI * 80 * t) * 0.3;
            
            data[i] = sample * Math.exp(-t * 0.5) * 0.8;
        }
        
        return buffer;
    }

    // 8. Generate voice sounds
    async generateVoiceSounds() {
        console.log('🗣️ Generating voice sounds...');
        
        this.sounds.playerGrunt = await this.createVoiceSound('grunt');
        this.sounds.playerPain = await this.createVoiceSound('pain');
        this.sounds.playerDeath = await this.createVoiceSound('death');
        this.sounds.playerJump = await this.createVoiceSound('jump');
        this.sounds.playerLand = await this.createVoiceSound('land');
    }

    // Create voice sound
    async createVoiceSound(type) {
        const duration = 0.5;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        const voiceConfigs = {
            grunt: { freq: 150, duration: 0.2, volume: 0.6 },
            pain: { freq: 200, duration: 0.4, volume: 0.8 },
            death: { freq: 100, duration: 0.8, volume: 1.0 },
            jump: { freq: 300, duration: 0.15, volume: 0.4 },
            land: { freq: 250, duration: 0.1, volume: 0.3 }
        };
        
        const config = voiceConfigs[type] || voiceConfigs.grunt;
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            if (t < config.duration) {
                let sample = Math.sin(2 * Math.PI * config.freq * t) * 0.5;
                sample += (Math.random() - 0.5) * 0.3;
                
                data[i] = sample * Math.exp(-t * 5) * config.volume;
            } else {
                data[i] = 0;
            }
        }
        
        return buffer;
    }

    // 9. Generate special effects
    async generateSpecialEffects() {
        console.log('✨ Generating special effects...');
        
        this.sounds.powerUp = await this.createPowerUpSound();
        this.sounds.levelUp = await this.createLevelUpSound();
        this.sounds.achievement = await this.createAchievementSound();
        this.sounds.moneyPickup = await this.createMoneyPickupSound();
        this.sounds.healthPickup = await this.createHealthPickupSound();
    }

    // Create power-up sound
    async createPowerUpSound() {
        const duration = 0.6;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            const risingFreq = 400 + t * 800;
            let sample = Math.sin(2 * Math.PI * risingFreq * t) * 0.5;
            sample += Math.sin(2 * Math.PI * risingFreq * 2 * t) * 0.3;
            
            data[i] = sample * Math.exp(-t * 2) * 0.7;
        }
        
        return buffer;
    }

    // Create level up sound
    async createLevelUpSound() {
        const duration = 1.0;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            let sample = 0;
            
            // Arpeggio
            if (t < 0.2) {
                sample += Math.sin(2 * Math.PI * 523 * t) * 0.4; // C5
            } else if (t < 0.4) {
                sample += Math.sin(2 * Math.PI * 659 * t) * 0.4; // E5
            } else if (t < 0.6) {
                sample += Math.sin(2 * Math.PI * 784 * t) * 0.4; // G5
            } else if (t < 0.8) {
                sample += Math.sin(2 * Math.PI * 1047 * t) * 0.4; // C6
            }
            
            data[i] = sample * Math.exp(-t * 3) * 0.8;
        }
        
        return buffer;
    }

    // Create achievement sound
    async createAchievementSound() {
        const duration = 0.8;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            let sample = Math.sin(2 * Math.PI * 523 * t) * 0.3; // C5
            sample += Math.sin(2 * Math.PI * 659 * t) * 0.3; // E5
            sample += Math.sin(2 * Math.PI * 784 * t) * 0.4; // G5
            
            // Sparkle effect
            if (Math.random() > 0.9) {
                sample += Math.sin(2 * Math.PI * 2000 * t) * 0.2;
            }
            
            data[i] = sample * Math.exp(-t * 2) * 0.9;
        }
        
        return buffer;
    }

    // Create money pickup sound
    async createMoneyPickupSound() {
        const duration = 0.3;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            // Coin jingle
            let sample = Math.sin(2 * Math.PI * 1200 * t) * 0.5;
            sample += Math.sin(2 * Math.PI * 2400 * t) * 0.3;
            
            data[i] = sample * Math.exp(-t * 8) * 0.6;
        }
        
        return buffer;
    }

    // Create health pickup sound
    async createHealthPickupSound() {
        const duration = 0.4;
        const sampleRate = this.audioContext.sampleRate;
        const buffer = this.audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            
            // Healing sound
            let sample = Math.sin(2 * Math.PI * 440 * t) * 0.4;
            sample += Math.sin(2 * Math.PI * 880 * t) * 0.2;
            
            // Whoosh effect
            sample += Math.sin(2 * Math.PI * 200 * t) * 0.3;
            
            data[i] = sample * Math.exp(-t * 4) * 0.7;
        }
        
        return buffer;
    }

    // Play sound effect
    playSound(soundName, volume = 1.0, pitch = 1.0) {
        if (!this.isInitialized || !this.sounds[soundName]) {
            return;
        }
        
        const source = this.audioContext.createBufferSource();
        source.buffer = this.sounds[soundName];
        
        // Apply pitch shift if needed
        if (pitch !== 1.0) {
            source.playbackRate.value = pitch;
        }
        
        // Apply volume
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = volume;
        
        source.connect(gainNode);
        gainNode.connect(this.sfxGain);
        
        source.start(0);
    }

    // Play music track
    playMusic(trackName, loop = true, volume = 1.0) {
        if (!this.isInitialized || !this.musicTracks[trackName]) {
            return;
        }
        
        // Stop current music
        this.stopMusic();
        
        const source = this.audioContext.createBufferSource();
        source.buffer = this.musicTracks[trackName];
        source.loop = loop;
        
        // Apply volume
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = volume;
        
        source.connect(gainNode);
        gainNode.connect(this.musicGain);
        
        source.start(0);
        this.currentMusic = { source, gainNode };
    }

    // Stop music
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.source.stop();
            this.currentMusic = null;
        }
    }

    // Play ambient sound
    playAmbient(soundName, loop = true, volume = 1.0) {
        if (!this.isInitialized || !this.ambientSounds[soundName]) {
            return;
        }
        
        const source = this.audioContext.createBufferSource();
        source.buffer = this.ambientSounds[soundName];
        source.loop = loop;
        
        // Apply volume
        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = volume;
        
        source.connect(gainNode);
        gainNode.connect(this.ambientGain);
        
        source.start(0);
        
        // Store for later control
        if (!this.ambientSources) {
            this.ambientSources = {};
        }
        this.ambientSources[soundName] = { source, gainNode };
    }

    // Stop ambient sound
    stopAmbient(soundName) {
        if (this.ambientSources && this.ambientSources[soundName]) {
            this.ambientSources[soundName].source.stop();
            delete this.ambientSources[soundName];
        }
    }

    // Set volume levels
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.value = this.masterVolume;
        }
    }

    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
        if (this.sfxGain) {
            this.sfxGain.gain.value = this.sfxVolume;
        }
    }

    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        if (this.musicGain) {
            this.musicGain.gain.value = this.musicVolume;
        }
    }

    setAmbientVolume(volume) {
        this.ambientVolume = Math.max(0, Math.min(1, volume));
        if (this.ambientGain) {
            this.ambientGain.gain.value = this.ambientVolume;
        }
    }

    // Get sound statistics
    getSoundStats() {
        return {
            totalSounds: Object.keys(this.sounds).length,
            totalMusicTracks: Object.keys(this.musicTracks).length,
            totalAmbientSounds: Object.keys(this.ambientSounds).length,
            isInitialized: this.isInitialized,
            volumes: {
                master: this.masterVolume,
                sfx: this.sfxVolume,
                music: this.musicVolume,
                ambient: this.ambientVolume
            }
        };
    }

    // Cleanup
    cleanup() {
        if (this.currentMusic) {
            this.stopMusic();
        }
        
        if (this.ambientSources) {
            Object.keys(this.ambientSources).forEach(soundName => {
                this.stopAmbient(soundName);
            });
        }
        
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}

// Export for use in game
if (typeof window !== 'undefined') {
    window.SoundEffectsSystem = SoundEffectsSystem;
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = SoundEffectsSystem;
}
