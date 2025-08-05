import { S3Client } from '@aws-sdk/client-s3';

// Validate required environment variables
const requiredEnvVars = {
  R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
  R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
  R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
  R2_PUBLIC_URL: process.env.R2_PUBLIC_URL,
};

// Check for missing environment variables
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const r2Config = {
  accessKeyId: requiredEnvVars.R2_ACCESS_KEY_ID,
  secretAccessKey: requiredEnvVars.R2_SECRET_ACCESS_KEY,
  accountId: requiredEnvVars.R2_ACCOUNT_ID,
  bucketName: requiredEnvVars.R2_BUCKET_NAME,
  publicUrl: requiredEnvVars.R2_PUBLIC_URL,
} as const;

// Initialize S3 client for R2
export const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${r2Config.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: r2Config.accessKeyId!,
    secretAccessKey: r2Config.secretAccessKey!,
  },
});
