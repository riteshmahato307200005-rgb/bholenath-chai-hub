import { json } from "@tanstack/react-start";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  subject: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
  data?: ContactFormData;
}

/**
 * Validates contact form data
 */
function validateContactData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.name || data.name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push("Valid email is required");
  }

  if (!data.phone || !/^[0-9]{10}$/.test(data.phone.replace(/\D/g, ""))) {
    errors.push("Valid 10-digit phone number is required");
  }

  if (!data.subject || data.subject.trim().length < 5) {
    errors.push("Subject must be at least 5 characters");
  }

  if (!data.message || data.message.trim().length < 10) {
    errors.push("Message must be at least 10 characters");
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Sends email notification (mock implementation - integrate with actual email service)
 */
async function sendEmailNotification(data: ContactFormData): Promise<boolean> {
  try {
    // In production, integrate with email service like:
    // - Mailgun
    // - SendGrid
    // - Resend
    // - AWS SES
    
    console.log("Contact form submission:", data);
    
    // Mock successful email send
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

/**
 * Stores contact form data in database/storage
 * Currently logs to console - integrate with D1, KV, or external database
 */
async function storeContactData(data: ContactFormData): Promise<boolean> {
  try {
    // In production, store in:
    // - Cloudflare D1 (SQLite)
    // - Cloudflare KV
    // - External database
    
    console.log("Storing contact data:", data);
    return true;
  } catch (error) {
    console.error("Error storing data:", error);
    return false;
  }
}

/**
 * POST /api/contact - Handle contact form submissions
 */
export async function contactFormHandler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return json(
      { success: false, message: "Method not allowed" },
      { status: 405 }
    );
  }

  try {
    const body = await request.json() as any;

    // Validate data
    const validation = validateContactData(body);
    if (!validation.valid) {
      return json(
        {
          success: false,
          message: "Validation failed",
          errors: validation.errors,
        },
        { status: 400 }
      );
    }

    const contactData: ContactFormData = {
      name: body.name.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone.replace(/\D/g, ""),
      subject: body.subject.trim(),
      message: body.message.trim(),
    };

    // Send email and store data
    const [emailSent, dataSaved] = await Promise.all([
      sendEmailNotification(contactData),
      storeContactData(contactData),
    ]);

    if (emailSent || dataSaved) {
      return json(
        {
          success: true,
          message:
            "Thank you! We've received your message. We'll get back to you soon! 🙏",
          data: contactData,
        },
        { status: 200 }
      );
    } else {
      return json(
        { success: false, message: "Failed to process request" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
