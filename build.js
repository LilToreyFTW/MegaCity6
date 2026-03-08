// Build script for MegaCity6 standalone executable
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building MegaCity6 standalone executable...');

// Ensure we have the required dependencies
try {
  require('electron');
  require('electron-builder');
} catch (error) {
  console.log('📦 Installing build dependencies...');
  execSync('npm install electron electron-builder electron-updater --save-dev', { stdio: 'inherit' });
}

// Create version file
const versionData = {
  version: '1.0.0',
  buildDate: new Date().toISOString(),
  buildNumber: Date.now()
};

fs.writeFileSync('version.json', JSON.stringify(versionData, null, 2));
console.log('✅ Version file created');

// Create icon placeholder (if icon.ico doesn't exist)
if (!fs.existsSync('icon.ico')) {
  console.log('⚠️  icon.ico not found - using default icon');
  // You would need to create an actual .ico file for production
}

// Build the executable
console.log('🔨 Building executable...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!');
  console.log('📁 Check the dist/ folder for your executable');
} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}

// Create release info
const releaseInfo = {
  version: '1.0.0',
  releaseDate: new Date().toISOString(),
  features: [
    'Complete GTA 6 open-world game',
    'Auto-updating executable',
    'All weapons and combat systems',
    'Police and wanted level system',
    'Money and economy system',
    'Standalone offline play'
  ],
  instructions: [
    'Download and run MegaCity6-Setup.exe',
    'Game will auto-update automatically',
    'Updates check every 30 seconds',
    'No manual intervention required'
  ]
};

fs.writeFileSync('release-info.json', JSON.stringify(releaseInfo, null, 2));
console.log('✅ Release info created');

console.log('\n🎮 MegaCity6 build complete!');
console.log('📋 Next steps:');
console.log('   1. Upload the executable to GitHub Releases');
console.log('   2. Deploy the web version to Vercel');
console.log('   3. Test auto-update functionality');
console.log('\n🌐 Web version: https://megacity6.vercel.app');
console.log('📦 Desktop version: Available in GitHub Releases');
