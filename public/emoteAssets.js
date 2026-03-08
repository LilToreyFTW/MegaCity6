// MEGACITY6 - EMOTE ASSETS GENERATOR
// Generates all images, clips, videos, and visual assets for emotes

class EmoteAssetsGenerator {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.assets = new Map();
        this.videoAssets = new Map();
        this.imageAssets = new Map();
        this.clipAssets = new Map();
        
        console.log('🎨 Initializing Emote Assets Generator...');
        
        this.initializeCanvas();
        this.generateAllAssets();
    }
    
    // Initialize canvas for asset generation
    initializeCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.width = 256;
        this.canvas.height = 256;
        this.ctx = this.canvas.getContext('2d');
    }
    
    // Generate all assets
    generateAllAssets() {
        console.log('🎬 Generating all emote assets...');
        
        // Generate emoji-style icons
        this.generateEmojiIcons();
        
        // Generate animated sprites
        this.generateAnimatedSprites();
        
        // Generate video clips
        this.generateVideoClips();
        
        // Generate thumbnails
        this.generateThumbnails();
        
        // Generate preview videos
        this.generatePreviewVideos();
        
        // Generate particle effects
        this.generateParticleEffects();
        
        // Generate UI elements
        this.generateUIElements();
        
        console.log(`✅ Generated ${this.assets.size} emote assets`);
    }
    
    // Generate emoji-style icons
    generateEmojiIcons() {
        const icons = [
            // Social
            'wave', 'handshake', 'hug', 'high_five', 'fist_bump', 'thumbs_up', 'thumbs_down',
            'peace_sign', 'rock_on', 'ok_sign', 'heart', 'broken_heart', 'kiss', 'wink',
            
            // Combat
            'punch', 'kick', 'sword', 'shield', 'explosion', 'fire', 'lightning', 'ice',
            'poison', 'heal', 'power_up', 'level_up', 'trophy', 'medal', 'crown',
            
            // Dance
            'music_note', 'disco_ball', 'speaker', 'headphones', 'microphone', 'guitar',
            'piano', 'drums', 'dance_floor', 'spotlight', 'confetti', 'balloons',
            
            // Movement
            'running', 'jumping', 'flying', 'swimming', 'cycling', 'driving', 'skateboarding',
            'climbing', 'swinging', 'sliding', 'rolling', 'spinning', 'teleport',
            
            // Emotions
            'happy', 'sad', 'angry', 'surprised', 'scared', 'love', 'hate', 'confused',
            'excited', 'bored', 'tired', 'energetic', 'calm', 'nervous', 'proud',
            
            // Special
            'magic', 'aura', 'glow', 'sparkle', 'star', 'moon', 'sun', 'rainbow',
            'crystal', 'gem', 'potion', 'spell_book', 'wand', 'crystal_ball',
            
            // Actions
            'eat', 'drink', 'sleep', 'work', 'study', 'read', 'write', 'draw',
            'paint', 'sing', 'play', 'exercise', 'meditate', 'pray', 'think',
            
            // Vehicle
            'car', 'motorcycle', 'bicycle', 'airplane', 'helicopter', 'boat', 'train',
            'bus', 'truck', 'rocket', 'spaceship', 'tank', 'submarine', 'hovercraft'
        ];
        
        icons.forEach(iconName => {
            const iconData = this.generateIcon(iconName);
            this.imageAssets.set(iconName, iconData);
        });
    }
    
    // Generate individual icon
    generateIcon(iconName) {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Set background
        this.ctx.fillStyle = this.getIconBackground(iconName);
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw icon based on type
        this.drawIcon(iconName);
        
        // Add effects
        this.addIconEffects(iconName);
        
        // Convert to data URL
        return this.canvas.toDataURL('image/png');
    }
    
    // Get icon background color
    getIconBackground(iconName) {
        const backgrounds = {
            social: '#4CAF50',
            combat: '#F44336',
            dance: '#9C27B0',
            movement: '#2196F3',
            emotional: '#FF9800',
            special: '#E91E63',
            action: '#607D8B',
            vehicle: '#795548'
        };
        
        const category = this.getIconCategory(iconName);
        return backgrounds[category] || '#333333';
    }
    
    // Get icon category
    getIconCategory(iconName) {
        const social = ['wave', 'handshake', 'hug', 'high_five', 'fist_bump', 'thumbs_up', 'peace_sign'];
        const combat = ['punch', 'kick', 'sword', 'shield', 'explosion', 'fire'];
        const dance = ['music_note', 'disco_ball', 'speaker', 'dance_floor'];
        const movement = ['running', 'jumping', 'flying', 'swimming', 'car'];
        const emotional = ['happy', 'sad', 'angry', 'surprised', 'love'];
        const special = ['magic', 'aura', 'glow', 'sparkle', 'star'];
        const action = ['eat', 'drink', 'sleep', 'work', 'study'];
        const vehicle = ['car', 'motorcycle', 'airplane', 'boat'];
        
        if (social.some(s => iconName.includes(s))) return 'social';
        if (combat.some(c => iconName.includes(c))) return 'combat';
        if (dance.some(d => iconName.includes(d))) return 'dance';
        if (movement.some(m => iconName.includes(m))) return 'movement';
        if (emotional.some(e => iconName.includes(e))) return 'emotional';
        if (special.some(s => iconName.includes(s))) return 'special';
        if (action.some(a => iconName.includes(a))) return 'action';
        if (vehicle.some(v => iconName.includes(v))) return 'vehicle';
        
        return 'social';
    }
    
    // Draw icon
    drawIcon(iconName) {
        this.ctx.save();
        
        // Set drawing style
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 3;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        // Center coordinates
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        
        // Draw specific icon
        switch (iconName) {
            case 'wave':
                this.drawWave(cx, cy);
                break;
            case 'punch':
                this.drawPunch(cx, cy);
                break;
            case 'dance':
                this.drawDance(cx, cy);
                break;
            case 'happy':
                this.drawHappy(cx, cy);
                break;
            case 'magic':
                this.drawMagic(cx, cy);
                break;
            case 'heart':
                this.drawHeart(cx, cy);
                break;
            case 'star':
                this.drawStar(cx, cy);
                break;
            case 'fire':
                this.drawFire(cx, cy);
                break;
            case 'music_note':
                this.drawMusicNote(cx, cy);
                break;
            case 'car':
                this.drawCar(cx, cy);
                break;
            default:
                this.drawDefaultIcon(cx, cy, iconName);
        }
        
        this.ctx.restore();
    }
    
    // Draw wave icon
    drawWave(cx, cy) {
        this.ctx.beginPath();
        this.ctx.arc(cx - 30, cy, 20, -Math.PI/2, Math.PI/2);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.arc(cx + 30, cy, 20, Math.PI/2, -Math.PI/2);
        this.ctx.stroke();
        
        // Hand
        this.ctx.beginPath();
        this.ctx.arc(cx + 30, cy - 20, 8, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    // Draw punch icon
    drawPunch(cx, cy) {
        // Fist
        this.ctx.fillRect(cx - 10, cy - 10, 20, 20);
        
        // Motion lines
        for (let i = 0; i < 3; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(cx - 40 - i * 10, cy - 5 + i * 5);
            this.ctx.lineTo(cx - 25 - i * 10, cy - 5 + i * 5);
            this.ctx.stroke();
        }
    }
    
    // Draw dance icon
    drawDance(cx, cy) {
        // Body
        this.ctx.beginPath();
        this.ctx.arc(cx, cy - 20, 15, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Arms up
        this.ctx.beginPath();
        this.ctx.moveTo(cx - 15, cy - 20);
        this.ctx.lineTo(cx - 30, cy - 40);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(cx + 15, cy - 20);
        this.ctx.lineTo(cx + 30, cy - 40);
        this.ctx.stroke();
        
        // Music notes
        this.ctx.font = '20px Arial';
        this.ctx.fillText('♪', cx - 35, cy - 45);
        this.ctx.fillText('♫', cx + 25, cy - 45);
    }
    
    // Draw happy icon
    drawHappy(cx, cy) {
        // Face
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 40, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Eyes
        this.ctx.beginPath();
        this.ctx.arc(cx - 12, cy - 10, 5, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(cx + 12, cy - 10, 5, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Smile
        this.ctx.beginPath();
        this.ctx.arc(cx, cy + 5, 20, 0, Math.PI);
        this.ctx.stroke();
    }
    
    // Draw magic icon
    drawMagic(cx, cy) {
        // Star
        this.drawStarShape(cx, cy, 30, 15, 5);
        this.ctx.fill();
        
        // Sparkles
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = cx + Math.cos(angle) * 50;
            const y = cy + Math.sin(angle) * 50;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    // Draw heart icon
    drawHeart(cx, cy) {
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy + 15);
        this.ctx.bezierCurveTo(cx - 30, cy - 15, cx - 30, cy + 5, cx, cy + 35);
        this.ctx.bezierCurveTo(cx + 30, cy + 5, cx + 30, cy - 15, cx, cy + 15);
        this.ctx.fill();
    }
    
    // Draw star icon
    drawStar(cx, cy) {
        this.drawStarShape(cx, cy, 35, 17, 5);
        this.ctx.fill();
    }
    
    // Draw fire icon
    drawFire(cx, cy) {
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy + 30);
        this.ctx.bezierCurveTo(cx - 20, cy + 10, cx - 15, cy - 10, cx, cy - 30);
        this.ctx.bezierCurveTo(cx + 15, cy - 10, cx + 20, cy + 10, cx, cy + 30);
        this.ctx.fill();
    }
    
    // Draw music note icon
    drawMusicNote(cx, cy) {
        this.ctx.font = 'bold 60px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('♪', cx, cy);
    }
    
    // Draw car icon
    drawCar(cx, cy) {
        // Body
        this.ctx.fillRect(cx - 40, cy - 10, 80, 20);
        
        // Roof
        this.ctx.fillRect(cx - 25, cy - 25, 50, 15);
        
        // Wheels
        this.ctx.beginPath();
        this.ctx.arc(cx - 20, cy + 15, 8, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.beginPath();
        this.ctx.arc(cx + 20, cy + 15, 8, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    // Draw default icon
    drawDefaultIcon(cx, cy, iconName) {
        // Draw text representation
        this.ctx.font = 'bold 24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        
        // Create abbreviation
        const abbrev = iconName.substring(0, 3).toUpperCase();
        this.ctx.fillText(abbrev, cx, cy);
    }
    
    // Draw star shape helper
    drawStarShape(cx, cy, outerRadius, innerRadius, points) {
        this.ctx.beginPath();
        for (let i = 0; i < points * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
            const x = cx + Math.cos(angle) * radius;
            const y = cy + Math.sin(angle) * radius;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.closePath();
    }
    
    // Add icon effects
    addIconEffects(iconName) {
        const category = this.getIconCategory(iconName);
        
        switch (category) {
            case 'special':
                this.addGlowEffect();
                break;
            case 'combat':
                this.addCombatEffect();
                break;
            case 'dance':
                this.addDanceEffect();
                break;
            case 'emotional':
                this.addEmotionalEffect();
                break;
        }
    }
    
    // Add glow effect
    addGlowEffect() {
        this.ctx.save();
        this.ctx.shadowColor = '#FFD700';
        this.ctx.shadowBlur = 20;
        this.ctx.globalCompositeOperation = 'screen';
        this.ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }
    
    // Add combat effect
    addCombatEffect() {
        this.ctx.save();
        this.ctx.strokeStyle = '#FF0000';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(5, 5, this.canvas.width - 10, this.canvas.height - 10);
        this.ctx.restore();
    }
    
    // Add dance effect
    addDanceEffect() {
        this.ctx.save();
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, 'rgba(156, 39, 176, 0.3)');
        gradient.addColorStop(1, 'rgba(233, 30, 99, 0.3)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }
    
    // Add emotional effect
    addEmotionalEffect() {
        this.ctx.save();
        this.ctx.globalAlpha = 0.2;
        this.ctx.fillStyle = '#FF9800';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();
    }
    
    // Generate animated sprites
    generateAnimatedSprites() {
        const animatedEmotes = [
            'dance', 'wave', 'punch', 'kick', 'jump', 'spin', 'transform', 'magic',
            'fire', 'lightning', 'explosion', 'heal', 'power_up', 'teleport'
        ];
        
        animatedEmotes.forEach(emoteName => {
            const spriteData = this.generateAnimatedSprite(emoteName);
            this.imageAssets.set(`${emoteName}_animated`, spriteData);
        });
    }
    
    // Generate animated sprite
    generateAnimatedSprite(emoteName) {
        const frames = [];
        const frameCount = 8;
        
        for (let i = 0; i < frameCount; i++) {
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Set background
            this.ctx.fillStyle = this.getIconBackground(emoteName);
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw animated frame
            this.drawAnimatedFrame(emoteName, i, frameCount);
            
            // Save frame
            frames.push(this.canvas.toDataURL('image/png'));
        }
        
        return {
            frames: frames,
            frameCount: frameCount,
            duration: 1000, // 1 second total
            loop: true
        };
    }
    
    // Draw animated frame
    drawAnimatedFrame(emoteName, frameIndex, frameCount) {
        const progress = frameIndex / frameCount;
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;
        
        this.ctx.save();
        
        // Set drawing style
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.lineWidth = 3;
        
        switch (emoteName) {
            case 'dance':
                this.drawDanceFrame(cx, cy, progress);
                break;
            case 'wave':
                this.drawWaveFrame(cx, cy, progress);
                break;
            case 'punch':
                this.drawPunchFrame(cx, cy, progress);
                break;
            case 'magic':
                this.drawMagicFrame(cx, cy, progress);
                break;
            case 'fire':
                this.drawFireFrame(cx, cy, progress);
                break;
            default:
                this.drawDefaultAnimatedFrame(cx, cy, progress);
        }
        
        this.ctx.restore();
    }
    
    // Draw dance frame
    drawDanceFrame(cx, cy, progress) {
        const bounce = Math.sin(progress * Math.PI * 4) * 10;
        const sway = Math.sin(progress * Math.PI * 2) * 15;
        
        // Body
        this.ctx.beginPath();
        this.ctx.arc(cx + sway, cy - 20 + bounce, 15, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Arms
        const armAngle = Math.sin(progress * Math.PI * 4) * Math.PI / 4;
        this.ctx.beginPath();
        this.ctx.moveTo(cx + sway, cy - 20 + bounce);
        this.ctx.lineTo(cx - 30 + armAngle * 10, cy - 40 + bounce);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(cx + sway, cy - 20 + bounce);
        this.ctx.lineTo(cx + 30 - armAngle * 10, cy - 40 + bounce);
        this.ctx.stroke();
    }
    
    // Draw wave frame
    drawWaveFrame(cx, cy, progress) {
        const waveAngle = Math.sin(progress * Math.PI * 2) * Math.PI / 3;
        
        // Arm
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, 20, -Math.PI/2, -Math.PI/2 + waveAngle);
        this.ctx.stroke();
        
        // Hand
        const handX = cx + Math.cos(-Math.PI/2 + waveAngle) * 20;
        const handY = cy + Math.sin(-Math.PI/2 + waveAngle) * 20;
        this.ctx.beginPath();
        this.ctx.arc(handX, handY, 8, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    // Draw punch frame
    drawPunchFrame(cx, cy, progress) {
        const extension = Math.sin(progress * Math.PI) * 30;
        
        // Fist
        this.ctx.fillRect(cx - 10 + extension, cy - 10, 20, 20);
        
        // Motion lines
        for (let i = 0; i < 3; i++) {
            const lineExtension = extension - i * 10;
            if (lineExtension > 0) {
                this.ctx.beginPath();
                this.ctx.moveTo(cx - 40 + lineExtension, cy - 5 + i * 5);
                this.ctx.lineTo(cx - 25 + lineExtension, cy - 5 + i * 5);
                this.ctx.stroke();
            }
        }
    }
    
    // Draw magic frame
    drawMagicFrame(cx, cy, progress) {
        const rotation = progress * Math.PI * 2;
        const scale = 1 + Math.sin(progress * Math.PI * 4) * 0.2;
        
        this.ctx.save();
        this.ctx.translate(cx, cy);
        this.ctx.rotate(rotation);
        this.ctx.scale(scale, scale);
        
        // Star
        this.drawStarShape(0, 0, 30, 15, 5);
        this.ctx.fill();
        
        this.ctx.restore();
        
        // Sparkles
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2 + rotation;
            const sparkleScale = 1 + Math.sin(progress * Math.PI * 4 + i) * 0.5;
            const x = cx + Math.cos(angle) * 50;
            const y = cy + Math.sin(angle) * 50;
            
            this.ctx.beginPath();
            this.ctx.arc(x, y, 3 * sparkleScale, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }
    
    // Draw fire frame
    drawFireFrame(cx, cy, progress) {
        const flicker = Math.sin(progress * Math.PI * 8) * 5;
        const height = 30 + Math.sin(progress * Math.PI * 4) * 10;
        
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy + 30);
        this.ctx.bezierCurveTo(
            cx - 20 + flicker, cy + 10,
            cx - 15 + flicker, cy - height,
            cx, cy - height - 10
        );
        this.ctx.bezierCurveTo(
            cx + 15 - flicker, cy - height,
            cx + 20 - flicker, cy + 10,
            cx, cy + 30
        );
        this.ctx.fill();
    }
    
    // Draw default animated frame
    drawDefaultAnimatedFrame(cx, cy, progress) {
        const bounce = Math.sin(progress * Math.PI * 2) * 10;
        
        // Simple bouncing circle
        this.ctx.beginPath();
        this.ctx.arc(cx, cy + bounce, 20, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    // Generate video clips
    generateVideoClips() {
        const videoEmotes = [
            'dance', 'wave', 'punch', 'kick', 'transform', 'magic', 'fire', 'lightning'
        ];
        
        videoEmotes.forEach(emoteName => {
            const videoData = this.generateVideoClip(emoteName);
            this.videoAssets.set(emoteName, videoData);
        });
    }
    
    // Generate video clip
    generateVideoClip(emoteName) {
        // This would generate actual video data
        // For now, we'll create a placeholder with metadata
        
        return {
            name: emoteName,
            duration: 2000, // 2 seconds
            fps: 30,
            resolution: { width: 256, height: 256 },
            format: 'webm',
            codec: 'vp9',
            size: '128KB', // Estimated
            frames: this.generateAnimatedSprite(emoteName).frames,
            audio: this.generateAudioClip(emoteName),
            metadata: {
                category: this.getIconCategory(emoteName),
                tags: [emoteName, this.getIconCategory(emoteName), 'animated'],
                created: new Date().toISOString()
            }
        };
    }
    
    // Generate audio clip
    generateAudioClip(emoteName) {
        // Generate audio data for the emote
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const duration = 2.0;
        const sampleRate = audioContext.sampleRate;
        const buffer = audioContext.createBuffer(1, duration * sampleRate, sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < buffer.length; i++) {
            const t = i / sampleRate;
            let sample = 0;
            
            switch (emoteName) {
                case 'dance':
                    sample = Math.sin(2 * Math.PI * 440 * t) * Math.sin(t * 8) * 0.3;
                    break;
                case 'punch':
                    sample = (Math.random() - 0.5) * 0.9 * Math.exp(-t * 20);
                    break;
                case 'magic':
                    sample = Math.sin(2 * Math.PI * 880 * t) * Math.sin(t * 16) * 0.4;
                    break;
                default:
                    sample = Math.sin(2 * Math.PI * 220 * t) * 0.3;
            }
            
            data[i] = sample * Math.exp(-t * 2);
        }
        
        return {
            buffer: buffer,
            duration: duration,
            sampleRate: sampleRate,
            format: 'wav'
        };
    }
    
    // Generate thumbnails
    generateThumbnails() {
        const allEmotes = [
            'wave', 'punch', 'dance', 'happy', 'magic', 'heart', 'star', 'fire',
            'music_note', 'car', 'jump', 'run', 'sit', 'sleep', 'eat', 'drink'
        ];
        
        allEmotes.forEach(emoteName => {
            const thumbnail = this.generateThumbnail(emoteName);
            this.imageAssets.set(`${emoteName}_thumb`, thumbnail);
        });
    }
    
    // Generate thumbnail
    generateThumbnail(emoteName) {
        // Create smaller version for thumbnail
        const originalWidth = this.canvas.width;
        const originalHeight = this.canvas.height;
        
        this.canvas.width = 64;
        this.canvas.height = 64;
        
        // Generate icon at smaller size
        const iconData = this.generateIcon(emoteName);
        
        // Restore original size
        this.canvas.width = originalWidth;
        this.canvas.height = originalHeight;
        
        return iconData;
    }
    
    // Generate preview videos
    generatePreviewVideos() {
        const previewEmotes = ['dance', 'wave', 'punch', 'magic'];
        
        previewEmotes.forEach(emoteName => {
            const preview = this.generatePreviewVideo(emoteName);
            this.videoAssets.set(`${emoteName}_preview`, preview);
        });
    }
    
    // Generate preview video
    generatePreviewVideo(emoteName) {
        return {
            name: `${emoteName}_preview`,
            duration: 1000, // 1 second preview
            fps: 30,
            resolution: { width: 128, height: 128 },
            format: 'webm',
            codec: 'vp9',
            size: '64KB',
            frames: this.generatePreviewFrames(emoteName),
            watermark: true,
            metadata: {
                type: 'preview',
                original: emoteName,
                created: new Date().toISOString()
            }
        };
    }
    
    // Generate preview frames
    generatePreviewFrames(emoteName) {
        const frames = [];
        const frameCount = 4;
        
        // Store original canvas size
        const originalWidth = this.canvas.width;
        const originalHeight = this.canvas.height;
        
        // Set preview size
        this.canvas.width = 128;
        this.canvas.height = 128;
        
        for (let i = 0; i < frameCount; i++) {
            // Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Set background
            this.ctx.fillStyle = this.getIconBackground(emoteName);
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw frame
            this.drawAnimatedFrame(emoteName, i, frameCount);
            
            // Add watermark
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PREVIEW', this.canvas.width / 2, this.canvas.height - 10);
            
            // Save frame
            frames.push(this.canvas.toDataURL('image/png'));
        }
        
        // Restore original size
        this.canvas.width = originalWidth;
        this.canvas.height = originalHeight;
        
        return frames;
    }
    
    // Generate particle effects
    generateParticleEffects() {
        const particleEmotes = ['magic', 'fire', 'explosion', 'heal', 'power_up'];
        
        particleEmotes.forEach(emoteName => {
            const particles = this.generateParticleEffect(emoteName);
            this.assets.set(`${emoteName}_particles`, particles);
        });
    }
    
    // Generate particle effect
    generateParticleEffect(emoteName) {
        const particleCount = 50;
        const particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                id: i,
                type: this.getParticleType(emoteName),
                position: {
                    x: Math.random() * 256,
                    y: Math.random() * 256
                },
                velocity: {
                    x: (Math.random() - 0.5) * 4,
                    y: (Math.random() - 0.5) * 4
                },
                size: Math.random() * 10 + 2,
                color: this.getParticleColor(emoteName),
                lifetime: Math.random() * 2 + 1,
                delay: Math.random() * 0.5
            });
        }
        
        return {
            name: emoteName,
            particles: particles,
            duration: 3000,
            emitter: {
                type: 'point',
                position: { x: 128, y: 128 },
                spread: 45
            },
            physics: {
                gravity: this.getParticleGravity(emoteName),
                damping: 0.98
            }
        };
    }
    
    // Get particle type
    getParticleType(emoteName) {
        const types = {
            magic: 'sparkle',
            fire: 'flame',
            explosion: 'debris',
            heal: 'light',
            power_up: 'energy'
        };
        
        return types[emoteName] || 'particle';
    }
    
    // Get particle color
    getParticleColor(emoteName) {
        const colors = {
            magic: '#FFD700',
            fire: '#FF6B35',
            explosion: '#FF4444',
            heal: '#00FF00',
            power_up: '#00BFFF'
        };
        
        return colors[emoteName] || '#FFFFFF';
    }
    
    // Get particle gravity
    getParticleGravity(emoteName) {
        const gravities = {
            magic: -0.1,
            fire: -0.05,
            explosion: 0.2,
            heal: -0.2,
            power_up: -0.15
        };
        
        return gravities[emoteName] || 0;
    }
    
    // Generate UI elements
    generateUIElements() {
        const uiElements = [
            'emote_button', 'emote_panel', 'emote_grid', 'emote_card',
            'emote_icon', 'emote_name', 'emote_description', 'emote_rarity'
        ];
        
        uiElements.forEach(elementName => {
            const element = this.generateUIElement(elementName);
            this.assets.set(elementName, element);
        });
    }
    
    // Generate UI element
    generateUIElement(elementName) {
        // Store original canvas size
        const originalWidth = this.canvas.width;
        const originalHeight = this.canvas.height;
        
        // Set appropriate size for UI element
        switch (elementName) {
            case 'emote_button':
                this.canvas.width = 120;
                this.canvas.height = 40;
                break;
            case 'emote_panel':
                this.canvas.width = 300;
                this.canvas.height = 200;
                break;
            case 'emote_grid':
                this.canvas.width = 400;
                this.canvas.height = 300;
                break;
            case 'emote_card':
                this.canvas.width = 150;
                this.canvas.height = 100;
                break;
            case 'emote_icon':
                this.canvas.width = 64;
                this.canvas.height = 64;
                break;
            default:
                this.canvas.width = 100;
                this.canvas.height = 50;
        }
        
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw UI element
        this.drawUIElement(elementName);
        
        // Convert to data URL
        const elementData = this.canvas.toDataURL('image/png');
        
        // Restore original size
        this.canvas.width = originalWidth;
        this.canvas.height = originalHeight;
        
        return {
            name: elementName,
            data: elementData,
            width: this.canvas.width,
            height: this.canvas.height,
            type: 'ui_element'
        };
    }
    
    // Draw UI element
    drawUIElement(elementName) {
        this.ctx.save();
        
        switch (elementName) {
            case 'emote_button':
                this.drawEmoteButton();
                break;
            case 'emote_panel':
                this.drawEmotePanel();
                break;
            case 'emote_grid':
                this.drawEmoteGrid();
                break;
            case 'emote_card':
                this.drawEmoteCard();
                break;
            case 'emote_icon':
                this.drawEmoteIcon();
                break;
            default:
                this.drawDefaultUI();
        }
        
        this.ctx.restore();
    }
    
    // Draw emote button
    drawEmoteButton() {
        // Background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#4CAF50');
        gradient.addColorStop(1, '#45a049');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Border
        this.ctx.strokeStyle = '#2E7D32';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Text
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 16px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('🎭 Emotes', this.canvas.width / 2, this.canvas.height / 2);
    }
    
    // Draw emote panel
    drawEmotePanel() {
        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Border
        this.ctx.strokeStyle = '#333333';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Title bar
        this.ctx.fillStyle = '#333333';
        this.ctx.fillRect(0, 0, this.canvas.width, 30);
        
        // Title
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('🎭 Emote Menu', 10, 20);
        
        // Grid placeholder
        this.ctx.strokeStyle = '#555555';
        this.ctx.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 4; j++) {
                this.ctx.strokeRect(10 + j * 70, 40 + i * 50, 60, 40);
            }
        }
    }
    
    // Draw emote grid
    drawEmoteGrid() {
        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Grid cells
        this.ctx.strokeStyle = '#444444';
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 5; j++) {
                const x = 10 + j * 75;
                const y = 10 + i * 90;
                
                // Cell background
                this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                this.ctx.fillRect(x, y, 70, 80);
                
                // Cell border
                this.ctx.strokeRect(x, y, 70, 80);
                
                // Icon placeholder
                this.ctx.fillStyle = '#666666';
                this.ctx.fillRect(x + 20, y + 10, 30, 30);
                
                // Name placeholder
                this.ctx.fillStyle = '#CCCCCC';
                this.ctx.fillRect(x + 5, y + 50, 60, 10);
            }
        }
    }
    
    // Draw emote card
    drawEmoteCard() {
        // Background
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Border
        this.ctx.strokeStyle = '#555555';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Icon placeholder
        this.ctx.fillStyle = '#888888';
        this.ctx.fillRect(50, 15, 50, 50);
        
        // Name placeholder
        this.ctx.fillStyle = '#CCCCCC';
        this.ctx.fillRect(10, 75, 130, 10);
    }
    
    // Draw emote icon
    drawEmoteIcon() {
        // Background
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Icon
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 32px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText('🎭', this.canvas.width / 2, this.canvas.height / 2);
    }
    
    // Draw default UI
    drawDefaultUI() {
        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Border
        this.ctx.strokeStyle = '#666666';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Text
        this.ctx.fillStyle = '#CCCCCC';
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(elementName, this.canvas.width / 2, this.canvas.height / 2);
    }
    
    // Get asset by name
    getAsset(name) {
        return this.assets.get(name) || 
               this.imageAssets.get(name) || 
               this.videoAssets.get(name) || 
               null;
    }
    
    // Get all assets
    getAllAssets() {
        return {
            images: Object.fromEntries(this.imageAssets),
            videos: Object.fromEntries(this.videoAssets),
            particles: Object.fromEntries(this.assets),
            ui: Object.fromEntries(this.assets)
        };
    }
    
    // Get asset statistics
    getStats() {
        return {
            totalAssets: this.assets.size + this.imageAssets.size + this.videoAssets.size,
            imageAssets: this.imageAssets.size,
            videoAssets: this.videoAssets.size,
            particleAssets: this.assets.size,
            animatedSprites: this.imageAssets.size,
            videoClips: this.videoAssets.size,
            uiElements: this.assets.size
        };
    }
}

// Export for use in game
if (typeof window !== 'undefined') {
    window.EmoteAssetsGenerator = EmoteAssetsGenerator;
} else if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmoteAssetsGenerator;
}
