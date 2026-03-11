export const otpTemplate = ({
  logoUrl,
  companyName,
  title,
  message,
  code,
  validityMinutes,
  footer,
  supportEmail,
}: {
  logoUrl?: string;
  companyName: string;
  title: string;
  message: string;
  code: string;
  validityMinutes?: number;
  footer: string;
  supportEmail?: string;
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif; background-color: #f4f4f7;">
  
  <div style="background-color: #f4f4f7; padding: 40px 20px;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
      
      <!-- Header with Logo -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
        ${logoUrl ? `<img src="${logoUrl}" alt="${companyName}" style="max-width: 180px; height: auto; margin-bottom: 15px; display: block; margin-left: auto; margin-right: auto;">` : ''}
        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 600;">${companyName}</h1>
      </div>

      <!-- Main Content -->
      <div style="padding: 40px 35px;">
        
        <!-- Title -->
        <h2 style="color: #2c3e50; margin: 0 0 20px 0; font-size: 24px; font-weight: 600; text-align: center;">${title}</h2>
        
        <!-- Message -->
        <p style="font-size: 16px; color: #555; line-height: 1.8; margin: 0 0 30px 0;">
          ${message}
        </p>

        <!-- OTP Code Box -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 35px 25px; border-radius: 10px; text-align: center; margin: 30px 0;">
          <p style="color: rgba(255, 255, 255, 0.9); font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px; margin: 0 0 12px 0; font-weight: 500;">Your Verification Code</p>
          <p style="font-size: 42px; font-weight: 700; color: #ffffff; letter-spacing: 10px; margin: 15px 0; font-family: 'Courier New', monospace;">
            ${code}
          </p>
          ${validityMinutes ? `<p style="color: rgba(255, 255, 255, 0.9); font-size: 14px; margin: 15px 0 0 0;">⏱ Valid for ${validityMinutes} minutes</p>` : ''}
        </div>

        <!-- Important Notice -->
        <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 18px 20px; margin: 25px 0; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px; color: #555; line-height: 1.6;">
            <strong style="color: #333;">Important:</strong> This code is single-use only and will expire after the specified time. Never share this code with anyone.
          </p>
        </div>

        <!-- Security Warning -->
        <div style="background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 18px 20px; margin: 25px 0; border-radius: 4px;">
          <p style="margin: 0; font-size: 14px; color: #856404; line-height: 1.6;">
            <strong>Security Alert:</strong> If you didn't request this code, please ignore this email ${supportEmail ? `or contact us at <a href="mailto:${supportEmail}" style="color: #667eea; text-decoration: none;">${supportEmail}</a>` : ''}.
          </p>
        </div>

      </div>

      <!-- Footer -->
      <div style="background-color: #f8f9fa; padding: 30px 35px; text-align: center; border-top: 1px solid #e9ecef;">
        <p style="font-size: 14px; color: #666; margin: 0 0 10px 0; line-height: 1.6;">
          ${footer}
        </p>
        ${
          supportEmail
            ? `
        <p style="font-size: 13px; color: #999; margin: 15px 0 0 0;">
          Need help? Contact us at <a href="mailto:${supportEmail}" style="color: #667eea; text-decoration: none;">${supportEmail}</a>
        </p>
        `
            : ''
        }
        <p style="font-size: 12px; color: #999; margin: 20px 0 0 0;">
          © ${new Date().getFullYear()} ${companyName}. All rights reserved.
        </p>
      </div>

    </div>
  </div>

</body>
</html>
`;
