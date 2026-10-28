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
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 40px 15px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border: 3px solid #0f172a; border-radius: 12px; box-shadow: 6px 6px 0px #0f172a; overflow: hidden;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background-color: #0f172a; padding: 24px 32px; text-align: left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; font-size: 24px; font-weight: 900; color: #ffffff; letter-spacing: -0.5px;">
                      NOTES <span style="color: #60a5fa;">NEXUS</span>
                    </h1>
                    <p style="margin: 4px 0 0 0; font-size: 13px; color: #94a3b8; font-weight: 600;">
                      JIS University Academic Resource & Study Exchange
                    </p>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="display: inline-block; background-color: #16a34a; color: #ffffff; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 6px 12px; border-radius: 20px; letter-spacing: 0.5px;">
                      ✓ Verified
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Hero Image / Celebration Accent -->
          <tr>
            <td style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 36px 32px; text-align: center; color: #ffffff;">
              <div style="display: inline-block; width: 64px; height: 64px; line-height: 64px; background-color: #ffffff; border-radius: 50%; font-size: 32px; margin-bottom: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                🎉
              </div>
              <h2 style="margin: 0 0 8px 0; font-size: 26px; font-weight: 800; color: #ffffff;">
                You're Officially Verified!
              </h2>
              <p style="margin: 0; font-size: 15px; color: #e0e7ff; max-width: 440px; margin: 0 auto; line-height: 1.5;">
                An administrator has reviewed your account and granted you full Verified Contributor access.
              </p>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding: 36px 32px;">
              <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6; font-weight: 600; color: #1e293b;">
                Hello ${studentName},
              </p>
              <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #475569;">
                Welcome to the trusted contributor circle of <strong>Notes Nexus</strong>. Your account (<code>${to}</code>) is now officially unlocked, meaning you can contribute study materials and help your fellow JIS University batchmates excel.
              </p>

              <!-- Unlocked Perks Card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 20px; margin-bottom: 28px;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 14px 0; font-size: 14px; font-weight: 800; text-transform: uppercase; color: #0f172a; letter-spacing: 0.5px;">
                      ✨ What You Can Do Now:
                    </h3>
                    <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #334155;">
                          📚 <strong>Upload Notes & PYQs:</strong> Share handwritten notes, organized modules, and previous years' question papers.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #334155;">
                          🎖️ <strong>Verified Badge:</strong> Your contributor badge will now display on your profile and every approved upload.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #334155;">
                          🛒 <strong>Student Marketplace:</strong> List engineering tools, drafters, aprons, and semester textbooks.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-size: 14px; color: #334155;">
                          🏛️ <strong>Campus Communities:</strong> Register and lead official student departmental societies and clubs.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Call to Action Buttons -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="text-align: center; margin: 28px 0 20px 0;">
                <tr>
                  <td align="center">
                    <a href="${uploadUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 32px; border-radius: 8px; border: 2px solid #0f172a; box-shadow: 4px 4px 0px #0f172a;">
                      Upload Your First Note →
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Security/Help Notice -->
              <p style="margin: 28px 0 0 0; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 13px; line-height: 1.5; color: #64748b;">
                If you did not request this or have questions regarding academic guidelines, you can reach out directly to the moderation team by replying to this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; border-top: 2px solid #0f172a; padding: 20px 32px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #64748b; font-weight: 600;">
                Notes Nexus • JIS University Campus Community
              </p>
              <p style="margin: 4px 0 0 0; font-size: 11px; color: #94a3b8;">
                Built by students, for students. Kolkata, West Bengal.
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
