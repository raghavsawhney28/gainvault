@echo off
echo 🚀 Building frontend...
call npm run build

echo 📦 Frontend built successfully!

echo 🔧 Starting backend server...
cd backend
call npm run start
