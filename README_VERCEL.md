# Deploying MegaCity6 to Vercel

## Prerequisites
- Node.js 18+ installed
- Vercel account
- GitHub repository connected to Vercel

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Move Game Files
Copy your existing game files to the `public/` directory:
- `game.js` → `public/game.js`
- `multiplayer.js` → `public/multiplayer.js`
- `battlepass.js` → `public/battlepass.js`
- `gangs.js` → `public/gangs.js`
- `characterAnimations.js` → `public/characterAnimations.js`
- `updater.js` → `public/updater.js`

### 3. Update Game Scripts
Make sure all your game scripts work in a browser environment. Remove any Node.js-specific code like `require()` or `module.exports`.

### 4. Test Locally
```bash
npm run dev
```
Visit `http://localhost:3000` to test.

### 5. Build for Production
```bash
npm run build
```

### 6. Deploy to Vercel
Option 1: Vercel CLI
```bash
npx vercel --prod
```

Option 2: GitHub Integration
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically deploy

## Important Notes

### Static Export
This project uses Next.js static export (`output: 'export'`) which generates a fully static site perfect for Vercel.

### API Routes
Server functionality is handled through Next.js API routes in `pages/api/`.

### Environment Variables
Add any environment variables in your Vercel dashboard under Settings → Environment Variables.

### Game Assets
Place all game assets (images, sounds, models) in the `public/` directory.

## Troubleshooting

### Build Errors
- Check that all game files are in the `public/` directory
- Ensure no Node.js-specific code in browser files
- Verify all imports/exports use ES6 syntax

### Runtime Errors
- Check browser console for JavaScript errors
- Ensure all game assets are properly referenced
- Verify API endpoints are working correctly

## File Structure
```
megacity6/
├── pages/
│   ├── index.js          # Main game page
│   └── api/
│       └── server.js     # API routes
├── public/
│   ├── game.js           # Game logic
│   ├── multiplayer.js    # Multiplayer logic
│   ├── battlepass.js     # Battle pass system
│   ├── gangs.js          # Gang system
│   ├── characterAnimations.js # Character animations
│   └── updater.js        # Game updater
├── next.config.js        # Next.js configuration
├── package.json          # Dependencies
└── .vercel              # Vercel configuration
```
