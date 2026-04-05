"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Edit2, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Coupon {
  _id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxUses?: number;
  usedCount: number;
  minimumPrice?: number;
  maximumDiscount?: number;
  expiryDate?: string;
  isActive: boolean;
  createdAt: string;
}

interface CouponManagementProps {
  eventId: string;
  eventTitle: string;
  registrationFee: number;
  isPaid?: boolean;
}

export default function CouponManagement({ eventId, eventTitle, registrationFee, isPaid }: CouponManagementProps) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage" as "percentage" | "fixed",
    discountValue: 0,
    maxUses: "",
    minimumPrice: "0",
    maximumDiscount: "",
    expiryDate: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, [eventId]);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/coupons?eventId=${eventId}`);
      const data = await response.json();

      if (data.success) {
        setCoupons(data.data);
      }
    } catch (err) {
      console.error("Error fetching coupons:", err);
      setError("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
    if (!formData.code.trim()) {
      setError("Coupon code is required");
      return;
    }

    if (formData.discountType === "percentage" && (formData.discountValue <= 0 || formData.discountValue > 100)) {
      setError("Percentage discount must be between 1 and 100");
      return;
    }

    if (formData.discountType === "fixed" && formData.discountValue <= 0) {
      setError("Fixed discount must be greater than 0");
      return;
    }

    try {
      const payload = {
        code: formData.code.toUpperCase(),
        eventId,
        description: formData.description,
        discountType: formData.discountType,
        discountValue: parseFloat(formData.discountValue.toString()),
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
        minimumPrice: parseFloat(formData.minimumPrice),
        maximumDiscount: formData.maximumDiscount ? parseFloat(formData.maximumDiscount) : null,
        expiryDate: formData.expiryDate ? new Date(formData.expiryDate).toISOString() : null,
      };

      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/coupons?id=${editingId}` : "/api/coupons";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(editingId ? "Coupon updated successfully" : "Coupon created successfully");
        resetForm();
        await fetchCoupons();
      } else {
        setError(data.error || "Failed to save coupon");
      }
    } catch (err: any) {
      setError(err.message || "Failed to save coupon");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this coupon?")) {
      try {
        const response = await fetch(`/api/coupons?id=${id}`, {
          method: "DELETE",
        });

        const data = await response.json();

        if (data.success) {
          setSuccess("Coupon deleted successfully");
          await fetchCoupons();
        } else {
          setError(data.error || "Failed to delete coupon");
        }
      } catch (err: any) {
        setError(err.message || "Failed to delete coupon");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: 0,
      maxUses: "",
      minimumPrice: "0",
      maximumDiscount: "",
      expiryDate: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const calculateDiscount = (coupon: Coupon) => {
    if (coupon.discountType === "percentage") {
      return Math.min(
        (registrationFee * coupon.discountValue) / 100,
        coupon.maximumDiscount || Infinity
      );
    }
    return coupon.discountValue;
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const isFull = (coupon: Coupon) => {
    return coupon.maxUses ? coupon.usedCount >= coupon.maxUses : false;
  };

  return (
    <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Coupon Management</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Manage discount coupons for {eventTitle}
          </p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Coupon
        </Button>
      </div>

      {/* Info message if event is not paid */}
      {!isPaid && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-500/20 border border-yellow-300 dark:border-yellow-400 rounded-lg flex items-gap gap-3 text-yellow-700 dark:text-yellow-300"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>⚠️ This event is not marked as paid. Please enable "This is a paid event" in Edit Details and set a registration fee before creating coupons.</span>
        </motion.div>
      )}

      {/* Error and Success Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-red-100 dark:bg-red-500/20 border border-red-300 dark:border-red-400 rounded-lg flex items-gap gap-3 text-red-700 dark:text-red-300"
        >
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {success && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-green-100 dark:bg-green-500/20 border border-green-300 dark:border-green-400 rounded-lg flex items-center gap-3 text-green-700 dark:text-green-300"
        >
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <span>{success}</span>
        </motion.div>
      )}

      {/* Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="mb-6 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Coupon Code
              </label>
              <input
                type="text"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="E.g., SUMMER20"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Discount Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Discount Type
              </label>
              <select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Price (৳)</option>
              </select>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="E.g., Summer discount"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Discount Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Discount Value {formData.discountType === "percentage" ? "(%)" : "(৳)"}
              </label>
              <input
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) })}
                placeholder="0"
                step={0.01}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Max Uses */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Uses (Leave empty for unlimited)
              </label>
              <input
                type="number"
                value={formData.maxUses}
                onChange={(e) => setFormData({ ...formData, maxUses: e.target.value })}
                placeholder="0"
                min="1"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Minimum Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Registration Fee (৳)
              </label>
              <input
                type="number"
                value={formData.minimumPrice}
                onChange={(e) => setFormData({ ...formData, minimumPrice: e.target.value })}
                placeholder="0"
                min="0"
                step={0.01}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            {/* Maximum Discount (for percentage) */}
            {formData.discountType === "percentage" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Discount Amount (৳) (Optional)
                </label>
                <input
                  type="number"
                  value={formData.maximumDiscount}
                  onChange={(e) => setFormData({ ...formData, maximumDiscount: e.target.value })}
                  placeholder="0"
                  min="0"
                  step={0.01}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            )}

            {/* Expiry Date */}
            <div className={formData.discountType === "percentage" ? "" : "md:col-span-2"}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Expiry Date (Optional)
              </label>
              <input
                type="datetime-local"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white">
              {editingId ? "Update Coupon" : "Create Coupon"}
            </Button>
            <Button type="button" onClick={resetForm} className="bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white">
              Cancel
            </Button>
          </div>
        </motion.form>
      )}

      {/* Coupons List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-8 text-gray-500">No coupons yet. Create one to get started!</div>
        ) : (
          coupons.map((coupon, idx) => (
            <motion.div
              key={coupon._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{coupon.code}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      coupon.isActive
                        ? "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300"
                        : "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300"
                    }`}>
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                    {isExpired(coupon.expiryDate) && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-300">
                        Expired
                      </span>
                    )}
                    {isFull(coupon) && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-300">
                        Full
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{coupon.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                      <span className="font-semibold text-gray-900 dark:text-white ml-1">
                        {coupon.discountType === "percentage"
                          ? `${coupon.discountValue}%`
                          : `৳${coupon.discountValue}`}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Actual Discount:</span>
                      <span className="font-semibold text-cyan-600 dark:text-cyan-400 ml-1">
                        ৳{calculateDiscount(coupon).toFixed(2)}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Usage:</span>
                      <span className="font-semibold text-gray-900 dark:text-white ml-1">
                        {coupon.usedCount}{coupon.maxUses ? `/${coupon.maxUses}` : "/∞"}
                      </span>
                    </div>

                    {coupon.expiryDate && (
                      <div>
                        <span className="text-gray-600 dark:text-gray-400">Expires:</span>
                        <span className="font-semibold text-gray-900 dark:text-white ml-1">
                          {new Date(coupon.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setEditingId(coupon._id);
                      setFormData({
                        code: coupon.code,
                        description: coupon.description,
                        discountType: coupon.discountType,
                        discountValue: coupon.discountValue,
                        maxUses: coupon.maxUses?.toString() || "",
                        minimumPrice: coupon.minimumPrice?.toString() || "0",
                        maximumDiscount: coupon.maximumDiscount?.toString() || "",
                        expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().slice(0, 16) : "",
                      });
                      setShowForm(true);
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(coupon._id)}
                    className="bg-red-600 hover:bg-red-700 text-white p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
