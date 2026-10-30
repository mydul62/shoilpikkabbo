import nodemailer from "nodemailer";
import { prisma } from "../../config/prisma";

export class EmailService {
  /**
   * Fetch current SMTP configuration from database settings
   */
  static async getSmtpConfig() {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: [
            "smtp_enabled",
            "smtp_host",
            "smtp_port",
            "smtp_secure",
            "smtp_user",
            "smtp_pass",
            "smtp_from_name",
            "smtp_from_email",
            "smtp_receiver_email",
            "store_name",
            "contact_email",
          ],
        },
      },
    });

    const map: Record<string, string> = {};
    settings.forEach((s) => {
      map[s.key] = s.value;
    });

    const enabled = map.smtp_enabled === "true";
    const host = map.smtp_host || process.env.SMTP_HOST || "";
    const port = parseInt(map.smtp_port || process.env.SMTP_PORT || "465", 10);
    const secure = map.smtp_secure !== undefined ? map.smtp_secure === "true" : port === 465;
    const user = map.smtp_user || process.env.SMTP_USER || "";
    const pass = map.smtp_pass || process.env.SMTP_PASS || "";
    const fromName = map.smtp_from_name || map.store_name || "SHOILPIKKABBO";
    const fromEmail = map.smtp_from_email || user || "no-reply@shoilpikkabbo.com";
    const receiverEmail =
      map.smtp_receiver_email || map.contact_email || user || "shoilpikkabbo@gmail.com";

    return {
      enabled,
      host,
      port,
      secure,
      user,
      pass,
      fromName,
      fromEmail,
      receiverEmail,
    };
  }

  /**
   * Create nodemailer transporter from settings
   */
  static async getTransporter() {
    const config = await this.getSmtpConfig();
    if (!config.host || !config.user || !config.pass) {
      return null;
    }

    return nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure, // true for 465, false for 587/other
      auth: {
        user: config.user,
        pass: config.pass,
      },
    });
  }

  /**
   * Send test email to verify credentials
   */
  static async sendTestEmail(targetEmail: string) {
    const config = await this.getSmtpConfig();
    if (!config.host || !config.user || !config.pass) {
      throw new Error(
        "SMTP credentials are incomplete. Please configure Host, User, and Password in Email Box setup."
      );
    }

    const transporter = await this.getTransporter();
    if (!transporter) {
      throw new Error("Could not initialize email transporter with provided settings.");
    }

    // Verify SMTP connection first
    await transporter.verify();

    const info = await transporter.sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      to: targetEmail,
      subject: `[Test] Email Box Setup Verification - ${config.fromName}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px; background-color: #ffffff;">
          <div style="border-bottom: 2px solid #0D3B37; padding-bottom: 12px; margin-bottom: 20px;">
            <h2 style="color: #0D3B37; margin: 0 0 6px 0;">Email Box Setup Verified! 🎉</h2>
            <p style="color: #E0592A; margin: 0; font-size: 13px; font-weight: bold;">SHOILPIKKABBO Store Notification Engine</p>
          </div>
          <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
            This test email confirms that your <strong>Email Box setup</strong> in SHOILPIKKABBO Admin Dashboard is configured and connected properly.
          </p>
          <div style="background-color: #FAF8F5; border: 1px solid #EAE3D5; padding: 16px; border-radius: 12px; margin: 20px 0; font-size: 13px; color: #1f2937;">
            <p style="margin: 4px 0;"><strong>SMTP Host:</strong> ${config.host}</p>
            <p style="margin: 4px 0;"><strong>Port:</strong> ${config.port} (${config.secure ? "SSL" : "TLS/STARTTLS"})</p>
            <p style="margin: 4px 0;"><strong>Sender:</strong> ${config.fromName} &lt;${config.fromEmail}&gt;</p>
            <p style="margin: 4px 0;"><strong>Inquiry Receiver:</strong> ${config.receiverEmail}</p>
          </div>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px; text-align: center;">
            Sent automatically from SHOILPIKKABBO Admin Panel.
          </p>
        </div>
      `,
    });

    return info;
  }

  /**
   * Send Service Inquiry Notification to Admin and confirmation to customer
   */
  static async sendInquiryNotification(inquiry: {
    id: string;
    serviceType: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string | null;
    organization?: string | null;
    requirements: string;
    createdAt?: Date;
  }) {
    try {
      const config = await this.getSmtpConfig();
      if (!config.enabled) {
        console.log("[EmailService] SMTP is disabled. Skipping email notification.");
        return;
      }

      const transporter = await this.getTransporter();
      if (!transporter) {
        console.warn("[EmailService] Incomplete SMTP credentials. Skipping email delivery.");
        return;
      }

      // 1. Send Admin Notification Email
      const adminHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px;">
          <div style="border-bottom: 2px solid #0D3B37; padding-bottom: 12px; margin-bottom: 20px;">
            <h2 style="color: #0D3B37; margin: 0 0 6px 0; font-size: 20px;">New Service Inquiry Received!</h2>
            <p style="color: #E0592A; margin: 0; font-size: 13px; font-weight: bold;">Special E-Sheba & Institutional Service Desk</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #374151;">
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; width: 170px; font-weight: bold; color: #111827;">Service Area:</td>
              <td style="padding: 10px 0; color: #0D3B37; font-weight: bold;">${inquiry.serviceType}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; font-weight: bold; color: #111827;">Customer Name:</td>
              <td style="padding: 10px 0;">${inquiry.customerName}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; font-weight: bold; color: #111827;">Phone Number:</td>
              <td style="padding: 10px 0;">
                <a href="tel:${inquiry.customerPhone}" style="color: #E0592A; text-decoration: none; font-weight: bold;">
                  ${inquiry.customerPhone}
                </a>
              </td>
            </tr>
            ${
              inquiry.customerEmail
                ? `
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; font-weight: bold; color: #111827;">Email Address:</td>
              <td style="padding: 10px 0;">
                <a href="mailto:${inquiry.customerEmail}" style="color: #0D3B37; text-decoration: none;">
                  ${inquiry.customerEmail}
                </a>
              </td>
            </tr>`
                : ""
            }
            ${
              inquiry.organization
                ? `
            <tr style="border-bottom: 1px solid #f3f4f6;">
              <td style="padding: 10px 0; font-weight: bold; color: #111827;">Organization:</td>
              <td style="padding: 10px 0;">${inquiry.organization}</td>
            </tr>`
                : ""
            }
          </table>

          <div style="background: #FAF8F5; border: 1px solid #EAE3D5; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <h4 style="margin: 0 0 8px 0; color: #0D3B37; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">
              Specific Requirements & Brief:
            </h4>
            <p style="margin: 0; color: #4B5563; font-size: 14px; white-space: pre-wrap; line-height: 1.6;">${inquiry.requirements}</p>
          </div>

          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 14px; text-align: center; margin-top: 20px;">
            <p style="margin: 0; font-size: 13px; color: #166534; font-weight: 600;">
              Manage this inquiry directly from your <strong>Admin Dashboard &rarr; Service Inquiries</strong>.
            </p>
          </div>

          <p style="font-size: 12px; color: #9CA3AF; margin-top: 24px; text-align: center;">
            Sent automatically by SHOILPIKKABBO Notification System.
          </p>
        </div>
      `;

      await transporter.sendMail({
        from: `"${config.fromName}" <${config.fromEmail}>`,
        to: config.receiverEmail,
        subject: `[New Inquiry] ${inquiry.serviceType} - ${inquiry.customerName}`,
        html: adminHtml,
      });
      console.log(`[EmailService] Inquiry notification sent to ${config.receiverEmail}`);

      // 2. If customer provided an email address, send customer receipt
      if (inquiry.customerEmail && inquiry.customerEmail.includes("@")) {
        const customerHtml = `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px;">
            <div style="border-bottom: 2px solid #0D3B37; padding-bottom: 12px; margin-bottom: 16px;">
              <h2 style="color: #0D3B37; margin: 0 0 6px 0;">Thank you, ${inquiry.customerName}!</h2>
              <p style="color: #6B7280; font-size: 14px; margin: 0;">We have received your inquiry for <strong>${inquiry.serviceType}</strong>.</p>
            </div>
            <p style="color: #374151; font-size: 14px; line-height: 1.6;">
              Our institutional accounts specialist is currently reviewing your brief and will connect with you via phone or email within 24 hours.
            </p>
            <div style="background: #FAF8F5; border: 1px solid #EAE3D5; padding: 14px; border-radius: 12px; margin: 18px 0; font-size: 13px; color: #4B5563;">
              <p style="margin: 0 0 4px 0;"><strong>Selected Service:</strong> ${inquiry.serviceType}</p>
              <p style="margin: 0;"><strong>Contact Phone:</strong> ${inquiry.customerPhone}</p>
            </div>
            <p style="color: #9CA3AF; font-size: 12px; margin-top: 24px;">
              Warm regards,<br/><strong>${config.fromName}</strong><br/>
              <span style="color: #E0592A; font-weight: 600;">Delivery • Quality • Reliability</span>
            </p>
          </div>
        `;

        await transporter.sendMail({
          from: `"${config.fromName}" <${config.fromEmail}>`,
          to: inquiry.customerEmail,
          subject: `We have received your inquiry - ${config.fromName}`,
          html: customerHtml,
        });
        console.log(`[EmailService] Customer acknowledgement sent to ${inquiry.customerEmail}`);
      }
    } catch (err: any) {
      console.error("[EmailService] Failed to send inquiry email:", err.message);
    }
  }
}

