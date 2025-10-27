import axios from "axios";

class EmailService {
  constructor() {
    this.brevoUrl = "https://api.brevo.com/v3/smtp/email";
    this.headers = {
      accept: "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
    };
  }

  async sendVerificationEmail(email, name, verificationLink) {
    const emailData = {
      sender: {
        name: process.env.EMAIL_SENDER_NAME || "Your App",
        email: process.env.EMAIL_SENDER_ADDRESS || "shittuibrahim092k@gmail.com",
      },
      to: [{ email, name }],
      subject: "Verify Your Email Address",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Our Platform, ${name}!</h2>
          <p>Please verify your email address to complete your registration:</p>
          <a href="${verificationLink}" 
             style="display: inline-block; padding: 12px 24px; background-color: #2563eb; 
                    color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
            Verify Email
          </a>
          <p style="color: #666; font-size: 14px;">
            This link will expire in 24 hours. If you didn't request this, please ignore this email.
          </p>
        </div>
      `,
    };

    try {
      const response = await axios.post(this.brevoUrl, emailData, {
        headers: this.headers,
      });
      console.log("Email sent successfully:", response.data);
      return true;
    } catch (error) {
      console.error("Email sending failed:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error("Failed to send verification email");
    }
  }

  async sendWelcomeEmail(email, name) {
    // Implementation for welcome email
  }

  async sendKYCApprovalEmail(email, name) {
    // Implementation for KYC approval
  }

  async sendAccountActivationEmail(email, name) {
    // Implementation for account activation
  }
}

export default new EmailService();
