const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');

let mainWindow;
let updateInterval;

// Enable logging for debugging
autoUpdater.logger = require('electron-log');
autoUpdater.logger.transports.file.level = 'info';

// Configure auto updater
autoUpdater.checkForUpdatesAndNotify();
autoUpdater.setFeedURL({
  provider: 'github',
  owner: 'LilToreyFTW',
  repo: 'MegaCity6'
});

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'icon.ico'),
    title: 'MegaCity6 - GTA 6 Edition',
    show: false,
    autoHideMenuBar: true
  });

  // Load the game
  mainWindow.loadFile('index.html');

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Open DevTools in development
    if (process.argv.includes('--dev')) {
      mainWindow.webContents.openDevTools();
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Start auto-update checking
  startAutoUpdate();
}

function startAutoUpdate() {
  // Check for updates every 30 seconds
  updateInterval = setInterval(() => {
    checkForUpdates();
  }, 30000);

  // Initial check
  checkForUpdates();
}

function checkForUpdates() {
  console.log('Checking for updates...');
  autoUpdater.checkForUpdatesAndNotify();
}

// Auto updater events
autoUpdater.on('checking-for-update', () => {
  console.log('Checking for update...');
  if (mainWindow) {
    mainWindow.webContents.send('update-status', 'Checking for updates...');
  }
});

autoUpdater.on('update-available', (info) => {
  console.log('Update available:', info);
  if (mainWindow) {
    mainWindow.webContents.send('update-status', 'Update available! Downloading...');
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update Available',
      message: 'A new version of MegaCity6 is available!',
      detail: `Version ${info.version} is ready to download.`,
      buttons: ['Download Now', 'Later']
    }).then((result) => {
      if (result.response === 0) {
        // User chose to download now
        autoUpdater.downloadUpdate();
      }
    });
  }
});

autoUpdater.on('update-not-available', (info) => {
  console.log('Update not available:', info);
  if (mainWindow) {
    mainWindow.webContents.send('update-status', 'Up to date');
  }
});

autoUpdater.on('error', (err) => {
  console.log('Error in auto-updater:', err);
  if (mainWindow) {
    mainWindow.webContents.send('update-status', 'Update check failed');
  }
});

autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  console.log(log_message);
  
  if (mainWindow) {
    mainWindow.webContents.send('update-progress', {
      percent: Math.round(progressObj.percent),
      transferred: progressObj.transferred,
      total: progressObj.total
    });
  }
});

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded:', info);
  if (mainWindow) {
    mainWindow.webContents.send('update-status', 'Update ready! Restarting...');
    mainWindow.webContents.send('update-downloaded');
    
    dialog.showMessageBox(mainWindow, {
      type: 'info',
      title: 'Update Ready',
      message: 'The update has been downloaded successfully!',
      detail: 'The game will restart to apply the update.',
      buttons: ['Restart Now', 'Restart Later']
    }).then((result) => {
      if (result.response === 0) {
        // User chose to restart now
        autoUpdater.quitAndInstall();
      }
    });
  }
});

// IPC handlers
ipcMain.handle('get-version', () => {
  return app.getVersion();
});

ipcMain.handle('check-for-updates', () => {
  checkForUpdates();
});

ipcMain.handle('install-update', () => {
  autoUpdater.quitAndInstall();
});

// App events
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
  });
});
