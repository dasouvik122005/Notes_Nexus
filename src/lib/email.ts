import nodemailer from 'nodemailer';

interface SendAccountVerifiedEmailParams {
  to: string;
  name?: string;
}

/**
 * Checks whether SMTP environment variables are properly configured.
 */
export function isSmtpConfigured(): boolean {
  return Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
}

/**
 * Creates and returns a Nodemailer transporter instance.
 */
function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(process.env.SMTP_PORT) || 465;
  const secure = process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : port === 465;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER?.trim(),
      pass: process.env.SMTP_PASS ? process.env.SMTP_PASS.replace(/\s+/g, '') : '',
    },
  });
}

/**
 * Sends a notification email to a student when their account is verified by an admin.
 */
export async function sendAccountVerifiedEmail({ to, name }: SendAccountVerifiedEmailParams) {
  if (!isSmtpConfigured()) {
    console.warn(
      `[Email Service] SMTP is not configured (missing SMTP_USER or SMTP_PASS). Skipped sending verification email to ${to}.`
    );
    return { success: false, skipped: true, error: 'SMTP not configured' };
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://notes-nexus-jisu.vercel.app').replace(/\/$/, '');
  const uploadUrl = `${siteUrl}/upload`;
  const studentName = name?.trim() ? name.trim() : 'Student';
  const senderEmail = process.env.SMTP_FROM || `"Notes Nexus" <${process.env.SMTP_USER}>`;

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Verified - Notes Nexus</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@600;800;900&family=Inter:wght@500;700&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #FDFBF7; font-family: 'Outfit', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #000000;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FDFBF7; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Neo-Brutalist Card -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #FFFFFF; border: 4px solid #000000; box-shadow: 8px 8px 0px 0px #000000; border-radius: 6px; overflow: hidden; text-align: left;">
          
          <!-- Top Navbar Header -->
          <tr>
            <td style="background-color: #FFFFFF; border-bottom: 3px solid #000000; padding: 18px 24px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left" style="vertical-align: middle;">
                    <a href="${siteUrl}" style="text-decoration: none; display: inline-block;">
                      <img src="${siteUrl}/icon2.png" alt="Notes Nexus" width="180" height="44" style="display: block; border: 0; max-width: 180px; height: auto;" />
                    </a>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="display: inline-block; background-color: #F472B6; color: #000000; font-size: 11px; font-weight: 900; text-transform: uppercase; padding: 6px 12px; border: 2px solid #000000; box-shadow: 3px 3px 0px #000000; border-radius: 4px; letter-spacing: 0.5px;">
                      JIS UNIVERSITY
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Celebration Box (Signature Neo-Brutalist Yellow) -->
          <tr>
            <td style="background-color: #FDE047; border-bottom: 4px solid #000000; padding: 36px 24px; text-align: center;">
              <!-- Verified Badge -->
              <div style="display: inline-block; background-color: #4ADE80; color: #000000; font-size: 13px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; padding: 6px 16px; border: 3px solid #000000; box-shadow: 3px 3px 0px #000000; border-radius: 4px; margin-bottom: 16px;">
                ✓ VERIFIED CONTRIBUTOR
              </div>
              <h1 style="margin: 0 0 10px 0; font-size: 32px; font-weight: 900; color: #000000; line-height: 1.1; letter-spacing: -1px; text-transform: uppercase;">
                YOU ARE VERIFIED!
              </h1>
              <p style="margin: 0 auto; font-size: 15px; font-weight: 700; color: #000000; line-height: 1.5; max-width: 440px;">
                Your student profile has been reviewed and approved by the admin team.
              </p>
            </td>
          </tr>

          <!-- Main Body Content -->
          <tr>
            <td style="padding: 32px 28px; background-color: #FFFFFF;">
              <p style="margin: 0 0 12px 0; font-size: 18px; font-weight: 900; color: #000000;">
                Hey ${studentName},
              </p>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; font-weight: 500; color: #111111;">
                Welcome to the trusted contributor circle of <strong>Notes Nexus</strong>! Your account (<code style="background-color: #FEF9C3; padding: 2px 6px; border: 1px solid #000000; font-weight: 700;">${to}</code>) is officially verified. You can now contribute study materials and help fellow JIS University students excel.
              </p>

              <!-- Section Title Pill -->
              <div style="display: inline-block; background-color: #000000; color: #FFFFFF; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; padding: 5px 12px; margin-bottom: 16px; border-radius: 3px;">
                ⚡ UNLOCKED PRIVILEGES
              </div>

              <!-- Neo-Brutalist Feature Cards -->
              <!-- Card 1: Upload Notes -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FEF9C3; border: 3px solid #000000; box-shadow: 4px 4px 0px #000000; border-radius: 4px; margin-bottom: 14px;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <strong style="font-size: 14px; font-weight: 900; color: #000000; text-transform: uppercase; display: block; margin-bottom: 4px;">
                      📚 UPLOAD STUDY MATERIALS & PYQS
                    </strong>
                    <span style="font-size: 13px; font-weight: 600; color: #222222; line-height: 1.4;">
                      Share handwritten notes, semester modules, and previous years' question papers with your batch.
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Card 2: Verified Badge -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #DCFCE7; border: 3px solid #000000; box-shadow: 4px 4px 0px #000000; border-radius: 4px; margin-bottom: 14px;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <strong style="font-size: 14px; font-weight: 900; color: #000000; text-transform: uppercase; display: block; margin-bottom: 4px;">
                      🎖️ VERIFIED CONTRIBUTOR BADGE
                    </strong>
                    <span style="font-size: 13px; font-weight: 600; color: #222222; line-height: 1.4;">
                      Your verified checkmark and contributor name will be proudly highlighted on all your approved uploads.
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Card 3: Marketplace -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #DBEAFE; border: 3px solid #000000; box-shadow: 4px 4px 0px #000000; border-radius: 4px; margin-bottom: 14px;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <strong style="font-size: 14px; font-weight: 900; color: #000000; text-transform: uppercase; display: block; margin-bottom: 4px;">
                      🛒 STUDENT INSTRUMENT MARKETPLACE
                    </strong>
                    <span style="font-size: 13px; font-weight: 600; color: #222222; line-height: 1.4;">
                      List engineering drafters, lab aprons, and semester textbooks directly for fellow students.
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Card 4: Communities -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #FCE7F3; border: 3px solid #000000; box-shadow: 4px 4px 0px #000000; border-radius: 4px; margin-bottom: 26px;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <strong style="font-size: 14px; font-weight: 900; color: #000000; text-transform: uppercase; display: block; margin-bottom: 4px;">
                      🏛️ CAMPUS COMMUNITIES
                    </strong>
                    <span style="font-size: 13px; font-weight: 600; color: #222222; line-height: 1.4;">
                      Register and lead official student departmental societies, study circles, and clubs.
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Primary Action CTA Button (Exact .neo-button.primary) -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="text-align: center; margin: 30px 0 16px 0;">
                <tr>
                  <td align="center">
                    <a href="${uploadUrl}" style="display: inline-block; background-color: #FDE047; color: #000000; font-family: 'Outfit', 'Inter', -apple-system, sans-serif; font-size: 16px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; padding: 16px 36px; border: 3px solid #000000; box-shadow: 5px 5px 0px #000000; border-radius: 4px; text-decoration: none;">
                      UPLOAD YOUR FIRST NOTE →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Security/Help Notice -->
              <p style="margin: 28px 0 0 0; padding-top: 20px; border-top: 3px dashed #000000; font-size: 12px; line-height: 1.5; font-weight: 600; color: #555555; text-align: center;">
                Need help or have questions? You can reply directly to this email to reach the moderation team.
              </p>
            </td>
          </tr>

          <!-- Neo-Brutalist Footer -->
          <tr>
            <td style="background-color: #FDFBF7; border-top: 3px solid #000000; padding: 22px 24px; text-align: center;">
              <div style="display: inline-block; background-color: #000000; color: #FFFFFF; font-size: 11px; font-weight: 900; text-transform: uppercase; padding: 4px 10px; border-radius: 3px; margin-bottom: 8px;">
                NOTES NEXUS • JIS UNIVERSITY
              </div>
              <p style="margin: 0; font-size: 12px; font-weight: 700; color: #333333;">
                Built by students, for students. Peer-shared & open academic resources.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  const textContent = `
Notes Nexus - Contributor Account Verified!

Hello ${studentName},

Great news! An administrator has reviewed your account and granted you full Verified Contributor access on Notes Nexus.

What you can do now:
- Upload handwritten notes, modules, and Previous Year Questions (PYQs).
- Earn your Verified Contributor badge on your profile and uploads.
- Post listings on the student instruments marketplace.
- Register campus communities and societies.

Get started by uploading your first study material:
${uploadUrl}

Best regards,
The Notes Nexus Team
JIS University Campus Community
`;

  try {
    const transporter = getTransporter();
    const info = await transporter.sendMail({
      from: senderEmail,
      to,
      subject: "🎉 You're Verified! Welcome to Notes Nexus Contributors",
      text: textContent,
      html: htmlContent,
    });

    console.log(`[Email Service] Verification email sent successfully to ${to} (MessageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error(`[Email Service] Failed to send verification email to ${to}:`, error);
    return { success: false, error: error.message };
  }
}
