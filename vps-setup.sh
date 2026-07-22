#!/bin/bash
##############################################
# Shree Sai Creation — VPS Setup Script
# Run this on your Hostinger VPS as root:
#   chmod +x vps-setup.sh
#   sudo bash vps-setup.sh
##############################################

set -e
DOMAIN="shreesaicreation.com"
APP_DIR="/home/shreesai/app"
APP_USER="shreesai"

echo "========================================"
echo " Shree Sai Creation — VPS Setup"
echo " Domain: $DOMAIN"
echo "========================================"

# ---- 1. System update ----
echo "[1/8] Updating system..."
apt-get update -y && apt-get upgrade -y

# ---- 2. Install Node.js 20 ----
echo "[2/8] Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# ---- 3. Install Nginx + Certbot ----
echo "[3/8] Installing Nginx + Certbot..."
apt-get install -y nginx certbot python3-certbot-nginx ufw

# ---- 4. Install PM2 ----
echo "[4/8] Installing PM2..."
npm install -g pm2

# ---- 5. Create app user ----
echo "[5/8] Creating app user: $APP_USER..."
id -u $APP_USER &>/dev/null || adduser --disabled-password --gecos "" $APP_USER

# ---- 6. Setup Nginx ----
echo "[6/8] Configuring Nginx..."
cp nginx.conf /etc/nginx/sites-available/shreesai
ln -sf /etc/nginx/sites-available/shreesai /etc/nginx/sites-enabled/shreesai
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# ---- 7. Get SSL Certificate ----
echo "[7/8] Getting SSL certificate from Let's Encrypt..."
certbot --nginx \
  -d $DOMAIN \
  -d www.$DOMAIN \
  --non-interactive \
  --agree-tos \
  --email admin@$DOMAIN \
  --redirect

# ---- 8. Firewall ----
echo "[8/8] Setting up firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw deny 3000/tcp
ufw --force enable

echo ""
echo "========================================"
echo " ✅ VPS setup complete!"
echo " Next: Upload your app to $APP_DIR"
echo " Then run: npm install && npm run build"
echo " Then: pm2 start npm --name shreesai -- start"
echo "========================================"
