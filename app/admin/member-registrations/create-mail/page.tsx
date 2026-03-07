"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { Loader2, Send, ChevronDown, ChevronUp, CheckCircle2, XCircle, Mail } from "lucide-react";
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
    body: `<h2>Welcome to the DIU Robotics Club Family! 🤖</h2>
<p>Dear Member,</p>
<p>We are thrilled to have you on board! As a member of the <strong>Daffodil International University Robotics Club</strong>, you now have access to exciting workshops, seminars, competitions, and a community of like-minded innovators.</p>
<h3>What's next?</h3>
<ul>
  <li>Check out our upcoming <a href="https://diu-rc-new.vercel.app/events">Events</a></li>
  <li>Explore our <a href="https://diu-rc-new.vercel.app/workshops">Workshops</a></li>
  <li>Connect with the team on our <a href="https://diu-rc-new.vercel.app/teams">Teams page</a></li>
</ul>
<p>Stay tuned for announcements and get ready to innovate!</p>
<p>Best regards,<br/><strong>DIU Robotics Club Team</strong></p>`,
  },
  {
    label: "📣 Event Announcement",
    subject: "Exciting Event Coming Up at DIU Robotics Club!",
    body: `<h2>Don't Miss Our Upcoming Event! 🚀</h2>
<p>Dear Member,</p>
<p>We are excited to announce an upcoming event organized by the <strong>DIU Robotics Club</strong>!</p>
<h3>Event Details</h3>
<ul>
  <li><strong>Event Name:</strong> [Event Name Here]</li>
  <li><strong>Date:</strong> [Date]</li>
  <li><strong>Time:</strong> [Time]</li>
  <li><strong>Venue:</strong> [Venue]</li>
</ul>
<p>This is a great opportunity to learn, network, and showcase your skills. Seats are limited — register early!</p>
<p><a href="https://diu-rc-new.vercel.app/events" style="display:inline-block;padding:10px 24px;background:#1c75bc;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;">View Events →</a></p>
<p>See you there!<br/><strong>DIU Robotics Club Team</strong></p>`,
  },
  {
    label: "🛠️ Workshop Invitation",
    subject: "You're Invited: Exclusive Workshop by DIU Robotics Club",
    body: `<h2>Exclusive Workshop Invitation 🛠️</h2>
<p>Dear Member,</p>
<p>We are hosting an exclusive workshop designed to sharpen your technical skills and broaden your knowledge in robotics and automation.</p>
<h3>Workshop Details</h3>
<ul>
  <li><strong>Topic:</strong> [Workshop Topic]</li>
  <li><strong>Instructor:</strong> [Instructor Name]</li>
  <li><strong>Date &amp; Time:</strong> [Date &amp; Time]</li>
  <li><strong>Registration Deadline:</strong> [Deadline]</li>
</ul>
<p>A certificate will be provided upon successful completion.</p>
<p><a href="https://diu-rc-new.vercel.app/workshops" style="display:inline-block;padding:10px 24px;background:#1c75bc;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;">Register Now →</a></p>
<p>Best regards,<br/><strong>DIU Robotics Club Team</strong></p>`,
  },
  {
    label: "🔔 General Announcement",
    subject: "Important Announcement from DIU Robotics Club",
    body: `<h2>Important Announcement 🔔</h2>
<p>Dear Member,</p>
<p>We have an important update to share with all members of the <strong>Daffodil International University Robotics Club</strong>.</p>
<p>[Write your announcement here]</p>
<p>For more information, visit our website or contact us at <a href="mailto:info@diuroboticclub.com">info@diuroboticclub.com</a>.</p>
<p>Thank you for being a valued member!</p>
<p>Best regards,<br/><strong>DIU Robotics Club Team</strong></p>`,
  },
  {
    label: "🏆 Membership Renewal Reminder",
    subject: "Renew Your DIU Robotics Club Membership",
    body: `<h2>Time to Renew Your Membership! 🏆</h2>
<p>Dear Member,</p>
<p>Your membership with the <strong>DIU Robotics Club</strong> is due for renewal. Don't miss out on another year of exciting events, workshops, and opportunities!</p>
<h3>Membership Benefits</h3>
<ul>
  <li>Access to exclusive workshops and bootcamps</li>
  <li>Priority registration for competitions</li>
  <li>Networking with top engineering students</li>
  <li>Certificate of membership</li>
</ul>
<p><strong>Renewal Fee: ৳200 BDT</strong></p>
<p><a href="https://diu-rc-new.vercel.app/join" style="display:inline-block;padding:10px 24px;background:#1c75bc;color:#fff;border-radius:6px;text-decoration:none;font-weight:bold;">Renew Now →</a></p>
<p>Thank you for being part of our community!<br/><strong>DIU Robotics Club Team</strong></p>`,
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
              <button
                key={t.label}
                onClick={() => applyTemplate(t)}
                className="text-left p-4 bg-white/5 border border-white/10 rounded-xl hover:border-cyan-400/40 hover:bg-cyan-400/5 transition-all group"
              >
                <p className="font-semibold text-sm group-hover:text-cyan-300 transition-colors">{t.label}</p>
                <p className="text-white/40 text-xs mt-1 truncate">{t.subject}</p>
              </button>
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
          <label className="block text-xs text-white/50 mb-1">Email Body *</label>
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
