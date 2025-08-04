import { S3Client } from '@aws-sdk/client-s3';

export const r2Config = {
  accessKeyId: 'YOUR_ACCESS_KEY_ID', // Replace with your R2 Access Key ID
  secretAccessKey: 'YOUR_SECRET_KEY', // Replace with your R2 Secret Access Key
  accountId: 'YOUR_ACCOUNT_ID', // Replace with your Cloudflare Account ID
  bucketName: 'YOUR_BUCKET_NAME', // Replace with your R2 bucket name
};

// Initialize S3 client for R2
export const s3Client = new S3Client({
  region: 'auto',
  endpoint: `https://${r2Config.accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: r2Config.accessKeyId,
    secretAccessKey: r2Config.secretAccessKey,
  },
});
