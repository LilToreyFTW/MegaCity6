// MEGACITY6 - ADVANCED CHARACTER ANIMATIONS & EMOTES SYSTEM
// 500+ character animations, emotes, sound effects, and VFX

class AdvancedAnimationSystem {
    constructor(game) {
        this.game = game;
        this.animations = new Map();
        this.emotes = new Map();
        this.soundEffects = new Map();
        this.vfxEffects = new Map();
        this.currentAnimation = null;
        this.animationMixer = null;
        this.isAnimating = false;
        this.emoteHistory = [];
        this.favoriteEmotes = [];
        
        console.log('🎭 Initializing Advanced Animation System...');
        
        this.initializeAllAnimations();
        this.initializeEmoteCategories();
        this.initializeSounds();
        this.initializeVFX();
    }
    
    // Initialize all 500+ animations
    initializeAllAnimations() {
        console.log('🎬 Loading 500+ animations...');
        
        // Movement Animations (50)
        this.createMovementAnimations();
        
        // Combat Animations (80)
        this.createCombatAnimations();
        
        // Social Animations (100)
        this.createSocialAnimations();
        
        // Dance Animations (60)
        this.createDanceAnimations();
        
        // Gesture Animations (80)
        this.createGestureAnimations();
        
        // Emotional Animations (60)
        this.createEmotionalAnimations();
        
        // Action Animations (70)
        this.createActionAnimations();
        
        // Idle Animations (40)
        this.createIdleAnimations();
        
        // Special Animations (30)
        this.createSpecialAnimations();
        
        // Vehicle Animations (30)
        this.createVehicleAnimations();
        
        console.log(`✅ Loaded ${this.animations.size} animations`);
    }
    
    // Movement Animations
    createMovementAnimations() {
        const movements = [
            'walk', 'run', 'sprint', 'jog', 'stroll', 'march', 'sneak', 'limp', 'crawl',
            'swim', 'fly', 'glide', 'hover', 'float', 'drift', 'slide', 'skate', 'roll',
            'backflip', 'frontflip', 'sideflip', 'wallrun', 'parkour', 'vault', 'climb',
            'jump', 'doublejump', 'triplejump', 'longjump', 'highjump', 'crouch', 'prone',
            'slide_tackle', 'dive', 'leap', 'bound', 'strafe', 'circle_strafe', 'zigzag',
            'moonwalk', 'grapevine', 'sidestep', 'backpedal', 'shuffle', 'skip', 'hop',
            'cartwheel', 'handspring', 'somersault', 'twirl', 'spin', 'pivot', 'turn',
            'dash', 'blink', 'teleport', 'phase', 'ghost_walk', 'shadow_walk', 'air_walk',
            'water_walk', 'ice_skate', 'snow_walk', 'mud_walk', 'sand_walk', 'rock_climb'
        ];
        
        movements.forEach(movement => {
            this.animations.set(movement, this.createAnimationData(movement, 'movement'));
        });
    }
    
    // Combat Animations
    createCombatAnimations() {
        const combat = [
            'punch', 'kick', 'uppercut', 'hook', 'jab', 'cross', 'elbow_strike', 'knee_strike',
            'roundhouse_kick', 'spinning_kick', 'flying_kick', 'dropkick', 'sweep', 'grapple',
            'throw', 'choke_slam', 'power_bomb', 'suplex', 'piledriver', 'DDT', 'RKO',
            'stone_cold_stunner', 'rock_bottom', 'F5', 'attitude_adjustment', 'AA', 'rko',
            'spear', 'clothesline', 'big_boot', 'leg_drop', 'elbow_drop', 'fist_drop',
            'sharshooter', 'figure_four', 'ankle_lock', 'arm_bar', 'kimura', 'guillotine',
            'triangle_choke', 'rear_naked_choke', 'omoplata', 'gogoplata', 'keylock',
            'headbutt', 'bite', 'scratch', 'claw_attack', 'tail_whip', 'wing_attack',
            'fire_breath', 'ice_blast', 'lightning_strike', 'earthquake', 'wind_slash',
            'water_jet', 'shadow_bolt', 'holy_light', 'dark_magic', 'heal_spell', 'buff_spell',
            'summon', 'teleport_spell', 'shield_block', 'parry', 'riposte', 'counter_attack',
            'dodge', 'roll_dodge', 'backflip_dodge', 'sidestep_dodge', 'block', 'guard_break',
            'critical_hit', 'finishing_move', 'ultimate_attack', 'special_move', 'combo_attack',
            'rapid_punches', 'machine_gun_kick', 'spin_attack', 'area_attack', 'laser_beam',
            'energy_blast', 'projectile_attack', 'melee_combo', 'weapon_draw', 'weapon_sheathe',
            'reload', 'aim', 'fire', 'throw_grenade', 'plant_bomb', 'defuse', 'hack',
            'stealth_kill', 'silent_takedown', 'brutal_kill', 'execution', 'fatality',
            'brutality', 'friendship', 'babality', 'animality', 'stage_fatal', 'test_your_might'
        ];
        
        combat.forEach(move => {
            this.animations.set(move, this.createAnimationData(move, 'combat'));
        });
    }
    
    // Social Animations
    createSocialAnimations() {
        const social = [
            'wave', 'handshake', 'hug', 'high_five', 'fist_bump', 'bro_fist', 'chest_bump',
            'salute', 'bow', 'curtsy', 'kneel', 'propose', 'kiss', 'blow_kiss', 'wink',
            'point', 'thumbs_up', 'thumbs_down', 'ok_sign', 'peace_sign', 'rock_sign',
            'paper_sign', 'scissors_sign', 'facepalm', 'headshake', 'nod', 'shrug',
            'face_desk', 'headdesk', 'palm_face', 'smh', 'lol', 'rofl', 'lmao', 'omg',
            'wow', 'ooh', 'ahh', 'eww', 'yuck', 'bleh', 'meh', 'meh_shrug', 'whatever',
            'okay', 'sure', 'maybe', 'nope', 'yes', 'no', 'idk', 'tbh', 'ngl', 'frfr',
            'bet', 'cap', 'no_cap', 'for_real', 'deadass', 'serious', 'joking', 'kidding',
            'sike', 'psych', 'gotcha', 'bamboozle', 'tricked', 'pranked', 'trolled',
            'flex', 'show_off', 'brag', 'humble', 'modest', 'shy', 'confident', 'arrogant',
            'cocky', 'humble_brag', 'humble_flex', 'quiet', 'loud', 'obnoxious', 'annoying',
            'charming', 'smooth', 'savage', 'roasted', 'burned', 'destroyed', 'rekt',
            'triggered', 'salty', 'salty_tears', 'crying', 'sobbing', 'weeping', 'bawling',
            'laughing', 'giggling', 'chuckling', 'snickering', 'guffawing', 'cackling',
            'smiling', 'grinning', 'beaming', 'smirking', 'frowning', 'pouting', 'glaring',
            'staring', 'gawking', 'peeking', 'sneaking_peek', 'hiding', 'exposed', 'caught',
            'busted', 'nailed', 'got_em', 'success', 'failure', 'try_again', 'give_up',
            'never_give_up', 'persevere', 'keep_going', 'stop', 'halt', 'freeze', 'stay',
            'come_here', 'go_away', 'leave', 'get_out', 'welcome', 'goodbye', 'farewell',
            'see_you', 'later', 'hello', 'hi', 'hey', 'yo', 'sup', 'what_up', 'howdy',
            'greetings', 'salutations', 'welcome_mat', 'red_carpet', 'royal_wave', 'president_wave'
        ];
        
        social.forEach(socialAnim => {
            this.animations.set(socialAnim, this.createAnimationData(socialAnim, 'social'));
        });
    }
    
    // Dance Animations
    createDanceAnimations() {
        const dances = [
            'dance', 'party_dance', 'club_dance', 'rave_dance', 'techno_dance', 'house_dance',
            'hip_hop_dance', 'breakdance', 'pop_lock', 'robot_dance', 'moonwalk', 'electric_slide',
            'macarena', 'floss', 'dab', 'whip', 'nae_nae', 'stanky_leg', 'orange_justice',
            'fresh', 'renegade', 'say_so', 'blinding_lights', 'savage_love', 'woah', 'git_up',
            'coi_leray', 'tiktok_dance', 'viral_dance', 'trending_dance', 'classic_dance',
            'waltz', 'tango', 'salsa', 'bachata', 'samba', 'rumba', 'cha_cha', 'swing',
            'jitterbug', 'charleston', 'foxtrot', 'quickstep', 'polka', 'square_dance',
            'line_dance', 'country_dance', 'western_dance', 'ballet', 'modern_dance', 'jazz',
            'contemporary', ' lyrical', 'tap_dance', 'irish_dance', 'scottish_dance', 'flamenco',
            'hula', 'belly_dance', 'bollywood', 'kpop_dance', 'jpop_dance', 'anime_dance',
            'idol_dance', 'cheerleader', 'pom_pom', 'marching_band', 'drum_major', 'conductor',
            'air_guitar', 'air_drums', 'air_piano', 'air_sax', 'air_violin', 'rock_star',
            'pop_star', 'rap_star', 'dj', 'mc', 'rapper', 'singer', 'performer', 'artist',
            'showtime', 'spotlight', 'center_stage', 'encore', 'curtain_call', 'bow_down',
            'take_a_bow', 'thank_you', 'applause', 'standing_ovation', 'bravo', 'encore'
        ];
        
        dances.forEach(dance => {
            this.animations.set(dance, this.createAnimationData(dance, 'dance'));
        });
    }
    
    // Gesture Animations
    createGestureAnimations() {
        const gestures = [
            'point_up', 'point_down', 'point_left', 'point_right', 'point_forward', 'point_back',
            'finger_gun', 'finger_heart', 'finger_cross', 'devil_horns', 'rock_on', 'shaka',
            'hang_loose', 'peace', 'victory', 'number_one', 'number_two', 'number_three',
            'number_four', 'number_five', 'number_ten', 'okay', 'thumbs_up', 'thumbs_down',
            'come_here', 'go_away', 'stop', 'go', 'yes', 'no', 'maybe', 'idk', 'whatever',
            'facepalm', 'headdesk', 'palm_face', 'smh', 'lol', 'rofl', 'lmao', 'omg',
            'wow', 'ooh', 'ahh', 'eww', 'yuck', 'bleh', 'meh', 'shrug', 'nod', 'headshake',
            'wink', 'blow_kiss', 'kiss', 'hug', 'handshake', 'high_five', 'fist_bump', 'bro_fist',
            'chest_bump', 'salute', 'bow', 'curtsy', 'kneel', 'pray', 'meditate', 'zen',
            'namaste', 'om', 'chant', 'mantra', 'focus', 'concentrate', 'think', 'ponder',
            'wonder', 'marvel', 'astonish', 'amaze', 'surprise', 'shock', 'gasp', 'faint',
            'dramatic', 'theatrical', 'melodramatic', 'over_the_top', 'extra', 'dramaqueen',
            'king', 'queen', 'royal', 'noble', 'peasant', 'commoner', 'citizen', 'resident',
            'tourist', 'visitor', 'guest', 'host', 'master', 'servant', 'leader', 'follower'
        ];
        
        gestures.forEach(gesture => {
            this.animations.set(gesture, this.createAnimationData(gesture, 'gesture'));
        });
    }
    
    // Emotional Animations
    createEmotionalAnimations() {
        const emotions = [
            'happy', 'sad', 'angry', 'excited', 'scared', 'surprised', 'confused', 'bored',
            'tired', 'energetic', 'calm', 'nervous', 'confident', 'shy', 'proud', 'embarrassed',
            'jealous', 'envious', 'greedy', 'generous', 'kind', 'mean', 'nice', 'rude',
            'polite', 'impolite', 'gentle', 'harsh', 'soft', 'hard', 'warm', 'cold',
            'hot', 'cool', 'mild', 'wild', 'tame', 'crazy', 'sane', 'normal', 'weird',
            'strange', 'odd', 'peculiar', 'unusual', 'typical', 'average', 'extraordinary',
            'special', 'ordinary', 'plain', 'fancy', 'simple', 'complex', 'easy', 'hard',
            'difficult', 'challenging', 'impossible', 'possible', 'likely', 'unlikely',
            'certain', 'uncertain', 'sure', 'unsure', 'doubtful', 'confident', 'hesitant',
            'brave', 'cowardly', 'fearless', 'fearful', 'bold', 'timid', 'aggressive',
            'passive', 'active', 'inactive', 'lazy', 'hardworking', 'diligent', 'careless',
            'careful', 'reckless', 'cautious', 'adventurous', 'conservative', 'liberal',
            'traditional', 'modern', 'old_fashioned', 'trendy', 'stylish', 'fashionable',
            'unfashionable', 'chic', 'elegant', 'classy', 'tacky', 'gaudy', 'tasteful'
        ];
        
        emotions.forEach(emotion => {
            this.animations.set(emotion, this.createAnimationData(emotion, 'emotional'));
        });
    }
    
    // Action Animations
    createActionAnimations() {
        const actions = [
            'eat', 'drink', 'sleep', 'work', 'play', 'study', 'read', 'write', 'draw', 'paint',
            'sing', 'dance', 'jump', 'run', 'walk', 'sit', 'stand', 'lie_down', 'kneel', 'squat',
            'stretch', 'exercise', 'workout', 'lift', 'push', 'pull', 'carry', 'hold', 'grab',
            'throw', 'catch', 'kick', 'punch', 'slap', 'hit', 'fight', 'argue', 'discuss', 'talk',
            'listen', 'watch', 'look', 'see', 'observe', 'inspect', 'examine', 'check', 'test',
            'try', 'attempt', 'succeed', 'fail', 'win', 'lose', 'compete', 'race', 'chase', 'flee',
            'hide', 'seek', 'find', 'search', 'explore', 'discover', 'invent', 'create', 'build',
            'destroy', 'break', 'fix', 'repair', 'clean', 'dirty', 'wash', 'dry', 'wet', 'moist',
            'soak', 'drown', 'swim', 'float', 'sink', 'fly', 'fall', 'rise', 'climb', 'descend',
            'ascend', 'drop', 'lift', 'lower', 'raise', 'boost', 'enhance', 'improve', 'worsen',
            'better', 'best', 'worst', 'good', 'bad', 'evil', 'good', 'neutral', 'balanced',
            'unbalanced', 'stable', 'unstable', 'steady', 'shaky', 'firm', 'soft', 'hard',
            'tough', 'weak', 'strong', 'powerful', 'helpless', 'mighty', 'feeble', 'robust',
            'fragile', 'durable', 'temporary', 'permanent', 'brief', 'long', 'short', 'tall'
        ];
        
        actions.forEach(action => {
            this.animations.set(action, this.createAnimationData(action, 'action'));
        });
    }
    
    // Idle Animations
    createIdleAnimations() {
        const idles = [
            'idle', 'stand', 'wait', 'patience', 'bored', 'tired', 'sleepy', 'drowsy',
            'alert', 'ready', 'prepared', 'unprepared', 'casual', 'formal', 'relaxed',
            'tense', 'stressed', 'calm', 'peaceful', 'agitated', 'restless', 'content',
            'discontent', 'satisfied', 'unsatisfied', 'pleased', 'displeased', 'happy',
            'unhappy', 'joyful', 'mournful', 'cheerful', 'somber', 'bright', 'dark',
            'light', 'heavy', 'empty', 'full', 'hungry', 'thirsty', 'satiated', 'starving',
            'dying', 'living', 'dead', 'alive', 'birth', 'death', 'beginning', 'end',
            'start', 'finish', 'complete', 'incomplete', 'whole', 'broken', 'fixed',
            'damaged', 'repaired', 'new', 'old', 'young', 'ancient', 'fresh', 'stale',
            'clean', 'dirty', 'pure', 'corrupt', 'holy', 'unholy', 'sacred', 'profane',
            'divine', 'mortal', 'immortal', 'human', 'inhuman', 'natural', 'unnatural',
            'real', 'fake', 'genuine', 'artificial', 'authentic', 'counterfeit', 'original',
            'copy', 'duplicate', 'unique', 'common', 'rare', 'scarce', 'abundant', 'plentiful'
        ];
        
        idles.forEach(idle => {
            this.animations.set(idle, this.createAnimationData(idle, 'idle'));
        });
    }
    
    // Special Animations
    createSpecialAnimations() {
        const specials = [
            'transform', 'morph', 'shape_shift', 'mutate', 'evolve', 'devolve', 'upgrade',
            'downgrade', 'level_up', 'level_down', 'power_up', 'power_down', 'buff', 'debuff',
            'heal', 'cure', 'poison', 'disease', 'infection', 'recovery', 'relapse', 'remission',
            'resurrection', 'reincarnation', 'ascension', 'descension', 'enlightenment',
            'awakening', 'sleep', 'coma', 'trance', 'hypnosis', 'mind_control', 'brainwash',
            'possession', 'exorcism', 'purification', 'corruption', 'redemption', 'damnation',
            'salvation', 'blessing', 'curse', 'hex', 'spell', 'incantation', 'ritual', 'ceremony',
            'sacrifice', 'offering', 'tribute', 'worship', 'idolatry', 'blasphemy', 'heresy',
            'orthodoxy', 'reformation', 'revolution', 'rebellion', 'uprising', 'insurrection',
            'coup', 'overthrow', 'usurp', 'abdicate', 'coronation', 'inauguration', 'installation',
            'dismissal', 'expulsion', 'exile', 'return', 'homecoming', 'departure', 'arrival',
            'farewell', 'reunion', 'separation', 'union', 'marriage', 'divorce', 'engagement',
            'betrayal', 'loyalty', 'treason', 'patriotism', 'nationalism', 'globalism', 'isolation'
        ];
        
        specials.forEach(special => {
            this.animations.set(special, this.createAnimationData(special, 'special'));
        });
    }
    
    // Vehicle Animations
    createVehicleAnimations() {
        const vehicles = [
            'drive', 'ride', 'pilot', 'fly', 'sail', 'row', 'paddle', 'pedal', 'steer',
            'accelerate', 'brake', 'reverse', 'park', 'crash', 'wreck', 'explode', 'burn',
            'repair', 'maintain', 'service', 'inspect', 'test', 'race', 'drift', 'spin',
            'donut', 'wheelie', 'stoppie', 'enduro', 'offroad', 'highway', 'city_driving',
            'country_driving', 'mountain_driving', 'desert_driving', 'winter_driving',
            'summer_driving', 'spring_driving', 'autumn_driving', 'night_driving',
            'day_driving', 'dawn_driving', 'dusk_driving', 'storm_driving', 'rain_driving',
            'snow_driving', 'ice_driving', 'mud_driving', 'rock_crawling', 'mudding',
            'off_roading', 'rally', 'circuit', 'drag_race', 'street_race', 'track_day',
            'cruising', 'joyride', 'road_trip', 'commute', 'travel', 'journey', 'adventure',
            'expedition', 'voyage', 'odyssey', 'quest', 'mission', 'operation', 'project'
        ];
        
        vehicles.forEach(vehicle => {
            this.animations.set(vehicle, this.createAnimationData(vehicle, 'vehicle'));
        });
    }
    
    // Create animation data structure
    createAnimationData(name, category) {
        return {
            name: name,
            category: category,
            duration: this.getAnimationDuration(name, category),
            priority: this.getAnimationPriority(name, category),
            loop: this.shouldLoop(name, category),
            transitions: this.getTransitions(name, category),
            requirements: this.getRequirements(name, category),
            soundEffects: this.getSoundEffects(name, category),
            vfxEffects: this.getVFXEffects(name, category),
            description: this.getDescription(name, category),
            prefix: this.getPrefix(name, category),
            unlockLevel: this.getUnlockLevel(name, category),
            rarity: this.getRarity(name, category),
            price: this.getPrice(name, category)
        };
    }
    
    // Get animation duration based on type
    getAnimationDuration(name, category) {
        const durations = {
            movement: 1.0,
            combat: 0.8,
            social: 1.2,
            dance: 2.0,
            gesture: 0.6,
            emotional: 1.5,
            action: 1.0,
            idle: 2.0,
            special: 3.0,
            vehicle: 1.5
        };
        
        return durations[category] || 1.0;
    }
    
    // Get animation priority
    getAnimationPriority(name, category) {
        const priorities = {
            movement: 5,
            combat: 10,
            social: 3,
            dance: 4,
            gesture: 2,
            emotional: 6,
            action: 7,
            idle: 1,
            special: 9,
            vehicle: 8
        };
        
        return priorities[category] || 5;
    }
    
    // Should animation loop
    shouldLoop(name, category) {
        const loopingCategories = ['idle', 'dance', 'movement'];
        const loopingAnimations = ['wave', 'dance', 'party_dance', 'meditate', 'zen'];
        
        return loopingCategories.includes(category) || loopingAnimations.includes(name);
    }
    
    // Get transitions
    getTransitions(name, category) {
        return {
            from: ['idle', 'stand', 'wait'],
            to: ['idle', 'stand', 'wait'],
            blendTime: 0.2
        };
    }
    
    // Get requirements
    getRequirements(name, category) {
        const requirements = {
            combat: ['weapon_equipped'],
            vehicle: ['in_vehicle'],
            dance: ['standing'],
            special: ['level_10', 'special_unlock']
        };
        
        return requirements[category] || [];
    }
    
    // Get sound effects
    getSoundEffects(name, category) {
        const sounds = {
            combat: ['punch', 'kick', 'hit'],
            dance: ['music', 'beat'],
            social: ['greeting', 'farewell'],
            movement: ['footstep', 'breathing'],
            special: ['magic', 'power_up']
        };
        
        return sounds[category] || [];
    }
    
    // Get VFX effects
    getVFXEffects(name, category) {
        const vfx = {
            combat: ['impact', 'blood', 'sparks'],
            dance: ['notes', 'disco_lights'],
            social: ['hearts', 'sparkles'],
            special: ['aura', 'particles', 'glow'],
            movement: ['dust', 'trails']
        };
        
        return vfx[category] || [];
    }
    
    // Get description
    getDescription(name, category) {
        const descriptions = {
            wave: "Friendly greeting gesture",
            punch: "Basic combat attack",
            dance: "Groovy dance moves",
            happy: "Show joy and happiness",
            run: "Quick movement",
            idle: "Resting stance"
        };
        
        return descriptions[name] || `${name} animation`;
    }
    
    // Get prefix
    getPrefix(name, category) {
        const prefixes = {
            combat: ['⚔️', '🗡️', '💥'],
            dance: ['🎵', '💃', '🕺'],
            social: ['👋', '🤝', '❤️'],
            movement: ['🏃', '🚶', '🤸'],
            special: ['✨', '🌟', '💫'],
            emotional: ['😊', '😢', '😠'],
            gesture: ['👍', '👎', '🤘'],
            action: ['⚡', '🔥', '❄️'],
            idle: ['😌', '🧘', '😴'],
            vehicle: ['🚗', '🏍️', '✈️']
        };
        
        const categoryPrefixes = prefixes[category] || ['🎭'];
        return categoryPrefixes[Math.floor(Math.random() * categoryPrefixes.length)];
    }
    
    // Get unlock level
    getUnlockLevel(name, category) {
        const levels = {
            movement: 1,
            social: 1,
            gesture: 1,
            idle: 1,
            emotional: 2,
            action: 3,
            dance: 5,
            combat: 7,
            special: 10,
            vehicle: 4
        };
        
        return levels[category] || 1;
    }
    
    // Get rarity
    getRarity(name, category) {
        const rarities = {
            movement: 'common',
            social: 'common',
            gesture: 'common',
            idle: 'common',
            emotional: 'uncommon',
            action: 'uncommon',
            dance: 'rare',
            combat: 'rare',
            special: 'legendary',
            vehicle: 'epic'
        };
        
        return rarities[category] || 'common';
    }
    
    // Get price
    getPrice(name, category) {
        const prices = {
            common: 100,
            uncommon: 500,
            rare: 2000,
            epic: 5000,
            legendary: 10000
        };
        
        const rarity = this.getRarity(name, category);
        return prices[rarity] || 100;
    }
    
    // Initialize emote categories
    initializeEmoteCategories() {
        this.emoteCategories = {
            favorites: {
                name: 'Favorites',
                icon: '⭐',
                emotes: []
            },
            recent: {
                name: 'Recent',
                icon: '🕐',
                emotes: []
            },
            movement: {
                name: 'Movement',
                icon: '🏃',
                emotes: this.getEmotesByCategory('movement')
            },
            combat: {
                name: 'Combat',
                icon: '⚔️',
                emotes: this.getEmotesByCategory('combat')
            },
            social: {
                name: 'Social',
                icon: '👋',
                emotes: this.getEmotesByCategory('social')
            },
            dance: {
                name: 'Dance',
                icon: '💃',
                emotes: this.getEmotesByCategory('dance')
            },
            gesture: {
                name: 'Gestures',
                icon: '🤘',
                emotes: this.getEmotesByCategory('gesture')
            },
            emotional: {
                name: 'Emotions',
                icon: '😊',
                emotes: this.getEmotesByCategory('emotional')
            },
            action: {
                name: 'Actions',
                icon: '⚡',
                emotes: this.getEmotesByCategory('action')
            },
            idle: {
                name: 'Idle',
                icon: '😌',
                emotes: this.getEmotesByCategory('idle')
            },
            special: {
                name: 'Special',
                icon: '✨',
                emotes: this.getEmotesByCategory('special')
            },
            vehicle: {
                name: 'Vehicle',
                icon: '🚗',
                emotes: this.getEmotesByCategory('vehicle')
            }
        };
    }
    
    // Get emotes by category
    getEmotesByCategory(category) {
        const emotes = [];
        this.animations.forEach((animation, name) => {
            if (animation.category === category) {
                emotes.push({
                    name: name,
                    prefix: animation.prefix,
                    description: animation.description,
                    rarity: animation.rarity,
                    price: animation.price,
                    unlockLevel: animation.unlockLevel,
                    duration: animation.duration,
                    soundEffects: animation.soundEffects,
                    vfxEffects: animation.vfxEffects
                });
            }
        });
        
        return emotes.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    // Initialize sound effects
    initializeSounds() {
        console.log('🔊 Initializing emote sound effects...');
        
        // Create sound effects for different emote types
        this.soundEffects.set('social', this.createSocialSounds());
        this.soundEffects.set('combat', this.createCombatSounds());
        this.soundEffects.set('dance', this.createDanceSounds());
        this.soundEffects.set('special', this.createSpecialSounds());
        this.soundEffects.set('movement', this.createMovementSounds());
        this.soundEffects.set('emotional', this.createEmotionalSounds());
        
        console.log(`✅ Created ${this.soundEffects.size} sound effect categories`);
    }
    
    // Create social sounds
    createSocialSounds() {
        return {
            wave: this.generateSound('wave', 0.3, 800),
            handshake: this.generateSound('handshake', 0.2, 400),
            hug: this.generateSound('hug', 0.4, 200),
            high_five: this.generateSound('high_five', 0.5, 1000),
            laugh: this.generateSound('laugh', 0.6, 600),
            giggle: this.generateSound('giggle', 0.4, 1200),
            cheer: this.generateSound('cheer', 0.7, 500),
            applause: this.generateSound('applause', 0.8, 300)
        };
    }
    
    // Create combat sounds
    createCombatSounds() {
        return {
            punch: this.generateSound('punch', 0.8, 200),
            kick: this.generateSound('kick', 0.9, 150),
            hit: this.generateSound('hit', 0.7, 300),
            block: this.generateSound('block', 0.5, 400),
            dodge: this.generateSound('dodge', 0.3, 800),
            power_up: this.generateSound('power_up', 0.6, 1000),
            special_move: this.generateSound('special_move', 0.9, 600),
            ultimate_attack: this.generateSound('ultimate_attack', 1.0, 200)
        };
    }
    
    // Create dance sounds
    createDanceSounds() {
        return {
            beat: this.generateSound('beat', 0.5, 120),
            music: this.generateSound('music', 0.6, 440),
            disco: this.generateSound('disco', 0.7, 880),
            techno: this.generateSound('techno', 0.6, 220),
            bass: this.generateSound('bass', 0.8, 80),
            synth: this.generateSound('synth', 0.5, 660),
            drop: this.generateSound('drop', 0.9, 100),
            build_up: this.generateSound('build_up', 0.4, 330)
        };
    }
    
    // Create special sounds
    createSpecialSounds() {
        return {
            magic: this.generateSound('magic', 0.8, 1500),
            power_up: this.generateSound('power_up', 0.7, 1000),
            transform: this.generateSound('transform', 0.9, 600),
            level_up: this.generateSound('level_up', 1.0, 800),
            achievement: this.generateSound('achievement', 0.8, 1200),
            unlock: this.generateSound('unlock', 0.6, 400),
            aura: this.generateSound('aura', 0.5, 200),
            glow: this.generateSound('glow', 0.4, 300)
        };
    }
    
    // Create movement sounds
    createMovementSounds() {
        return {
            footstep: this.generateSound('footstep', 0.3, 200),
            run: this.generateSound('run', 0.4, 300),
            jump: this.generateSound('jump', 0.5, 400),
            land: this.generateSound('land', 0.6, 150),
            slide: this.generateSound('slide', 0.4, 800),
            dash: this.generateSound('dash', 0.7, 1000),
            teleport: this.generateSound('teleport', 0.8, 2000),
            dodge: this.generateSound('dodge', 0.3, 1200)
        };
    }
    
    // Create emotional sounds
    createEmotionalSounds() {
        return {
            laugh: this.generateSound('laugh', 0.6, 600),
            cry: this.generateSound('cry', 0.5, 400),
            sigh: this.generateSound('sigh', 0.3, 300),
            gasp: this.generateSound('gasp', 0.4, 800),
            cheer: this.generateSound('cheer', 0.7, 500),
            boo: this.generateSound('boo', 0.5, 200),
            awe: this.generateSound('awe', 0.6, 150),
            anger: this.generateSound('anger', 0.8, 100)
        };
    }
    
    // Generate sound
    generateSound(type, volume, frequency) {
        const duration = 0.5;
        const sampleRate = 44100;
        const buffer = new AudioBuffer({ length: duration * sampleRate, sampleRate });
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            let sample = 0;
            
            switch (type) {
                case 'wave':
                    sample = Math.sin(2 * Math.PI * frequency * t) * 0.3;
                    break;
                case 'handshake':
                    sample = (Math.random() - 0.5) * 0.5;
                    break;
                case 'punch':
                    sample = (Math.random() - 0.5) * 0.9 * Math.exp(-t * 20);
                    break;
                case 'magic':
                    sample = Math.sin(2 * Math.PI * frequency * t) * Math.sin(t * 10) * 0.5;
                    break;
                default:
                    sample = Math.sin(2 * Math.PI * frequency * t) * 0.5;
            }
            
            data[i] = sample * volume * Math.exp(-t * 2);
        }
        
        return buffer;
    }
    
    // Initialize VFX effects
    initializeVFX() {
        console.log('✨ Initializing VFX effects...');
        
        this.vfxEffects.set('social', this.createSocialVFX());
        this.vfxEffects.set('combat', this.createCombatVFX());
        this.vfxEffects.set('dance', this.createDanceVFX());
        this.vfxEffects.set('special', this.createSpecialVFX());
        this.vfxEffects.set('movement', this.createMovementVFX());
        this.vfxEffects.set('emotional', this.createEmotionalVFX());
        
        console.log(`✅ Created ${this.vfxEffects.size} VFX effect categories`);
    }
    
    // Create social VFX
    createSocialVFX() {
        return {
            hearts: this.createParticleEffect('hearts', '❤️', 0.1),
            sparkles: this.createParticleEffect('sparkles', '✨', 0.05),
            notes: this.createParticleEffect('notes', '🎵', 0.08),
            stars: this.createParticleEffect('stars', '⭐', 0.06),
            confetti: this.createParticleEffect('confetti', '🎊', 0.04)
        };
    }
    
    // Create combat VFX
    createCombatVFX() {
        return {
            impact: this.createImpactEffect(),
            blood: this.createParticleEffect('blood', '🩸', 0.1),
            sparks: this.createParticleEffect('sparks', '⚡', 0.05),
            fire: this.createParticleEffect('fire', '🔥', 0.08),
            ice: this.createParticleEffect('ice', '❄️', 0.06),
            shockwave: this.createShockwaveEffect(),
            slash: this.createSlashEffect()
        };
    }
    
    // Create dance VFX
    createDanceVFX() {
        return {
            disco_lights: this.createDiscoLights(),
            dance_floor: this.createDanceFloor(),
            spotlights: this.createSpotlights(),
            smoke: this.createSmokeEffect(),
            lasers: this.createLaserEffect(),
            strobe: this.createStrobeEffect()
        };
    }
    
    // Create special VFX
    createSpecialVFX() {
        return {
            aura: this.createAuraEffect(),
            glow: this.createGlowEffect(),
            particles: this.createParticleEffect('particles', '✨', 0.05),
            teleport: this.createTeleportEffect(),
            transform: this.createTransformEffect(),
            power_up: this.createPowerUpEffect()
        };
    }
    
    // Create movement VFX
    createMovementVFX() {
        return {
            dust: this.createDustEffect(),
            trails: this.createTrailEffect(),
            speed_lines: this.createSpeedLines(),
            wind: this.createWindEffect(),
            splash: this.createSplashEffect(),
            footprints: this.createFootprintEffect()
        };
    }
    
    // Create emotional VFX
    createEmotionalVFX() {
        return {
            tears: this.createParticleEffect('tears', '💧', 0.03),
            anger: this.createParticleEffect('anger', '🔥', 0.08),
            joy: this.createParticleEffect('joy', '✨', 0.06),
            love: this.createParticleEffect('love', '❤️', 0.07),
            fear: this.createParticleEffect('fear', '💀', 0.05),
            sweat: this.createParticleEffect('sweat', '💧', 0.02)
        };
    }
    
    // Create particle effect
    createParticleEffect(name, emoji, size) {
        return {
            name: name,
            type: 'particle',
            emoji: emoji,
            size: size,
            count: 20,
            lifetime: 2.0,
            speed: 0.5,
            spread: 0.3,
            gravity: -0.1,
            color: this.getRandomColor()
        };
    }
    
    // Create impact effect
    createImpactEffect() {
        return {
            name: 'impact',
            type: 'impact',
            size: 0.2,
            duration: 0.3,
            color: 0xff0000,
            intensity: 1.0,
            shockwave: true
        };
    }
    
    // Create shockwave effect
    createShockwaveEffect() {
        return {
            name: 'shockwave',
            type: 'shockwave',
            radius: 2.0,
            speed: 5.0,
            duration: 0.5,
            color: 0xffffff,
            intensity: 0.8
        };
    }
    
    // Create slash effect
    createSlashEffect() {
        return {
            name: 'slash',
            type: 'slash',
            length: 1.5,
            duration: 0.2,
            color: 0xffff00,
            intensity: 1.0,
            trail: true
        };
    }
    
    // Create disco lights
    createDiscoLights() {
        return {
            name: 'disco_lights',
            type: 'lighting',
            colors: [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff],
            speed: 2.0,
            intensity: 0.8,
            rotation: true
        };
    }
    
    // Create dance floor
    createDanceFloor() {
        return {
            name: 'dance_floor',
            type: 'surface',
            size: 5.0,
            pattern: 'tiles',
            colors: [0x000000, 0x444444],
            glow: true,
            reflective: true
        };
    }
    
    // Create spotlights
    createSpotlights() {
        return {
            name: 'spotlights',
            type: 'lighting',
            count: 4,
            intensity: 0.7,
            movement: true,
            colors: [0xffffff, 0xff0000, 0x00ff00, 0x0000ff]
        };
    }
    
    // Create smoke effect
    createSmokeEffect() {
        return {
            name: 'smoke',
            type: 'particle',
            size: 0.3,
            count: 50,
            lifetime: 3.0,
            color: 0x888888,
            opacity: 0.6,
            rise: true
        };
    }
    
    // Create laser effect
    createLaserEffect() {
        return {
            name: 'lasers',
            type: 'beam',
            count: 8,
            length: 10.0,
            width: 0.05,
            colors: [0xff0000, 0x00ff00, 0x0000ff],
            speed: 3.0,
            rotation: true
        };
    }
    
    // Create strobe effect
    createStrobeEffect() {
        return {
            name: 'strobe',
            type: 'lighting',
            frequency: 10.0,
            duration: 0.1,
            color: 0xffffff,
            intensity: 1.0
        };
    }
    
    // Create aura effect
    createAuraEffect() {
        return {
            name: 'aura',
            type: 'aura',
            radius: 1.0,
            intensity: 0.5,
            color: this.getRandomColor(),
            rotation: true,
            pulsing: true
        };
    }
    
    // Create glow effect
    createGlowEffect() {
        return {
            name: 'glow',
            type: 'glow',
            intensity: 0.7,
            color: this.getRandomColor(),
            radius: 0.5,
            pulsing: false
        };
    }
    
    // Create teleport effect
    createTeleportEffect() {
        return {
            name: 'teleport',
            type: 'teleport',
            duration: 1.0,
            particles: true,
            distortion: true,
            color: 0x00ffff,
            sound: 'teleport'
        };
    }
    
    // Create transform effect
    createTransformEffect() {
        return {
            name: 'transform',
            type: 'transform',
            duration: 2.0,
            particles: true,
            glow: true,
            morph: true,
            color: 0xff00ff
        };
    }
    
    // Create power-up effect
    createPowerUpEffect() {
        return {
            name: 'power_up',
            type: 'power_up',
            duration: 1.5,
            particles: true,
            glow: true,
            scale: true,
            color: 0xffff00
        };
    }
    
    // Create dust effect
    createDustEffect() {
        return {
            name: 'dust',
            type: 'particle',
            size: 0.1,
            count: 30,
            lifetime: 1.0,
            color: 0x8b7355,
            opacity: 0.4,
            settle: true
        };
    }
    
    // Create trail effect
    createTrailEffect() {
        return {
            name: 'trail',
            type: 'trail',
            duration: 0.5,
            color: this.getRandomColor(),
            opacity: 0.6,
            width: 0.1
        };
    }
    
    // Create speed lines
    createSpeedLines() {
        return {
            name: 'speed_lines',
            type: 'lines',
            count: 20,
            length: 2.0,
            speed: 10.0,
            color: 0xffffff,
            opacity: 0.7
        };
    }
    
    // Create wind effect
    createWindEffect() {
        return {
            name: 'wind',
            type: 'particle',
            size: 0.05,
            count: 100,
            lifetime: 2.0,
            color: 0xffffff,
            opacity: 0.3,
            direction: true
        };
    }
    
    // Create splash effect
    createSplashEffect() {
        return {
            name: 'splash',
            type: 'splash',
            size: 1.0,
            particles: 50,
            color: 0x4682b4,
            lifetime: 1.5,
            gravity: true
        };
    }
    
    // Create footprint effect
    createFootprintEffect() {
        return {
            name: 'footprints',
            type: 'footprint',
            size: 0.3,
            lifetime: 10.0,
            color: 0x333333,
            opacity: 0.5
        };
    }
    
    // Get random color
    getRandomColor() {
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    // Play emote
    playEmote(emoteName, character) {
        const animation = this.animations.get(emoteName);
        if (!animation) {
            console.warn(`Emote not found: ${emoteName}`);
            return false;
        }
        
        // Check requirements
        if (!this.checkRequirements(animation.requirements)) {
            console.warn(`Requirements not met for emote: ${emoteName}`);
            return false;
        }
        
        // Play animation
        this.playAnimation(animation, character);
        
        // Play sound effects
        this.playSoundEffects(animation.soundEffects);
        
        // Play VFX effects
        this.playVFXEffects(animation.vfxEffects, character);
        
        // Add to recent emotes
        this.addToRecent(emoteName);
        
        // Update animation state
        this.currentAnimation = animation;
        this.isAnimating = true;
        
        console.log(`🎭 Playing emote: ${emoteName}`);
        return true;
    }
    
    // Check requirements
    checkRequirements(requirements) {
        // Simple requirement check - can be expanded
        return requirements.length === 0;
    }
    
    // Play animation
    playAnimation(animation, character) {
        if (!character) return;
        
        // Create animation timeline
        const timeline = {
            duration: animation.duration,
            loop: animation.loop,
            name: animation.name,
            startTime: Date.now()
        };
        
        // Apply animation to character
        this.applyAnimationToCharacter(animation, character, timeline);
        
        // Handle animation completion
        if (!animation.loop) {
            setTimeout(() => {
                this.isAnimating = false;
                this.currentAnimation = null;
            }, animation.duration * 1000);
        }
    }
    
    // Apply animation to character
    applyAnimationToCharacter(animation, character, timeline) {
        // This would integrate with the character's animation system
        // For now, we'll simulate the animation
        
        const elapsed = (Date.now() - timeline.startTime) / 1000;
        const progress = Math.min(elapsed / animation.duration, 1.0);
        
        // Apply animation based on type
        switch (animation.category) {
            case 'social':
                this.applySocialAnimation(animation, character, progress);
                break;
            case 'dance':
                this.applyDanceAnimation(animation, character, progress);
                break;
            case 'combat':
                this.applyCombatAnimation(animation, character, progress);
                break;
            case 'emotional':
                this.applyEmotionalAnimation(animation, character, progress);
                break;
            default:
                this.applyGenericAnimation(animation, character, progress);
        }
    }
    
    // Apply social animation
    applySocialAnimation(animation, character, progress) {
        // Implement social animation logic
        if (animation.name === 'wave') {
            // Wave animation
            const waveAngle = Math.sin(progress * Math.PI * 4) * 0.5;
            if (character.rightArm) {
                character.rightArm.rotation.z = -0.2 + waveAngle;
            }
        } else if (animation.name === 'dance') {
            // Dance animation
            const bounce = Math.sin(progress * Math.PI * 8) * 0.1;
            if (character.characterGroup) {
                character.characterGroup.position.y = 1 + bounce;
            }
        }
    }
    
    // Apply dance animation
    applyDanceAnimation(animation, character, progress) {
        // Implement dance animation logic
        const danceMove = Math.sin(progress * Math.PI * 6);
        const bodyBounce = Math.abs(Math.sin(progress * Math.PI * 4)) * 0.15;
        
        if (character.characterBody) {
            character.characterBody.position.y = 0.6 + bodyBounce;
        }
        
        // Arm movements
        if (character.leftArm && character.rightArm) {
            character.leftArm.rotation.x = danceMove * 0.8;
            character.rightArm.rotation.x = -danceMove * 0.8;
        }
    }
    
    // Apply combat animation
    applyCombatAnimation(animation, character, progress) {
        // Implement combat animation logic
        if (animation.name === 'punch') {
            const punchExtension = Math.sin(progress * Math.PI) * 0.8;
            if (character.rightArm) {
                character.rightArm.rotation.z = -0.2 - punchExtension;
            }
        } else if (animation.name === 'kick') {
            const kickExtension = Math.sin(progress * Math.PI) * 0.6;
            if (character.rightLeg) {
                character.rightLeg.rotation.x = kickExtension;
            }
        }
    }
    
    // Apply emotional animation
    applyEmotionalAnimation(animation, character, progress) {
        // Implement emotional animation logic
        if (animation.name === 'happy') {
            const smileAmount = Math.sin(progress * Math.PI * 2) * 0.1;
            if (character.characterHead) {
                character.characterHead.position.y = 1.6 + smileAmount;
            }
        } else if (animation.name === 'sad') {
            const droopAmount = Math.sin(progress * Math.PI) * 0.2;
            if (character.characterHead) {
                character.characterHead.rotation.x = droopAmount;
            }
        }
    }
    
    // Apply generic animation
    applyGenericAnimation(animation, character, progress) {
        // Generic animation fallback
        const bobAmount = Math.sin(progress * Math.PI * 2) * 0.05;
        if (character.characterGroup) {
            character.characterGroup.position.y = 1 + bobAmount;
        }
    }
    
    // Play sound effects
    playSoundEffects(soundEffects) {
        soundEffects.forEach(soundName => {
            const sound = this.soundEffects.get(soundName);
            if (sound && sound[soundName]) {
                this.playSound(sound[soundName]);
            }
        });
    }
    
    // Play sound
    playSound(audioBuffer) {
        if (!this.game.audioContext) return;
        
        const source = this.game.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.game.audioContext.destination);
        source.start(0);
    }
    
    // Play VFX effects
    playVFXEffects(vfxEffects, character) {
        vfxEffects.forEach(vfxName => {
            const vfx = this.vfxEffects.get(vfxName);
            if (vfx && vfx[vfxName]) {
                this.createVFX(vfx[vfxName], character);
            }
        });
    }
    
    // Create VFX
    createVFX(vfxConfig, character) {
        // Create visual effect based on configuration
        const vfx = {
            type: vfxConfig.type,
            position: character.position.clone(),
            config: vfxConfig,
            startTime: Date.now(),
            duration: vfxConfig.duration || 2.0
        };
        
        // Add to active VFX
        if (!this.activeVFX) {
            this.activeVFX = [];
        }
        this.activeVFX.push(vfx);
        
        // Clean up after duration
        setTimeout(() => {
            const index = this.activeVFX.indexOf(vfx);
            if (index > -1) {
                this.activeVFX.splice(index, 1);
            }
        }, vfx.duration * 1000);
    }
    
    // Add to recent emotes
    addToRecent(emoteName) {
        // Remove from recent if already exists
        const index = this.emoteHistory.indexOf(emoteName);
        if (index > -1) {
            this.emoteHistory.splice(index, 1);
        }
        
        // Add to beginning
        this.emoteHistory.unshift(emoteName);
        
        // Keep only last 10
        if (this.emoteHistory.length > 10) {
            this.emoteHistory.pop();
        }
        
        // Update recent category
        this.emoteCategories.recent.emotes = this.getRecentEmotes();
    }
    
    // Get recent emotes
    getRecentEmotes() {
        return this.emoteHistory.map(name => {
            const animation = this.animations.get(name);
            return {
                name: name,
                prefix: animation.prefix,
                description: animation.description,
                rarity: animation.rarity
            };
        });
    }
    
    // Add to favorites
    addToFavorites(emoteName) {
        if (!this.favoriteEmotes.includes(emoteName)) {
            this.favoriteEmotes.push(emoteName);
            this.emoteCategories.favorites.emotes = this.getFavoriteEmotes();
        }
    }
    
    // Remove from favorites
    removeFromFavorites(emoteName) {
        const index = this.favoriteEmotes.indexOf(emoteName);
        if (index > -1) {
            this.favoriteEmotes.splice(index, 1);
            this.emoteCategories.favorites.emotes = this.getFavoriteEmotes();
        }
    }
    
    // Get favorite emotes
    getFavoriteEmotes() {
        return this.favoriteEmotes.map(name => {
            const animation = this.animations.get(name);
            return {
                name: name,
                prefix: animation.prefix,
                description: animation.description,
                rarity: animation.rarity
            };
        });
    }
    
    // Search emotes
    searchEmotes(query) {
        const results = [];
        const lowerQuery = query.toLowerCase();
        
        this.animations.forEach((animation, name) => {
            if (name.toLowerCase().includes(lowerQuery) ||
                animation.description.toLowerCase().includes(lowerQuery)) {
                results.push({
                    name: name,
                    prefix: animation.prefix,
                    description: animation.description,
                    category: animation.category,
                    rarity: animation.rarity,
                    price: animation.price
                });
            }
        });
        
        return results;
    }
    
    // Get emote statistics
    getEmoteStats() {
        const stats = {
            total: this.animations.size,
            categories: Object.keys(this.emoteCategories).length,
            favorites: this.favoriteEmotes.length,
            recent: this.emoteHistory.length,
            byCategory: {},
            byRarity: {
                common: 0,
                uncommon: 0,
                rare: 0,
                epic: 0,
                legendary: 0
            }
        };
        
        // Count by category and rarity
        this.animations.forEach((animation) => {
            if (!stats.byCategory[animation.category]) {
                stats.byCategory[animation.category] = 0;
            }
            stats.byCategory[animation.category]++;
            stats.byRarity[animation.rarity]++;
        });
        
        return stats;
    }
    
    // Get all emotes for menu
    getAllEmotesForMenu() {
        const allEmotes = [];
        
        Object.keys(this.emoteCategories).forEach(categoryKey => {
            const category = this.emoteCategories[categoryKey];
            category.emotes.forEach(emote => {
                allEmotes.push({
                    ...emote,
                    category: categoryKey,
                    categoryName: category.name,
                    categoryIcon: category.icon
                });
            });
        });
        
        return allEmotes;
    }
}

// Export for use in game
if (typeof window !== 'undefined') {
    window.AdvancedAnimationSystem = AdvancedAnimationSystem;
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdvancedAnimationSystem;
}