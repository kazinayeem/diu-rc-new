"use client";

import React, { useState, ChangeEvent, FormEvent, KeyboardEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { CheckCircle, AlertCircle } from "lucide-react";
import { useCreateMemberRegistrationMutation } from "@/lib/api/api";

/* ============================================
   Types
============================================ */

interface RegistrationFormData {
  name: string;
  studentId: string;
  email: string;
  phone: string;
  department: string;
  batch: string;
  currentYear: string;
  cgpa: string;
  previousExperience: string;
  whyJoin: string;
  skills: string[];
  portfolio: string;
  linkedin: string;
  github: string;

  paymentOptionId: string;
  paymentNumber: string;
  paymentMethod: string;
  transactionId: string;
}

interface PaymentOptionItem {
  _id: string;
  name: string;
  number: string;
  instruction: string;
}

/* ============================================
   Component
============================================ */

export default function MemberRegistrationForm() {
  const [formData, setFormData] = useState<RegistrationFormData>({
    name: "",
    studentId: "",
    email: "",
    phone: "",
    department: "",
    batch: "",
    currentYear: "",
    cgpa: "",
    previousExperience: "",
    whyJoin: "",
    skills: [],
    portfolio: "",
    linkedin: "",
    github: "",

    paymentOptionId: "",
    paymentNumber: "",
    paymentMethod: "",
    transactionId: "",
  });

  const [paymentOptions, setPaymentOptions] = useState<PaymentOptionItem[]>([]);
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentOptionItem | null>(null);

  const [skillInput, setSkillInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);

  /* ============================================
     Skill Functions
  ============================================ */

  const addSkill = (): void => {
    const skill = skillInput.trim();
    if (skill && !formData.skills.includes(skill)) {
      setFormData({ ...formData, skills: [...formData.skills, skill] });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string): void => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((s) => s !== skill),
    });
  };

  /* ============================================
     Submit Handler
  ============================================ */

  const [createMemberRegistration] = useCreateMemberRegistrationMutation();

  React.useEffect(() => {
    const loadPaymentOptions = async () => {
      try {
        const res = await fetch("/api/payment-options");
        const data = await res.json();
        const options = Array.isArray(data?.data) ? data.data : [];
        setPaymentOptions(options);
        if (options.length > 0) {
          setSelectedPayment(options[0]);
        }
      } catch {
        setPaymentOptions([]);
      }
    };

    loadPaymentOptions();
  }, []);

  React.useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      paymentOptionId: selectedPayment?._id || "",
      paymentNumber: selectedPayment?.number || "",
      paymentMethod: selectedPayment?.name || "",
    }));
  }, [selectedPayment]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createMemberRegistration(formData).unwrap();
      setSuccess(true);

      
      setFormData({
        name: "",
        studentId: "",
        email: "",
        phone: "",
        department: "",
        batch: "",
        currentYear: "",
        cgpa: "",
        previousExperience: "",
        whyJoin: "",
        skills: [],
        portfolio: "",
        linkedin: "",
        github: "",
        paymentOptionId: selectedPayment?._id || "",
        paymentNumber: selectedPayment?.number || "",
        paymentMethod: selectedPayment?.name || "",
        transactionId: "",
      });
    } catch (err: any) {
      // API returns { error: "..." } or { message: "..." } — check both
      setError(
        err?.data?.error ||
        err?.data?.message ||
        err?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* ============================================
     Success Message
  ============================================ */

  if (success) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="bg-green-100/10 border border-green-500/30">
          <CardContent className="p-8 text-center text-green-300">
            <CheckCircle size={64} className="mx-auto mb-4" />
            <h3 className="text-2xl font-bold">Application Submitted! 🎉</h3>
            <p className="mt-3 text-base">
              We will review your application and payment details shortly.
            </p>
            <div className="mt-4 bg-green-500/10 border border-green-500/20 rounded-xl px-5 py-4 text-sm leading-relaxed">
              <p className="font-semibold text-green-200 mb-1">📧 Check Your Email Inbox</p>
              <p className="text-green-300/80">
                A confirmation email has been sent to your registered email address.
                Please check your <strong>inbox</strong> (and spam/junk folder) for details.
              </p>
            </div>
            <p className="mt-4 text-green-400/70 text-sm">
              You will receive a second email once your payment is verified and membership is confirmed.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  /* ============================================
     Main Form
  ============================================ */

  return (
    <motion.div initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="bg-transparent backdrop-blur-xl border border-white/10 shadow-xl rounded-2xl">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-lg flex items-center gap-2">
                <AlertCircle size={20} />
                {error}
              </div>
            )}

            {/* Name + Student ID */}
            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                label="Full Name / পূর্ণ নাম *"
                value={formData.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <InputField
                label="Student ID / স্টুডেন্ট আইডি *"
                value={formData.studentId}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({
                    ...formData,
                    studentId: e.target.value.toUpperCase(),
                  })
                }
              />
            </div>

            {/* Email + Phone */}
            <div className="grid md:grid-cols-2 gap-6">
              <InputField
                label="Email / ইমেইল *"
                type="email"
                value={formData.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <InputField
                label="Phone / মোবাইল *"
                value={formData.phone}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            {/* Department / Batch / Year */}
            <div className="grid md:grid-cols-3 gap-6">
              <InputField
                label="Department / বিভাগ *"
                value={formData.department}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              />

              <InputField
                label="Batch / ব্যাচ *"
                value={formData.batch}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, batch: e.target.value })
                }
              />

              <SelectField
                label="Current Year / বর্ষ *"
                value={formData.currentYear}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setFormData({ ...formData, currentYear: e.target.value })
                }
                options={["1st Year", "2nd Year", "3rd Year", "4th Year"]}
              />
            </div>

            <InputField
              label="CGPA / সিজিপিএ"
              value={formData.cgpa}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, cgpa: e.target.value })
              }
            />

            <TextareaField
              label="Previous Experience / পূর্ব অভিজ্ঞতা"
              value={formData.previousExperience}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, previousExperience: e.target.value })
              }
            />

            <TextareaField
              label="Why do you want to join? / কেন যোগ দিতে চান? *"
              required
              value={formData.whyJoin}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, whyJoin: e.target.value })
              }
            />

            {/* Skills */}
            <div>
              <label className="block text-sm text-white/80 mb-2">
                Skills / দক্ষতা
              </label>

              <div className="flex gap-2 mb-3">
                <input
                  value={skillInput}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setSkillInput(e.target.value)
                  }
                  onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
                    e.key === "Enter" && (e.preventDefault(), addSkill())
                  }
                  placeholder="Add and press Enter"
                  className="flex-1 px-4 py-2 bg-black/20 border border-white/20 rounded-lg text-white"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={addSkill}
                  className="border-white/40 text-white"
                >
                  Add / যোগ করুন
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 bg-white/10 border border-white/20 rounded-full text-sm flex items-center gap-2"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-red-300 hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Payment Section */}
            <div className="p-4 rounded-xl bg-black/20 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-3">
                Membership Fee / সদস্যপদ ফি
              </h3>

              {paymentOptions.length === 0 ? (
                <p className="text-white/70 text-sm mb-4">
                  No payment options are available right now.
                </p>
              ) : (
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm text-white/80 mb-2">
                      Payment Option / পেমেন্ট অপশন
                    </label>
                    <select
                      value={selectedPayment?._id || ""}
                      onChange={(e) => {
                        const option = paymentOptions.find(
                          (item) => item._id === e.target.value
                        );
                        setSelectedPayment(option || null);
                      }}
                      className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white"
                    >
                      {paymentOptions.map((option) => (
                        <option key={option._id} value={option._id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <InputField
                    label="Send Money Number / নাম্বার *"
                    value={formData.paymentNumber}
                    readOnly
                  />

                  <InputField
                    label="Payment Method / মেথড *"
                    value={formData.paymentMethod}
                    readOnly
                  />
                </div>
              )}

              {selectedPayment && (
                <p className="text-white/70 text-sm mb-4">
                  {selectedPayment.instruction}
                </p>
              )}

              {selectedPayment && (
                <div>
                  <InputField
                    label="Transaction ID / ট্রানজেকশন আইডি *"
                    value={formData.transactionId}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormData({
                        ...formData,
                        transactionId: e.target.value,
                      })
                    }
                  />
                </div>
              )}

              <p className="text-white/50 text-xs mt-3">
                Your application will be verified after confirming payment. /
                পেমেন্ট যাচাই শেষে আবেদনটি যাচাই করা হবে।
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500"
              size="lg"
            >
              {loading
                ? "Submitting..."
                : "Submit Application / আবেদন জমা দিন"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ============================================
   Reusable Inputs
============================================ */

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

function InputField({ label, ...props }: InputProps) {
  return (
    <div>
      <label className="block text-sm text-white/80 mb-2">{label}</label>
      <input
        {...props}
        className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

function TextareaField({ label, ...props }: TextareaProps) {
  return (
    <div>
      <label className="block text-sm text-white/80 mb-2">{label}</label>
      <textarea
        {...props}
        className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
      />
    </div>
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

function SelectField({ label, options, ...props }: SelectProps) {
  return (
    <div>
      <label className="block text-sm text-white/80 mb-2">{label}</label>
      <select
        {...props}
        className="w-full px-4 py-2 bg-black/30 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
      >
        <option value="">Select</option>
        {options.map((op) => (
          <option key={op} value={op} className="text-black">
            {op}
          </option>
        ))}
      </select>
    </div>
  );
}
