#!/bin/bash

# DhoniGo Master Deployment Script
# This script guides you through the production deployment of DhoniGo

echo "🚀 Starting DhoniGo Deployment Sequence..."

# 1. Backend & Database (Render.com)
echo -e "\n--- [STEP 1: Backend & Database] ---"
echo "1. Create a Render.com account."
echo "2. Go to 'Blueprints' and connect your GitHub repository."
echo "3. Render will use the 'render.yaml' file to create your PostgreSQL DB and Node.js API."
echo "4. After deployment, get your API URL (e.g., https://dhonigo-api.onrender.com)."

# 2. Frontend (Expo EAS)
echo -e "\n--- [STEP 2: Mobile App Build] ---"
cd frontend
echo "Checking EAS CLI..."
if ! command -v eas &> /dev/null
then
    echo "EAS CLI not found. Install it with: npm install -g eas-cli"
else
    echo "EAS CLI found. Logging in..."
    eas login
    eas build:configure
    echo "Building Android APK..."
    eas build --platform android --profile preview
    echo "Building iOS for TestFlight..."
    eas build --platform ios --profile production
fi
cd ..

# 3. Validation
echo -e "\n--- [STEP 3: Post-Deployment] ---"
echo "1. Run migrations and seed: cd backend && npx prisma db push && npx prisma db seed"
echo "2. Test the health check: curl https://your-api-url.com/health"

echo -e "\n✅ Deployment files ready. Push your code to GitHub to trigger step 1."
