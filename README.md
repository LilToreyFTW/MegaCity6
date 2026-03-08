# MegaCity 6 - Three.js Edition 🎮

A fully-featured GTA 6-inspired game built with Three.js, featuring open-world gameplay, combat systems, and police chases.

## 🚀 Features

### 🏙️ Open World
- **Vice City Environment** - Procedurally generated city with buildings, roads, and traffic
- **Day/Night Cycle** - Dynamic lighting system
- **Living City** - AI pedestrians and traffic vehicles

### 🚗 Vehicle System
- **Drivable Vehicles** - Physics-based car controls
- **Traffic AI** - Autonomous vehicles navigating the city
- **Vehicle Entry/Exit** - Seamless character-vehicle interaction

### 🚶 Character System
- **Full Character Model** - Detailed 3D character with animations
- **Movement Mechanics** - Walk, run, jump with stamina system
- **Third-Person Camera** - Dynamic camera following

### 🔫 Combat System
- **6 Weapon Types**:
  - Pistol (Semi-auto, infinite ammo)
  - Shotgun (High damage, slow fire)
  - Rifle (Automatic, balanced)
  - SMG (Rapid fire)
  - Sniper (Long range, high damage)
  - RPG (Explosive, devastating)
- **Realistic Ballistics** - Bullet physics and collision detection
- **Sound Effects** - Procedurally generated gunshot audio

### 💰 Economy System
- **Money Management** - Cash and bank system
- **Rewards** - Earn money by eliminating targets
- **Economic Progression** - Build your wealth

### 🚓 Police & Wanted System
- **6-Star Wanted Level** - Progressive law enforcement response
- **Police AI** - Smart chasing and patrolling behavior
- **Police Vehicles** - Cars with flashing lights
- **On-foot Officers** - Police that pursue at higher wanted levels
- **Crime Detection** - System tracks criminal activities

### 🎮 Controls
- **WASD** - Move/Drive
- **Shift** - Run (with stamina system)
- **Space** - Jump/Brake
- **Mouse** - Look around and shoot
- **E** - Enter/Exit vehicles
- **1-6** - Switch weapons
- **M** - Add money (debug cheat)
- **P** - Increase wanted level (debug)

### 🗺️ HUD Features
- **Minimap** - Real-time position tracking
- **Speedometer** - Vehicle speed display
- **Stamina Bar** - Running stamina indicator
- **Money Display** - Cash and bank balance
- **Wanted Level** - Star rating system
- **Mission Updates** - Real-time status messages

## 🌐 Web Version

Play the game directly in your browser at: **[https://megacity6.vercel.app](https://megacity6.vercel.app)**

## 📱 Desktop Application

### Auto-Updating EXE
The game includes a standalone Windows executable with automatic update functionality:

- **Auto-Update Mechanism** - Checks for updates every 30 seconds
- **Seamless Updates** - Downloads and applies updates automatically
- **Version Control** - Tracks local and remote versions
- **Background Updates** - Non-intrusive update process

### Download
Get the latest standalone executable from the **Releases** section on GitHub.

## 🛠️ Technical Stack

### Frontend
- **Three.js** - 3D graphics engine
- **Web Audio API** - Procedural sound generation
- **HTML5 Canvas** - Minimap and HUD rendering
- **Vanilla JavaScript** - Core game logic

### Backend/Deployment
- **Vercel** - Web hosting and CDN
- **GitHub** - Version control and releases
- **Electron** - Desktop application framework

## 🚀 Quick Start

### Web Version
1. Visit [https://megacity6.vercel.app](https://megacity6.vercel.app)
2. Wait for the game to load
3. Start playing immediately!

### Desktop Version
1. Download the latest EXE from GitHub Releases
2. Run the installer
3. Game updates automatically in the background

### Development
```bash
# Clone the repository
git clone https://github.com/LilToreyFTW/MegaCity6.git

# Navigate to project
cd MegaCity6

# Start local server
python -m http.server 8000

# Open in browser
# Visit http://localhost:8000
```

## 🎯 Game Mechanics

### Stamina System
- **Maximum Stamina**: 100 points
- **Running Cost**: 20 points/second
- **Regeneration**: 10 points/second (when not running)
- **Speed Boost**: 2x movement speed when running

### Weapon Stats
| Weapon | Damage | Range | Fire Rate | Ammo | Type |
|--------|--------|-------|----------|------|------|
| Pistol | 25 | 50m | 500ms | ∞ | Semi |
| Shotgun | 75 | 30m | 1000ms | 50 | Semi |
| Rifle | 35 | 100m | 150ms | 300 | Auto |
| SMG | 20 | 60m | 100ms | 500 | Auto |
| Sniper | 100 | 200m | 2000ms | 20 | Semi |
| RPG | 200 | 150m | 3000ms | 5 | Semi |

### Wanted Level Progression
- **1 Star** - Basic police presence
- **2 Stars** - Increased patrols
- **3 Stars** - On-foot officers join chase
- **4+ Stars** - Maximum police response
- **5-6 Stars** - Elite units and aggressive tactics

## 🔄 Auto-Update System

The desktop application features a sophisticated auto-update mechanism:

### Update Process
1. **Version Check** - Compares local version with GitHub releases
2. **Download Detection** - Monitors for new game files
3. **Automatic Download** - Fetches updates in background
4. **Seamless Installation** - Applies updates without user intervention
4. **Restart Notification** - Informs user when update is ready

### Update Frequency
- **Check Interval**: Every 30 seconds
- **Update Types**: Game files, assets, executables
- **Version Tracking**: Semantic versioning system
- **Rollback Support**: Previous version backup

## 🐛 Debug Features

### Cheat Codes (for testing)
- **M** - Add $1000
- **P** - Increase wanted level
- **Number Keys 1-6** - Switch weapons instantly

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🎮 Support

For issues, bugs, or feature requests:
- Create an issue on GitHub
- Join our Discord community
- Check the troubleshooting guide

---

**Enjoy your GTA 6 experience! 🌆🚗🔫**
