#!/bin/bash

echo "🚀 Deploying to Render..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf dist
rm -rf backend/node_modules

# Install frontend dependencies and build
echo "📦 Installing frontend dependencies..."
npm install

echo "🔨 Building frontend..."
npm run build

# Verify build
if [ ! -f "dist/index.html" ]; then
    echo "❌ Frontend build failed! dist/index.html not found."
    exit 1
fi

echo "✅ Frontend built successfully!"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "🚀 Ready to deploy to Render!"
echo "📝 Make sure to:"
echo "   1. Push this code to your Git repository"
echo "   2. Connect your repo to Render"
echo "   3. Use the render.yaml configuration"
echo "   4. Set your environment variables in Render dashboard"
