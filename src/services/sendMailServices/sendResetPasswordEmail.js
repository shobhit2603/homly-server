import axios from "axios";
import { email_style, logoUrl } from "./constants.js";

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

/**
 * Send password reset link
 * @param {Object} data - Contains recipient info ({ to, name, resetUrl })
 */
export const sendResetPasswordEmail = async ({ to, name, resetUrl }) => {
  console.log("BREVO_API_KEY loaded:", !!process.env.BREVO_API_KEY);
  console.log("BREVO_SENDER_EMAIL:", process.env.BREVO_SENDER_EMAIL);
  try {
    const payload = {
      sender: {
        email: process.env.BREVO_SENDER_EMAIL,
        name: process.env.BREVO_SENDER_NAME || "Homely",
      },
      to: [
        {
          email: to,
          name: name || "User",
        },
      ],
      subject: `Reset Your Password - Homely`,

      htmlContent: `
      ${email_style}
<div style="font-family: 'Inter', system-ui, -apple-system, sans-serif; background-color: #f8fafc; padding: 40px 10px;">
  <div style="max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.03); border: 1px solid #e2e8f0;">
    
    <div style="background: #1e1b4b; padding: 32px 20px; text-align: center;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: auto;">
        <tr>
          <td style="vertical-align: middle;">
            <img src="${logoUrl}" alt="Homely Logo" 
            class="logo-img"
            style="max-height: 35px; width: auto; display: block; margin-right: 8px;" />
          </td>
          <td style="vertical-align: middle;">
            <span style="color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.5px; line-height: 1;">Homely.</span>
          </td>
        </tr>
      </table>
    </div>

    <div style="padding: 40px 32px;">
      <h1 style="font-size: 24px; font-weight: 700; color: #1e293b; margin: 0 0 16px; letter-spacing: -0.5px;">
        Reset Your Password
      </h1>
      
      <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 24px;">
        Hello ${name || "User"},<br/><br/>
        We received a request to reset your password for your Homely account. You can reset your password by clicking the button below.
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetUrl}"
           style="
             display: inline-block;
             background-color: #4f46e5;
             color: #ffffff;
             padding: 14px 32px;
             font-size: 15px;
             font-weight: 600;
             text-decoration: none;
             border-radius: 8px;
             box-shadow: 0 4px 12px rgba(79, 70, 229, 0.2);
           ">
          Reset Password
        </a>
      </div>

      <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px;">
        Or copy and paste this link into your browser:<br/>
        <a href="${resetUrl}" style="color: #4f46e5; word-break: break-all;">${resetUrl}</a>
      </p>
      
      <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px;">
        This link will expire in 15 minutes. If you did not request a password reset, please ignore this email and your password will remain unchanged.
      </p>
    </div>

    <div style="padding: 32px; border-top: 1px solid #f1f5f9; background-color: #fafafa; text-align: center;">
      <p style="font-size: 13px; color: #64748b; margin: 0;">
        Best regards,<br/>
        <strong style="color: #1e293b;">Homely Team</strong>
      </p>
      <p style="font-size: 11px; color: #cbd5e1; margin-top: 12px;">
        This is an automated message. Please do not reply directly to this email.
      </p>
    </div>
  </div>
</div>
`,
      textContent: `
Hello ${name || "User"},

We received a request to reset your password for your Homely account.

Click the following link to reset your password (expires in 15 minutes):
${resetUrl}

If you did not request a password reset, please ignore this email and your password will remain unchanged.

Regards,
Homely Team
  `,
    };

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": process.env.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("RESET PASSWORD EMAIL SENT:", response.data.messageId);
    return response.data;
  } catch (error) {
    console.error("Brevo reset email failed:", error.response?.data || error.message);
    throw error;
  }
};
