'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, User, Package, Timer, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '@/components/TopBar';
import { storage } from '@/lib/storage';

const steps = ['Location', 'Slot', 'Address', 'Payment', 'Confirm'] as const;

export default function BookPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    serviceType: 'eye_test',
    city: '',
    pincode: '',
    address: '',
    landmark: '',
    date: '',
    slot: '',
  });

  useEffect(() => {
    const currentUser = storage.getUser();
    if (!currentUser) {
      router.push('/login?redirect=/book');
    } else {
      setUser(currentUser);
    }
  }, [router]);

  // Mock slots
  const mockSlots = [
    { id: '1', time: '10:00 AM - 11:00 AM' },
    { id: '2', time: '11:00 AM - 12:00 PM' },
    { id: '3', time: '2:00 PM - 3:00 PM' },
    { id: '4', time: '3:00 PM - 4:00 PM' },
    { id: '5', time: '4:00 PM - 5:00 PM' },
  ];

  const handleSubmit = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Create order
      const orderId = `EKR-${Math.floor(10000 + Math.random() * 90000)}`;
      const order = {
        id: `order_${Date.now()}`,
        orderId: orderId,
        customerId: user.id,
        customerPhone: user.phone,
        type: 'FAST' as const,
        serviceType: formData.serviceType,
        status: 'in_progress' as const,
        currentStage: 'confirmed',
        startedAt: new Date(),
        targetMinutes: 240,
        timeline: [
          {
            stage: 'confirmed',
            timestamp: new Date(),
            userName: user.name || 'Customer',
          },
        ],
        assignedStaffName: 'Dr. Rajesh Kumar',
        address: {
          full: formData.address,
          landmark: formData.landmark,
        },
        createdAt: new Date(),
      };

      storage.saveOrder(order);
      router.push(`/track?id=${orderId}`);
    }
  };

  const progress = ((step + 1) / steps.length) * 100;

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <div className="bg-gradient-to-b from-orange-50/60 via-white to-white">
        <div className="mx-auto max-w-6xl px-4 py-4 md:py-8">
          <div className="grid gap-4 md:gap-6 md:grid-cols-12">
            <div className="md:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg md:text-xl font-bold">Book Eye Test</h2>
                  <div className="text-xs text-gray-500">Step {step + 1} / {steps.length}</div>
                </div>

                {/* Animated Progress Bar */}
                <div className="mb-4 md:mb-6">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="h-full bg-orange-600 rounded-full"
                    />
                  </div>
                </div>

                {/* Animated Step Indicators */}
                <div className="mb-4 md:mb-6 flex flex-wrap gap-2">
                  {steps.map((s, i) => (
                    <motion.span
                      key={s}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                        transition: { delay: i * 0.1 },
                      }}
                      whileHover={{ scale: 1.05 }}
                      className={`rounded-full px-2 md:px-3 py-1 text-xs font-semibold transition-all duration-300 ${
                        i === step
                          ? 'bg-orange-600 text-white shadow-lg shadow-orange-200'
                          : i < step
                            ? 'bg-orange-50 text-orange-700'
                            : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {s}
                    </motion.span>
                  ))}
                </div>

                {/* Animated Form Content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4"
                  >
                    {step === 0 && (
                      <>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <label className="block text-sm font-medium mb-1">Service Type</label>
                          <select
                            value={formData.serviceType}
                            onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                            className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                          >
                            <option value="eye_test">Eye Test Only</option>
                            <option value="try_on">Try-On Only</option>
                            <option value="combo">Eye Test + Try-On</option>
                          </select>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <label className="block text-sm font-medium mb-1">City</label>
                          <input
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="Enter city"
                            className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <label className="block text-sm font-medium mb-1">Pincode</label>
                          <input
                            value={formData.pincode}
                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value.replace(/\D/g, '').slice(0, 6) })}
                            placeholder="Enter 6-digit pincode"
                            maxLength={6}
                            className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.4 }}
                          className="rounded-2xl bg-orange-50 p-3 md:p-4 border border-orange-100"
                        >
                          <div className="text-sm font-semibold text-orange-700">SLA Capacity Gate</div>
                          <div className="text-xs text-orange-700/80">Slots shown only if 4-hour capacity is safe.</div>
                        </motion.div>
                      </>
                    )}

                    {step === 1 && (
                      <>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <label className="block text-sm font-medium mb-1">Select Date</label>
                          <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <label className="block text-sm font-medium mb-1">Select Time Slot</label>
                          <div className="grid grid-cols-2 gap-2">
                            {mockSlots.map((slot, index) => (
                              <motion.button
                                key={slot.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 * index }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => setFormData({ ...formData, slot: slot.id })}
                                className={`rounded-2xl border px-3 py-2 text-xs md:text-sm font-semibold transition-all duration-200 ${
                                  formData.slot === slot.id
                                    ? 'border-orange-600 bg-orange-50 text-orange-700 shadow-md'
                                    : 'border-gray-200 bg-white hover:bg-gray-50 hover:border-orange-300'
                                }`}
                              >
                                {slot.time}
                              </motion.button>
                            ))}
                          </div>
                        </motion.div>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <label className="block text-sm font-medium mb-1">Full Address</label>
                          <textarea
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Enter complete address"
                            rows={3}
                            className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <label className="block text-sm font-medium mb-1">Landmark (Optional)</label>
                          <input
                            value={formData.landmark}
                            onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                            placeholder="Nearby landmark"
                            className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200 transition-all"
                          />
                        </motion.div>
                      </>
                    )}

                    {step === 3 && (
                      <>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.1 }}
                          className="rounded-2xl border border-gray-200 bg-white p-4"
                        >
                          <div className="flex items-center justify-between">
                            <div className="text-sm font-semibold">Visit Fee</div>
                            <div className="text-sm font-semibold">₹0</div>
                          </div>
                          <div className="mt-1 text-xs text-gray-500">(Wireframe) payment method selection</div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <label className="block text-sm font-medium mb-1">Payment Method</label>
                          <select className="w-full rounded-2xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200 transition-all">
                            <option>UPI</option>
                            <option>Card</option>
                            <option>Pay Later</option>
                          </select>
                        </motion.div>
                      </>
                    )}

                    {step === 4 && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 p-4 md:p-6 border-2 border-orange-200"
                      >
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                          className="flex items-center justify-center mb-4"
                        >
                          <div className="rounded-full bg-orange-600 p-3">
                            <CheckCircle2 className="h-6 w-6 md:h-8 md:w-8 text-white" />
                          </div>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-center"
                        >
                          <div className="text-base md:text-lg font-semibold text-orange-700 mb-2">Booking Confirmed!</div>
                          <div className="text-xs text-orange-700/80">Optima is auto-assigned. SLA timer starts at Order Confirmed.</div>
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-between pt-4 md:pt-6 mt-4 md:mt-6 border-t border-gray-100 gap-2"
                >
                  <motion.button
                    type="button"
                    onClick={() => setStep(Math.max(0, step - 1))}
                    disabled={step === 0}
                    whileHover={{ scale: step === 0 ? 1 : 1.05 }}
                    whileTap={{ scale: step === 0 ? 1 : 0.95 }}
                    className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 md:px-4 py-2 text-xs md:text-sm font-semibold transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Back
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleSubmit}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center rounded-2xl bg-orange-600 px-3 md:px-4 py-2 text-xs md:text-sm font-semibold text-white transition hover:bg-orange-700 shadow-lg shadow-orange-200"
                  >
                    {step < steps.length - 1 ? (
                      <>
                        Continue
                        <motion.div
                          animate={{ x: [0, 4, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                          <ChevronRight className="ml-2 h-3 w-3 md:h-4 md:w-4" />
                        </motion.div>
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>

            <div className="md:col-span-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm sticky top-24"
              >
                <h2 className="text-lg md:text-xl font-bold mb-2">What happens next</h2>
                <p className="text-xs md:text-sm text-gray-500 mb-4">Only home visit is human. Everything else is automated.</p>
                <div className="space-y-3">
                  {[
                    { icon: User, text: 'Optima home visit' },
                    { icon: Package, text: 'Automated lab queue' },
                    { icon: Timer, text: 'SLA tracking' },
                    { icon: CheckCircle2, text: 'Prescription valid 6 months' },
                  ].map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-2 text-xs md:text-sm"
                      >
                        <motion.div
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ repeat: Infinity, duration: 2, delay: index * 0.5 }}
                        >
                          <Icon className="h-3 w-3 md:h-4 md:w-4 text-orange-600" />
                        </motion.div>
                        <span>{item.text}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
