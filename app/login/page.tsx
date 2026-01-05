'use client';

export const dynamic = 'force-dynamic';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import TopBar from '@/components/TopBar';
import { storage } from '@/lib/storage';

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'name'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError('');
    // Simulate OTP send
    setTimeout(() => {
      setStep('otp');
      setLoading(false);
    }, 1000);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Please enter 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');
    // Check if user exists
    const existingUser = storage.getUser();
    if (existingUser && existingUser.phone === phone) {
      // Existing user, login directly
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    } else {
      // New user, ask for name
      setStep('name');
      setLoading(false);
    }
  };

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    // Create user
    const userId = `user_${Date.now()}`;
    const user = {
      id: userId,
      phone,
      name: name.trim(),
    };
    storage.setUser(user);

    const redirect = searchParams.get('redirect') || '/';
    router.push(redirect);
  };

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <div className="bg-gradient-to-b from-orange-50/60 via-white to-white flex items-center justify-center px-4 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="rounded-2xl border border-gray-200 bg-white p-6 md:p-8 shadow-sm">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-6"
            >
              <h1 className="text-2xl md:text-3xl font-extrabold mb-2">Welcome to Eyekra</h1>
              <p className="text-sm text-gray-500">Enter your phone number to continue</p>
            </motion.div>

            <AnimatePresence mode="wait">
              {step === 'phone' && (
                <motion.form
                  key="phone"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSendOTP}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit phone number"
                      maxLength={10}
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <motion.button
                    type="submit"
                    disabled={loading || phone.length !== 10}
                    whileHover={{ scale: phone.length === 10 ? 1.02 : 1 }}
                    whileTap={{ scale: phone.length === 10 ? 0.98 : 1 }}
                    className="w-full rounded-2xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
                  >
                    {loading ? 'Sending...' : 'Send OTP'}
                  </motion.button>
                  <p className="text-xs text-gray-400 text-center">
                    Demo mode: Use any 6-digit code (e.g., 123456)
                  </p>
                </motion.form>
              )}

              {step === 'otp' && (
                <motion.form
                  key="otp"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleVerifyOTP}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">Enter OTP</label>
                    <p className="text-xs text-gray-500 mb-2">Sent to {phone}</p>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="6-digit OTP"
                      maxLength={6}
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-200 text-center text-2xl tracking-widest"
                      required
                    />
                    <p className="text-xs text-gray-400 mt-2 text-center">
                      Demo mode: Enter any 6 digits to continue
                    </p>
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <motion.button
                    type="submit"
                    disabled={loading || code.length !== 6}
                    whileHover={{ scale: code.length === 6 ? 1.02 : 1 }}
                    whileTap={{ scale: code.length === 6 ? 0.98 : 1 }}
                    className="w-full rounded-2xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
                  >
                    {loading ? 'Verifying...' : 'Verify OTP'}
                  </motion.button>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('phone');
                      setCode('');
                      setError('');
                    }}
                    className="w-full text-sm text-gray-500 hover:text-gray-700"
                  >
                    Change phone number
                  </button>
                </motion.form>
              )}

              {step === 'name' && (
                <motion.form
                  key="name"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleSaveName}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">Enter Your Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <motion.button
                    type="submit"
                    disabled={loading || !name.trim()}
                    whileHover={{ scale: name.trim() ? 1.02 : 1 }}
                    whileTap={{ scale: name.trim() ? 0.98 : 1 }}
                    className="w-full rounded-2xl bg-orange-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-700 disabled:opacity-50"
                  >
                    Continue
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
