import axios from "axios";
import { email_style, logoUrl } from "./constants.js";
import envConfig from "../../config/env.config.js";

const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

/**
 * Send welcome email after registration
 * @param {Object} data - Contains recipient info (to, name, role, registeredAt)
 */
export async function sendWelcomeEmail(data) {
  try {
    const payload = {
      sender: {
        name: envConfig.BREVO_SENDER_NAME,
        email: envConfig.BREVO_SENDER_EMAIL,
      },
      to: [{ email: data.to, name: data.name || "User" }],
      subject: `Welcome to Homely!`,

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
        Account Created Successfully!
      </h1>
      
      <p style="font-size: 15px; line-height: 1.6; color: #475569; margin: 0 0 24px;">
        Hello ${data.name || "User"},<br/><br/>
        Welcome to Homely! We are excited to have you on board. Your account has been successfully set up, and you can now start exploring homes or managing your property listings.
      </p>

      <div style="background: #f1f5f9; border-radius: 8px; padding: 20px; border-left: 4px solid #1e1b4b; margin-bottom: 24px;">
        <p style="margin: 0; font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">
          Account Details
        </p>
        <p style="margin: 8px 0 0; font-size: 15px; color: #1e293b; font-weight: 600;">
          Role: ${data.role || "User"}
        </p>
        <p style="margin: 4px 0 0; font-size: 13px; color: #64748b;">
          Registered Email: ${data.to}
        </p>
        <p style="margin: 4px 0 0; font-size: 13px; color: #64748b;">
          Registered on: ${new Date(data.registeredAt).toLocaleString()}
        </p>
      </div>

      <p style="font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px;">
        Click the button below to log in and start using your portal.
      </p>

      <div style="text-align: center; margin: 32px 0;">
        <a href="http://localhost:5173"
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
          Go to Dashboard
        </a>
      </div>
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

Welcome to Homely! Your account has been successfully created.

Role: ${data.role || "User"}
Email: ${data.to}
Registered on: ${new Date(data.registeredAt).toLocaleString()}

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

    console.log("WELCOME EMAIL SENT:", response.data.messageId);
    return response.data;
  } catch (error) {
    console.error("Brevo welcome email failed:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });
    throw error; // Propagate the error so BullMQ can trigger retries
  }
}
