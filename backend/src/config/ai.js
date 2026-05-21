/**
 * AI SERVICES CONFIGURATION
 * Multi-provider AI setup with fallback chain
 */

import config from './env.js';

const aiConfig = {
  primaryProvider: process.env.AI_PRIMARY_PROVIDER || 'gemini',
  
  fallbackProviders: [
    'gemini',
    'openai',
    'huggingface',
    'local'
  ],
  
  gemini: {
    enabled: !!config.ai.geminiApiKey,
    apiKey: config.ai.geminiApiKey,
    model: process.env.GEMINI_MODEL || 'gemini-pro',
    version: process.env.GEMINI_API_VERSION || 'v1',
    temperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.GEMINI_MAX_TOKENS || '2000', 10),
    timeout: parseInt(process.env.GEMINI_TIMEOUT || '30000', 10),
  },
  
  openai: {
    enabled: !!config.ai.openaiApiKey,
    apiKey: config.ai.openaiApiKey,
    model: process.env.OPENAI_MODEL || 'gpt-4',
    temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '2000', 10),
    timeout: parseInt(process.env.OPENAI_TIMEOUT || '30000', 10),
    organizationId: process.env.OPENAI_ORG_ID,
  },
  
  huggingface: {
    enabled: !!config.ai.huggingfaceApiKey,
    apiKey: config.ai.huggingfaceApiKey,
    model: process.env.HUGGINGFACE_MODEL || 'mistralai/Mistral-7B-Instruct-v0.1',
    temperature: parseFloat(process.env.HUGGINGFACE_TEMPERATURE || '0.7'),
    maxNewTokens: parseInt(process.env.HUGGINGFACE_MAX_TOKENS || '1000', 10),
    timeout: parseInt(process.env.HUGGINGFACE_TIMEOUT || '30000', 10),
  },
  
  local: {
    enabled: process.env.LOCAL_AI_ENABLED === 'true',
    modelPath: process.env.LOCAL_AI_MODEL_PATH || './models',
    modelName: process.env.LOCAL_AI_MODEL_NAME || 'mistral',
    gpuEnabled: process.env.LOCAL_AI_GPU === 'true',
    threads: parseInt(process.env.LOCAL_AI_THREADS || '4', 10),
  },
  
  // Caching
  caching: {
    enabled: process.env.AI_CACHING_ENABLED !== 'false',
    ttl: parseInt(process.env.AI_CACHE_TTL || '3600', 10),
  },
  
  // Rate limiting
  rateLimit: {
    enabled: process.env.AI_RATE_LIMIT_ENABLED !== 'false',
    requestsPerMinute: parseInt(process.env.AI_REQUESTS_PER_MINUTE || '60', 10),
    requestsPerHour: parseInt(process.env.AI_REQUESTS_PER_HOUR || '1000', 10),
  },
  
  // Cost tracking
  costTracking: {
    enabled: process.env.AI_COST_TRACKING_ENABLED === 'true',
    maxMonthlyCostUsd: parseFloat(process.env.AI_MAX_MONTHLY_COST || '100'),
  },
};

export default aiConfig;
