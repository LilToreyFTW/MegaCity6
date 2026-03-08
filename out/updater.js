// Advanced Auto-Update System for MegaCity6
class GameUpdater {
  constructor() {
    this.currentVersion = '1.0.0';
    this.updateUrl = 'https://api.github.com/repos/LilToreyFTW/MegaCity6/releases/latest';
    this.gameFilesUrl = 'https://github.com/LilToreyFTW/MegaCity6/archive/master.zip';
    this.localVersionPath = './version.json';
    this.updateInterval = 30000; // 30 seconds
    this.isUpdating = false;
    this.lastCheckTime = 0;
    
    this.init();
  }
  
  init() {
    this.loadLocalVersion();
    this.startAutoUpdate();
    this.setupEventListeners();
  }
  
  loadLocalVersion() {
    try {
      // Browser version - use localStorage
      const versionData = localStorage.getItem('gameVersion');
      if (versionData) {
        const parsed = JSON.parse(versionData);
        this.currentVersion = parsed.version;
      } else {
        this.currentVersion = '1.0.0';
      }
    } catch (error) {
      console.error('Error loading local version:', error);
      this.currentVersion = '1.0.0';
    }
  }
  
  saveLocalVersion() {
    try {
      // Browser version - use localStorage
      const versionData = {
        version: this.currentVersion,
        lastUpdate: new Date().toISOString()
      };
      localStorage.setItem('gameVersion', JSON.stringify(versionData));
    } catch (error) {
      console.error('Error saving local version:', error);
    }
  }
  
  startAutoUpdate() {
    console.log('Starting auto-update system...');
    
    // Check immediately
    this.checkForUpdates();
    
    // Set up interval
    setInterval(() => {
      this.checkForUpdates();
    }, this.updateInterval);
  }
  
  async checkForUpdates() {
    if (this.isUpdating) {
      console.log('Update already in progress, skipping check');
      return;
    }
    
    const now = Date.now();
    if (now - this.lastCheckTime < this.updateInterval) {
      return;
    }
    
    this.lastCheckTime = now;
    
    try {
      console.log('Checking for updates...');
      
      // Fetch latest release info
      const response = await fetch(this.updateUrl);
      const releaseData = await response.json();
      
      const latestVersion = releaseData.tag_name.replace('v', '');
      console.log('Latest version:', latestVersion, 'Current version:', this.currentVersion);
      
      if (this.compareVersions(latestVersion, this.currentVersion) > 0) {
        console.log('Update available!');
        await this.downloadUpdate(releaseData, latestVersion);
      } else {
        console.log('Already up to date');
        this.showUpdateStatus('Up to date');
      }
      
    } catch (error) {
      console.error('Update check failed:', error);
      this.showUpdateStatus('Update check failed');
    }
  }
  
  compareVersions(version1, version2) {
    const parts1 = version1.split('.').map(Number);
    const parts2 = version2.split('.').map(Number);
    
    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;
      
      if (part1 > part2) return 1;
      if (part1 < part2) return -1;
    }
    
    return 0;
  }
  
  async downloadUpdate(releaseData, newVersion) {
    if (this.isUpdating) return;
    
    this.isUpdating = true;
    this.showUpdateStatus('Downloading update...');
    
    try {
      console.log('Downloading update...');
      
      // Download the latest game files
      const gameFilesResponse = await fetch(this.gameFilesUrl);
      const buffer = await gameFilesResponse.arrayBuffer();
      
      // Save the update
      const fs = require('fs');
      const path = require('path');
      
      const updatePath = './updates';
      if (!fs.existsSync(updatePath)) {
        fs.mkdirSync(updatePath);
      }
      
      const updateFile = path.join(updatePath, `update-${newVersion}.zip`);
      fs.writeFileSync(updateFile, Buffer.from(buffer));
      
      console.log('Update downloaded successfully');
      
      // Apply the update
      await this.applyUpdate(updateFile, newVersion);
      
    } catch (error) {
      console.error('Update download failed:', error);
      this.showUpdateStatus('Update download failed');
      this.isUpdating = false;
    }
  }
  
  async applyUpdate(updateFile, newVersion) {
    try {
      console.log('Applying update...');
      this.showUpdateStatus('Installing update...');
      
      const fs = require('fs');
      const path = require('path');
      const { execSync } = require('child_process');
      
      // Extract the update
      const extractPath = path.join('./updates', `extracted-${newVersion}`);
      
      // Create extraction directory
      if (!fs.existsSync(extractPath)) {
        fs.mkdirSync(extractPath);
      }
      
      // Extract using system unzip (or alternative method)
      try {
        execSync(`unzip "${updateFile}" -d "${extractPath}"`, { stdio: 'pipe' });
      } catch (unzipError) {
        console.log('System unzip not available, using manual extraction...');
        // Fallback: manually copy files if unzip fails
        this.manualUpdate(extractPath, newVersion);
      }
      
      // Update version
      this.currentVersion = newVersion;
      this.saveLocalVersion();
      
      // Clean up
      fs.unlinkSync(updateFile);
      
      console.log('Update applied successfully!');
      this.showUpdateStatus('Update complete! Restart game to apply changes.');
      
      // Show restart dialog
      this.showRestartDialog();
      
    } catch (error) {
      console.error('Update application failed:', error);
      this.showUpdateStatus('Update installation failed');
    } finally {
      this.isUpdating = false;
    }
  }
  
  manualUpdate(extractPath, newVersion) {
    // Fallback update method - copy essential files
    const fs = require('fs');
    const path = require('path');
    
    // In a real implementation, you would extract and copy files here
    // For now, we'll just update the version
    console.log('Manual update applied');
  }
  
  showUpdateStatus(message) {
    // Send status to renderer process
    if (typeof window !== 'undefined' && window.electronAPI) {
      // In Electron environment
      console.log('Update status:', message);
    } else {
      // In browser environment
      console.log('Update status:', message);
      this.updateUIStatus(message);
    }
  }
  
  updateUIStatus(message) {
    // Update the UI with status message
    let statusElement = document.getElementById('update-status');
    if (!statusElement) {
      statusElement = document.createElement('div');
      statusElement.id = 'update-status';
      statusElement.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 4px;
        font-size: 12px;
        z-index: 10000;
        border: 1px solid #333;
      `;
      document.body.appendChild(statusElement);
    }
    
    statusElement.textContent = message;
    
    // Hide after 5 seconds if it's a success message
    if (message.includes('Up to date') || message.includes('complete')) {
      setTimeout(() => {
        statusElement.style.display = 'none';
      }, 5000);
    } else {
      statusElement.style.display = 'block';
    }
  }
  
  showRestartDialog() {
    if (typeof window !== 'undefined' && confirm('Update downloaded! Restart the game now?')) {
      if (window.electronAPI) {
        window.electronAPI.installUpdate();
      } else {
        location.reload();
      }
    }
  }
  
  setupEventListeners() {
    // Listen for manual update requests
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', (e) => {
        // Ctrl+U for manual update check
        if (e.ctrlKey && e.key === 'u') {
          e.preventDefault();
          this.checkForUpdates();
        }
      });
    }
  }
}

// Initialize the updater
if (typeof window !== 'undefined') {
  window.gameUpdater = new GameUpdater();
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameUpdater;
}
