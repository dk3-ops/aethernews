/**
 * DATABASE CONFIGURATION
 * PostgreSQL connection and pooling setup
 */

import config from './env.js';

const databaseConfig = {
  host: config.database.host,
  port: config.database.port,
  user: config.database.username,
  password: config.database.password,
  database: config.database.database,
  
  // Connection pooling
  pool: {
    min: parseInt(process.env.DB_POOL_MIN || '2', 10),
    max: parseInt(process.env.DB_POOL_MAX || '20', 10),
    idleTimeoutMillis: parseInt(process.env.DB_IDLE_TIMEOUT || '30000', 10),
    connectionTimeoutMillis: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000', 10),
  },
  
  // SSL configuration
  ssl: config.app.env === 'production' ? {
    rejectUnauthorized: false,
  } : false,
  
  // Statement timeout
  statement_timeout: 30000,
  query_timeout: 30000,
  
  // Application name for debugging
  application_name: `${config.app.name}-${config.app.env}`,
};

export default databaseConfig;
