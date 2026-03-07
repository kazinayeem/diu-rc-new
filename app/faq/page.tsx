"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    category: "Membership",
    items: [
      {
        q: "How do I join the DIU Robotics Club?",
        a: "Visit the Join page, fill out the membership application form, and complete the payment. Your application will be reviewed by the committee within 3–5 working days.",
      },
      {
        q: "How much is the membership fee?",
        a: "Membership fees vary by semester. Please check the Join page for the current fee structure and payment methods.",
      },
      {
        q: "How long does approval take?",
        a: "Application review typically takes 3–7 working days after payment verification. You will receive an email notification once your status is updated.",
      },
      {
        q: "Can I check my application status?",
        a: "Yes — visit the Verify page and enter your student ID or email to check your membership application status.",
      },
      {
        q: "I paid but my application still shows 'pending'. What should I do?",
        a: "Payment verification may take 1–2 working days. If it has been longer, contact us at info@diuroboticclub.com with your transaction ID.",
      },
    ],
  },
  {
    category: "Events & Workshops",
    items: [
      {
        q: "Do I need to be a member to attend events?",
        a: "Most public seminars and competitions are open to all DIU students. Some workshops and bootcamps are reserved for registered members and may require a separate registration fee.",
      },
      {
        q: "How do I register for a workshop or event?",
        a: "Browse the Events or Workshops page, click on the event of your interest, and follow the registration instructions provided there.",
      },
      {
        q: "Will I receive a certificate for attending?",
        a: "Certificates are issued for workshops and bootcamps upon successful completion. You can verify and download your certificate on the Verify page using the certificate ID provided.",
      },
    ],
  },
  {
    category: "Payments & Refunds",
    items: [
      {
        q: "Which payment methods are accepted?",
        a: "We accept bKash, Nagad, and bank transfers. The specific payment options and account numbers are shown during registration.",
      },
      {
        q: "Can I get a refund if I change my mind?",
        a: "Please review our full Refund Policy. In short, fees are generally non-refundable, but exceptions exist for cancellations by DIU RC or duplicate payments.",
      },
      {
        q: "I made a payment mistake. Who do I contact?",
        a: "Email us at info@diuroboticclub.com immediately with your name, student ID, and transaction ID. We will resolve it as quickly as possible.",
      },
    ],
  },
  {
    category: "Website & Account",
    items: [
      {
        q: "How do I verify my membership certificate?",
        a: "Visit the Verify page and enter your certificate ID or student ID to confirm authenticity.",
      },
      {
        q: "My profile information is incorrect. How do I update it?",
        a: "Contact us at info@diuroboticclub.com with the correct information and your student ID.",
      },
      {
        q: "Is my personal data safe?",
        a: "Yes. We take data protection seriously. Please read our Privacy Policy for full details on how your data is stored and used.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1F3A] text-black dark:text-white">
      <section className="py-20 text-center bg-gray-50 dark:bg-transparent border-b border-gray-200 dark:border-white/10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto text-sm">
          Can&apos;t find your answer here? Email us at{" "}
          <a href="mailto:info@diuroboticclub.com" className="text-cyan-400 hover:underline">
            info@diuroboticclub.com
          </a>
        </p>
      </section>

      <main className="max-w-3xl mx-auto px-6 py-16 space-y-14">
        {faqs.map((section) => (
          <div key={section.category}>
            <h2 className="text-lg font-bold text-cyan-400 uppercase tracking-widest mb-5 flex items-center gap-2">
              <span className="w-1 h-5 bg-cyan-400 rounded-full inline-block" />
              {section.category}
            </h2>
            <div className="space-y-3">
              {section.items.map((item) => (
                <FAQItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}

        <div className="p-5 rounded-xl border border-cyan-400/20 bg-cyan-400/5 text-sm text-cyan-300 text-center">
          Still have questions? See our{" "}
          <Link href="/terms" className="underline hover:text-white">Terms &amp; Conditions</Link>,{" "}
          <Link href="/privacy" className="underline hover:text-white">Privacy Policy</Link>, or{" "}
          <Link href="/refund-policy" className="underline hover:text-white">Refund Policy</Link>.
        </div>
      </main>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-black dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm"
      >
        <span>{q}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0 text-cyan-400"
        >
          <ChevronDown size={18} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-[14px] text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-white/5 pt-3">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
