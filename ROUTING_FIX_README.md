# Fixing Trading Challenge Routing Issue

## Problem
When you refresh the page on `/trading-challenge` (or any other route), you get a "Not Found" error. This happens because the server doesn't know about your client-side React routes.

## Solution
I've implemented a comprehensive solution that handles both development and production environments:

### 1. Frontend Changes
- Added a catch-all route (`<Route path="*" element={mainContent} />`) in `App.jsx`
- Updated Vite configuration with `historyApiFallback: true`
- Added preview configuration for production testing

### 2. Backend Changes
- Added static file serving for the React build
- Implemented a catch-all handler that serves `index.html` for all non-API routes
- Added path import for file system operations

### 3. Deployment Files
- Created `_redirects` file for Netlify
- Created `vercel.json` file for Vercel
- Added deployment scripts (`deploy.sh`, `deploy.bat`)

## How to Use

### Development
```bash
# Terminal 1: Start frontend
npm run dev

# Terminal 2: Start backend
cd backend
npm run dev
```

### Production
```bash
# Option 1: Use the deployment script
./deploy.sh  # Linux/Mac
deploy.bat   # Windows

# Option 2: Manual deployment
npm run build
cd backend
npm run start-with-build
```

## What This Fixes
✅ Page refresh on `/trading-challenge` now works  
✅ Direct URL access to any route works  
✅ Backend serves the React app for all non-API routes  
✅ Development server handles routing correctly  
✅ Production deployment handles routing correctly  

## Testing
1. Build and start your application
2. Navigate to `/trading-challenge`
3. Refresh the page - it should work now!
4. Try direct URL access to any route

## Notes
- The backend now serves your React app for all non-API routes
- API routes (`/api/*`) are still handled by your Express server
- Static files are served from the `dist` directory
- This solution works for both development and production environments
