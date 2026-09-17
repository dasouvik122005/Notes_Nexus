import { google } from 'googleapis';
import { Readable } from 'stream';

const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY 
  ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/"/g, '').replace(/'/g, '')
  : '';

export const isDriveConfigured = Boolean(GOOGLE_SERVICE_ACCOUNT_EMAIL && GOOGLE_PRIVATE_KEY);

/**
 * Uploads a file buffer to Google Drive and sets it to be publicly viewable.
 * Returns the public webViewLink.
 */
export async function uploadToGoogleDrive(
  buffer: Buffer,
  fileName: string,
  mimeType: string = 'application/pdf'
): Promise<string | null> {
  if (!isDriveConfigured) {
    console.warn('[Drive] Google Drive is not configured. Missing Service Account credentials.');
    return null;
  }

  try {
    const auth = new google.auth.JWT({
      email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: GOOGLE_PRIVATE_KEY,
      scopes: ['https://www.googleapis.com/auth/drive.file'],
    });

    const drive = google.drive({ version: 'v3', auth });

    // Convert Buffer to Readable Stream for upload
    const stream = Readable.from(buffer);

    // 1. Upload the file
    const fileMetadata = {
      name: fileName,
      mimeType,
    };
    const media = {
      mimeType,
      body: stream,
    };

    const res = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: 'id, webViewLink',
    });

    const fileId = res.data.id;
    if (!fileId) {
      throw new Error('Failed to retrieve file ID after upload');
    }

    // 2. Set permissions to "Anyone with the link can view"
    await drive.permissions.create({
      fileId: fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Return the link (e.g., https://drive.google.com/file/d/XYZ/view?usp=drivesdk)
    return res.data.webViewLink || null;
  } catch (err) {
    console.error('[Drive] Failed to upload file to Google Drive:', err);
    return null;
  }
}
