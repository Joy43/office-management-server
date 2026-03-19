import { Injectable } from '@nestjs/common';

export interface ClientCredentials {
  clientName: string;
  clientEmail: string;
  password: string;
  logoUrl?: string;
}

@Injectable()
export class AccountConfirmationTemplate {
  generateTemplate(credentials: ClientCredentials): string {
    const { clientName, clientEmail, password, logoUrl } = credentials;

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Our Platform</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            ${logoUrl ? `<img src="${logoUrl}" alt="Company Logo" style="max-width: 180px; height: auto; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;">` : ''}
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                                Welcome to Our Platform!
                            </h1>
                            <p style="margin: 10px 0 0 0; color: #e0e7ff; font-size: 16px;">
                                Your account has been successfully created
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 1.6;">
                                Hello <strong>${clientName}</strong>,
                            </p>
                            
                            <p style="margin: 0 0 20px 0; color: #555555; font-size: 15px; line-height: 1.6;">
                                Your account has been created by the administrator. Below are your login credentials to access the platform:
                            </p>
                            
                            <!-- Credentials Box -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0; background-color: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <table role="presentation" style="width: 100%; border-collapse: collapse;">
                                            <tr>
                                                <td style="padding: 10px 0;">
                                                    <p style="margin: 0; color: #6c757d; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                                                        Email Address
                                                    </p>
                                                    <p style="margin: 5px 0 0 0; color: #212529; font-size: 16px; font-weight: 500;">
                                                        ${clientEmail}
                                                    </p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 10px 0; border-top: 1px solid #dee2e6;">
                                                    <p style="margin: 0; color: #6c757d; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">
                                                        Temporary Password
                                                    </p>
                                                    <p style="margin: 5px 0 0 0; color: #212529; font-size: 16px; font-weight: 500; font-family: 'Courier New', monospace; background-color: #ffffff; padding: 8px 12px; border-radius: 4px; display: inline-block;">
                                                        ${password}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Security Warning -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 20px 0; background-color: #fff3cd; border-left: 4px solid #ffc107; border-radius: 4px;">
                                <tr>
                                    <td style="padding: 15px 20px;">
                                        <p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.5;">
                                            <strong>⚠️ Important Security Notice:</strong><br>
                                            Please change your password immediately after your first login for security purposes.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="${process.env.APP_URL || 'https://yourapp.com/login'}" 
                                           style="display: inline-block; padding: 14px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                                            Login to Your Account
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 20px 0 0 0; color: #555555; font-size: 14px; line-height: 1.6;">
                                If you have any questions or need assistance, please don't hesitate to contact our support team.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e9ecef;">
                            <p style="margin: 0 0 10px 0; color: #6c757d; font-size: 13px;">
                                © ${new Date().getFullYear()} ${process.env.COMPANY_NAME || 'Your Company'}. All rights reserved.
                            </p>
                            <p style="margin: 0; color: #adb5bd; font-size: 12px;">
                                This is an automated message. Please do not reply to this email.
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
  }
}
