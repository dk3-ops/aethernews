/**
 * STORAGE CONFIGURATION
 * Cloud storage, CDN, and file upload settings
 */

import config from './env.js';

const storageConfig = {
  defaultProvider: process.env.STORAGE_DEFAULT_PROVIDER || 'local',
  
  s3: {
    enabled: !!config.storage.s3AccessKey,
    accessKeyId: config.storage.s3AccessKey,
    secretAccessKey: config.storage.s3SecretKey,
    region: config.storage.s3Region,
    bucket: config.storage.s3Bucket,
    acl: process.env.S3_ACL || 'private',
    endpoint: process.env.S3_ENDPOINT,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
  },
  
  cloudflare: {
    enabled: !!config.storage.cloudflareUrl,
    cdnUrl: config.storage.cloudflareUrl,
    apiToken: config.storage.cloudflareToken,
    accountId: process.env.CLOUDFLARE_ACCOUNT_ID,
    zoneId: process.env.CLOUDFLARE_ZONE_ID,
    cacheTtl: parseInt(process.env.CLOUDFLARE_CACHE_TTL || '3600', 10),
  },
  
  local: {
    enabled: true,
    uploadDir: process.env.LOCAL_UPLOAD_DIR || './uploads',
    publicDir: process.env.LOCAL_PUBLIC_DIR || './public',
  },
  
  // Upload configuration
  upload: {
    maxSize: parseInt(process.env.FILE_UPLOAD_MAX_SIZE || '5242880', 10), // 5MB default
    maxSizeMb: parseInt(process.env.FILE_UPLOAD_MAX_SIZE || '5242880', 10) / 1024 / 1024,
    allowedMimeTypes: (process.env.FILE_UPLOAD_ALLOWED_TYPES || 
      'image/jpeg,image/png,image/gif,video/mp4,audio/mpeg,application/pdf').split(','),
    allowedExtensions: (process.env.FILE_UPLOAD_ALLOWED_EXTENSIONS || 
      'jpg,jpeg,png,gif,mp4,mp3,pdf,doc,docx,xls,xlsx').split(','),
    scanVirus: process.env.FILE_UPLOAD_SCAN_VIRUS === 'true',
  },
  
  // Image optimization
  imageOptimization: {
    enabled: process.env.IMAGE_OPTIMIZATION_ENABLED !== 'false',
    generateThumbnails: true,
    thumbnailSizes: [128, 256, 512],
    quality: parseInt(process.env.IMAGE_QUALITY || '80', 10),
  },
  
  // Video processing
  videoProcessing: {
    enabled: process.env.VIDEO_PROCESSING_ENABLED !== 'false',
    generatePreview: true,
    previewAt: parseInt(process.env.VIDEO_PREVIEW_AT || '5', 10), // seconds
    maxDuration: parseInt(process.env.VIDEO_MAX_DURATION || '3600', 10), // 1 hour
  },
  
  // Backup configuration
  backup: {
    enabled: process.env.BACKUP_ENABLED === 'true',
    frequency: process.env.BACKUP_FREQUENCY || 'daily',
    retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30', 10),
  },
  
  // Signing configuration
  signing: {
    expiresIn: parseInt(process.env.SIGNED_URL_EXPIRES_IN || '3600', 10),
  },
};

export default storageConfig;
