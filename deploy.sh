#!/bin/bash
##############################################
# Shree Sai Creation — One-Click Deploy Script
# Usage: bash /root/shreesai/deploy.sh
##############################################

set -e

APP_DIR="/root/shreesai"
PM2_NAME="shree-sai-creation"

echo ""
echo "================================================"
echo " 🚀 Shree Sai Creation — Deploying..."
echo "================================================"
echo ""

cd "$APP_DIR"

# Step 1: Pull latest code
echo "[1/4] Pulling latest code from GitHub..."
git fetch origin
git reset --hard origin/main
echo "      ✓ Code updated to: $(git log --oneline -1)"
echo ""

# Step 2: Install dependencies
echo "[2/4] Installing dependencies..."
npm install --silent
echo "      ✓ Dependencies installed"
echo ""

# Step 3: Build
echo "[3/4] Building Next.js app..."
npm run build
echo "      ✓ Build successful"
echo ""

# Step 4: Restart PM2
echo "[4/4] Restarting app..."
pm2 restart "$PM2_NAME"
pm2 save
echo "      ✓ App restarted"
echo ""

echo "================================================"
echo " ✅ Deployment Complete!"
echo " 🌐 Live at: https://shreesaicreation.com"
echo " 📋 PM2 Status:"
pm2 list
echo "================================================"
echo ""
