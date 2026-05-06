# Deployment Guide - Team Task Management

## Pre-Deployment Checklist

- [ ] Update `.env` file with production values
- [ ] Generate strong JWT_SECRET (use `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- [ ] Ensure MongoDB Atlas connection string is correct
- [ ] Update CORS_ORIGIN with your frontend domain
- [ ] Create production MongoDB database
- [ ] Test application locally with NODE_ENV=production
- [ ] Build frontend: `cd client && npm run build`
- [ ] Remove `.env` from git (add to .gitignore)

## Deployment Options

### Option 1: Docker Deployment (Recommended)

#### Prerequisites
- Docker installed
- Docker account (for Docker Hub)

#### Build and Deploy
```bash
# Build Docker image
docker build -t team-task-management:latest .

# Test locally
docker run -p 5000:5000 \
  -e MONGODB_URI="your_mongodb_uri" \
  -e JWT_SECRET="your_jwt_secret" \
  -e CORS_ORIGIN="http://localhost:3000" \
  team-task-management:latest

# Push to Docker Hub
docker tag team-task-management:latest your-username/team-task-management:latest
docker push your-username/team-task-management:latest
```

### Option 2: Heroku Deployment

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set MONGODB_URI="your_mongodb_uri"
heroku config:set JWT_SECRET="your_jwt_secret"
heroku config:set CORS_ORIGIN="https://your-app-name.herokuapp.com"
heroku config:set NODE_ENV="production"

# Deploy
git push heroku main
```

### Option 3: Manual VPS Deployment (Ubuntu/Debian)

```bash
# SSH into server
ssh user@your-server-ip

# Install Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Clone repository
git clone your-repo-url
cd team-task-management

# Install dependencies
npm install
cd client && npm install && npm run build && cd ..
cd backend && npm install && cd ..

# Create .env file
nano backend/.env
# Add your production environment variables

# Start application with PM2
pm2 start backend/server.js --name "team-task-management"
pm2 save
pm2 startup

# Install and configure Nginx
sudo apt-get install -y nginx

# Create Nginx config
sudo nano /etc/nginx/sites-available/team-task-management

# Add this configuration:
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Enable site
sudo ln -s /etc/nginx/sites-available/team-task-management /etc/nginx/sites-enabled/

# Test Nginx
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx

# Setup SSL with Let's Encrypt
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### Option 4: Deploy to AWS EC2

1. Create EC2 instance (Ubuntu 20.04 LTS)
2. Configure security groups (allow 80, 443, 22)
3. Follow VPS deployment steps above
4. Optional: Set up CloudFront CDN for frontend
5. Optional: Use RDS for managed MongoDB (or keep MongoDB Atlas)

### Option 5: Deploy to Render

1. Push code to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect GitHub repository
5. Configure environment variables
6. Deploy

## Post-Deployment

1. **Test Endpoints**
```bash
# Health check
curl https://your-domain.com/api/auth/me

# Test signup
curl -X POST https://your-domain.com/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

2. **Monitor Logs**
- Docker: `docker logs container-id`
- PM2: `pm2 logs team-task-management`
- Heroku: `heroku logs --tail`

3. **Setup Monitoring**
- Add error tracking (Sentry)
- Add performance monitoring (New Relic)
- Setup alerts for crashes

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| MONGODB_URI | MongoDB connection string | mongodb+srv://user:pass@cluster.mongodb.net/db |
| JWT_SECRET | Secret for JWT signing | (32+ char random string) |
| PORT | Server port | 5000 |
| NODE_ENV | Environment | production |
| CORS_ORIGIN | Allowed frontend origin | https://your-domain.com |

## Troubleshooting

### Application won't start
- Check MongoDB connection: `ping cluster0.mongodb.net`
- Verify environment variables are set correctly
- Check logs for detailed error messages

### Frontend routes not working
- Ensure React build is in `/public` folder
- Verify server.js serves static files
- Check REACT_APP_API_URL is correct

### CORS errors
- Update CORS_ORIGIN environment variable
- Ensure it matches your frontend domain exactly
- Check browser console for specific error

### High memory usage
- Restart application: `pm2 restart team-task-management`
- Check for memory leaks in logs
- Consider upgrading server resources

## Performance Optimization

1. Enable gzip compression in Nginx
2. Add caching headers for static files
3. Use MongoDB indexes for frequently queried fields
4. Consider Redis for session caching
5. Setup CDN for static assets

## Security Hardening

- [ ] Enable HTTPS/SSL certificate
- [ ] Setup firewall rules
- [ ] Regular security updates
- [ ] Add rate limiting (express-rate-limit)
- [ ] Add helmet.js for security headers
- [ ] Setup CSRF protection
- [ ] Regular backups of MongoDB
- [ ] Monitor and log all access
