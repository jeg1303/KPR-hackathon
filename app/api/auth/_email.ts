// Email utility - Last updated: 2026-09-24 14:32:00
// Force fresh load by Turbopack

console.log('[EMAIL UTIL LOADED] Timestamp: 2026-09-24 14:32:00');

interface EmailConfig {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendEmail(config: EmailConfig): Promise<boolean> {
  try {
    console.log('[SEND EMAIL] Starting email send to:', config.to);
    
    // Dynamic import nodemailer
    const nodemailer = await import('nodemailer');
    console.log('[SEND EMAIL] Nodemailer imported:', typeof nodemailer);
    console.log('[SEND EMAIL] Nodemailer.default:', typeof nodemailer.default);
    console.log('[SEND EMAIL] Nodemailer.default.createTransport:', typeof nodemailer.default?.createTransport);
    
    // Create transporter
    const transporter = nodemailer.default.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    console.log('[SEND EMAIL] Transporter created, verifying connection...');
    
    // Verify connection
    await transporter.verify();
    console.log('[SEND EMAIL] SMTP connection verified successfully');

    // Send mail
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Webros Techo" <webrostecho@gmail.com>',
      to: config.to,
      subject: config.subject,
      text: config.text,
      html: config.html,
    });

    console.log('[SEND EMAIL] Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('[SEND EMAIL] Error sending email:', error);
    return false;
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getOTPEmailTemplate(otp: string): { subject: string; text: string; html: string } {
  const subject = 'Your ReleaseGuard AI Verification Code';
  
  const text = `
Your verification code is: ${otp}

This code will expire in 10 minutes.

If you didn't request this code, please ignore this email.

- Webros Techo Team
  `;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .otp-box { background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0; }
    .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 8px; }
    .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛡️ ReleaseGuard AI</h1>
      <p>Verification Code</p>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>Your verification code for ReleaseGuard AI is:</p>
      <div class="otp-box">
        <div class="otp-code">${otp}</div>
      </div>
      <p><strong>This code will expire in 10 minutes.</strong></p>
      <p>If you didn't request this code, please ignore this email.</p>
      <div class="footer">
        <p>Sent with ❤️ by Webros Techo Team</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  return { subject, text, html };
}
