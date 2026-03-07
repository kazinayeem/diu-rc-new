import React from "react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | DIU Robotics Club",
  description: "Privacy policy for the Daffodil International University Robotics Club website.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0B1F3A] text-black dark:text-white">
      <section className="py-20 text-center bg-gray-50 dark:bg-transparent border-b border-gray-200 dark:border-white/10">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Privacy Policy</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Last updated: March 2026</p>
      </section>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-10">
        <Section title="1. Information We Collect">
          When you register as a member or apply for membership, we collect personal information including your name, student ID, email address, phone number, department, batch, and payment details. We also collect non-personal data such as browser type, pages visited, and access times through standard web server logs.
        </Section>

        <Section title="2. How We Use Your Information">
          We use the information we collect to:
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Process membership applications and manage your membership</li>
            <li>Send important announcements, event invitations, and newsletters</li>
            <li>Verify payment transactions</li>
            <li>Display your profile (name, department, batch) on our public members list</li>
            <li>Improve our website and services</li>
          </ul>
        </Section>

        <Section title="3. Information Sharing">
          We do not sell, rent, or trade your personal information to third parties. We may share information with:
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>University administration when required for verification</li>
            <li>Event organisers for events you register for</li>
            <li>Service providers who assist us in operating the website (hosting, email services)</li>
            <li>Law enforcement if required by law</li>
          </ul>
        </Section>

        <Section title="4. Data Security">
          We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. However, no internet transmission is 100% secure, and we cannot guarantee absolute security.
        </Section>

        <Section title="5. Cookies">
          We use cookies to enhance your browsing experience and analyse site traffic. You can control cookie settings through your browser. Disabling cookies may limit some functionality. See our{" "}
          <Link href="/terms" className="text-cyan-400 hover:underline">Terms &amp; Conditions</Link>{" "}
          for more detail on how we use cookies.
        </Section>

        <Section title="6. Your Rights">
          You have the right to:
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Access the personal data we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your data (subject to legal obligations)</li>
            <li>Opt out of marketing communications at any time</li>
          </ul>
          To exercise these rights, contact us at{" "}
          <a href="mailto:info@diuroboticclub.com" className="text-cyan-400 hover:underline">info@diuroboticclub.com</a>.
        </Section>

        <Section title="7. Data Retention">
          We retain your personal data for as long as your membership is active or as needed to provide services. You may request deletion of your data at any time by contacting us.
        </Section>

        <Section title="8. Children's Privacy">
          Our services are intended for university students aged 18 and above. We do not knowingly collect data from children under 13.
        </Section>

        <Section title="9. Changes to This Policy">
          We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on our website. Continued use of our services constitutes acceptance of the updated policy.
        </Section>

        <Section title="10. Contact Us">
          For privacy-related questions or requests, contact us at{" "}
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
      <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-[15px]">{children}</div>
    </div>
  );
}
