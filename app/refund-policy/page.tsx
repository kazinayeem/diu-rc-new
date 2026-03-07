import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Refund Policy | DIU Robotics Club",
  description: "Refund policy for membership fees, workshops, and events at DIU Robotics Club.",
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1F3A] text-black dark:text-white">
      <section className="py-20 text-center bg-gray-50 dark:bg-transparent border-b border-gray-200 dark:border-white/10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Refund Policy</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Last updated: March 2026</p>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-10">
        <Section title="1. General Policy">
          All fees paid to Daffodil International University Robotics Club (DIU RC) are generally non-refundable. This includes membership registration fees, workshop fees, event registration fees, and bootcamp fees. We encourage you to review the details carefully before completing payment.
        </Section>

        <Section title="2. Membership Fees">
          Membership registration fees are non-refundable once the application has been submitted and payment confirmed. If your application is rejected by the committee for any reason, a full refund will be processed within 7–14 working days.
        </Section>

        <Section title="3. Event &amp; Workshop Fees">
          <ul className="list-disc pl-6 mt-1 space-y-1">
            <li><strong>Cancellation by DIU RC:</strong> If we cancel an event or workshop, you will receive a full refund within 7–14 working days.</li>
            <li><strong>Cancellation by participant (7+ days before event):</strong> 50% refund may be considered on a case-by-case basis.</li>
            <li><strong>Cancellation by participant (less than 7 days before event):</strong> No refund.</li>
            <li><strong>No-show:</strong> No refund.</li>
          </ul>
        </Section>

        <Section title="4. Bootcamp Fees">
          Bootcamp fees are non-refundable after the programme has commenced. If cancelled by DIU RC before the programme starts, a full refund will be issued. Participant cancellations made more than 14 days before the start date may be eligible for a 50% refund.
        </Section>

        <Section title="5. Duplicate Payments">
          If you accidentally made a duplicate payment, please contact us immediately at{" "}
          <a href="mailto:info@diuroboticclub.com" className="text-cyan-400 hover:underline">info@diuroboticclub.com</a>{" "}
          with your transaction IDs. Duplicate payments will be fully refunded within 7 working days.
        </Section>

        <Section title="6. Refund Process">
          Refunds are processed back to the original payment method (bKash, Nagad, or bank transfer). Processing time is 7–14 working days after approval. To request a refund, email us with your name, student ID, transaction ID, and reason for the refund request.
        </Section>

        <Section title="7. Contact for Refund Requests">
          Email: <a href="mailto:info@diuroboticclub.com" className="text-cyan-400 hover:underline">info@diuroboticclub.com</a>
          <br />
          Please include your full name, student ID, payment transaction ID, and a brief description of your request.
        </Section>

        <div className="p-4 rounded-xl border border-cyan-400/20 bg-cyan-400/5 text-sm text-cyan-300">
          This policy is subject to change. For questions, see our{" "}
          <Link href="/faq" className="underline hover:text-white">FAQ</Link> or{" "}
          <Link href="/terms" className="underline hover:text-white">Terms &amp; Conditions</Link>.
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-cyan-400 mb-3">{title}</h2>
      <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-[15px]">{children}</div>
    </div>
  );
}
