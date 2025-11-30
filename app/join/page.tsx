import React from "react";
import MemberRegistrationForm from "@/components/public/MemberRegistrationForm";
import AnimatedJoinHero from "@/components/public/AnimatedJoinHero";
import AnimatedBenefits from "@/components/public/AnimatedBenefits";
import AnimatedFormSection from "@/components/public/AnimatedFormSection";

export default function JoinPage() {
  return (
    <div className="min-h-screen flex flex-col bg-transparent">
      <main className="flex-grow">
        {/* Hero Section */}
        <AnimatedJoinHero />

        {/* Benefits Section */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-6">
            <AnimatedBenefits />
          </div>
        </section>

        {/* Membership Form Section */}
        <section className="relative py-24">
          <AnimatedFormSection>
            <div className="max-w-3xl mx-auto px-4">
              <div className="text-center mb-10">
                <h2 className="text-4xl font-bold text-white mb-3">
                  Apply for Membership
                </h2>
                <p className="text-white/70 leading-relaxed text-lg">
                  Fill out the form below. Our team will review your application
                  and get back to you shortly.
                </p>
              </div>

              <MemberRegistrationForm />
            </div>
          </AnimatedFormSection>
        </section>
      </main>

    
    </div>
  );
}
