'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface WorkshopRegistrationFormProps {
  workshopId: string;
}

export default function WorkshopRegistrationForm({ workshopId }: WorkshopRegistrationFormProps) {
  const [workshop, setWorkshop] = useState<any>(null);
  const [loadingWorkshop, setLoadingWorkshop] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    studentId: '',
    department: '',
    batch: '',
    message: '',
    paymentMethod: 'bkash' as 'bkash' | 'nagad',
    paymentNumber: '',
    transactionId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Fetch workshop details
  useEffect(() => {
    async function fetchWorkshop() {
      try {
        setLoadingWorkshop(true);
        const res = await fetch(`/api/events/${workshopId}`);
        const data = await res.json();
        if (data.success) {
          setWorkshop(data.data);
        }
      } catch (err) {
        console.error('Error fetching workshop:', err);
      } finally {
        setLoadingWorkshop(false);
      }
    }
    if (workshopId) {
      fetchWorkshop();
    }
  }, [workshopId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`/api/workshops/${workshopId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          studentId: '',
          department: '',
          batch: '',
          message: '',
          paymentMethod: 'bkash',
          paymentNumber: '',
          transactionId: '',
        });
      } else {
        setError(data.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card variant="elevated" className="bg-green-50 border-green-200">
          <CardContent className="p-6 text-center">
            <CheckCircle className="text-green-600 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-bold text-green-900 mb-2">Registration Successful!</h3>
            <p className="text-green-700 mb-4">
              Thank you for registering. We'll send you a confirmation email shortly.
            </p>
            <Button
              variant="outline"
              onClick={() => setSuccess(false)}
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              Register Another Person
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  if (loadingWorkshop) {
    return (
      <Card variant="elevated">
        <CardContent className="p-6 text-center">
          <p className="text-dark-600">Loading workshop details...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card variant="elevated">
        <CardHeader>
          <h3 className="text-xl font-bold text-dark-900">Register for Workshop</h3>
          <p className="text-sm text-dark-600">Fill in your details to register</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                <AlertCircle size={20} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-4 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-2">
                Student ID
              </label>
              <input
                type="text"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-4 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-700 mb-2">
                  Batch
                </label>
                <input
                  type="text"
                  value={formData.batch}
                  onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                  className="w-full px-4 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {workshop?.isPaid && (
              <div className="border-t border-dark-200 pt-4 space-y-4">
                <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                  <h4 className="font-semibold text-dark-900 mb-2">Payment Information</h4>
                  <p className="text-sm text-dark-600 mb-3">
                    Registration Fee: <span className="font-bold text-primary-600">৳{workshop.registrationFee}</span>
                  </p>
                  <p className="text-sm text-dark-600 mb-2">
                    Send payment to: <span className="font-semibold">{workshop.paymentNumber}</span>
                  </p>
                  <p className="text-xs text-dark-500">
                    Payment Methods: {workshop.paymentMethod === 'both' ? 'bKash / Nagad' : workshop.paymentMethod?.toUpperCase()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">
                    Payment Method *
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as 'bkash' | 'nagad' })}
                    required
                    disabled={workshop.paymentMethod !== 'both'}
                    className="w-full px-4 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    {workshop.paymentMethod === 'both' ? (
                      <>
                        <option value="bkash">bKash</option>
                        <option value="nagad">Nagad</option>
                      </>
                    ) : (
                      <option value={workshop.paymentMethod}>{workshop.paymentMethod?.toUpperCase()}</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">
                    Your {formData.paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} Number *
                  </label>
                  <input
                    type="tel"
                    value={formData.paymentNumber}
                    onChange={(e) => setFormData({ ...formData, paymentNumber: e.target.value })}
                    required
                    placeholder="01XXXXXXXXX"
                    className="w-full px-4 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-700 mb-2">
                    Transaction ID *
                  </label>
                  <input
                    type="text"
                    value={formData.transactionId}
                    onChange={(e) => setFormData({ ...formData, transactionId: e.target.value.toUpperCase() })}
                    required
                    placeholder="Enter transaction ID"
                    className="w-full px-4 py-2 border border-dark-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-xs text-dark-500 mt-1">
                    After payment, enter the transaction ID you received
                  </p>
                </div>
              </div>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Registering...' : workshop?.isPaid ? `Register & Pay ৳${workshop.registrationFee}` : 'Register Now'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

