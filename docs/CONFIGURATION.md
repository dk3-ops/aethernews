# Environment Configuration Setup Guide

## Overview

OmniSphere AI uses a comprehensive, enterprise-grade environment configuration system that supports multiple environments (development, staging, production) with type-safe, validated configuration modules.

## Structure

```
backend/src/config/
├── env.js          # Core environment loader & validator
├── database.js     # PostgreSQL configuration
├── cache.js        # Redis configuration
├── ai.js           # AI services configuration
├── auth.js         # Authentication & security
├── storage.js      # Cloud storage & CDN
└── index.js        # Central export point
```

## Setup Instructions

### 1. Initial Setup

```bash
# Copy environment template
cp .env.example .env

# Edit with your values
nano .env

# Validate configuration
npm run check-config
```

### 2. Environment Variables

#### Required (Must Set)
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `JWT_SECRET` - JWT token secret (min 32 chars in production)
- `GEMINI_API_KEY` - Google Gemini API key

#### Recommended
- `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` - S3 storage
- `STRIPE_SECRET_KEY` - Payment processing
- `SENDGRID_API_KEY` - Email service

### 3. Environment-Specific Configurations

Create environment-specific files:

```bash
# Development
.env.development

# Staging
.env.staging

# Production
.env.production

# Local overrides
.env.local
```

Loading order (later files override earlier):
1. `.env`
2. `.env.{NODE_ENV}`
3. `.env.local`

### 4. Security Best Practices

#### Production
```bash
# NEVER commit .env file
git add .env.example  # Only commit example
git add .env.*.example  # Only examples

# Use strong secrets (minimum 32 characters)
JWT_SECRET=generate-using-: openssl rand -base64 32

# Enable security headers
HELMET_HSTS=true
CSRF_ENABLED=true
SESSION_SECURE=true
```

#### Development
```bash
# Use weaker secrets (for local testing)
JWT_SECRET=dev-secret-key-12345
SESSION_SECURE=false
ALLOW_INSECURE_REQUESTS=true
```

## Configuration Modules

### env.js
Central environment loader with:
- Automatic .env file loading
- Environment variable validation
- Type-safe configuration object
- Development/staging/production support

**Usage:**
```javascript
import config from './config/env.js';
console.log(config.database.url);
console.log(config.app.port);
```

### database.js
PostgreSQL connection configuration:
```javascript
import { databaseConfig } from './config/database.js';
// Max connections, SSL, timeouts, etc.
```

### cache.js
Redis caching configuration:
```javascript
import { cacheConfig } from './config/cache.js';
// Connection pooling, TTLs, cluster mode
```

### ai.js
Multi-provider AI configuration:
```javascript
import { aiConfig } from './config/ai.js';
// Gemini, OpenAI, HuggingFace, Local AI fallback
```

### auth.js
Authentication and security:
```javascript
import { authConfig } from './config/auth.js';
// JWT, OAuth, CORS, Rate Limiting, CSRF
```

### storage.js
Cloud storage and CDN:
```javascript
import { storageConfig } from './config/storage.js';
// S3, Cloudflare CDN, local uploads
```

## Validation

### Automatic Validation
Configuration is validated on application startup:
```javascript
import { initializeConfig } from './config/env.js';
await initializeConfig();
```

### Manual Validation
```bash
# Check configuration
npm run check-config

# Output example:
# ✅ All checks passed
# Required: 4/4 ✓
# Optional: 15/20 configured
```

## Environment-Specific Examples

### Development Setup
```bash
# .env.development
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/omnisphere_dev
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev-secret-key-change-in-production
DEBUG=true
```

### Staging Setup
```bash
# .env.staging
NODE_ENV=staging
DATABASE_URL=postgresql://user:pass@staging-db.example.com:5432/omnisphere_staging
REDIS_URL=redis://staging-redis:6379
JWT_SECRET=staging-secret-key-long-and-strong-32-chars-min
HELMET_HSTS=true
```

### Production Setup
```bash
# .env.production
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@prod-db.aws.com:5432/omnisphere_prod
REDIS_URL=redis://prod-redis-cluster:6379
JWT_SECRET=production-secret-key-very-long-secure-random-string-32-chars-min
SESSION_SECURE=true
HELMET_HSTS=true
CSRF_ENABLED=true
```

## Deployment Guides

### Docker Deployment
```bash
# Build with environment
docker build --build-arg NODE_ENV=production -t omnisphere:latest .

# Run with environment variables
docker run -e DATABASE_URL=postgresql://... \
           -e REDIS_URL=redis://... \
           -e JWT_SECRET=... \
           omnisphere:latest
```

### Kubernetes Deployment
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: omnisphere-secrets
type: Opaque
stringData:
  DATABASE_URL: postgresql://...
  REDIS_URL: redis://...
  JWT_SECRET: ...

---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: omnisphere-backend
spec:
  template:
    spec:
      containers:
      - name: backend
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: omnisphere-secrets
              key: DATABASE_URL
```

### Vercel Deployment
1. Connect GitHub repository
2. Set environment variables in Vercel dashboard
3. Auto-deploys on push

### Heroku Deployment
```bash
# Set config vars
heroku config:set DATABASE_URL=postgresql://...
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

## Troubleshooting

### Missing Environment Variables
```
Error: Missing required environment variables: DATABASE_URL
```
**Solution:** Copy `.env.example` to `.env` and fill in values

### Configuration Not Loading
```bash
# Check which .env files exist
ls -la .env*

# Manually load
NODE_ENV=production npm start
```

### Security Warnings
```bash
# Run validation to see warnings
npm run check-config

# Fix issues in .env file and rerun
```

## Adding New Configuration

1. Define in `.env.example`
2. Add to `env.js` config object
3. Create module if needed (e.g., `payment.js`)
4. Export from `index.js`
5. Update validation if required

Example:
```javascript
// In env.js
payment: {
  stripeKey: process.env.STRIPE_SECRET_KEY,
  paypalId: process.env.PAYPAL_CLIENT_ID,
}

// Usage
import config from './config/env.js';
config.payment.stripeKey;
```

## Environment Variable Reference

See `.env.example` for complete list of 230+ configuration options organized by:
- Node environment & app settings
- Database credentials
- Redis configuration
- Supabase setup
- JWT & authentication
- AI services
- AWS S3 & CDN
- Email service
- Payment processing
- OAuth providers
- Security & CORS
- Rate limiting
- File uploads
- WebSocket
- Logging & monitoring
- Feature flags
- Kubernetes & Docker
- And more...

## Security Checklist

- [ ] Never commit `.env` files
- [ ] Use strong secrets (32+ characters in production)
- [ ] Enable HTTPS/TLS in production
- [ ] Enable security headers (Helmet, HSTS, CSP)
- [ ] Use environment-specific configurations
- [ ] Rotate secrets regularly
- [ ] Use secrets manager for production
- [ ] Enable rate limiting
- [ ] Configure CORS properly
- [ ] Enable CSRF protection
- [ ] Set secure session cookies
- [ ] Validate all environment variables
- [ ] Monitor configuration changes

## Support

For issues or questions:
- Check `.env.example` for variable descriptions
- Run `npm run check-config` for validation
- See deployment guides above
- Check logs: `docker-compose logs backend`
