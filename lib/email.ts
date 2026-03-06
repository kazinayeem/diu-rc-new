/**
 * Email utility for Daffodil International University Robotics Club
 * Reads SMTP settings from the database and sends transactional emails.
 */

import nodemailer from "nodemailer";
import connectDB from "@/lib/db";
import SMTPSettings from "@/lib/models/SMTPSettings";

// ─── Transporter ─────────────────────────────────────────────────────────────

async function createTransporter() {
  await connectDB();
  const settings = await SMTPSettings.findOne({ isActive: true }).lean() as any;

  if (!settings || !settings.auth?.user || !settings.auth?.pass) {
    throw new Error("SMTP settings not configured. Please configure SMTP in Admin → Settings → SMTP.");
  }

  const transporter = nodemailer.createTransport({
    host: settings.host || "smtp.gmail.com",
    port: settings.port || 587,
    secure: settings.secure || false,
    auth: {
      user: settings.auth.user,
      pass: settings.auth.pass,
    },
  });

  return { transporter, from: settings.from };
}

// ─── Shared Layout Helpers ────────────────────────────────────────────────────

const LOGO_URL = "https://diurc.vercel.app/diurc_logo.png";
const SITE_URL = "https://diurc.vercel.app";

const socialIcons = `
  <a href="https://www.facebook.com/diuroboticsclub" style="display:inline-block;width:34px;height:34px;border-radius:50%;background:#ffffff22;margin:0 5px;text-align:center;line-height:34px;text-decoration:none;color:#fff;font-size:14px" target="_blank">f</a>
  <a href="https://instagram.com/diu_robotics_club" style="display:inline-block;width:34px;height:34px;border-radius:50%;background:#ffffff22;margin:0 5px;text-align:center;line-height:34px;text-decoration:none;color:#fff;font-size:14px" target="_blank">in</a>
  <a href="https://bd.linkedin.com/company/diuroboticsclub" style="display:inline-block;width:34px;height:34px;border-radius:50%;background:#ffffff22;margin:0 5px;text-align:center;line-height:34px;text-decoration:none;color:#fff;font-size:14px" target="_blank">li</a>
  <a href="${SITE_URL}" style="display:inline-block;width:34px;height:34px;border-radius:50%;background:#ffffff22;margin:0 5px;text-align:center;line-height:34px;text-decoration:none;color:#fff;font-size:12px" target="_blank">🌐</a>
`;

function emailWrapper(headerTitle: string, bodyContent: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>${headerTitle}</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:'Segoe UI',Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0">
<tr><td align="center">
<table width="620" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 4px 32px rgba(28,117,188,0.12)">

  <!-- HEADER -->
  <tr>
    <td align="center" style="padding:40px 30px 30px;background:linear-gradient(135deg,#0a1f44 0%,#1c75bc 100%)">
      <img src="${LOGO_URL}" alt="Daffodil International University Robotics Club" width="220" style="display:block;margin:0 auto 16px" />
      <div style="color:#ffffff;font-size:26px;font-weight:700;letter-spacing:1.5px;margin-top:8px">${headerTitle}</div>
    </td>
  </tr>

  <!-- BODY -->
  <tr>
    <td style="padding:36px 44px 28px;color:#333;font-size:16px;line-height:1.85">
      ${bodyContent}
    </td>
  </tr>

  <!-- FOOTER -->
  <tr>
    <td align="center" style="background:linear-gradient(135deg,#0a1f44 0%,#1c75bc 100%);padding:28px 20px 22px">
      <img src="${LOGO_URL}" alt="DIURC" width="140" style="display:block;margin:0 auto 10px" />
      <div style="margin:10px 0">${socialIcons}</div>
      <p style="color:#ffffffaa;font-size:12px;margin:10px 0 0">
        © ${new Date().getFullYear()} Daffodil International University Robotics Club · Daffodil International University
      </p>
      <p style="color:#ffffff66;font-size:11px;margin:4px 0 0">
        <a href="${SITE_URL}" style="color:#90d4ff;text-decoration:none">${SITE_URL}</a>
      </p>
    </td>
  </tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

// ─── Info Box Helper ──────────────────────────────────────────────────────────

function infoBox(rows: { label: string; value: string }[]) {
  const rowsHtml = rows.map(r => `
    <tr>
      <td style="padding:7px 0;color:#1c75bc;font-weight:600;white-space:nowrap;vertical-align:top;width:150px">${r.label}</td>
      <td style="padding:7px 0 7px 12px;color:#0a1f44;vertical-align:top">${r.value}</td>
    </tr>`).join("");
  return `
  <table width="100%" cellpadding="0" cellspacing="0"
    style="margin:28px 0;background:linear-gradient(135deg,#f0f8ff,#e1f1ff);border-radius:14px;border:1px solid #c7e2ff;padding:0">
    <tr><td style="padding:24px 28px">
      <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px">
        ${rowsHtml}
      </table>
    </td></tr>
  </table>`;
}

// ─── CTA Button ───────────────────────────────────────────────────────────────

function ctaButton(text: string, href: string) {
  return `
  <table align="center" cellpadding="0" cellspacing="0" style="margin:32px auto">
    <tr>
      <td align="center" style="border-radius:50px;background:linear-gradient(135deg,#1c75bc,#4da6ff)">
        <a href="${href}" target="_blank"
          style="display:inline-block;padding:16px 42px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:50px;letter-spacing:0.5px">
          ${text}
        </a>
      </td>
    </tr>
  </table>`;
}

// ─── Email 1: Registration Received ──────────────────────────────────────────

export async function sendRegistrationReceivedEmail(reg: {
  name: string;
  email: string;
  studentId: string;
  department?: string;
  batch?: string;
  paymentMethod?: string;
  transactionId?: string;
}) {
  try {
    const { transporter, from } = await createTransporter();

    const body = `
      <p style="margin-top:0;font-size:17px;color:#0a1f44">
        <strong>Dear ${reg.name},</strong>
      </p>
      <p>
        Thank you for applying to join the <strong>Daffodil International University Robotics Club</strong>! 🤖<br/>
        We have successfully received your membership registration and payment details.
      </p>
      <p>
        Our team will now <strong>review your payment</strong>. Once verified, you will receive
        a confirmation email with your membership details. Please allow <strong>1–3 business days</strong>
        for the review process.
      </p>

      ${infoBox([
        { label: "📋 Name", value: reg.name },
        { label: "🎓 Student ID", value: reg.studentId },
        { label: "🏛️ Department", value: reg.department || "—" },
        { label: "📅 Batch", value: reg.batch || "—" },
        { label: "💳 Payment Method", value: reg.paymentMethod || "—" },
        { label: "🔖 Transaction ID", value: reg.transactionId || "—" },
      ])}

      <p>
        If you have any questions or concerns, feel free to reach out to us via our
        official channels or visit our website.
      </p>

      ${ctaButton("Visit DIURC Website", SITE_URL)}

      <p style="text-align:center;font-size:17px;color:#0a1f44;font-weight:600;margin-top:10px">
        We look forward to welcoming you to our family! 🚀
      </p>
    `;

    await transporter.sendMail({
      from: `"${from?.name || "Daffodil International University Robotics Club"}" <${from?.email}>`,
      to: reg.email,
      subject: "Registration Received — Daffodil International University Robotics Club 🤖",
      html: emailWrapper("Registration Received", body),
    });

    console.log(`[Email] Registration received email sent to ${reg.email}`);
    return true;
  } catch (err: any) {
    console.error("[Email] Failed to send registration received email:", err.message);
    return false;
  }
}

// ─── Email 2: Membership Approved / Confirmed ─────────────────────────────────

export async function sendRegistrationApprovedEmail(reg: {
  name: string;
  email: string;
  studentId: string;
  department?: string;
  batch?: string;
}) {
  try {
    const { transporter, from } = await createTransporter();

    const body = `
      <p style="margin-top:0;font-size:17px;color:#0a1f44">
        <strong>Congratulations, ${reg.name}! 🎉</strong>
      </p>
      <p>
        We are thrilled to inform you that your membership application to
        <strong>Daffodil International University Robotics Club</strong> has been <span style="color:#1c75bc;font-weight:700">approved and confirmed</span>!
      </p>
      <p>
        Your payment has been verified and you are now an official member of the club.
        Welcome to the DIURC family — a community of innovators, engineers, and tech enthusiasts!
      </p>

      ${infoBox([
        { label: "✅ Name", value: reg.name },
        { label: "🎓 Student ID", value: reg.studentId },
        { label: "🏛️ Department", value: reg.department || "—" },
        { label: "📅 Batch", value: reg.batch || "—" },
        { label: "🏅 Status", value: '<span style="color:#16a34a;font-weight:700">Confirmed Member</span>' },
      ])}

      <p>
        Stay tuned for upcoming events, workshops, and activities.
        Make sure to follow our social media channels and check the website regularly.
      </p>

      ${ctaButton("Go to DIURC Website 🚀", SITE_URL)}

      <p style="text-align:center;font-size:17px;color:#0a1f44;font-weight:600;margin-top:10px">
        Welcome aboard — let's build the future together! 🤖⚙️
      </p>
    `;

    await transporter.sendMail({
      from: `"${from?.name || "Daffodil International University Robotics Club"}" <${from?.email}>`,
      to: reg.email,
      subject: "🎉 Membership Confirmed — Welcome to Daffodil International University Robotics Club!",
      html: emailWrapper("Membership Confirmed! 🎉", body),
    });

    console.log(`[Email] Approval email sent to ${reg.email}`);
    return true;
  } catch (err: any) {
    console.error("[Email] Failed to send approval email:", err.message);
    return false;
  }
}

// ─── Email 3: Registration Rejected ──────────────────────────────────────────

export async function sendRegistrationRejectedEmail(reg: {
  name: string;
  email: string;
  studentId: string;
}) {
  try {
    const { transporter, from } = await createTransporter();

    const body = `
      <p style="margin-top:0;font-size:17px;color:#0a1f44">
        <strong>Dear ${reg.name},</strong>
      </p>
      <p>
        Thank you for your interest in joining <strong>Daffodil International University Robotics Club</strong>.
      </p>
      <p>
        After reviewing your application and payment details for Student ID <strong>${reg.studentId}</strong>,
        we regret to inform you that we were unable to verify your payment or approve your application at this time.
      </p>
      <p>
        If you believe this is a mistake or would like to reapply, please contact us through
        our official channels or visit our website to submit a new application.
      </p>

      ${ctaButton("Apply Again", `${SITE_URL}/join`)}

      <p style="text-align:center;color:#555;font-size:14px;margin-top:10px">
        We hope to see you again soon!
      </p>
    `;

    await transporter.sendMail({
      from: `"${from?.name || "Daffodil International University Robotics Club"}" <${from?.email}>`,
      to: reg.email,
      subject: "Update on Your DIURC Membership Application",
      html: emailWrapper("Application Status Update", body),
    });

    console.log(`[Email] Rejection email sent to ${reg.email}`);
    return true;
  } catch (err: any) {
    console.error("[Email] Failed to send rejection email:", err.message);
    return false;
  }
}

// ─── Email: Payment Verified ─────────────────────────────────────────────────

export async function sendPaymentVerifiedEmail(reg: {
  name: string;
  email: string;
  studentId: string;
  department?: string;
  batch?: string;
  paymentMethod?: string;
  transactionId?: string;
}) {
  try {
    const { transporter, from } = await createTransporter();

    const body = `
      <p style="margin-top:0;font-size:17px;color:#0a1f44">
        <strong>Dear ${reg.name},</strong>
      </p>
      <p>
        Great news! 🎉 Your payment for <strong>Daffodil International University Robotics Club</strong> membership has been
        <span style="color:#16a34a;font-weight:700">successfully verified</span> by our team.
      </p>
      <p>
        Your application is now under final review. You will receive a <strong>membership confirmation email</strong>
        very soon once your application is fully approved.
      </p>

      ${infoBox([
        { label: "✅ Name", value: reg.name },
        { label: "🎓 Student ID", value: reg.studentId },
        { label: "🏛️ Department", value: reg.department || "—" },
        { label: "📅 Batch", value: reg.batch || "—" },
        { label: "💳 Payment Method", value: reg.paymentMethod || "—" },
        { label: "🔖 Transaction ID", value: reg.transactionId || "—" },
        { label: "💚 Payment Status", value: '<span style="color:#16a34a;font-weight:700">Verified ✓</span>' },
      ])}

      <p>
        Thank you for your patience. If you have any questions, feel free to contact us.
      </p>

      ${ctaButton("Visit DIURC Website", SITE_URL)}

      <p style="text-align:center;font-size:16px;color:#0a1f44;font-weight:600;margin-top:10px">
        Stay tuned — your membership confirmation is on its way! 🚀
      </p>
    `;

    await transporter.sendMail({
      from: `"${from?.name || "Daffodil International University Robotics Club"}" <${from?.email}>`,
      to: reg.email,
      subject: "✅ Payment Verified — Daffodil International University Robotics Club",
      html: emailWrapper("Payment Verified ✅", body),
    });

    console.log(`[Email] Payment-verified email sent to ${reg.email}`);
    return true;
  } catch (err: any) {
    console.error("[Email] Failed to send payment-verified email:", err.message);
    return false;
  }
}

// ─── Email: Payment Rejected ─────────────────────────────────────────────────

export async function sendPaymentRejectedEmail(reg: {
  name: string;
  email: string;
  studentId: string;
  department?: string;
  batch?: string;
  paymentMethod?: string;
  transactionId?: string;
}) {
  try {
    const { transporter, from } = await createTransporter();

    const body = `
      <p style="margin-top:0;font-size:17px;color:#0a1f44">
        <strong>Dear ${reg.name},</strong>
      </p>
      <p>
        We have reviewed your payment submission for <strong>Daffodil International University Robotics Club</strong> membership,
        and unfortunately we were <span style="color:#dc2626;font-weight:700">unable to verify your payment</span> at this time.
      </p>

      ${infoBox([
        { label: "👤 Name", value: reg.name },
        { label: "🎓 Student ID", value: reg.studentId },
        { label: "🏛️ Department", value: reg.department || "—" },
        { label: "💳 Payment Method", value: reg.paymentMethod || "—" },
        { label: "🔖 Transaction ID", value: reg.transactionId || "—" },
        { label: "💔 Payment Status", value: '<span style="color:#dc2626;font-weight:700">Rejected ✗</span>' },
      ])}

      <p>
        Common reasons for payment rejection:
      </p>
      <ul style="color:#444;font-size:15px;line-height:1.8">
        <li>Incorrect transaction ID submitted</li>
        <li>Payment amount does not match the required fee</li>
        <li>Payment screenshot could not be verified</li>
      </ul>
      <p>
        If you believe this is a mistake, please <strong>resubmit your application</strong> with the correct payment details,
        or contact us for assistance.
      </p>

      ${ctaButton("Reapply Now", `${SITE_URL}/join`)}

      <p style="text-align:center;color:#555;font-size:14px;margin-top:10px">
        We apologize for any inconvenience and hope to resolve this quickly.
      </p>
    `;

    await transporter.sendMail({
      from: `"${from?.name || "Daffodil International University Robotics Club"}" <${from?.email}>`,
      to: reg.email,
      subject: "❌ Payment Rejected — Daffodil International University Robotics Club Membership",
      html: emailWrapper("Payment Rejected ❌", body),
    });

    console.log(`[Email] Payment-rejected email sent to ${reg.email}`);
    return true;
  } catch (err: any) {
    console.error("[Email] Failed to send payment-rejected email:", err.message);
    return false;
  }
}

// ─── Admin Email 1: New Registration Alert ────────────────────────────────────

export async function sendAdminNewRegistrationNotification(reg: {
  name: string;
  email: string;
  studentId: string;
  department?: string;
  batch?: string;
  phone?: string;
  paymentMethod?: string;
  transactionId?: string;
}) {
  try {
    const { transporter, from } = await createTransporter();

    const adminEmail = from?.email;
    if (!adminEmail) return false;

    const body = `
      <p style="margin-top:0;font-size:17px;color:#0a1f44">
        <strong>🔔 New Membership Registration Received</strong>
      </p>
      <p>
        A new membership application has just been submitted on the DIURC portal.
        Please review the application and verify the payment from the admin panel.
      </p>

      ${infoBox([
        { label: "👤 Name", value: reg.name },
        { label: "📧 Email", value: reg.email },
        { label: "📞 Phone", value: reg.phone || "—" },
        { label: "🎓 Student ID", value: reg.studentId },
        { label: "🏛️ Department", value: reg.department || "—" },
        { label: "📅 Batch", value: reg.batch || "—" },
        { label: "💳 Payment Method", value: reg.paymentMethod || "—" },
        { label: "🔖 Transaction ID", value: reg.transactionId || "—" },
        { label: "🕐 Submitted At", value: new Date().toLocaleString("en-BD", { timeZone: "Asia/Dhaka" }) },
      ])}

      ${ctaButton("Review in Admin Panel →", `${SITE_URL}/admin/member-registrations`)}

      <p style="color:#888;font-size:13px;text-align:center;margin-top:8px">
        This is an automated notification from the DIURC portal.
      </p>
    `;

    await transporter.sendMail({
      from: `"DIURC Portal" <${adminEmail}>`,
      to: adminEmail,
      subject: `🔔 New Registration: ${reg.name} (${reg.studentId})`,
      html: emailWrapper("New Registration Alert", body),
    });

    console.log(`[Email] Admin new-registration notification sent to ${adminEmail}`);
    return true;
  } catch (err: any) {
    console.error("[Email] Failed to send admin new-registration notification:", err.message);
    return false;
  }
}

// ─── Admin Email 2: Status Change Notification ───────────────────────────────

export async function sendAdminStatusChangeNotification(reg: {
  name: string;
  email: string;
  studentId: string;
  status: "approved" | "rejected";
}) {
  try {
    const { transporter, from } = await createTransporter();

    const adminEmail = from?.email;
    if (!adminEmail) return false;

    const isApproved = reg.status === "approved";
    const statusLabel = isApproved
      ? '<span style="color:#16a34a;font-weight:700">✅ Approved</span>'
      : '<span style="color:#dc2626;font-weight:700">❌ Rejected</span>';

    const body = `
      <p style="margin-top:0;font-size:17px;color:#0a1f44">
        <strong>${isApproved ? "✅ Member Approved" : "❌ Application Rejected"}</strong>
      </p>
      <p>
        The following applicant's status has been updated and a notification email
        has been <strong>sent to them</strong> from the DIURC portal.
      </p>

      ${infoBox([
        { label: "👤 Name", value: reg.name },
        { label: "📧 Email", value: reg.email },
        { label: "🎓 Student ID", value: reg.studentId },
        { label: "📋 New Status", value: statusLabel },
        { label: "🕐 Updated At", value: new Date().toLocaleString("en-BD", { timeZone: "Asia/Dhaka" }) },
      ])}

      <p>
        ${isApproved
          ? "A <strong>welcome confirmation email</strong> has been dispatched to the applicant's inbox."
          : "A <strong>rejection notification email</strong> has been dispatched to the applicant's inbox."}
      </p>

      ${ctaButton("View All Registrations →", `${SITE_URL}/admin/member-registrations`)}

      <p style="color:#888;font-size:13px;text-align:center;margin-top:8px">
        This is an automated notification from the DIURC portal.
      </p>
    `;

    await transporter.sendMail({
      from: `"DIURC Portal" <${adminEmail}>`,
      to: adminEmail,
      subject: `${isApproved ? "✅ Approved" : "❌ Rejected"}: ${reg.name} (${reg.studentId})`,
      html: emailWrapper(`Member ${isApproved ? "Approved" : "Rejected"}`, body),
    });

    console.log(`[Email] Admin status-change notification sent to ${adminEmail}`);
    return true;
  } catch (err: any) {
    console.error("[Email] Failed to send admin status-change notification:", err.message);
    return false;
  }
}
