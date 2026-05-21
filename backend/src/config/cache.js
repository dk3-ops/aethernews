/**
 * CACHE CONFIGURATION
 * Redis caching and session storage setup
 */

import config from './env.js';

const cacheConfig = {
  host: config.cache.host,
  port: config.cache.port,
  password: config.cache.password,
  db: config.cache.db,
  
  // Cluster configuration
  cluster: process.env.REDIS_CLUSTER_ENABLED === 'true',
  clusterOptions: {
    enableReadyCheck: false,
    maxRedirections: 3,
    retryDelayOnFailover: 100,
    retryDelayOnClusterDown: 100,
    enableOfflineQueue: true,
  },
  
  // Connection settings
  retryStrategy: (times) => Math.min(times * 50, 2000),
  reconnectOnError: () => true,
  
  // Timeout settings
  connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT || '10000', 10),
  commandTimeout: parseInt(process.env.REDIS_COMMAND_TIMEOUT || '5000', 10),
  
  // TTL defaults
  ttl: {
    session: parseInt(process.env.REDIS_SESSION_TTL || '86400', 10), // 24 hours
    cache: parseInt(process.env.REDIS_CACHE_TTL || '3600', 10), // 1 hour
    temporary: parseInt(process.env.REDIS_TEMP_TTL || '300', 10), // 5 minutes
  },
  
  // Key prefixes
  keyPrefix: `${config.app.name}:${config.app.env}:`,
  
  // Sentinel configuration (if using sentinel)
  sentinelEnabled: process.env.REDIS_SENTINEL_ENABLED === 'true',
  sentinels: process.env.REDIS_SENTINELS ? 
    process.env.REDIS_SENTINELS.split(',').map(s => {
      const [host, port] = s.split(':');
      return { host, port: parseInt(port, 10) };
    }) : [],
  sentinelName: process.env.REDIS_SENTINEL_NAME || 'mymaster',
};

export default cacheConfig;
