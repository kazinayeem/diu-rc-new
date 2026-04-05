"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Ticket, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CouponApplierProps {
  eventId: string;
  originalPrice: number;
  onCouponApplied: (discount: number, couponCode: string) => void;
  onCouponRemoved: () => void;
}

export default function CouponApplier({ eventId, originalPrice, onCouponApplied, onCouponRemoved }: CouponApplierProps) {
  const [couponCode, setCouponCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!couponCode.trim()) {
      setError("Please enter a coupon code");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`/api/coupons?code=${couponCode.toUpperCase()}&eventId=${eventId}`);
      const data = await response.json();

      if (!data.success) {
        setError(data.error || "Invalid coupon code");
        return;
      }

      const coupon = data.data;

      // Check minimum price
      if (originalPrice < (coupon.minimumPrice || 0)) {
        setError(`Minimum registration fee required for this coupon: ৳${coupon.minimumPrice}`);
        return;
      }

      // Calculate discount
      let discount = 0;
      if (coupon.discountType === "percentage") {
        discount = (originalPrice * coupon.discountValue) / 100;
        if (coupon.maximumDiscount) {
          discount = Math.min(discount, coupon.maximumDiscount);
        }
      } else {
        discount = coupon.discountValue;
      }

      // Don't allow discount more than original price
      discount = Math.min(discount, originalPrice);

      setAppliedCoupon(coupon);
      setSuccess(`Coupon applied! You save ৳${discount.toFixed(2)}`);
      onCouponApplied(discount, coupon.code);
    } catch (err: any) {
      setError(err.message || "Failed to validate coupon");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setAppliedCoupon(null);
    setError(null);
    setSuccess(null);
    onCouponRemoved();
  };

  return (
    <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 dark:from-purple-500/10 to-pink-50 dark:to-pink-500/10 rounded-2xl border border-purple-200 dark:border-purple-500/30">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <Ticket className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        <h3 className="font-bold text-gray-900 dark:text-white">Have a Coupon?</h3>
      </div>

      {appliedCoupon ? (
        // Coupon Applied State
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-4"
        >
          <div className="p-4 bg-green-100 dark:bg-green-500/20 border border-green-300 dark:border-green-400 rounded-lg">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-green-800 dark:text-green-300">Coupon Applied!</p>
                <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                  {appliedCoupon.description}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Discount</p>
              <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                {appliedCoupon.discountType === "percentage"
                  ? `${appliedCoupon.discountValue}%`
                  : `৳${appliedCoupon.discountValue}`}
              </p>
            </div>
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Code</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white font-mono">
                {appliedCoupon.code}
              </p>
            </div>
          </div>

          <Button
            onClick={handleRemoveCoupon}
            className="w-full bg-red-600 hover:bg-red-700 text-white"
          >
            Remove Coupon
          </Button>
        </motion.div>
      ) : (
        // Form State
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleApplyCoupon}
          className="space-y-3"
        >
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              placeholder="Enter coupon code"
              disabled={loading}
              className="flex-1 px-4 py-2 border border-purple-300 dark:border-purple-500 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            />
            <Button
              type="submit"
              disabled={loading || !couponCode.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
            >
              {loading ? "Validating..." : "Apply"}
            </Button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-400 rounded-lg flex items-start gap-2 text-red-700 dark:text-red-300 text-sm"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}
        </motion.form>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 bg-green-100 dark:bg-green-500/20 border border-green-300 dark:border-green-400 rounded-lg text-green-700 dark:text-green-300 text-sm"
        >
          ✓ {success}
        </motion.div>
      )}
    </div>
  );
}
