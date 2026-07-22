# 🚀 Shree Sai Creation — VPS Deployment Guide (Hostinger)

## Prerequisites
- Hostinger VPS (Ubuntu 22.04 recommended)
- Domain pointed to VPS IP
- SSH access to VPS

---

## Step 1: VPS Initial Setup

```bash
# Connect to VPS
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install Nginx + Certbot (SSL)
apt install -y nginx certbot python3-certbot-nginx

# Install PM2 (process manager — keeps app running)
npm install -g pm2

# Create app user (security best practice)
adduser --disabled-password shreesai
su - shreesai
```

---

## Step 2: Deploy Application

```bash
# As shreesai user — clone or upload your project
cd /home/shreesai
git clone https://github.com/yourusername/shree-sai-creation.git app
cd app

# Install dependencies
npm install

# Create production environment file
cp .env.production.example .env.local
nano .env.local
```

**Fill in `.env.local`:**
```env
# Generate strong JWT secret:
# openssl rand -hex 64
JWT_SECRET=<paste 64 char random string here>

ADMIN_EMAIL=admin@shreesaicreation.com
ADMIN_INITIAL_PASSWORD=<strong password>
ALLOWED_ORIGIN=https://shreesaicreation.com
NODE_ENV=production
```

```bash
# Build the app
npm run build

# Create data and logs directories
mkdir -p data logs

# Start with PM2
pm2 start npm --name "shreesai" -- start
pm2 save
pm2 startup  # Follow the printed command to auto-start on reboot
```

---

## Step 3: Nginx Configuration

```bash
# Exit shreesai user, back to root
exit

# Create Nginx config
nano /etc/nginx/sites-available/shreesai
```

Paste this config:
```nginx
server {
    listen 80;
    server_name shreesaicreation.com www.shreesaicreation.com;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml image/svg+xml;
    gzip_min_length 1000;

    # Security headers (extra layer on top of Next.js headers)
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }

    # Cache static assets
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Favicon and robots
    location = /favicon.ico {
        proxy_pass http://localhost:3000;
        expires 1d;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/shreesai /etc/nginx/sites-enabled/
nginx -t  # Test config
systemctl reload nginx
```

---

## Step 4: SSL Certificate (HTTPS — MUST DO)

```bash
# Get free SSL from Let's Encrypt
certbot --nginx -d shreesaicreation.com -d www.shreesaicreation.com

# Auto-renewal test
certbot renew --dry-run
```

Certbot automatically updates your Nginx config with HTTPS!

---

## Step 5: Change Admin Password

After first deploy, immediately change default admin password:

```bash
su - shreesai
cd app
node -e "
const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');
const db = new Database('data/shreesai.db');
const hash = bcrypt.hashSync('YOUR_STRONG_NEW_PASSWORD', 12);
db.prepare('UPDATE admins SET password_hash = ? WHERE email = ?').run(hash, 'admin@shreesaicreation.com');
console.log('Admin password updated!');
db.close();
"
```

---

## Step 6: Firewall Setup

```bash
# Allow only necessary ports
ufw allow 22/tcp    # SSH
ufw allow 80/tcp    # HTTP (Nginx)
ufw allow 443/tcp   # HTTPS (Nginx)
ufw deny 3000       # Block direct Next.js access (Nginx only)
ufw enable
```

---

## Maintenance Commands

```bash
# View app logs
pm2 logs shreesai

# View access logs
tail -f /home/shreesai/app/logs/access-$(date +%Y-%m-%d).log

# Restart app after code update
cd /home/shreesai/app
git pull
npm install
npm run build
pm2 restart shreesai

# View Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

---

## Security Checklist Before Launch

- [ ] JWT_SECRET changed to 64-char random string
- [ ] Admin password changed from default
- [ ] ALLOWED_ORIGIN set to actual domain
- [ ] SSL certificate installed (HTTPS green padlock)
- [ ] Firewall enabled (port 3000 blocked)
- [ ] NODE_ENV=production in .env.local
- [ ] PM2 auto-startup configured
