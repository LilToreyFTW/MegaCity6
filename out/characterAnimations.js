// MegaCity6 Character Animation System
// Human-like animations for all characters and NPCs

class CharacterAnimationSystem {
    constructor(game) {
        this.game = game;
        this.animationMixer = null;
        this.clock = new THREE.Clock();
        
        // Animation states
        this.animationStates = {
            idle: { name: 'idle', speed: 1.0, loop: true },
            walk: { name: 'walk', speed: 1.0, loop: true },
            run: { name: 'run', speed: 1.5, loop: true },
            jump: { name: 'jump', speed: 1.0, loop: false },
            fall: { name: 'fall', speed: 1.0, loop: true },
            land: { name: 'land', speed: 1.0, loop: false },
            shoot: { name: 'shoot', speed: 1.0, loop: false },
            reload: { name: 'reload', speed: 1.0, loop: false },
            melee: { name: 'melee', speed: 1.2, loop: false },
            death: { name: 'death', speed: 1.0, loop: false },
            drive: { name: 'drive', speed: 1.0, loop: true },
            sit: { name: 'sit', speed: 1.0, loop: true },
            dance: { name: 'dance', speed: 1.0, loop: true },
            wave: { name: 'wave', speed: 1.0, loop: false },
            surrender: { name: 'surrender', speed: 1.0, loop: true },
            crouch: { name: 'crouch', speed: 1.0, loop: true },
            climb: { name: 'climb', speed: 1.0, loop: true }
        };
        
        // Procedural animation parameters
        this.walkCycle = 0;
        this.runCycle = 0;
        this.idleBreathing = 0;
        this.headBobAmount = 0.05;
        this.armSwingAmount = 0.3;
        this.legSwingAmount = 0.4;
        
        // Animation blending
        this.currentAnimation = 'idle';
        this.targetAnimation = 'idle';
        this.blendFactor = 0;
        this.blendSpeed = 0.1;
        
        // Character-specific animation data
        this.characterAnimations = new Map();
        this.npcAnimations = new Map();
        this.gangAnimations = new Map();
        
        this.init();
    }
    
    init() {
        console.log('🎬 Character Animation System initialized');
        this.setupAnimationSystem();
        this.createProceduralAnimations();
    }
    
    setupAnimationSystem() {
        // Create animation mixer for procedural animations
        this.animationMixer = {
            time: 0,
            deltaTime: 0,
            update: (deltaTime) => {
                this.animationMixer.deltaTime = deltaTime;
                this.animationMixer.time += deltaTime;
            }
        };
        
        console.log('🎭 Animation mixer created');
    }
    
    createProceduralAnimations() {
        // Create procedural bone structures for characters
        this.createCharacterSkeleton();
        this.createNPCSkeletons();
        this.createGangSkeletons();
    }
    
    createCharacterSkeleton() {
        // Player character skeleton
        const skeleton = {
            // Spine chain
            spine: {
                position: new THREE.Vector3(0, 1.2, 0),
                rotation: new THREE.Euler(),
                scale: new THREE.Vector3(1, 1, 1)
            },
            chest: {
                position: new THREE.Vector3(0, 1.5, 0),
                rotation: new THREE.Euler(),
                scale: new THREE.Vector3(1.2, 0.8, 0.6)
            },
            head: {
                position: new THREE.Vector3(0, 2.8, 0),
                rotation: new THREE.Euler(),
                scale: new THREE.Vector3(0.8, 0.8, 0.8)
            },
            // Arms
            leftShoulder: {
                position: new THREE.Vector3(-0.8, 2.2, 0),
                rotation: new THREE.Euler(),
                scale: new THREE.Vector3(0.3, 0.3, 1.2)
            },
            leftElbow: {
                position: new THREE.Vector3(-1.2, 1.8, 0),
                rotation: new THREE.Euler(),
                scale: new THREE.Vector3(0.25, 0.25, 1.0)
            },
            leftHand: {
                position: new THREE.Vector3(-1.4, 1.4, 0),
                rotation: new THREE.Euler(),
                scale: new THREE.Vector3(0.2, 0.2, 0.3)
            },
            rightShoulder: {
                position: new THREE.Vector3(0.8, 2.2, 0),
                rotation: new THREE.Euler(),
                scale: new THREE.Vector3(0.3, 0.3, 1.2)
            },
            rightElbow: {
                position: new THREE.Vector3(1.2, 1.8, 0),
                rotation: new THREE.Euler(),
                scale: new THREE.Vector3(0.25, 0.25, 1.0)
            },
            rightHand: {
                position: new THREE.Vector3(1.4, 1.4, 0),
                rotation: new THREE.Euler(),
                scale: new THREE.Vector3(0.2, 0.2, 0.3)
            },
            // Legs
            leftHip: {
                position: new THREE.Vector3(-0.3, 1.0, 0),
                rotation: new THREE.Euler(),
                scale: new THREE.Vector3(0.4, 0.4, 1.0)
            },
            leftKnee: {
                position: new THREE.Vector3(-0.3, 0.5, 0),
                rotation: new THREE.Euler(),
                scale: new THREE.Vector3(0.35, 0.35, 0.8)
            },
            leftFoot: {
                position: new THREE.Vector3(-0.3, 0.1, 0.2),
                rotation: new THREE.Euler(),
                scale: new THREE.Vector3(0.3, 0.1, 0.6)
            },
            rightHip: {
                position: new THREE.Vector3(0.3, 1.0, 0),
                rotation: new THREE.Euler(),
                scale: new THREE.Vector3(0.4, 0.4, 1.0)
            },
            rightKnee: {
                position: new THREE.Vector3(0.3, 0.5, 0),
                rotation: new THREE.Euler(),
                scale: new THREE.Vector3(0.35, 0.35, 0.8)
            },
            rightFoot: {
                position: new THREE.Vector3(0.3, 0.1, 0.2),
                rotation: new THREE.Euler(),
                scale: new THREE.Vector3(0.3, 0.1, 0.6)
            }
        };
        
        this.characterAnimations.set('player', skeleton);
        this.createCharacterMesh(skeleton, 'player');
    }
    
    createCharacterMesh(skeleton, characterType) {
        const characterGroup = new THREE.Group();
        
        // Create body parts as meshes
        const bodyParts = {};
        
        // Torso
        bodyParts.torso = new THREE.Mesh(
            new THREE.BoxGeometry(0.8, 1.2, 0.4),
            new THREE.MeshLambertMaterial({ color: characterType === 'player' ? 0x4169E1 : 0x8B4513 })
        );
        bodyParts.torso.position.copy(skeleton.chest.position);
        characterGroup.add(bodyParts.torso);
        
        // Head
        bodyParts.head = new THREE.Mesh(
            new THREE.BoxGeometry(0.6, 0.6, 0.6),
            new THREE.MeshLambertMaterial({ color: 0xFFDBAC })
        );
        bodyParts.head.position.copy(skeleton.head.position);
        characterGroup.add(bodyParts.head);
        
        // Arms
        bodyParts.leftArm = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 1.0, 0.2),
            new THREE.MeshLambertMaterial({ color: characterType === 'player' ? 0x4169E1 : 0x8B4513 })
        );
        bodyParts.leftArm.position.set(-0.5, 1.8, 0);
        characterGroup.add(bodyParts.leftArm);
        
        bodyParts.rightArm = new THREE.Mesh(
            new THREE.BoxGeometry(0.2, 1.0, 0.2),
            new THREE.MeshLambertMaterial({ color: characterType === 'player' ? 0x4169E1 : 0x8B4513 })
        );
        bodyParts.rightArm.position.set(0.5, 1.8, 0);
        characterGroup.add(bodyParts.rightArm);
        
        // Legs
        bodyParts.leftLeg = new THREE.Mesh(
            new THREE.BoxGeometry(0.25, 1.2, 0.25),
            new THREE.MeshLambertMaterial({ color: 0x2F4F4F })
        );
        bodyParts.leftLeg.position.set(-0.2, 0.5, 0);
        characterGroup.add(bodyParts.leftLeg);
        
        bodyParts.rightLeg = new THREE.Mesh(
            new THREE.BoxGeometry(0.25, 1.2, 0.25),
            new THREE.MeshLambertMaterial({ color: 0x2F4F4F })
        );
        bodyParts.rightLeg.position.set(0.2, 0.5, 0);
        characterGroup.add(bodyParts.rightLeg);
        
        // Store mesh references for animation
        this.characterAnimations.set(characterType + '_mesh', bodyParts);
        
        return characterGroup;
    }
    
    createNPCSkeletons() {
        // Create different NPC types with unique skeletons
        const npcTypes = ['civilian', 'business', 'worker', 'police', 'medic'];
        
        npcTypes.forEach(type => {
            const skeleton = this.createNPCSkeleton(type);
            this.npcAnimations.set(type, skeleton);
        });
    }
    
    createNPCSkeleton(type) {
        const baseSkeleton = this.characterAnimations.get('player');
        const npcSkeleton = JSON.parse(JSON.stringify(baseSkeleton)); // Deep copy
        
        // Customize based on NPC type
        switch (type) {
            case 'civilian':
                // Standard civilian - no changes
                break;
            case 'business':
                // Business person - slightly different proportions
                npcSkeleton.chest.scale.y = 0.9;
                npcSkeleton.head.position.y = 2.9;
                break;
            case 'worker':
                // Worker - more muscular build
                npcSkeleton.chest.scale.x = 1.4;
                npcSkeleton.chest.scale.y = 0.9;
                npcSkeleton.leftShoulder.scale.x = 0.4;
                npcSkeleton.rightShoulder.scale.x = 0.4;
                break;
            case 'police':
                // Police officer - tactical stance
                npcSkeleton.chest.scale.y = 0.85;
                npcSkeleton.leftArm.scale.y = 1.1;
                npcSkeleton.rightArm.scale.y = 1.1;
                break;
            case 'medic':
                // Medic - leaner build
                npcSkeleton.chest.scale.x = 1.0;
                npcSkeleton.chest.scale.y = 0.85;
                break;
        }
        
        return npcSkeleton;
    }
    
    createGangSkeletons() {
        // Create gang member skeletons with aggressive stances
        const gangTypes = ['street_thug', 'biker', 'cartel', 'mafia'];
        
        gangTypes.forEach(type => {
            const skeleton = this.createGangSkeleton(type);
            this.gangAnimations.set(type, skeleton);
        });
    }
    
    createGangSkeleton(type) {
        const baseSkeleton = this.characterAnimations.get('player');
        const gangSkeleton = JSON.parse(JSON.stringify(baseSkeleton));
        
        // Customize based on gang type
        switch (type) {
            case 'street_thug':
                // Street thug - hunched posture
                gangSkeleton.chest.rotation.x = 0.1;
                gangSkeleton.head.position.y = 2.7;
                break;
            case 'biker':
                // Biker - heavy build
                gangSkeleton.chest.scale.x = 1.3;
                gangSkeleton.chest.scale.y = 0.8;
                gangSkeleton.leftArm.scale.x = 0.4;
                gangSkeleton.rightArm.scale.x = 0.4;
                break;
            case 'cartel':
                // Cartel member - tactical stance
                gangSkeleton.chest.scale.y = 0.85;
                gangSkeleton.leftArm.rotation.z = 0.2;
                gangSkeleton.rightArm.rotation.z = -0.2;
                break;
            case 'mafia':
                // Mafia enforcer - imposing build
                gangSkeleton.chest.scale.x = 1.2;
                gangSkeleton.chest.scale.y = 0.9;
                gangSkeleton.leftHip.scale.x = 0.5;
                gangSkeleton.rightHip.scale.x = 0.5;
                break;
        }
        
        return gangSkeleton;
    }
    
    // Animation update methods
    update(deltaTime) {
        this.animationMixer.update(deltaTime);
        
        // Update animation cycles
        this.walkCycle += deltaTime * 4;
        this.runCycle += deltaTime * 6;
        this.idleBreathing += deltaTime * 2;
        
        // Blend animations
        this.updateAnimationBlend(deltaTime);
        
        // Update character animations
        this.updateCharacterAnimations(deltaTime);
        
        // Update NPC animations
        this.updateNPCAnimations(deltaTime);
        
        // Update gang animations
        this.updateGangAnimations(deltaTime);
    }
    
    updateAnimationBlend(deltaTime) {
        if (this.currentAnimation !== this.targetAnimation) {
            this.blendFactor = Math.min(1, this.blendFactor + this.blendSpeed);
            
            if (this.blendFactor >= 1) {
                this.currentAnimation = this.targetAnimation;
                this.blendFactor = 0;
            }
        }
    }
    
    updateCharacterAnimations(deltaTime) {
        if (!this.game.character) return;
        
        const meshParts = this.characterAnimations.get('player_mesh');
        if (!meshParts) return;
        
        const animation = this.animationStates[this.currentAnimation];
        if (!animation) return;
        
        switch (this.currentAnimation) {
            case 'idle':
                this.animateIdle(meshParts, deltaTime);
                break;
            case 'walk':
                this.animateWalk(meshParts, deltaTime);
                break;
            case 'run':
                this.animateRun(meshParts, deltaTime);
                break;
            case 'jump':
                this.animateJump(meshParts, deltaTime);
                break;
            case 'shoot':
                this.animateShoot(meshParts, deltaTime);
                break;
            case 'drive':
                this.animateDrive(meshParts, deltaTime);
                break;
        }
    }
    
    animateIdle(meshParts, deltaTime) {
        // Breathing animation
        const breathing = Math.sin(this.idleBreathing) * 0.02;
        
        // Slight chest movement
        meshParts.torso.scale.y = 1.2 + breathing;
        meshParts.torso.position.y = 1.5 + breathing * 0.5;
        
        // Head slight nod
        meshParts.head.rotation.x = breathing * 0.1;
        
        // Arm sway
        const armSway = Math.sin(this.idleBreathing * 0.5) * 0.05;
        meshParts.leftArm.rotation.z = armSway;
        meshParts.rightArm.rotation.z = -armSway;
        
        // Weight shift
        const weightShift = Math.sin(this.idleBreathing * 0.3) * 0.02;
        meshParts.torso.rotation.z = weightShift;
    }
    
    animateWalk(meshParts, deltaTime) {
        // Walk cycle animations
        const walkCycle = this.walkCycle;
        
        // Leg animation
        const leftLegAngle = Math.sin(walkCycle) * this.legSwingAmount;
        const rightLegAngle = -Math.sin(walkCycle) * this.legSwingAmount;
        
        meshParts.leftLeg.rotation.x = leftLegAngle;
        meshParts.rightLeg.rotation.x = rightLegAngle;
        
        // Arm swing (opposite to legs)
        const leftArmAngle = -Math.sin(walkCycle) * this.armSwingAmount;
        const rightArmAngle = Math.sin(walkCycle) * this.armSwingAmount;
        
        meshParts.leftArm.rotation.z = leftArmAngle;
        meshParts.rightArm.rotation.z = rightArmAngle;
        
        // Head bob
        const headBob = Math.abs(Math.sin(walkCycle * 2)) * this.headBobAmount;
        meshParts.head.position.y = 2.8 + headBob;
        meshParts.torso.position.y = 1.5 + headBob * 0.5;
        
        // Body lean
        const lean = Math.sin(walkCycle) * 0.05;
        meshParts.torso.rotation.z = lean;
        
        // Slight forward lean during walk
        meshParts.torso.rotation.x = 0.05;
    }
    
    animateRun(meshParts, deltaTime) {
        // Run cycle animations (faster and more exaggerated)
        const runCycle = this.runCycle;
        
        // More aggressive leg movement
        const leftLegAngle = Math.sin(runCycle) * this.legSwingAmount * 1.5;
        const rightLegAngle = -Math.sin(runCycle) * this.legSwingAmount * 1.5;
        
        meshParts.leftLeg.rotation.x = leftLegAngle;
        meshParts.rightLeg.rotation.x = rightLegAngle;
        
        // More aggressive arm swing
        const leftArmAngle = -Math.sin(runCycle) * this.armSwingAmount * 1.8;
        const rightArmAngle = Math.sin(runCycle) * this.armSwingAmount * 1.8;
        
        meshParts.leftArm.rotation.z = leftArmAngle;
        meshParts.rightArm.rotation.z = rightArmAngle;
        
        // More pronounced head bob
        const headBob = Math.abs(Math.sin(runCycle * 2)) * this.headBobAmount * 1.5;
        meshParts.head.position.y = 2.8 + headBob;
        meshParts.torso.position.y = 1.5 + headBob * 0.7;
        
        // Forward lean during run
        meshParts.torso.rotation.x = 0.15;
        
        // Body bounce
        const bounce = Math.abs(Math.sin(runCycle * 4)) * 0.02;
        meshParts.torso.position.y += bounce;
    }
    
    animateJump(meshParts, deltaTime) {
        // Jump animation - tuck knees and arms up
        const jumpProgress = Math.min(1, deltaTime * 3);
        
        // Arms up
        meshParts.leftArm.rotation.x = -Math.PI / 3 * jumpProgress;
        meshParts.rightArm.rotation.x = -Math.PI / 3 * jumpProgress;
        
        // Legs tucked
        meshParts.leftLeg.rotation.x = Math.PI / 6 * jumpProgress;
        meshParts.rightLeg.rotation.x = Math.PI / 6 * jumpProgress;
        
        // Body arch
        meshParts.torso.rotation.x = -0.2 * jumpProgress;
        
        // Head forward
        meshParts.head.rotation.x = 0.1 * jumpProgress;
    }
    
    animateShoot(meshParts, deltaTime) {
        // Shooting animation - quick arm movement
        const shootProgress = Math.min(1, deltaTime * 5);
        
        // Right arm extends
        meshParts.rightArm.rotation.x = -Math.PI / 6 * shootProgress;
        
        // Left arm supports
        meshParts.leftArm.rotation.x = -Math.PI / 12 * shootProgress;
        
        // Body slight recoil
        meshParts.torso.rotation.z = 0.1 * shootProgress;
        
        // Head tracks target
        meshParts.head.rotation.y = 0.05 * shootProgress;
        
        // Quick animation - return to idle
        setTimeout(() => {
            this.setAnimation('idle');
        }, 200);
    }
    
    animateDrive(meshParts, deltaTime) {
        // Driving animation - seated position
        meshParts.torso.position.y = 1.2;
        meshParts.torso.rotation.x = 0.2;
        
        // Arms on wheel
        meshParts.leftArm.rotation.x = Math.PI / 4;
        meshParts.rightArm.rotation.x = Math.PI / 4;
        meshParts.leftArm.rotation.z = Math.PI / 6;
        meshParts.rightArm.rotation.z = -Math.PI / 6;
        
        // Legs bent
        meshParts.leftLeg.rotation.x = Math.PI / 3;
        meshParts.rightLeg.rotation.x = Math.PI / 3;
        
        // Head forward
        meshParts.head.rotation.x = 0.1;
    }
    
    updateNPCAnimations(deltaTime) {
        // Update all NPC animations
        for (const [npcId, npc] of this.game.pedestrians.entries()) {
            this.updateNPCAnimation(npc, deltaTime);
        }
    }
    
    updateNPCAnimation(npc, deltaTime) {
        // Determine NPC animation based on state
        let animation = 'idle';
        
        if (npc.velocity && (npc.velocity.x !== 0 || npc.velocity.z !== 0)) {
            const speed = Math.sqrt(npc.velocity.x * npc.velocity.x + npc.velocity.z * npc.velocity.z);
            animation = speed > 2 ? 'run' : 'walk';
        }
        
        // Apply animation to NPC model
        this.applyNPCAnimation(npc, animation, deltaTime);
    }
    
    applyNPCAnimation(npc, animation, deltaTime) {
        if (!npc.model) return;
        
        // Find NPC mesh parts
        const npcType = this.getNPCType(npc);
        const meshParts = this.characterAnimations.get(npcType + '_mesh');
        
        if (!meshParts) return;
        
        // Apply appropriate animation
        switch (animation) {
            case 'idle':
                this.animateNPCIdle(npc, meshParts, deltaTime);
                break;
            case 'walk':
                this.animateNPCWalk(npc, meshParts, deltaTime);
                break;
            case 'run':
                this.animateNPCRun(npc, meshParts, deltaTime);
                break;
        }
    }
    
    getNPCType(npc) {
        // Determine NPC type based on appearance or properties
        if (npc.gangType) return 'gang';
        if (npc.profession) return npc.profession;
        return 'civilian'; // Default
    }
    
    animateNPCIdle(npc, meshParts, deltaTime) {
        // NPC idle with slight variations
        const idleTime = Date.now() * 0.001 + npc.id.charCodeAt(0);
        const breathing = Math.sin(idleTime * 2) * 0.015;
        
        // Subtle breathing
        if (meshParts.torso) {
            meshParts.torso.scale.y = 1.2 + breathing;
        }
        
        // Occasionally look around
        if (Math.random() < 0.01) {
            const lookAngle = (Math.random() - 0.5) * 0.3;
            if (meshParts.head) {
                meshParts.head.rotation.y = lookAngle;
            }
        }
    }
    
    animateNPCWalk(npc, meshParts, deltaTime) {
        // NPC walk with individual timing
        const walkTime = Date.now() * 0.004 + npc.id.charCodeAt(0);
        const walkCycle = walkTime;
        
        // Leg movement
        if (meshParts.leftLeg && meshParts.rightLeg) {
            const leftLegAngle = Math.sin(walkCycle) * this.legSwingAmount * 0.8;
            const rightLegAngle = -Math.sin(walkCycle) * this.legSwingAmount * 0.8;
            
            meshParts.leftLeg.rotation.x = leftLegAngle;
            meshParts.rightLeg.rotation.x = rightLegAngle;
        }
        
        // Arm movement
        if (meshParts.leftArm && meshParts.rightArm) {
            const leftArmAngle = -Math.sin(walkCycle) * this.armSwingAmount * 0.7;
            const rightArmAngle = Math.sin(walkCycle) * this.armSwingAmount * 0.7;
            
            meshParts.leftArm.rotation.z = leftArmAngle;
            meshParts.rightArm.rotation.z = rightArmAngle;
        }
    }
    
    animateNPCRun(npc, meshParts, deltaTime) {
        // NPC run animation
        const runTime = Date.now() * 0.006 + npc.id.charCodeAt(0);
        const runCycle = runTime;
        
        // More aggressive movement
        if (meshParts.leftLeg && meshParts.rightLeg) {
            const leftLegAngle = Math.sin(runCycle) * this.legSwingAmount * 1.2;
            const rightLegAngle = -Math.sin(runCycle) * this.legSwingAmount * 1.2;
            
            meshParts.leftLeg.rotation.x = leftLegAngle;
            meshParts.rightLeg.rotation.x = rightLegAngle;
        }
        
        if (meshParts.leftArm && meshParts.rightArm) {
            const leftArmAngle = -Math.sin(runCycle) * this.armSwingAmount * 1.3;
            const rightArmAngle = Math.sin(runCycle) * this.armSwingAmount * 1.3;
            
            meshParts.leftArm.rotation.z = leftArmAngle;
            meshParts.rightArm.rotation.z = rightArmAngle;
        }
    }
    
    updateGangAnimations(deltaTime) {
        // Update all gang member animations
        if (this.game.gangs) {
            for (const gang of this.game.gangs.gangs.values()) {
                this.updateGangAnimation(gang, deltaTime);
            }
        }
    }
    
    updateGangAnimation(gang, deltaTime) {
        if (!gang.model) return;
        
        // Gang animations based on state
        let animation = 'idle';
        
        switch (gang.state) {
            case 'patrol':
                animation = 'walk';
                break;
            case 'chase':
                animation = 'run';
                break;
            case 'attack':
                animation = 'shoot';
                break;
        }
        
        this.applyGangAnimation(gang, animation, deltaTime);
    }
    
    applyGangAnimation(gang, animation, deltaTime) {
        // Get gang-specific mesh parts
        const meshParts = this.characterAnimations.get(gang.type.name + '_mesh');
        
        if (!meshParts) return;
        
        // Apply animations with gang-specific behaviors
        switch (animation) {
            case 'idle':
                this.animateGangIdle(gang, meshParts, deltaTime);
                break;
            case 'walk':
                this.animateGangWalk(gang, meshParts, deltaTime);
                break;
            case 'run':
                this.animateGangRun(gang, meshParts, deltaTime);
                break;
            case 'shoot':
                this.animateGangShoot(gang, meshParts, deltaTime);
                break;
        }
    }
    
    animateGangIdle(gang, meshParts, deltaTime) {
        // Gang idle - more aggressive posture
        const idleTime = Date.now() * 0.001 + gang.id.charCodeAt(0);
        const breathing = Math.sin(idleTime * 2) * 0.02;
        
        // More tense posture
        if (meshParts.torso) {
            meshParts.torso.rotation.x = 0.1;
            meshParts.torso.scale.y = 1.2 + breathing * 0.5;
        }
        
        // Alert head movement
        if (meshParts.head) {
            meshParts.head.rotation.y = Math.sin(idleTime * 0.5) * 0.2;
            meshParts.head.rotation.x = 0.05;
        }
        
        // Arms ready position
        if (meshParts.leftArm && meshParts.rightArm) {
            meshParts.leftArm.rotation.z = 0.2;
            meshParts.rightArm.rotation.z = -0.2;
        }
    }
    
    animateGangWalk(gang, meshParts, deltaTime) {
        // Gang walk - more aggressive stride
        const walkTime = Date.now() * 0.004 + gang.id.charCodeAt(0);
        const walkCycle = walkTime;
        
        // Aggressive leg movement
        if (meshParts.leftLeg && meshParts.rightLeg) {
            const leftLegAngle = Math.sin(walkCycle) * this.legSwingAmount * 1.1;
            const rightLegAngle = -Math.sin(walkCycle) * this.legSwingAmount * 1.1;
            
            meshParts.leftLeg.rotation.x = leftLegAngle;
            meshParts.rightLeg.rotation.x = rightLegAngle;
        }
        
        // Arms ready for combat
        if (meshParts.leftArm && meshParts.rightArm) {
            meshParts.leftArm.rotation.z = 0.3;
            meshParts.rightArm.rotation.z = -0.3;
            meshParts.leftArm.rotation.x = -0.1;
            meshParts.rightArm.rotation.x = -0.1;
        }
        
        // Forward lean
        if (meshParts.torso) {
            meshParts.torso.rotation.x = 0.1;
        }
    }
    
    animateGangRun(gang, meshParts, deltaTime) {
        // Gang run - very aggressive
        const runTime = Date.now() * 0.006 + gang.id.charCodeAt(0);
        const runCycle = runTime;
        
        // Very aggressive leg movement
        if (meshParts.leftLeg && meshParts.rightLeg) {
            const leftLegAngle = Math.sin(runCycle) * this.legSwingAmount * 1.8;
            const rightLegAngle = -Math.sin(runCycle) * this.legSwingAmount * 1.8;
            
            meshParts.leftLeg.rotation.x = leftLegAngle;
            meshParts.rightLeg.rotation.x = rightLegAngle;
        }
        
        // Arms pumping
        if (meshParts.leftArm && meshParts.rightArm) {
            const leftArmAngle = -Math.sin(runCycle) * this.armSwingAmount * 1.5;
            const rightArmAngle = Math.sin(runCycle) * this.armSwingAmount * 1.5;
            
            meshParts.leftArm.rotation.z = leftArmAngle;
            meshParts.rightArm.rotation.z = rightArmAngle;
        }
        
        // Aggressive forward lean
        if (meshParts.torso) {
            meshParts.torso.rotation.x = 0.2;
        }
    }
    
    animateGangShoot(gang, meshParts, deltaTime) {
        // Gang shooting animation
        const shootTime = Date.now() * 0.01 + gang.id.charCodeAt(0);
        const shootProgress = Math.min(1, shootTime % 1);
        
        // Shooting stance
        if (meshParts.torso) {
            meshParts.torso.rotation.z = 0.2;
            meshParts.torso.rotation.x = 0.1;
        }
        
        // Right arm aiming
        if (meshParts.rightArm) {
            meshParts.rightArm.rotation.x = -Math.PI / 4;
            meshParts.rightArm.rotation.z = -Math.PI / 6;
        }
        
        // Left arm supporting
        if (meshParts.leftArm) {
            meshParts.leftArm.rotation.x = -Math.PI / 8;
            meshParts.leftArm.rotation.z = Math.PI / 8;
        }
        
        // Head tracking
        if (meshParts.head) {
            meshParts.head.rotation.y = 0.1;
            meshParts.head.rotation.x = 0.05;
        }
        
        // Recoil effect
        if (shootProgress < 0.1) {
            if (meshParts.torso) {
                meshParts.torso.rotation.z += 0.05;
            }
        }
    }
    
    // Public animation control methods
    setAnimation(animationName) {
        if (this.animationStates[animationName]) {
            this.targetAnimation = animationName;
            this.blendFactor = 0;
        }
    }
    
    getCurrentAnimation() {
        return this.currentAnimation;
    }
    
    isAnimationComplete(animationName) {
        // For non-looping animations
        return this.currentAnimation === animationName && this.blendFactor >= 1;
    }
    
    // Special animation methods
    playDeathAnimation(character) {
        this.setAnimation('death');
        
        // Death animation specific logic
        setTimeout(() => {
            // Ragdoll or fall animation
            if (character.model) {
                character.model.rotation.x = Math.PI / 2;
                character.model.position.y = 0.5;
            }
        }, 500);
    }
    
    playDanceAnimation(character) {
        this.setAnimation('dance');
        
        // Dance animation with rhythmic movements
        const danceTime = Date.now() * 0.004;
        const meshParts = this.characterAnimations.get('player_mesh');
        
        if (meshParts) {
            // Rhythmic arm movements
            meshParts.leftArm.rotation.z = Math.sin(danceTime) * Math.PI / 4;
            meshParts.rightArm.rotation.z = -Math.sin(danceTime) * Math.PI / 4;
            
            // Hip movement
            if (meshParts.torso) {
                meshParts.torso.rotation.z = Math.sin(danceTime * 2) * 0.1;
            }
        }
    }
    
    playWaveAnimation(character) {
        this.setAnimation('wave');
        
        // Waving animation
        const meshParts = this.characterAnimations.get('player_mesh');
        
        if (meshParts && meshParts.rightArm) {
            // Wave motion
            const waveTime = Date.now() * 0.01;
            meshParts.rightArm.rotation.z = -Math.PI / 2 + Math.sin(waveTime) * Math.PI / 6;
            meshParts.rightArm.rotation.x = Math.sin(waveTime * 2) * 0.2;
        }
        
        // Return to idle after wave
        setTimeout(() => {
            this.setAnimation('idle');
        }, 1000);
    }
    
    playSurrenderAnimation(character) {
        this.setAnimation('surrender');
        
        // Hands up animation
        const meshParts = this.characterAnimations.get('player_mesh');
        
        if (meshParts) {
            // Both arms up
            meshParts.leftArm.rotation.x = -Math.PI / 2;
            meshParts.rightArm.rotation.x = -Math.PI / 2;
            
            // Slight crouch
            if (meshParts.torso) {
                meshParts.torso.position.y = 1.3;
            }
        }
    }
    
    // Animation utilities
    getAnimationSpeed(animationName) {
        const animation = this.animationStates[animationName];
        return animation ? animation.speed : 1.0;
    }
    
    setAnimationSpeed(animationName, speed) {
        if (this.animationStates[animationName]) {
            this.animationStates[animationName].speed = speed;
        }
    }
    
    // Cleanup
    dispose() {
        // Clean up animation resources
        this.characterAnimations.clear();
        this.npcAnimations.clear();
        this.gangAnimations.clear();
        
        console.log('🎬 Character Animation System disposed');
    }
}

// Initialize animation system when game loads
window.addEventListener('load', () => {
    if (window.game) {
        window.game.characterAnimations = new CharacterAnimationSystem(window.game);
        
        // Add animation update to game loop
        const originalAnimate = window.game.animate;
        window.game.animate = function() {
            originalAnimate.call(this);
            if (this.characterAnimations) {
                this.characterAnimations.update(this.clock.getDelta());
            }
        };
        
        console.log('🎬 MegaCity6 Character Animation System loaded');
    }
});
