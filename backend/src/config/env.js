/**
 * ENVIRONMENT CONFIGURATION LOADER
 * Loads and validates environment variables
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '../../..');

// Load environment variables in order
const envFiles = [
  `.env`,
  `.env.${process.env.NODE_ENV || 'development'}`,
  `.env.local`
];

envFiles.forEach(file => {
  const filePath = path.join(rootDir, file);
  dotenv.config({ path: filePath });
});

const env = process.env;

// Validate required variables
const required = [
  'DATABASE_URL',
  'REDIS_URL',
  'JWT_SECRET'
];

const missing = required.filter(key => !env[key]);
if (missing.length > 0) {
  console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

const config = {
  app: {
    name: env.APP_NAME || 'OmniSphere AI',
    version: env.APP_VERSION || '1.0.0',
    env: env.NODE_ENV || 'development',
    port: parseInt(env.PORT || '3000', 10),
    host: env.HOST || '0.0.0.0',
    debug: env.DEBUG === 'true' || env.NODE_ENV !== 'production',
    baseUrl: env.BASE_URL || 'http://localhost:3000',
  },
  
  database: {
    url: env.DATABASE_URL,
    host: env.DB_HOST || 'localhost',
    port: parseInt(env.DB_PORT || '5432', 10),
    username: env.DB_USER || 'postgres',
    password: env.DB_PASSWORD || '',
    database: env.DB_NAME || 'omnisphere',
  },
  
  cache: {
    url: env.REDIS_URL,
    host: env.REDIS_HOST || 'localhost',
    port: parseInt(env.REDIS_PORT || '6379', 10),
    password: env.REDIS_PASSWORD || undefined,
    db: parseInt(env.REDIS_DB || '0', 10),
  },
  
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN || '7d',
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN || '30d',
    algorithm: env.JWT_ALGORITHM || 'HS256',
  },
  
  security: {
    corsOrigins: (env.CORS_ORIGINS || 'http://localhost:3000,http://localhost:3001').split(','),
    corsCredentials: env.CORS_CREDENTIALS === 'true',
    helmetEnabled: env.HELMET_ENABLED !== 'false',
    hstsMaxAge: parseInt(env.HSTS_MAX_AGE || '31536000', 10),
  },
  
  rateLimit: {
    enabled: env.RATE_LIMIT_ENABLED !== 'false',
    windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests: parseInt(env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  
  ai: {
    geminiApiKey: env.GEMINI_API_KEY,
    openaiApiKey: env.OPENAI_API_KEY,
    huggingfaceApiKey: env.HUGGINGFACE_API_KEY,
  },
  
  storage: {
    s3AccessKey: env.AWS_ACCESS_KEY_ID,
    s3SecretKey: env.AWS_SECRET_ACCESS_KEY,
    s3Region: env.AWS_REGION || 'us-east-1',
    s3Bucket: env.AWS_S3_BUCKET,
    cloudflareUrl: env.CLOUDFLARE_CDN_URL,
    cloudflareToken: env.CLOUDFLARE_API_TOKEN,
  },
  
  auth: {
    bcryptRounds: parseInt(env.BCRYPT_ROUNDS || '10', 10),
    sessionMaxAge: parseInt(env.SESSION_MAX_AGE || '86400000', 10),
    sessionSecure: env.SESSION_SECURE === 'true',
  },
  
  oauth: {
    githubClientId: env.GITHUB_CLIENT_ID,
    githubClientSecret: env.GITHUB_CLIENT_SECRET,
    googleClientId: env.GOOGLE_CLIENT_ID,
    googleClientSecret: env.GOOGLE_CLIENT_SECRET,
    facebookAppId: env.FACEBOOK_APP_ID,
    facebookAppSecret: env.FACEBOOK_APP_SECRET,
  },
  
  payment: {
    stripeSecretKey: env.STRIPE_SECRET_KEY,
    stripePublishableKey: env.STRIPE_PUBLISHABLE_KEY,
    paypalClientId: env.PAYPAL_CLIENT_ID,
    paypalClientSecret: env.PAYPAL_CLIENT_SECRET,
  },
  
  email: {
    sendgridApiKey: env.SENDGRID_API_KEY,
    mailgunApiKey: env.MAILGUN_API_KEY,
    mailgunDomain: env.MAILGUN_DOMAIN,
  },
  
  websocket: {
    enabled: env.WEBSOCKET_ENABLED !== 'false',
    port: parseInt(env.WEBSOCKET_PORT || '3001', 10),
    pingInterval: parseInt(env.WEBSOCKET_PING_INTERVAL || '30000', 10),
  },
  
  logging: {
    level: env.LOG_LEVEL || 'info',
    format: env.LOG_FORMAT || 'json',
  },
  
  services: {
    aiService: env.AI_SERVICE_URL || 'http://localhost:8000',
    mediaService: env.MEDIA_SERVICE_URL || 'http://localhost:3002',
    websocketService: env.WEBSOCKET_SERVICE_URL || 'http://localhost:3001',
    analyticsService: env.ANALYTICS_SERVICE_URL || 'http://localhost:3003',
  },
  
  features: {
    communicationEnabled: env.FEATURE_COMMUNICATION_ENABLED !== 'false',
    aiAssistantEnabled: env.FEATURE_AI_ASSISTANT_ENABLED !== 'false',
    socialEnabled: env.FEATURE_SOCIAL_ENABLED !== 'false',
    productivityEnabled: env.FEATURE_PRODUCTIVITY_ENABLED !== 'false',
    learningEnabled: env.FEATURE_LEARNING_ENABLED !== 'false',
    entertainmentEnabled: env.FEATURE_ENTERTAINMENT_ENABLED !== 'false',
    businessEnabled: env.FEATURE_BUSINESS_ENABLED !== 'false',
    financeEnabled: env.FEATURE_FINANCE_ENABLED !== 'false',
    offlineEnabled: env.FEATURE_OFFLINE_ENABLED !== 'false',
    analyticsEnabled: env.FEATURE_ANALYTICS_ENABLED !== 'false',
  },
  
  kubernetes: {
    enabled: env.KUBERNETES_ENABLED === 'true',
    namespace: env.KUBERNETES_NAMESPACE || 'default',
    podName: env.KUBERNETES_POD_NAME || 'omnisphere-pod',
  },
};

export default config;
