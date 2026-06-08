const nodemailer = require('nodemailer');

let transporter = null;

async function getTransporter() {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    await transporter.verify();
    console.log('[Email] Using SMTP:', process.env.SMTP_HOST);
  } else {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('[Email] Using Ethereal test account:', testAccount.user);
  }

  return transporter;
}

async function sendPasswordResetEmail(to, token) {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const resetLink = `${baseUrl}/reset-password/${token}`;

  const transport = await getTransporter();

  const info = await transport.sendMail({
    from: `"TOE Tournament" <${process.env.SMTP_USER || 'noreply@toe-tournament.com'}>`,
    to,
    subject: 'Password Reset - TOE Tournament',
    html: `
      <div style="max-width:520px;margin:0 auto;font-family:Arial,sans-serif;background:#1a2035;padding:32px;border-radius:16px;color:#f1f5f9;">
        <h1 style="color:#00e5ff;text-align:center;margin:0 0 8px;">TOE Tournament</h1>
        <p style="text-align:center;color:#94a3b8;margin:0 0 24px;">Password Reset Request</p>
        <hr style="border:none;border-top:1px solid #334155;margin:0 0 24px;">
        <p style="margin:0 0 16px;">We received a request to reset your password. Click the button below to set a new one. This link expires in <strong>1 hour</strong>.</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${resetLink}" style="display:inline-block;background:#0891b2;color:white;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:16px;font-weight:bold;">Reset Password</a>
        </div>
        <p style="color:#94a3b8;font-size:13px;">If you didn't request this, you can safely ignore this email.</p>
        <hr style="border:none;border-top:1px solid #334155;margin:24px 0 16px;">
        <p style="color:#64748b;font-size:12px;text-align:center;margin:0;">&copy; 2026 TOE Tournament Platform</p>
      </div>
    `,
  });

  console.log('[Email] Password reset sent to:', to, '- Message ID:', info.messageId);

  if (process.env.SMTP_HOST) {
    return { sent: true };
  }

  const previewUrl = nodemailer.getTestMessageUrl(info);
  console.log('[Email] Preview URL:', previewUrl);
  return { sent: true, previewUrl };
}

module.exports = { sendPasswordResetEmail };
