const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Version info
  getVersion: () => ipcRenderer.invoke('get-version'),
  
  // Update functions
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  installUpdate: () => ipcRenderer.invoke('install-update'),
  
  // Update events
  onUpdateStatus: (callback) => ipcRenderer.on('update-status', callback),
  onUpdateProgress: (callback) => ipcRenderer.on('update-progress', callback),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});

// Add update notification to the game
window.addEventListener('DOMContentLoaded', () => {
  // Create update notification UI
  const updateNotification = document.createElement('div');
  updateNotification.id = 'update-notification';
  updateNotification.style.cssText = `
    position: fixed;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px 15px;
    border-radius: 5px;
    font-size: 14px;
    z-index: 10000;
    display: none;
    border: 1px solid #333;
    max-width: 300px;
  `;
  
  const updateProgress = document.createElement('div');
  updateProgress.id = 'update-progress';
  updateProgress.style.cssText = `
    width: 100%;
    height: 4px;
    background: #333;
    border-radius: 2px;
    margin-top: 5px;
    overflow: hidden;
  `;
  
  const updateProgressBar = document.createElement('div');
  updateProgressBar.id = 'update-progress-bar';
  updateProgressBar.style.cssText = `
    height: 100%;
    background: #4CAF50;
    width: 0%;
    transition: width 0.3s ease;
  `;
  
  updateProgress.appendChild(updateProgressBar);
  updateNotification.appendChild(updateProgress);
  document.body.appendChild(updateNotification);
  
  // Handle update events
  if (window.electronAPI) {
    // Update status
    window.electronAPI.onUpdateStatus((event, message) => {
      const notification = document.getElementById('update-notification');
      const progress = document.getElementById('update-progress');
      
      if (message === 'Up to date') {
        notification.style.display = 'none';
      } else {
        notification.style.display = 'block';
        notification.firstChild.textContent = message;
        
        if (message.includes('Downloading')) {
          progress.style.display = 'block';
        } else {
          progress.style.display = 'none';
        }
      }
    });
    
    // Update progress
    window.electronAPI.onUpdateProgress((event, progress) => {
      const progressBar = document.getElementById('update-progress-bar');
      const notification = document.getElementById('update-notification');
      
      progressBar.style.width = progress.percent + '%';
      notification.firstChild.textContent = `Downloading update: ${progress.percent}% (${Math.round(progress.transferred / 1024 / 1024)}MB / ${Math.round(progress.total / 1024 / 1024)}MB)`;
    });
    
    // Update downloaded
    window.electronAPI.onUpdateDownloaded((event) => {
      const notification = document.getElementById('update-notification');
      notification.style.background = 'rgba(76, 175, 80, 0.9)';
      notification.innerHTML = 'Update ready! Restart to apply changes.<br><button onclick="window.electronAPI.installUpdate()" style="margin-top: 5px; padding: 5px 10px; background: #4CAF50; color: white; border: none; border-radius: 3px; cursor: pointer;">Restart Now</button>';
    });
    
    // Get initial version
    window.electronAPI.getVersion().then(version => {
      console.log('MegaCity6 Version:', version);
    });
  }
});
