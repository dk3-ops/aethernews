#!/usr/bin/env node

/**
 * OMNISPHERE AI - CONFIGURATION VALIDATOR
 * Run: node scripts/check-config.js
 * 
 * This script validates the entire configuration system
 * and checks for missing or invalid environment variables
 */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// CONFIGURATION CHECKS
// ============================================

const checks = {
  // Core Environment
  core: {
    name: 'Core Configuration',
    required: ['NODE_ENV', 'PORT', 'APP_NAME'],
    optional: ['DEBUG', 'VERBOSE_LOGGING'],
  },

  // Database
  database: {
    name: 'Database Configuration',
    required: ['DATABASE_URL'],
    optional: ['DB_POOL_MIN', 'DB_POOL_MAX'],
  },

  // Redis
  redis: {
    name: 'Redis Configuration',
    required: ['REDIS_URL'],
    optional: ['REDIS_PASSWORD', 'REDIS_DB'],
  },

  // Authentication
  auth: {
    name: 'Authentication Configuration',
    required: ['JWT_SECRET'],
    optional: ['JWT_EXPIRY', 'JWT_REFRESH_SECRET'],
  },

  // AI Services
  ai: {
    name: 'AI Services Configuration',
    required: ['GEMINI_API_KEY'],
    optional: ['OPENAI_API_KEY', 'HUGGINGFACE_API_KEY'],
  },

  // Security
  security: {
    name: 'Security Configuration',
    required: ['CORS_ORIGIN'],
    optional: ['CSRF_ENABLED', 'HELMET_ENABLED'],
  },

  // Storage (Optional but recommended)
  storage: {
    name: 'Storage Configuration',
    required: [],
    optional: ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'S3_BUCKET'],
  },

  // Payments (Optional)
  payments: {
    name: 'Payment Configuration',
    required: [],
    optional: ['STRIPE_SECRET_KEY', 'PAYPAL_CLIENT_ID'],
  },
};

// ============================================
// VALIDATION LOGIC
// ============================================

function loadEnvFiles() {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const appRoot = path.resolve(__dirname, '..');

  const envFiles = [
    path.join(appRoot, '.env'),
    path.join(appRoot, `.env.${nodeEnv}`),
    path.join(appRoot, '.env.local'),
  ];

  for (const envFile of envFiles) {
    if (fs.existsSync(envFile)) {
      dotenv.config({ path: envFile });
    }
  }
}

function validateCheck(checkName, checkConfig) {
  const results = {
    name: checkConfig.name,
    required: { passed: [], failed: [] },
    optional: { passed: [], failed: [] },
  };

  // Check required
  for (const variable of checkConfig.required) {
    if (process.env[variable]) {
      results.required.passed.push(variable);
    } else {
      results.required.failed.push(variable);
    }
  }

  // Check optional
  for (const variable of checkConfig.optional) {
    if (process.env[variable]) {
      results.optional.passed.push(variable);
    } else {
      results.optional.failed.push(variable);
    }
  }

  return results;
}

function validateSecretStrength() {
  const issues = [];

  if (process.env.JWT_SECRET) {
    if (process.env.JWT_SECRET.length < 32) {
      issues.push({
        severity: 'warn',
        variable: 'JWT_SECRET',
        message: 'Should be at least 32 characters',
        current: `${process.env.JWT_SECRET.length} characters`,
      });
    }
  }

  if (process.env.SESSION_SECRET && process.env.SESSION_SECRET.length < 32) {
    issues.push({
      severity: 'warn',
      variable: 'SESSION_SECRET',
      message: 'Should be at least 32 characters',
      current: `${process.env.SESSION_SECRET.length} characters`,
    });
  }

  return issues;
}

function validateSecurityHeaders() {
  const issues = [];

  if (process.env.NODE_ENV === 'production') {
    if (process.env.SESSION_SECURE !== 'true') {
      issues.push({
        severity: 'error',
        variable: 'SESSION_SECURE',
        message: 'Must be true in production',
        current: process.env.SESSION_SECURE || 'false',
      });
    }

    if (process.env.CSRF_COOKIE_SECURE !== 'true') {
      issues.push({
        severity: 'warn',
        variable: 'CSRF_COOKIE_SECURE',
        message: 'Should be true in production',
        current: process.env.CSRF_COOKIE_SECURE || 'false',
      });
    }

    if (process.env.HELMET_HSTS !== 'true') {
      issues.push({
        severity: 'warn',
        variable: 'HELMET_HSTS',
        message: 'Should be true in production',
        current: process.env.HELMET_HSTS || 'false',
      });
    }
  }

  return issues;
}

function printResults(results) {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║   OMNISPHERE AI - CONFIGURATION VALIDATION REPORT          ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log(`Environment: ${process.env.NODE_ENV || 'development'}\n`);

  let totalRequired = 0;
  let totalRequiredPassed = 0;
  let totalOptional = 0;
  let totalOptionalPassed = 0;
  let hasErrors = false;

  // Display check results
  for (const [checkName, result] of Object.entries(results.checks)) {
    console.log(`📋 ${result.name}`);

    // Required
    totalRequired += result.required.passed.length + result.required.failed.length;
    totalRequiredPassed += result.required.passed.length;

    if (result.required.passed.length > 0) {
      console.log(`   ✅ Required: ${result.required.passed.join(', ')}`);
    }

    if (result.required.failed.length > 0) {
      hasErrors = true;
      console.log(`   ❌ Missing: ${result.required.failed.join(', ')}`);
    }

    // Optional
    totalOptional += result.optional.passed.length + result.optional.failed.length;
    totalOptionalPassed += result.optional.passed.length;

    if (result.optional.passed.length > 0) {
      console.log(`   ⚙️  Configured: ${result.optional.passed.length}/${result.optional.passed.length + result.optional.failed.length}`);
    }

    console.log();
  }

  // Security Issues
  if (results.securityIssues.length > 0) {
    console.log('🔐 SECURITY ISSUES');
    for (const issue of results.securityIssues) {
      const icon = issue.severity === 'error' ? '❌' : '⚠️ ';
      console.log(`   ${icon} ${issue.variable}: ${issue.message}`);
      console.log(`      Current: ${issue.current}\n`);
    }
    if (results.securityIssues.some(i => i.severity === 'error')) {
      hasErrors = true;
    }
  }

  // Secret Strength Issues
  if (results.secretIssues.length > 0) {
    console.log('🔑 SECRET STRENGTH');
    for (const issue of results.secretIssues) {
      const icon = issue.severity === 'error' ? '❌' : '⚠️ ';
      console.log(`   ${icon} ${issue.variable}: ${issue.message}`);
      console.log(`      Current: ${issue.current}\n`);
    }
  }

  // Summary
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('📊 SUMMARY');
  console.log(`   Required: ${totalRequiredPassed}/${totalRequired} ✓`);
  console.log(`   Optional: ${totalOptionalPassed}/${totalOptional} configured`);

  if (hasErrors) {
    console.log('\n❌ VALIDATION FAILED\n');
    console.log('Actions:');
    console.log('  1. Copy .env.example to .env');
    console.log('  2. Fill in all required variables');
    console.log('  3. Run this script again\n');
    process.exit(1);
  } else {
    console.log('\n✅ ALL CHECKS PASSED\n');
    console.log('Actions:');
    console.log('  1. Review optional configurations');
    console.log('  2. Enable production security settings if needed');
    console.log('  3. Proceed with deployment\n');
    process.exit(0);
  }
}

// ============================================
// MAIN EXECUTION
// ============================================

function main() {
  // Load environment files
  loadEnvFiles();

  // Run all checks
  const results = {
    checks: {},
    securityIssues: [],
    secretIssues: [],
  };

  for (const [checkName, checkConfig] of Object.entries(checks)) {
    results.checks[checkName] = validateCheck(checkName, checkConfig);
  }

  // Validate security
  results.securityIssues = validateSecurityHeaders();
  results.secretIssues = validateSecretStrength();

  // Print results
  printResults(results);
}

// Run
main();
