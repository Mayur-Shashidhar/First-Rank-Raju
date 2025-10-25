/**
 * Email Service
 * Handles sending verification and password reset emails
 */

const nodemailer = require('nodemailer');

// For development mode - just log email details instead of sending
const sendDevEmail = (to, subject, html, verificationUrl) => {
  console.log('\n📧 ==============================================');
  console.log('📧 EMAIL WOULD BE SENT (Development Mode)');
  console.log('📧 ==============================================');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('Verification/Reset URL:', verificationUrl);
  console.log('📧 ==============================================\n');
  
  return { success: true, messageId: 'dev-mode-' + Date.now() };
};

// Send verification email
const sendVerificationEmail = async (email, name, verificationToken) => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

    // In development, just log the email
    if (process.env.NODE_ENV !== 'production') {
      return sendDevEmail(
        email,
        'Verify Your Email - First Rank Raju',
        'verification email',
        verificationUrl
      );
    }

    // Production email sending (requires real SMTP configuration)
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: `"First Rank Raju" <${process.env.EMAIL_USER || 'noreply@firstrankraju.com'}>`,
      to: email,
      subject: 'Verify Your Email - First Rank Raju',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Welcome to First Rank Raju!</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>Thank you for signing up! We're excited to help you on your learning journey.</p>
              <p>Please verify your email address by clicking the button below:</p>
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email Address</a>
              </div>
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
              <p><strong>This link will expire in 24 hours.</strong></p>
              <p>If you didn't create an account, you can safely ignore this email.</p>
              <div class="footer">
                <p>© 2025 First Rank Raju. All rights reserved.</p>
                <p>Your AI-powered study companion</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Verification email sent!');
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, name, resetToken) => {
  try {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    // In development, just log the email
    if (process.env.NODE_ENV !== 'production') {
      return sendDevEmail(
        email,
        'Reset Your Password - First Rank Raju',
        'password reset email',
        resetUrl
      );
    }

    // Production email sending (requires real SMTP configuration)
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: `"First Rank Raju" <${process.env.EMAIL_USER || 'noreply@firstrankraju.com'}>`,
      to: email,
      subject: 'Reset Your Password - First Rank Raju',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 12px 30px; background: #f5576c; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔐 Password Reset Request</h1>
            </div>
            <div class="content">
              <h2>Hi ${name},</h2>
              <p>We received a request to reset your password for your First Rank Raju account.</p>
              <p>Click the button below to reset your password:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              <p>Or copy and paste this link in your browser:</p>
              <p style="word-break: break-all; color: #f5576c;">${resetUrl}</p>
              <div class="warning">
                <strong>⚠️ Important:</strong>
                <ul>
                  <li>This link will expire in 1 hour</li>
                  <li>If you didn't request this, please ignore this email</li>
                  <li>Your password will remain unchanged</li>
                </ul>
              </div>
              <p>For security reasons, we recommend choosing a strong, unique password.</p>
              <div class="footer">
                <p>© 2025 First Rank Raju. All rights reserved.</p>
                <p>Your AI-powered study companion</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    
    if (process.env.NODE_ENV !== 'production') {
      console.log('📧 Password reset email sent!');
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail
};
