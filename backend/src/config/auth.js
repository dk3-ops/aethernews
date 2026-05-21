/**
 * AUTHENTICATION & SECURITY CONFIGURATION
 * JWT, OAuth, session, and security settings
 */

import config from './env.js';

const authConfig = {
  jwt: {
    secret: config.jwt.secret,
    expiresIn: config.jwt.expiresIn,
    refreshExpiresIn: config.jwt.refreshExpiresIn,
    algorithm: config.jwt.algorithm,
    issuer: process.env.JWT_ISSUER || 'omnisphere-ai',
    audience: process.env.JWT_AUDIENCE || 'omnisphere-users',
  },
  
  bcrypt: {
    rounds: config.auth.bcryptRounds,
  },
  
  session: {
    secret: process.env.SESSION_SECRET || config.jwt.secret,
    name: process.env.SESSION_NAME || 'omnisphere.sid',
    maxAge: config.auth.sessionMaxAge,
    secure: config.auth.sessionSecure,
    httpOnly: true,
    sameSite: 'strict',
    domain: process.env.SESSION_DOMAIN,
  },
  
  oauth: {
    github: {
      enabled: !!config.oauth.githubClientId,
      clientId: config.oauth.githubClientId,
      clientSecret: config.oauth.githubClientSecret,
      callbackUrl: `${config.app.baseUrl}/auth/github/callback`,
      scope: 'user:email',
    },
    google: {
      enabled: !!config.oauth.googleClientId,
      clientId: config.oauth.googleClientId,
      clientSecret: config.oauth.googleClientSecret,
      callbackUrl: `${config.app.baseUrl}/auth/google/callback`,
      scope: ['email', 'profile'],
    },
    facebook: {
      enabled: !!config.oauth.facebookAppId,
      appId: config.oauth.facebookAppId,
      appSecret: config.oauth.facebookAppSecret,
      callbackUrl: `${config.app.baseUrl}/auth/facebook/callback`,
      scope: ['email', 'public_profile'],
    },
    microsoft: {
      enabled: !!process.env.MICROSOFT_CLIENT_ID,
      clientId: process.env.MICROSOFT_CLIENT_ID,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
      callbackUrl: `${config.app.baseUrl}/auth/microsoft/callback`,
      scope: ['user.read'],
    },
  },
  
  // CORS configuration
  cors: {
    origin: config.security.corsOrigins,
    credentials: config.security.corsCredentials,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  },
  
  // CSRF protection
  csrf: {
    enabled: process.env.CSRF_ENABLED !== 'false',
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
  },
  
  // Helmet security headers
  helmet: {
    enabled: config.security.helmetEnabled,
    hsts: {
      enabled: config.app.env === 'production',
      maxAge: config.security.hstsMaxAge,
      includeSubDomains: true,
      preload: true,
    },
    csp: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    xssFilter: true,
    noSniff: true,
  },
  
  // Two-factor authentication
  twoFactor: {
    enabled: process.env.TWO_FACTOR_ENABLED === 'true',
    issuer: 'OmniSphere AI',
    window: 1,
  },
  
  // Account lockout
  accountLockout: {
    enabled: process.env.ACCOUNT_LOCKOUT_ENABLED !== 'false',
    maxAttempts: parseInt(process.env.ACCOUNT_LOCKOUT_MAX_ATTEMPTS || '5', 10),
    lockoutDuration: parseInt(process.env.ACCOUNT_LOCKOUT_DURATION || '900000', 10), // 15 minutes
  },
  
  // Password policy
  passwordPolicy: {
    minLength: parseInt(process.env.PASSWORD_MIN_LENGTH || '8', 10),
    requireUppercase: process.env.PASSWORD_REQUIRE_UPPERCASE !== 'false',
    requireLowercase: process.env.PASSWORD_REQUIRE_LOWERCASE !== 'false',
    requireNumbers: process.env.PASSWORD_REQUIRE_NUMBERS !== 'false',
    requireSpecialChars: process.env.PASSWORD_REQUIRE_SPECIAL !== 'false',
    expiryDays: parseInt(process.env.PASSWORD_EXPIRY_DAYS || '90', 10),
  },
};

export default authConfig;
