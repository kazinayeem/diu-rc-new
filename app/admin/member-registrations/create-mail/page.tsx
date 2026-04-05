"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { Loader2, Send, ChevronDown, ChevronUp, CheckCircle2, XCircle, Mail, Copy, Check, Code2, X } from "lucide-react";
import Link from "next/link";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

// ── Quill toolbar config ──────────────────────────────────────────────────────
const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    [{ font: [] }, { size: ["small", false, "large", "huge"] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ align: [] }],
    ["blockquote", "link", "image"],
    ["clean"],
  ],
};

const quillFormats = [
  "header","font","size","bold","italic","underline","strike",
  "color","background","list","bullet","align","blockquote","link","image",
];

// ── Email Templates ───────────────────────────────────────────────────────────
const TEMPLATES = [
  {
    label: "🎉 Welcome New Members",
    subject: "Welcome to DIU Robotics Club!",
    body: `<div style="font-family:Arial,sans-serif;color:#333;line-height:1.6;">
<h2 style="color:#0066cc;border-bottom:3px solid #00ccff;padding-bottom:10px;">Welcome to the DIU Robotics Club Family! 🤖</h2>
<p>Dear Member,</p>
<p>We are thrilled to have you on board! As a member of the <strong>Daffodil International University Robotics Club</strong>, you now have access to exciting workshops, seminars, competitions, and a community of like-minded innovators.</p>
<h3 style="color:#0066cc;margin-top:20px;">What's Next?</h3>
<ul style="background:#f0f8ff;padding:15px 20px;border-left:4px solid #00ccff;border-radius:6px;">
  <li>Check out our upcoming <a href="https://diu-rc-new.vercel.app/events" style="color:#0066cc;text-decoration:none;font-weight:bold;">Events</a></li>
  <li>Explore our <a href="https://diu-rc-new.vercel.app/workshops" style="color:#0066cc;text-decoration:none;font-weight:bold;">Workshops</a></li>
  <li>Connect with the team on our <a href="https://diu-rc-new.vercel.app/teams" style="color:#0066cc;text-decoration:none;font-weight:bold;">Teams page</a></li>
</ul>
<p style="margin-top:20px;">Stay tuned for announcements and get ready to innovate!</p>
<p style="margin-top:20px;">Best regards,<br/><strong style="color:#0066cc;">DIU Robotics Club Team</strong></p>
</div>`,
  },
  {
    label: "📣 Event Announcement",
    subject: "Exciting Event Coming Up at DIU Robotics Club!",
    body: `<div style="font-family:Arial,sans-serif;color:#333;line-height:1.6;">
<h2 style="color:#0066cc;border-bottom:3px solid #ff6600;padding-bottom:10px;">Don't Miss Our Upcoming Event! 🚀</h2>
<p>Dear Member,</p>
<p>We are excited to announce an upcoming event organized by the <strong>DIU Robotics Club</strong>!</p>
<h3 style="color:#0066cc;margin-top:20px;">Event Details</h3>
<div style="background:#fff3e0;padding:15px 20px;border-left:4px solid #ff6600;border-radius:6px;margin-bottom:15px;">
  <p><strong>Event Name:</strong> [Event Name Here]</p>
  <p><strong>Date:</strong> [Date]</p>
  <p><strong>Time:</strong> [Time]</p>
  <p><strong>Venue:</strong> [Venue]</p>
</div>
<p>This is a great opportunity to learn, network, and showcase your skills. Seats are limited — register early!</p>
<p style="text-align:center;margin:25px 0;"><a href="https://diu-rc-new.vercel.app/events" style="display:inline-block;padding:12px 30px;background:#ff6600;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;font-size:16px;">View & Register Now →</a></p>
<p>See you there!<br/><strong style="color:#0066cc;">DIU Robotics Club Team</strong></p>
</div>`,
  },
  {
    label: "🛠️ Workshop Invitation",
    subject: "You're Invited: Exclusive Workshop by DIU Robotics Club",
    body: `<div style="font-family:Arial,sans-serif;color:#333;line-height:1.6;">
<h2 style="color:#0066cc;border-bottom:3px solid #00cc66;padding-bottom:10px;">Exclusive Workshop Invitation 🛠️</h2>
<p>Dear Member,</p>
<p>We are hosting an exclusive workshop designed to sharpen your technical skills and broaden your knowledge in robotics and automation.</p>
<h3 style="color:#0066cc;margin-top:20px;">Workshop Details</h3>
<div style="background:#f0fff0;padding:15px 20px;border-left:4px solid #00cc66;border-radius:6px;margin-bottom:15px;">
  <p><strong>Topic:</strong> [Workshop Topic]</p>
  <p><strong>Instructor:</strong> [Instructor Name]</p>
  <p><strong>Date &amp; Time:</strong> [Date &amp; Time]</p>
  <p><strong>Capacity:</strong> [Number] participants</p>
  <p><strong>Registration Deadline:</strong> [Deadline]</p>
</div>
<p><strong style="color:#00cc66;">✓ Certificate</strong> will be provided upon successful completion.</p>
<p style="text-align:center;margin:25px 0;"><a href="https://diu-rc-new.vercel.app/workshops" style="display:inline-block;padding:12px 30px;background:#00cc66;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;font-size:16px;">Register Now →</a></p>
<p>Best regards,<br/><strong style="color:#0066cc;">DIU Robotics Club Team</strong></p>
</div>`,
  },
  {
    label: "🔔 General Announcement",
    subject: "Important Announcement from DIU Robotics Club",
    body: `<div style="font-family:Arial,sans-serif;color:#333;line-height:1.6;">
<h2 style="color:#0066cc;border-bottom:3px solid #cc0000;padding-bottom:10px;">Important Announcement 🔔</h2>
<p>Dear Member,</p>
<p>We have an important update to share with all members of the <strong>Daffodil International University Robotics Club</strong>.</p>
<div style="background:#ffe6e6;padding:15px 20px;border-left:4px solid #cc0000;border-radius:6px;margin:20px 0;">
  <p>[Write your announcement here]</p>
</div>
<h3 style="color:#0066cc;margin-top:20px;">What You Need to Know</h3>
<ul>
  <li>[Key Point 1]</li>
  <li>[Key Point 2]</li>
  <li>[Key Point 3]</li>
</ul>
<p style="margin-top:20px;">For more information, visit our website or contact us at <a href="mailto:info@diuroboticclub.com" style="color:#0066cc;text-decoration:none;font-weight:bold;">info@diuroboticclub.com</a>.</p>
<p>Thank you for being a valued member!</p>
<p>Best regards,<br/><strong style="color:#0066cc;">DIU Robotics Club Team</strong></p>
</div>`,
  },
  {
    label: "🏆 Membership Renewal Reminder",
    subject: "Renew Your DIU Robotics Club Membership",
    body: `<div style="font-family:Arial,sans-serif;color:#333;line-height:1.6;">
<h2 style="color:#0066cc;border-bottom:3px solid #ffd700;padding-bottom:10px;">Time to Renew Your Membership! 🏆</h2>
<p>Dear Member,</p>
<p>Your membership with the <strong>DIU Robotics Club</strong> is due for renewal. Don't miss out on another year of exciting events, workshops, and opportunities!</p>
<h3 style="color:#0066cc;margin-top:20px;">Membership Benefits</h3>
<div style="background:#fffef0;padding:15px 20px;border-left:4px solid #ffd700;border-radius:6px;margin-bottom:15px;">
  <ul style="margin:0;padding-left:20px;">
    <li>Access to exclusive workshops and bootcamps</li>
    <li>Priority registration for competitions</li>
    <li>Networking with top engineering students</li>
    <li>Certificate of membership</li>
    <li>Exclusive club merchandise</li>
  </ul>
</div>
<p style="font-size:18px;text-align:center;color:#cc6600;font-weight:bold;margin:20px 0;">Renewal Fee: <span style="color:#0066cc;">৳200 BDT</span></p>
<p style="text-align:center;margin:25px 0;"><a href="https://diu-rc-new.vercel.app/join" style="display:inline-block;padding:12px 30px;background:#ffd700;color:#000;border-radius:6px;text-decoration:none;font-weight:bold;font-size:16px;">Renew Now →</a></p>
<p>Thank you for being part of our community!<br/><strong style="color:#0066cc;">DIU Robotics Club Team</strong></p>
</div>`,
  },
  {
    label: "🎯 Project Showcase & Sponsorship",
    subject: "Exciting Projects & Sponsorship Opportunities",
    body: `<div style="font-family:Arial,sans-serif;color:#333;line-height:1.6;">
<h2 style="color:#0066cc;border-bottom:3px solid #9933cc;padding-bottom:10px;">Check Out Our Amazing Projects! 🎯</h2>
<p>Dear Member,</p>
<p>We're proud to showcase the incredible projects our members have been working on this semester. From AI-powered robots to autonomous vehicles, our club continues to push the boundaries of innovation!</p>
<h3 style="color:#0066cc;margin-top:20px;">Featured Projects</h3>
<div style="background:#f3e6ff;padding:15px 20px;border-left:4px solid #9933cc;border-radius:6px;margin-bottom:15px;">
  <p><strong>[Project Name 1]</strong> - [Brief Description]</p>
  <p style="margin-top:10px;"><strong>[Project Name 2]</strong> - [Brief Description]</p>
  <p style="margin-top:10px;"><strong>[Project Name 3]</strong> - [Brief Description]</p>
</div>
<h3 style="color:#0066cc;margin-top:20px;">Sponsorship Opportunities</h3>
<p>If you or your organization would like to support DIU Robotics Club, we have exciting sponsorship opportunities available. Your support helps us:</p>
<ul style="background:#f9f9f9;padding:15px 20px;border-radius:6px;">
  <li>Organize competitions and events</li>
  <li>Conduct advanced workshops</li>
  <li>Purchase state-of-the-art equipment</li>
</ul>
<p style="text-align:center;margin:25px 0;"><a href="https://diu-rc-new.vercel.app/sponsors" style="display:inline-block;padding:12px 30px;background:#9933cc;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;font-size:16px;">Learn More About Sponsorship →</a></p>
<p>Best regards,<br/><strong style="color:#0066cc;">DIU Robotics Club Leadership</strong></p>
</div>`,
  },
  {
    label: "✅ Registration Confirmation",
    subject: "Your Registration is Confirmed - DIU Robotics Club",
    body: `<div style="font-family:Arial,sans-serif;color:#333;line-height:1.6;">
<h2 style="color:#0066cc;border-bottom:3px solid #00cc00;padding-bottom:10px;">Registration Confirmed! ✅</h2>
<p>Dear Member,</p>
<p>Thank you for registering for our upcoming <strong>[Event/Workshop Name]</strong>. We're excited to have you participate!</p>
<h3 style="color:#0066cc;margin-top:20px;">Confirmation Details</h3>
<div style="background:#e6ffe6;padding:15px 20px;border-left:4px solid #00cc00;border-radius:6px;margin-bottom:15px;">
  <p><strong>Confirmation Number:</strong> [CONF-000123]</p>
  <p><strong>Event:</strong> [Event Name]</p>
  <p><strong>Date:</strong> [Date]</p>
  <p><strong>Time:</strong> [Time]</p>
  <p><strong>Venue:</strong> [Venue/Link]</p>
  <p><strong>Registration Status:</strong> <span style="color:#00cc00;font-weight:bold;">✓ Confirmed</span></p>
</div>
<h3 style="color:#0066cc;margin-top:20px;">What to Bring/Do</h3>
<ul>
  <li>Bring a valid ID</li>
  <li>Arrive 10 minutes early</li>
  <li>Bring your laptop (if applicable)</li>
</ul>
<p style="margin-top:20px;padding:15px;background:#f0f8ff;border-radius:6px;"><strong>Questions?</strong> Contact us at <a href="mailto:support@diuroboticclub.com" style="color:#0066cc;text-decoration:none;">support@diuroboticclub.com</a></p>
<p style="margin-top:20px;">We look forward to seeing you!<br/><strong style="color:#0066cc;">DIU Robotics Club Team</strong></p>
</div>`,
  },
  {
    label: "🎖️ Congratulations & Achievement",
    subject: "🎉 Congratulations on Your Achievement!",
    body: `<div style="font-family:Arial,sans-serif;color:#333;line-height:1.6;">
<h2 style="color:#0066cc;border-bottom:3px solid #ff6600;padding-bottom:10px;text-align:center;font-size:28px;">🎉 Congratulations! 🎖️</h2>
<p style="text-align:center;font-size:18px;color:#ff6600;font-weight:bold;margin:20px 0;">We're Proud of Your Achievement!</p>
<p>Dear [Member Name],</p>
<p style="text-align:center;margin:20px 0;font-size:16px;">We are delighted to recognize your outstanding contribution and achievement in [Competition/Project/Role]!</p>
<div style="background:#fff3e0;padding:20px;border-left:4px solid #ff6600;border-radius:6px;margin:20px 0;text-align:center;">
  <p style="font-size:20px;color:#ff6600;font-weight:bold;margin:0;">Winner: [Award Category]</p>
  <p style="margin:10px 0 0 0;color:#0066cc;">Date: [Date of Achievement]</p>
</div>
<h3 style="color:#0066cc;margin-top:20px;">Why This Matters</h3>
<p>Your dedication, hard work, and innovation exemplify the spirit of DIU Robotics Club. This achievement not only showcases your skills but also represents the excellence of our entire organization.</p>
<h3 style="color:#0066cc;margin-top:20px;">What's Next?</h3>
<ul>
  <li>Join our Hall of Fame at <a href="https://diu-rc-new.vercel.app/hall-of-fame" style="color:#0066cc;text-decoration:none;font-weight:bold;">Hall of Fame</a></li>
  <li>Share your experience with the community</li>
  <li>Mentor junior members</li>
</ul>
<p style="text-align:center;margin:25px 0;"><a href="https://diu-rc-new.vercel.app/hall-of-fame" style="display:inline-block;padding:12px 30px;background:#ff6600;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;font-size:16px;">View Hall of Fame →</a></p>
<p>Once again, congratulations!<br/><strong style="color:#0066cc;">DIU Robotics Club Leadership</strong></p>
</div>`,
  },
  {
    label: "📅 Meeting Reminder & Agenda",
    subject: "Meeting Reminder: DIU Robotics Club - [Date]",
    body: `<div style="font-family:Arial,sans-serif;color:#333;line-height:1.6;">
<h2 style="color:#0066cc;border-bottom:3px solid #0099ff;padding-bottom:10px;">📅 Upcoming Meeting Reminder</h2>
<p>Dear Member,</p>
<p>We have an important meeting coming up! Please mark your calendar and plan to attend.</p>
<h3 style="color:#0066cc;margin-top:20px;">Meeting Details</h3>
<div style="background:#e6f2ff;padding:15px 20px;border-left:4px solid #0099ff;border-radius:6px;margin-bottom:15px;">
  <p><strong>Date:</strong> [Date]</p>
  <p><strong>Time:</strong> [Time]</p>
  <p><strong>Venue:</strong> [Room/Location]</p>
  <p><strong>Duration:</strong> [Duration] minutes</p>
</div>
<h3 style="color:#0066cc;margin-top:20px;">Agenda</h3>
<ol style="background:#f9f9f9;padding:15px 20px;border-radius:6px;">
  <li><strong>Opening Remarks</strong> - Updates from leadership</li>
  <li><strong>Project Updates</strong> - Status on ongoing projects</li>
  <li><strong>Upcoming Events</strong> - Discussion on next events</li>
  <li><strong>Announcements</strong> - Important news and opportunities</li>
  <li><strong>Q&A Session</strong> - Ask your questions!</li>
  <li><strong>Closing</strong> - Next meeting date</li>
</ol>
<p style="margin-top:20px;padding:15px;background:#ffe6e6;border-left:4px solid #cc0000;border-radius:6px;"><strong>⚠️ Important:</strong> Please confirm your attendance by replying to this email or registering <a href="https://diu-rc-new.vercel.app" style="color:#0066cc;text-decoration:none;font-weight:bold;">here</a>.</p>
<p style="margin-top:20px;">See you there!<br/><strong style="color:#0066cc;">DIU Robotics Club Team</strong></p>
</div>`,
  },
  {
    label: "💬 Feedback & Survey Request",
    subject: "Your Feedback Matters! Help Us Improve",
    body: `<div style="font-family:Arial,sans-serif;color:#333;line-height:1.6;">
<h2 style="color:#0066cc;border-bottom:3px solid #00cc99;padding-bottom:10px;">💬 We Value Your Feedback!</h2>
<p>Dear Member,</p>
<p>Thank you for being an active member of DIU Robotics Club! Your feedback is invaluable to help us improve our services, events, and overall member experience.</p>
<h3 style="color:#0066cc;margin-top:20px;">Why Your Opinion Matters</h3>
<div style="background:#e6ffe6;padding:15px 20px;border-left:4px solid #00cc99;border-radius:6px;margin-bottom:15px;">
  <ul style="margin:0;padding-left:20px;">
    <li>Help us design better workshops and events</li>
    <li>Improve our communication and resources</li>
    <li>Shape the future of the club</li>
    <li>Your voice directly influences our decisions</li>
  </ul>
</div>
<h3 style="color:#0066cc;margin-top:20px;">Survey Topics Include</h3>
<p>✓ Event quality and relevance<br/>
✓ Workshop content and instructors<br/>
✓ Communication effectiveness<br/>
✓ Community and networking<br/>
✓ Resources and support<br/>
✓ Overall member satisfaction</p>
<p style="text-align:center;margin:25px 0;"><a href="https://diu-rc-new.vercel.app" style="display:inline-block;padding:12px 30px;background:#00cc99;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;font-size:16px;">Take the Survey (5 minutes) →</a></p>
<p style="margin-top:20px;padding:15px;background:#f0f8ff;border-radius:6px;"><strong>Incentive:</strong> All survey participants will be entered into a raffle to win exciting prizes!</p>
<p style="margin-top:20px;">Thank you for helping us build a better club!<br/><strong style="color:#0066cc;">DIU Robotics Club Team</strong></p>
</div>`,
  },
  {
    label: "🚀 Bootcamp Invitation",
    subject: "Elevate Your Skills: DIU Robotics Bootcamp Starts Soon!",
    body: `<div style="font-family:Arial,sans-serif;color:#333;line-height:1.6;">
<h2 style="color:#0066cc;border-bottom:3px solid #ff0066;padding-bottom:10px;">🚀 Bootcamp Starts Soon!</h2>
<p>Dear Member,</p>
<p>Get ready for an intensive learning experience! We're launching an exclusive <strong>Robotics Bootcamp</strong> designed to take your skills to the next level.</p>
<h3 style="color:#0066cc;margin-top:20px;">Bootcamp Overview</h3>
<div style="background:#ffe6f0;padding:15px 20px;border-left:4px solid #ff0066;border-radius:6px;margin-bottom:15px;">
  <p><strong>Duration:</strong> [Duration - e.g., 4 weeks]</p>
  <p><strong>Schedule:</strong> [Days and Times]</p>
  <p><strong>Format:</strong> Hands-on practical learning with real projects</p>
  <p><strong>Capacity:</strong> Limited to [Number] participants</p>
  <p><strong>Start Date:</strong> [Date]</p>
</div>
<h3 style="color:#0066cc;margin-top:20px;">What You'll Learn</h3>
<ul style="background:#f9f9f9;padding:15px 20px;border-radius:6px;">
  <li>Advanced robotics programming concepts</li>
  <li>Hardware integration and troubleshooting</li>
  <li>Real-world project development</li>
  <li>Industry best practices</li>
  <li>Collaboration and teamwork</li>
</ul>
<h3 style="color:#0066cc;margin-top:20px;">Investment</h3>
<p style="text-align:center;font-size:18px;font-weight:bold;margin:15px 0;">Early Bird Price: <span style="color:#ff0066;">৳[Amount] BDT</span></p>
<p style="text-align:center;color:#666;font-size:12px;">Regular Price: ৳[Original Amount] BDT</p>
<p style="text-align:center;margin:25px 0;"><a href="https://diu-rc-new.vercel.app/bootcamp" style="display:inline-block;padding:12px 30px;background:#ff0066;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;font-size:16px;">Enroll Now →</a></p>
<p style="color:#cc0000;margin:15px 0;font-weight:bold;">⏰ Limited seats available! Register before [Deadline]</p>
<p>Best regards,<br/><strong style="color:#0066cc;">DIU Robotics Club Team</strong></p>
</div>`,
  },
];

const BATCH_OPTIONS = [
  { label: "Send to 100", value: 100 },
  { label: "Send to 500", value: 500 },
  { label: "Send to 1000", value: 1000 },
  { label: "Send to All", value: 99999 },
];

export default function CreateMailPage() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [recipientType, setRecipientType] = useState("approved");
  const [batchSize, setBatchSize] = useState(100);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showTemplates, setShowTemplates] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showHtmlPaste, setShowHtmlPaste] = useState(false);
  const [pasteHtml, setPasteHtml] = useState("");

  const copyHtml = async (html: string, id: string) => {
    try {
      await navigator.clipboard.writeText(html);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement("textarea");
      el.value = html;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const applyTemplate = (t: (typeof TEMPLATES)[0]) => {
    setSubject(t.subject);
    setBody(t.body);
    setShowTemplates(false);
  };

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      alert("Please fill in the subject and email body.");
      return;
    }
    if (!confirm(`Send to up to ${batchSize === 99999 ? "ALL" : batchSize} ${recipientType} members?`)) return;

    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/member-registrations/send-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, htmlBody: body, recipientType, batchSize }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ success: false, error: "Network error — could not reach server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-1 flex items-center gap-2">
            <Mail size={28} className="text-cyan-400" />
            Send Promotional Email
          </h1>
          <p className="text-white/50 text-sm">Compose and send bulk emails to members</p>
        </div>
        <Link href="/admin/member-registrations">
          <Button className="bg-white/10 hover:bg-white/20">← Back</Button>
        </Link>
      </div>

      {/* Templates */}
      <div className="bg-white/5 border border-white/10 rounded-2xl mb-6 overflow-hidden">
        <button
          onClick={() => setShowTemplates(v => !v)}
          className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold hover:bg-white/5 transition-colors"
        >
          <span className="flex items-center gap-2 text-cyan-300">
            📄 Email Templates <span className="text-white/40 text-xs font-normal">(click to use)</span>
          </span>
          {showTemplates ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showTemplates && (
          <div className="px-5 pb-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TEMPLATES.map((t) => (
              <div
                key={t.label}
                className="bg-white/5 border border-white/10 rounded-xl hover:border-cyan-400/40 hover:bg-cyan-400/5 transition-all group p-4 flex flex-col gap-3"
              >
                <div>
                  <p className="font-semibold text-sm group-hover:text-cyan-300 transition-colors">{t.label}</p>
                  <p className="text-white/40 text-xs mt-1 truncate">{t.subject}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => applyTemplate(t)}
                    className="flex-1 py-1.5 text-xs font-semibold bg-cyan-500/15 hover:bg-cyan-500/30 text-cyan-300 rounded-lg transition-colors"
                  >
                    Use Template
                  </button>
                  <button
                    onClick={() => copyHtml(t.body, t.label)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white/5 hover:bg-white/10 text-white/60 hover:text-white rounded-lg transition-colors border border-white/10"
                    title="Copy HTML"
                  >
                    {copiedId === t.label ? <><Check size={12} className="text-green-400" /> Copied!</> : <><Copy size={12} /> HTML</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Compose */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-5">
        {/* Recipients + Batch */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/50 mb-1">Recipients</label>
            <select
              value={recipientType}
              onChange={e => setRecipientType(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#0f192d] border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="approved" className="bg-[#0f192d]">Approved members only</option>
              <option value="pending" className="bg-[#0f192d]">Pending members only</option>
              <option value="all" className="bg-[#0f192d]">All registrations</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1">Batch Size</label>
            <select
              value={batchSize}
              onChange={e => setBatchSize(Number(e.target.value))}
              className="w-full px-3 py-2.5 bg-[#0f192d] border border-white/15 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              {BATCH_OPTIONS.map(o => (
                <option key={o.value} value={o.value} className="bg-[#0f192d]">{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-xs text-white/50 mb-1">Subject *</label>
          <input
            value={subject}
            onChange={e => setSubject(e.target.value)}
            placeholder="Email subject..."
            className="w-full px-4 py-2.5 bg-white/5 border border-white/15 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-sm"
          />
        </div>

        {/* Rich Text Editor */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-white/50">Email Body *</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setShowHtmlPaste(v => !v); if (!showHtmlPaste) setPasteHtml(""); }}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium border rounded-lg transition-colors ${
                  showHtmlPaste
                    ? "bg-purple-500/20 border-purple-400/40 text-purple-300"
                    : "bg-white/5 hover:bg-white/10 border-white/15 text-white/60 hover:text-white"
                }`}
                title="Paste raw HTML into editor"
              >
                <Code2 size={12} />
                {showHtmlPaste ? "Close HTML" : "Paste HTML"}
              </button>
              {body && (
                <button
                  onClick={() => copyHtml(body, "__body__")}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium bg-white/5 hover:bg-white/10 border border-white/15 text-white/60 hover:text-white rounded-lg transition-colors"
                >
                  {copiedId === "__body__" ? <><Check size={12} className="text-green-400" />Copied!</> : <><Copy size={12} />Copy HTML</>}
                </button>
              )}
            </div>
          </div>

          {/* HTML Paste Panel */}
          {showHtmlPaste && (
            <div className="mb-3 bg-purple-900/20 border border-purple-400/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                  <Code2 size={13} /> Paste your custom HTML template below
                </p>
                <button
                  onClick={() => setShowHtmlPaste(false)}
                  className="text-white/30 hover:text-white/70 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
              <textarea
                value={pasteHtml}
                onChange={e => setPasteHtml(e.target.value)}
                rows={10}
                placeholder="<h1>Hello {{name}}</h1><p>Your custom HTML here...</p>"
                className="w-full px-3 py-2.5 bg-[#0a1120] border border-white/10 rounded-lg text-white/90 text-xs font-mono placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y"
              />
              <div className="flex items-center gap-2">
                <button
                  disabled={!pasteHtml.trim()}
                  onClick={() => {
                    setBody(pasteHtml.trim());
                    setShowHtmlPaste(false);
                    setPasteHtml("");
                  }}
                  className="flex-1 py-2 text-xs font-bold bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  ✓ Apply to Editor
                </button>
                <button
                  onClick={() => { setPasteHtml(""); setShowHtmlPaste(false); }}
                  className="px-4 py-2 text-xs font-medium bg-white/5 hover:bg-white/10 text-white/60 rounded-lg transition-colors border border-white/10"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="quill-dark rounded-xl overflow-hidden border border-white/15">
            <ReactQuill
              theme="snow"
              value={body}
              onChange={setBody}
              modules={quillModules}
              formats={quillFormats}
              style={{ minHeight: "340px", color: "#fff", background: "rgba(255,255,255,0.03)" }}
              placeholder="Compose your email here..."
            />
          </div>
        </div>

        {/* Result banner */}
        {result && (
          <div className={`rounded-xl border text-sm ${
            result.success
              ? "bg-green-500/10 border-green-500/25 text-green-300"
              : "bg-red-500/10 border-red-500/25 text-red-300"
          }`}>
            {/* Top row */}
            <div className="flex items-center gap-3 px-4 pt-4 pb-3">
              {result.success ? <CheckCircle2 size={18} className="flex-shrink-0" /> : <XCircle size={18} className="flex-shrink-0" />}
              <p className="font-bold text-base">{result.success ? "Email campaign complete!" : "Error"}</p>
            </div>

            {/* Stats cards */}
            {result.success && (
              <div className="grid grid-cols-3 gap-3 px-4 pb-4">
                <div className="bg-white/5 rounded-lg p-3 text-center">
                  <p className="text-2xl font-extrabold text-white">{result.total ?? 0}</p>
                  <p className="text-xs text-white/50 mt-0.5">Total matched</p>
                </div>
                <div className="bg-green-500/15 rounded-lg p-3 text-center border border-green-500/20">
                  <p className="text-2xl font-extrabold text-green-300">{result.sent ?? 0}</p>
                  <p className="text-xs text-green-300/60 mt-0.5">Sent ✓</p>
                </div>
                <div className={`rounded-lg p-3 text-center border ${result.failed > 0 ? "bg-red-500/15 border-red-500/20" : "bg-white/5 border-white/10"}`}>
                  <p className={`text-2xl font-extrabold ${result.failed > 0 ? "text-red-300" : "text-white/40"}`}>{result.failed ?? 0}</p>
                  <p className={`text-xs mt-0.5 ${result.failed > 0 ? "text-red-300/60" : "text-white/30"}`}>Failed ✗</p>
                </div>
              </div>
            )}

            {/* Error message */}
            {!result.success && (
              <p className="px-4 pb-4">{result.error}</p>
            )}

            {/* Failed address details */}
            {result.errors?.length > 0 && (
              <details className="px-4 pb-4 text-xs opacity-70">
                <summary className="cursor-pointer hover:opacity-100">Show failed addresses ({result.errors.length})</summary>
                <ul className="mt-2 space-y-0.5 pl-3">
                  {result.errors.map((e: string, i: number) => <li key={i}>{e}</li>)}
                </ul>
              </details>
            )}
          </div>
        )}

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={loading || !subject.trim() || !body.trim()}
          className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed py-3 text-base font-bold"
        >
          {loading ? (
            <><Loader2 size={18} className="mr-2 animate-spin" />Sending...</>
          ) : (
            <><Send size={18} className="mr-2" />Send Email</>
          )}
        </Button>
      </div>
    </div>
  );
}
