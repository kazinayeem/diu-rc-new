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

  paymentNumber: string;
  paymentMethod: string;
  transactionId: string;
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

    paymentNumber: "0194312421", // editable default number
    paymentMethod: "",
    transactionId: "",
  });

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createMemberRegistration(formData).unwrap();
      setSuccess(true);

      // reset form
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
        paymentNumber: "0194312421",
        paymentMethod: "",
        transactionId: "",
      });
    } catch (err: any) {
      setError(err?.data?.message || err?.message || "Registration failed");
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
            <h3 className="text-2xl font-bold">Application Submitted!</h3>
            <p className="mt-2">We will contact you after review.</p>
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
                label="Full Name *"
                value={formData.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <InputField
                label="Student ID *"
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
                label="Email *"
                type="email"
                value={formData.email}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <InputField
                label="Phone *"
                value={formData.phone}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>

            {/* Department / Batch / Year */}
            <div className="grid md:grid-cols-3 gap-6">
              <InputField
                label="Department *"
                value={formData.department}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, department: e.target.value })
                }
              />

              <InputField
                label="Batch *"
                value={formData.batch}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, batch: e.target.value })
                }
              />

              <SelectField
                label="Current Year *"
                value={formData.currentYear}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                  setFormData({ ...formData, currentYear: e.target.value })
                }
                options={["1st Year", "2nd Year", "3rd Year", "4th Year"]}
              />
            </div>

            <InputField
              label="CGPA"
              value={formData.cgpa}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, cgpa: e.target.value })
              }
            />

            <TextareaField
              label="Previous Experience"
              value={formData.previousExperience}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, previousExperience: e.target.value })
              }
            />

            <TextareaField
              label="Why do you want to join? *"
              required
              value={formData.whyJoin}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setFormData({ ...formData, whyJoin: e.target.value })
              }
            />

            {/* Skills */}
            <div>
              <label className="block text-sm text-white/80 mb-2">Skills</label>

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
                  Add
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
                Membership Fee
              </h3>

              <p className="text-white/70 text-sm mb-3">
                Please send{" "}
                <span className="font-bold text-blue-300">200 BDT</span> to the
                number below:
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Editable Send Money Number */}
                <InputField
                  label="Send Money Number *"
                  value={formData.paymentNumber}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFormData({
                      ...formData,
                      paymentNumber: e.target.value,
                    })
                  }
                />

                {/* Payment Method */}
                <SelectField
                  label="Payment Method *"
                  value={formData.paymentMethod}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setFormData({
                      ...formData,
                      paymentMethod: e.target.value,
                    })
                  }
                  options={["bkash", "nagad", "rocket"]}
                />

                {/* Transaction ID */}
                <InputField
                  label="Transaction ID *"
                  value={formData.transactionId}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFormData({
                      ...formData,
                      transactionId: e.target.value,
                    })
                  }
                />
              </div>

              <p className="text-white/50 text-xs mt-3">
                Your application will be verified after confirming payment.
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500"
              size="lg"
            >
              {loading ? "Submitting..." : "Submit Application"}
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
