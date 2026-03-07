import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Terms & Conditions | DIU Robotics Club",
  description: "Terms and conditions for using the Daffodil International University Robotics Club website and services.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1F3A] text-black dark:text-white">
      {/* Hero */}
      <section className="py-20 text-center bg-gray-50 dark:bg-transparent border-b border-gray-200 dark:border-white/10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Terms &amp; Conditions</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Last updated: March 2026</p>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-10">
        <Section title="1. Acceptance of Terms">
          By accessing or using the Daffodil International University Robotics Club (&quot;DIU RC&quot;) website and services, you agree to be bound by these Terms &amp; Conditions. If you do not agree, please do not use our services.
        </Section>

        <Section title="2. Use of Services">
          You agree to use our services only for lawful purposes and in a way that does not infringe the rights of others. You must not misuse our website by introducing viruses, attempting unauthorised access, or engaging in any conduct that restricts or inhibits others from using it.
        </Section>

        <Section title="3. Membership &amp; Registration">
          Membership applications are subject to review and approval by the club committee. Submission of an application does not guarantee acceptance. All information provided during registration must be accurate and complete. DIU RC reserves the right to reject or revoke membership at its discretion.
        </Section>

        <Section title="4. Payments &amp; Fees">
          Membership fees, workshop fees, or event fees are non-refundable once paid, unless otherwise stated in our{" "}
          <Link href="/refund-policy" className="text-cyan-400 hover:underline">Refund Policy</Link>.
          All payments must be made through the designated payment methods listed on the registration form.
        </Section>

        <Section title="5. Intellectual Property">
          All content on this website, including text, graphics, logos, images, and software, is the property of DIU RC or its content suppliers and is protected by applicable intellectual property laws. You may not reproduce, distribute, or create derivative works without express written permission.
        </Section>

        <Section title="6. User Content">
          Any content you submit to our platform (project descriptions, photos, comments) grants DIU RC a non-exclusive, royalty-free licence to use, display, and share that content for club-related promotional purposes. You retain ownership of your content.
        </Section>

        <Section title="7. Privacy">
          Your use of our services is also governed by our{" "}
          <Link href="/privacy" className="text-cyan-400 hover:underline">Privacy Policy</Link>,
          which is incorporated into these Terms by reference.
        </Section>

        <Section title="8. Limitation of Liability">
          DIU RC and its officers shall not be liable for any indirect, incidental, or consequential damages arising from your use of our services. Our total liability shall not exceed the amount you paid to us in the preceding 12 months.
        </Section>

        <Section title="9. Changes to Terms">
          We may update these Terms at any time. Continued use of our services after changes constitutes acceptance of the new Terms. We will notify members of significant changes via email or website notice.
        </Section>

        <Section title="10. Contact">
          For questions about these Terms, contact us at{" "}
          <a href="mailto:info@diuroboticclub.com" className="text-cyan-400 hover:underline">info@diuroboticclub.com</a>.
        </Section>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-bold text-cyan-400 mb-3">{title}</h2>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-[15px]">{children}</p>
    </div>
  );
}
