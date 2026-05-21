/**
 * CENTRAL CONFIGURATION EXPORT
 * Aggregates all configuration modules
 */

import config from './env.js';
import databaseConfig from './database.js';
import cacheConfig from './cache.js';
import aiConfig from './ai.js';
import authConfig from './auth.js';
import storageConfig from './storage.js';

export const configurations = {
  app: config.app,
  database: databaseConfig,
  cache: cacheConfig,
  ai: aiConfig,
  auth: authConfig,
  storage: storageConfig,
  
  // Security
  security: config.security,
  rateLimit: config.rateLimit,
  
  // Services
  services: config.services,
  
  // Features
  features: config.features,
  
  // Logging
  logging: config.logging,
  sentry: config.sentry,
  
  // Kubernetes
  kubernetes: config.kubernetes,
};

/**
 * Initialize all configurations
 */
export async function initializeAllConfigs() {
  try {
    console.log('\n╔════════════════════════════════════════════════════╗');
    console.log('║   OmniSphere AI - Configuration Initialization      ║');
    console.log('╚════════════════════════════════════════════════════╝\n');

    // Print environment info
    console.log(`📍 Environment: ${config.app.env.toUpperCase()}`);
    console.log(`📱 App: ${config.app.name} v${config.app.version}`);
    console.log(`🔌 Port: ${config.app.port}\n`);

    // Print database info
    console.log(`🗄️  Database`);
    console.log(`   Host: ${databaseConfig.host}`);
    console.log(`   Port: ${databaseConfig.port}`);
    console.log(`   Pool: ${databaseConfig.pool.min}-${databaseConfig.pool.max}\n`);

    // Print cache info
    console.log(`📦 Cache (Redis)`);
    console.log(`   Host: ${cacheConfig.host}`);
    console.log(`   Port: ${cacheConfig.port}`);
    console.log(`   Cluster: ${cacheConfig.cluster ? 'enabled' : 'disabled'}\n`);

    // Print AI info
    console.log(`🤖 AI Services`);
    console.log(`   Primary: ${aiConfig.primaryProvider}`);
    console.log(`   Fallback: ${aiConfig.fallbackProviders.join(', ')}`);
    console.log(`   Providers Enabled:`);
    console.log(`      • Gemini: ${aiConfig.gemini.enabled ? '✓' : '✗'}`);
    console.log(`      • OpenAI: ${aiConfig.openai.enabled ? '✓' : '✗'}`);
    console.log(`      • HuggingFace: ${aiConfig.huggingface.enabled ? '✓' : '✗'}`);
    console.log(`      • Local: ${aiConfig.local.enabled ? '✓' : '✗'}\n`);

    // Print auth info
    console.log(`🔐 Authentication`);
    console.log(`   JWT: ✓`);
    console.log(`   Bcrypt Rounds: ${authConfig.bcrypt.rounds}`);
    console.log(`   OAuth Providers:`);
    console.log(`      • GitHub: ${authConfig.oauth.github.enabled ? '✓' : '✗'}`);
    console.log(`      • Google: ${authConfig.oauth.google.enabled ? '✓' : '✗'}`);
    console.log(`      • Facebook: ${authConfig.oauth.facebook.enabled ? '✗' : '✗'}`);
    console.log(`      • Microsoft: ${authConfig.oauth.microsoft.enabled ? '✗' : '✗'}\n`);

    // Print storage info
    console.log(`💾 Storage`);
    console.log(`   Default Provider: ${storageConfig.defaultProvider}`);
    console.log(`   S3: ${storageConfig.s3.enabled ? '✓' : '✗'}`);
    console.log(`   Cloudflare CDN: ${storageConfig.cloudflare.enabled ? '✓' : '✗'}`);
    console.log(`   Local: ✓`);
    console.log(`   Max File Size: ${storageConfig.upload.maxSizeMb} MB\n`);

    // Print security info
    console.log(`🛡️  Security`);
    console.log(`   CORS Enabled: ✓`);
    console.log(`   CSRF Protected: ${authConfig.csrf.enabled ? '✓' : '✗'}`);
    console.log(`   Helmet Headers: ${authConfig.helmet.enabled ? '✓' : '✗'}`);
    console.log(`   Rate Limiting: ${config.rateLimit.enabled ? '✓' : '✗'}`);
    console.log(`   HSTS Enabled: ${authConfig.helmet.hsts.enabled ? '✓' : '✗'}\n`);

    // Print features info
    const enabledFeatures = Object.entries(config.features)
      .filter(([_, enabled]) => enabled)
      .map(([name]) => name);

    console.log(`✨ Features Enabled (${enabledFeatures.length}/10)`);
    enabledFeatures.forEach(feature => {
      console.log(`   • ${feature.replace(/([A-Z])/g, ' $1').trim()}`);
    });
    console.log('');

    // Print WebSocket info if enabled
    if (config.websocket.enabled) {
      console.log(`📡 WebSocket`);
      console.log(`   Port: ${config.websocket.port}`);
      console.log(`   Ping Interval: ${config.websocket.pingInterval}ms\n`);
    }

    // Print services info
    console.log(`🔗 Microservices`);
    console.log(`   AI Service: ${config.services.aiService}`);
    console.log(`   Media Service: ${config.services.mediaService}`);
    console.log(`   WebSocket: ${config.services.websocketService}`);
    console.log(`   Analytics: ${config.services.analyticsService}\n`);

    console.log('✅ Configuration loaded successfully!\n');

    return configurations;
  } catch (error) {
    console.error('❌ Configuration initialization failed:', error.message);
    throw error;
  }
}

/**
 * Get configuration summary
 */
export function getConfigSummary() {
  return {
    environment: config.app.env,
    appName: config.app.name,
    appVersion: config.app.version,
    port: config.app.port,
    database: {
      host: databaseConfig.host,
      port: databaseConfig.port,
      name: databaseConfig.database,
    },
    cache: {
      host: cacheConfig.host,
      port: cacheConfig.port,
    },
    ai: {
      primary: aiConfig.primaryProvider,
      fallback: aiConfig.fallbackProviders,
    },
    auth: {
      jwtAlgorithm: authConfig.jwt.algorithm,
      sessionMaxAge: authConfig.session.maxAge,
    },
    storage: {
      provider: storageConfig.defaultProvider,
      maxFileSize: storageConfig.upload.maxSize,
    },
    features: Object.entries(config.features)
      .filter(([_, v]) => v)
      .map(([k]) => k),
  };
}

export default configurations;
