#!/bin/bash

echo "🚀 Building frontend..."
npm run build

echo "📦 Frontend built successfully!"

echo "🔧 Starting backend server..."
cd backend
npm run start
