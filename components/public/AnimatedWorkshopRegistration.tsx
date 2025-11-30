"use client";

import { motion } from "framer-motion";
import WorkshopRegistrationForm from "@/components/public/WorkshopRegistrationForm";

interface AnimatedWorkshopRegistrationProps {
  workshopId: string;
  isRegistrationOpen: boolean;
  workshop?: any;
}

export default function AnimatedWorkshopRegistration({
  workshopId,
  isRegistrationOpen,
  workshop,
}: AnimatedWorkshopRegistrationProps) {
  if (!workshopId) {
    return (
      <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 text-center">
        <p className="text-gray-600">Loading registration form...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
    >
      {isRegistrationOpen ? (
        <WorkshopRegistrationForm workshopId={workshopId} />
      ) : (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-center">
          <h3 className="text-xl font-bold text-red-900 mb-2">
            Registration Closed
          </h3>
          <p className="text-red-700 mb-4">
            {workshop?.registrationLimit &&
            (workshop?.spotsRemaining === 0 ||
              workshop?.registrationCount >= workshop?.registrationLimit)
              ? "All spots have been filled."
              : "Registration is currently closed for this workshop."}
          </p>

          {workshop?.registrationLimit && (
            <p className="text-sm text-red-600">
              {workshop.registrationCount || 0} / {workshop.registrationLimit}{" "}
              spots filled
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}
