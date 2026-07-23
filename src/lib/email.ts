/**
 * Resend Email Engine & Responsive HTML Templates
 * Handles lifecycle notifications, order invoices, password resets, and contact inquiries.
 * Designed with non-blocking error safety so email failures never block database transactions.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const SENDER_EMAIL = process.env.SENDER_EMAIL || "Shree Sai Creation <onboarding@resend.dev>";
const STORE_ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@shreesaicreation.com";
const SITE_URL = process.env.ALLOWED_ORIGIN || process.env.NEXT_PUBLIC_APP_URL || "https://shreesaicreation.com";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

/**
 * Base email dispatcher calling Resend REST API
 */
export async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.log(`[Email Engine] API key missing. Mock dispatch to ${to}: "${subject}"`);
    return true;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: SENDER_EMAIL,
        to: [to],
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.warn(`[Email Engine Warning] Resend dispatch returned ${res.status}: ${errorText}`);
      return false;
    }

    return true;
  } catch (err) {
    console.error("[Email Engine Error] Failed to send email:", err);
    return false;
  }
}

/**
 * Common Responsive Header & Footer Layout Wrapper
 */
function wrapInEmailTemplate(contentHtml: string, previewText: string = ""): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shree Sai Creation</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0d0d0d; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #e5e5e5; }
    .container { max-width: 600px; margin: 0 auto; background-color: #141414; border: 1px solid #262626; border-radius: 12px; overflow: hidden; }
    .header { background-color: #0a0a0a; padding: 30px; text-align: center; border-bottom: 1px solid #262626; }
    .logo { font-size: 20px; font-weight: 700; color: #c9a96e; letter-spacing: 4px; text-transform: uppercase; margin: 0; }
    .content { padding: 35px; line-height: 1.6; font-size: 14px; color: #cccccc; }
    .footer { background-color: #0a0a0a; padding: 25px; text-align: center; border-top: 1px solid #262626; font-size: 11px; color: #737373; letter-spacing: 1px; }
    .btn { display: inline-block; background-color: #c9a96e; color: #000000; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; padding: 14px 28px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .th { text-align: left; padding: 10px; border-bottom: 1px solid #262626; font-size: 11px; text-transform: uppercase; color: #8c8c8c; }
    .td { padding: 12px 10px; border-bottom: 1px solid #1f1f1f; font-size: 13px; color: #e5e5e5; }
    .total-box { background: #1a1a1a; border-radius: 8px; padding: 15px; margin-top: 20px; border: 1px solid #262626; }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${previewText}
  </div>
  <div style="padding: 20px 10px;">
    <div class="container">
      <div class="header">
        <h1 class="logo">SHREE SAI CREATION</h1>
        <p style="margin: 5px 0 0 0; font-size: 10px; color: #8c8c8c; letter-spacing: 2px; text-transform: uppercase;">Luxury Lighting & Architectural Fixtures</p>
      </div>
      <div class="content">
        ${contentHtml}
      </div>
      <div class="footer">
        <p style="margin: 0 0 8px 0;">SHREE SAI CREATION — Melbourne & Global Showrooms</p>
        <p style="margin: 0;">White-Glove Support: support@shreesaicreation.com | +91 98765 43210</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// 1. User Registration Welcome Email
export async function sendWelcomeEmail(email: string, name: string) {
  const html = wrapInEmailTemplate(`
    <h2 style="color: #ffffff; font-weight: 400; margin-top: 0;">Welcome to Shree Sai Creation</h2>
    <p>Dear ${name},</p>
    <p>Thank you for joining Shree Sai Creation. Your account has been registered successfully. Explore our exclusive catalog of precision-crafted K9 crystal chandeliers, brass pendants, and architectural fixtures.</p>
    <div style="text-align: center;">
      <a href="${SITE_URL}/shop" class="btn">Explore Collections</a>
    </div>
  `, `Welcome to Shree Sai Creation, ${name}!`);

  return sendEmail({ to: email, subject: "Welcome to Shree Sai Creation", html });
}

// 2. Email Verification Token
export async function sendVerificationEmail(email: string, name: string, token: string) {
  const verifyLink = `${SITE_URL}/signin?verifyToken=${token}`;
  const html = wrapInEmailTemplate(`
    <h2 style="color: #ffffff; font-weight: 400; margin-top: 0;">Verify Your Email Address</h2>
    <p>Dear ${name},</p>
    <p>Please confirm your email address to unlock complete account features and order tracking coordinates.</p>
    <div style="text-align: center;">
      <a href="${verifyLink}" class="btn">Verify Email Address</a>
    </div>
    <p style="font-size: 11px; color: #737373;">If you did not create an account, please disregard this email.</p>
  `, "Please verify your email address.");

  return sendEmail({ to: email, subject: "Verify Your Shree Sai Creation Email", html });
}

// 3. Password Reset Token Email
export async function sendPasswordResetEmail(email: string, name: string, token: string) {
  const resetLink = `${SITE_URL}/signin?resetToken=${token}`;
  const html = wrapInEmailTemplate(`
    <h2 style="color: #ffffff; font-weight: 400; margin-top: 0;">Password Reset Request</h2>
    <p>Dear ${name},</p>
    <p>We received a request to reset your password. Click the secure link below to set a new password. This link is valid for 1 hour.</p>
    <div style="text-align: center;">
      <a href="${resetLink}" class="btn">Reset Password</a>
    </div>
    <p style="font-size: 11px; color: #737373;">If you did not request a password reset, your account remains secure.</p>
  `, "Password Reset Request for Shree Sai Creation");

  return sendEmail({ to: email, subject: "Password Reset — Shree Sai Creation", html });
}

// 4. Order Placement Confirmation Invoice Email
export async function sendOrderConfirmationEmail(order: {
  orderNumber: string;
  fullName: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressCity: string;
  addressState: string;
  addressPincode: string;
  subtotal: number;
  discountAmount: number;
  tax: number;
  shipping: number;
  grandTotal: number;
  items: Array<{ productName: string; unitPrice: number; quantity: number; selectedFinish?: string }>;
}) {
  const itemsRows = order.items
    .map(
      (item) => `
      <tr>
        <td class="td">
          <strong>${item.productName}</strong>
          ${item.selectedFinish ? `<br/><span style="font-size: 11px; color: #8c8c8c;">Finish: ${item.selectedFinish}</span>` : ""}
        </td>
        <td class="td" style="text-align: center;">${item.quantity}</td>
        <td class="td" style="text-align: right;">₹${(item.unitPrice * item.quantity).toLocaleString("en-IN")}</td>
      </tr>
    `
    )
    .join("");

  const html = wrapInEmailTemplate(`
    <h2 style="color: #ffffff; font-weight: 400; margin-top: 0;">Order Confirmation</h2>
    <p>Dear ${order.fullName},</p>
    <p>Thank you for your purchase. We have received your order <strong>#${order.orderNumber}</strong>. Our white-glove artisan team is inspecting and custom-crating your fixtures for zero-risk transit.</p>
    
    <div style="background: #1a1a1a; padding: 15px; border-radius: 8px; margin: 15px 0; font-size: 12px; border: 1px solid #262626;">
      <strong style="color: #c9a96e; uppercase;">Delivery & Payment Coordinates:</strong><br/>
      ${order.addressLine1}, ${order.addressCity}, ${order.addressState} - ${order.addressPincode}<br/>
      Phone: ${order.phone} | Payment Method: <strong>Cash on Delivery (COD)</strong>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th class="th">Fixture Item</th>
          <th class="th" style="text-align: center;">Qty</th>
          <th class="th" style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsRows}
      </tbody>
    </table>

    <div class="total-box">
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 12px;">
        <span>Subtotal:</span> <span>₹${order.subtotal.toLocaleString("en-IN")}</span>
      </div>
      ${order.discountAmount > 0 ? `<div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 12px; color: #49cc90;"><span>Discount:</span> <span>-₹${order.discountAmount.toLocaleString("en-IN")}</span></div>` : ""}
      <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 12px;">
        <span>Estimated Tax:</span> <span>₹${order.tax.toLocaleString("en-IN")}</span>
      </div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px;">
        <span>Crating & Shipping:</span> <span>${order.shipping === 0 ? "COMPLIMENTARY" : `₹${order.shipping}`}</span>
      </div>
      <div style="border-top: 1px solid #333; padding-top: 8px; display: flex; justify-content: space-between; font-weight: 700; color: #c9a96e; font-size: 15px;">
        <span>Grand Total (COD):</span> <span>₹${order.grandTotal.toLocaleString("en-IN")}</span>
      </div>
    </div>

    <div style="text-align: center;">
      <a href="${SITE_URL}/account" class="btn">Track Order Status</a>
    </div>
  `, `Order Confirmation #${order.orderNumber} — Shree Sai Creation`);

  return sendEmail({ to: order.email, subject: `Order Confirmation #${order.orderNumber}`, html });
}

// 5. Order Status Email Notifications (SHIPPED, DELIVERED, CANCELLED)
export async function sendOrderStatusEmail(
  order: { orderNumber: string; fullName: string; email: string },
  status: "SHIPPED" | "DELIVERED" | "CANCELLED"
) {
  let statusTitle = "";
  let message = "";

  if (status === "SHIPPED") {
    statusTitle = "Your Order Has Shipped!";
    message = `Your order <strong>#${order.orderNumber}</strong> has been white-glove crated and dispatched with custom transit insurance.`;
  } else if (status === "DELIVERED") {
    statusTitle = "Order Delivered Successfully";
    message = `Your order <strong>#${order.orderNumber}</strong> has been delivered. We hope your new fixtures transform your space.`;
  } else if (status === "CANCELLED") {
    statusTitle = "Order Cancellation Notice";
    message = `Your order <strong>#${order.orderNumber}</strong> has been cancelled. Any associated inventory allocation has been released.`;
  }

  const html = wrapInEmailTemplate(`
    <h2 style="color: #ffffff; font-weight: 400; margin-top: 0;">${statusTitle}</h2>
    <p>Dear ${order.fullName},</p>
    <p>${message}</p>
    <div style="text-align: center;">
      <a href="${SITE_URL}/account" class="btn">View Order Details</a>
    </div>
  `, `Update on Order #${order.orderNumber} — ${status}`);

  return sendEmail({ to: order.email, subject: `Order #${order.orderNumber} Status: ${status}`, html });
}

// 6. Contact Form Submissions
export async function sendContactFormNotification(contact: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}) {
  // A) Store Admin Notification
  const adminHtml = wrapInEmailTemplate(`
    <h2 style="color: #ffffff; font-weight: 400; margin-top: 0;">New Concierge Support Inquiry</h2>
    <p><strong>Customer Name:</strong> ${contact.name}</p>
    <p><strong>Email:</strong> ${contact.email}</p>
    <p><strong>Phone:</strong> ${contact.phone || "N/A"}</p>
    <div style="background: #1a1a1a; padding: 15px; border-radius: 8px; border: 1px solid #262626; margin: 15px 0;">
      <strong>Inquiry Message:</strong><br/>
      ${contact.message.replace(/\n/g, "<br/>")}
    </div>
  `, `New Support Inquiry from ${contact.name}`);

  sendEmail({ to: STORE_ADMIN_EMAIL, subject: `New Support Inquiry — ${contact.name}`, html: adminHtml });

  // B) Customer Receipt Acknowledgment
  const customerHtml = wrapInEmailTemplate(`
    <h2 style="color: #ffffff; font-weight: 400; margin-top: 0;">We Have Received Your Inquiry</h2>
    <p>Dear ${contact.name},</p>
    <p>Thank you for reaching out to Shree Sai Creation. Our concierge lighting team has received your message and will respond within 24 business hours.</p>
  `, "Thank you for contacting Shree Sai Creation");

  return sendEmail({ to: contact.email, subject: "Inquiry Received — Shree Sai Creation", html: customerHtml });
}
