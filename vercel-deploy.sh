#!/bin/bash

# MegaCity6 Vercel Deployment Script
echo "🚀 Deploying MegaCity6 to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Make sure you're in the MegaCity6 directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Deploy to Vercel
echo "🌐 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🎮 Your game is now live at: https://megacity-6.vercel.app"
echo "🔧 Admin panel: https://vercel.com/dashboard"
