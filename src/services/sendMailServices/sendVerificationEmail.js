import axios from "axios";
import { email_style, logoUrl } from "./constants.js";
import envConfig from "../../config/env.config.js";

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

/**
 * Send email verification link after registration
 * @param {Object} data - Contains recipient info (to, name, verificationUrl)
 */
export async function sendVerificationEmail(data) {
  try {
    const payload = {
      sender: {
        name: envConfig.BREVO_SENDER_NAME,
        email: envConfig.BREVO_SENDER_EMAIL,
      },
      to: [{ email: data.to, name: data.name || "User" }],
      subject: `Verify Your Email - Homely`,

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
        Verify Your Email Address
      </h1>
      
      <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 24px;">
        Hello ${data.name || "User"},<br/><br/>
        Thank you for joining Homely! Please verify your email address to get full access to your account and start exploring homes or managing your property listings.
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="${data.verificationUrl}"
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
          Verify Email
        </a>
      </div>

      <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px;">
        Or copy and paste this link into your browser:<br/>
        <a href="${data.verificationUrl}" style="color: #4f46e5; word-break: break-all;">${data.verificationUrl}</a>
      </p>
      
      <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px;">
        This link will expire in 24 hours. If you did not create an account, no further action is required.
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
Hello ${data.name || "User"},

Please verify your email address to complete your registration at Homely.

Click the following link to verify your email (expires in 24 hours):
${data.verificationUrl}

If you did not create an account, no further action is required.

Regards,
Homely Team
  `,
    };

    const response = await axios.post(BREVO_URL, payload, {
      headers: {
        "api-key": envConfig.BREVO_API_KEY,
        "Content-Type": "application/json",
      },
    });

    console.log("VERIFICATION EMAIL SENT:", response.data.messageId);
    return response.data;
  } catch (error) {
    console.error("Brevo verification email failed:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error; // Propagate the error so BullMQ can trigger retries
  }
}
