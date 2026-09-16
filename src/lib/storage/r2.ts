import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '';
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || '';
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '';
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'notes-nexus-materials';

export const isR2Configured = Boolean(
  R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET_NAME
);

// Cloudflare R2 S3 Client
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: R2_ACCOUNT_ID ? `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : undefined,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Generate a short-lived presigned upload URL for student contributions (max 20MB)
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string = 'application/pdf',
  expiresInSeconds: number = 300
): Promise<{ uploadUrl: string; key: string } | null> {
  if (!isR2Configured) {
    console.warn('[R2] R2 is not configured. Unable to generate presigned upload URL.');
    return null;
  }

  try {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const uploadUrl = await getSignedUrl(r2Client, command, { expiresIn: expiresInSeconds });
    return { uploadUrl, key };
  } catch (err) {
    console.error('[R2] Failed to generate presigned upload URL:', err);
    return null;
  }
}

/**
 * Generate a short-lived (e.g. 60s) presigned read URL
 */
export async function getPresignedReadUrl(
  key: string,
  expiresInSeconds: number = 60
): Promise<string | null> {
  if (!isR2Configured) {
    console.warn('[R2] R2 is not configured. Unable to generate presigned read URL.');
    return null;
  }

  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    return await getSignedUrl(r2Client, command, { expiresIn: expiresInSeconds });
  } catch (err) {
    console.error('[R2] Failed to generate presigned read URL:', err);
    return null;
  }
}

/**
 * Fetch object byte stream from R2
 */
export async function getR2ObjectStream(key: string) {
  if (!isR2Configured) {
    return null;
  }

  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });

    const response = await r2Client.send(command);
    return response.Body;
  } catch (err) {
    console.error('[R2] Failed to fetch object stream for key:', key, err);
    return null;
  }
}
