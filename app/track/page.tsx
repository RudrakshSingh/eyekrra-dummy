'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Bell, Settings, Package, MapPin, CheckCircle2, Clock, Truck, Sparkles, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SLATimer from '@/components/SLATimer';
import TopBar from '@/components/TopBar';
import { storage } from '@/lib/storage';

export default function TrackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('id') || searchParams.get('order') || '';
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      const foundOrder = storage.getOrder(orderId);
      if (foundOrder) {
        // Convert date strings back to Date objects
        const order = {
          ...foundOrder,
          startedAt: new Date(foundOrder.startedAt),
          createdAt: new Date(foundOrder.createdAt),
          timeline: foundOrder.timeline.map((t: any) => ({
            ...t,
            timestamp: new Date(t.timestamp),
          })),
        };
        setOrder(order);
      }
    }
    setLoading(false);
  }, [orderId]);

  // Map timeline to stages
  const stages = [
    { name: 'Confirmed', stage: 'confirmed' as const, done: false, time: '—', icon: CheckCircle2 },
    { name: 'Optima Assigned', stage: 'optima_assigned' as const, done: false, time: '—', icon: Package },
    { name: 'Eye Test Done', stage: 'eye_test_completed' as const, done: false, time: '—', icon: CheckCircle2 },
    { name: 'In Lab', stage: 'job_received' as const, done: false, time: '—', icon: Package },
    { name: 'Processing', stage: 'cutting_fitting' as const, done: false, time: '—', icon: Clock },
    { name: 'QC', stage: 'qc_1' as const, done: false, time: '—', icon: CheckCircle2 },
    { name: 'Packed', stage: 'dispatch_ready' as const, done: false, time: '—', icon: Package },
    { name: 'Out for Delivery', stage: 'out_for_delivery' as const, done: false, time: '—', icon: Truck },
    { name: 'Delivered', stage: 'delivered' as const, done: false, time: '—', icon: CheckCircle2 },
  ];

  // Update stages based on timeline
  if (order) {
    order.timeline?.forEach((event: any) => {
      const stageIndex = stages.findIndex((s) => s.stage === event.stage);
      if (stageIndex !== -1) {
        stages[stageIndex].done = true;
        stages[stageIndex].time = new Date(event.timestamp).toLocaleTimeString('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
        });
      }
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="rounded-full h-12 w-12 border-4 border-orange-200 border-t-orange-600 mx-auto"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-gray-500 text-sm"
          >
            Loading order...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white">
        <TopBar />
        <div className="flex items-center justify-center px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <p className="text-gray-500 mb-4">Order not found</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/account')}
              className="rounded-2xl bg-orange-600 text-white px-4 py-2 text-sm font-semibold"
            >
              View My Orders
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <div className="bg-gradient-to-b from-orange-50/60 via-white to-white">
        <div className="mx-auto max-w-6xl px-4 py-4 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between mb-4 md:mb-6"
          >
            <div className="flex-1">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-xl md:text-2xl font-bold"
              >
                Order Tracking
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xs md:text-sm text-gray-500"
              >
                Zomato-style tracking + SLA clock
              </motion.p>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-2 text-xs md:text-sm font-semibold flex flex-wrap items-center gap-2"
              >
                <span>Order #{order.orderId}</span>
                <span>•</span>
                <span>{order.type}</span>
                <span>(≤{order.targetMinutes / 60} hours)</span>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Sparkles className="h-3 w-3 md:h-4 md:w-4 text-orange-600" />
                </motion.div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mt-2 md:mt-0"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 md:px-4 py-2 text-xs md:text-sm font-semibold transition hover:bg-gray-50 shadow-sm"
              >
                <Bell className="mr-2 h-3 w-3 md:h-4 md:w-4" /> 
                <span className="hidden sm:inline">Updates</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center rounded-2xl border border-gray-200 bg-white px-3 md:px-4 py-2 text-xs md:text-sm font-semibold transition hover:bg-gray-50 shadow-sm"
              >
                <Settings className="mr-2 h-3 w-3 md:h-4 md:w-4" /> 
                <span className="hidden sm:inline">Help</span>
              </motion.button>
            </motion.div>
          </motion.div>

          <div className="grid gap-4 md:gap-6 md:grid-cols-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="md:col-span-4 space-y-4"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <SLATimer
                  startedAt={order.startedAt}
                  targetMinutes={order.targetMinutes}
                  currentStage={order.currentStage}
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.02 }}
                className="rounded-2xl border border-gray-200 bg-white p-3 md:p-4 shadow-sm"
              >
                <div className="flex items-center gap-2 text-xs md:text-sm font-semibold mb-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                  >
                    <MapPin className="h-3 w-3 md:h-4 md:w-4 text-orange-600" />
                  </motion.div>
                  <span>Map (Optional MVP)</span>
                </div>
                <p className="text-xs text-gray-500 mb-3">
                  Placeholder. MVP can be stage-only. Later: Mappls / Google maps.
                </p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="h-32 md:h-40 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200"
                />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="md:col-span-8 space-y-4 md:space-y-6"
            >
              <motion.div
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 300 }}
                className="rounded-2xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm"
              >
                <div className="flex items-center gap-2 text-xs md:text-sm font-semibold mb-4">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
                  >
                    <Package className="h-3 w-3 md:h-4 md:w-4 text-orange-600" />
                  </motion.div>
                  <span>Timeline</span>
                </div>
                <AnimatedTimeline stages={stages} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="grid gap-3 md:gap-4 md:grid-cols-2"
              >
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="rounded-2xl border border-gray-200 bg-white p-3 md:p-4 shadow-sm"
                >
                  <div className="text-xs md:text-sm font-semibold mb-1">Optima</div>
                  <p className="text-xs text-gray-500 mb-3">
                    {order.assignedStaffName || 'Name + certification (masked contact)'}
                  </p>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="h-8 md:h-10 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200"
                  />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="rounded-2xl border border-gray-200 bg-white p-3 md:p-4 shadow-sm"
                >
                  <div className="text-xs md:text-sm font-semibold mb-1">Delivery</div>
                  <p className="text-xs text-gray-500 mb-3">OTP + GPS + Photo proof (wireframe)</p>
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                    className="h-8 md:h-10 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200"
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnimatedTimeline({ stages }: { stages: any[] }) {
  return (
    <div className="space-y-2">
      <AnimatePresence>
        {stages.map((s, index) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 5, scale: 1.02 }}
              className="flex items-center justify-between rounded-2xl border border-gray-200 p-2 md:p-3 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                <motion.div
                  animate={s.done ? { scale: [1, 1.2, 1], rotate: [0, 360] } : {}}
                  transition={{ duration: 0.5 }}
                  className={`flex h-7 w-7 md:h-9 md:w-9 items-center justify-center rounded-2xl transition-all flex-shrink-0 ${
                    s.done ? 'bg-orange-50 shadow-md' : 'bg-gray-100'
                  }`}
                >
                  {s.done ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    >
                      <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-orange-600" />
                    </motion.div>
                  ) : (
                    <Clock className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
                  )}
                </motion.div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs md:text-sm font-semibold truncate">{s.name}</div>
                  <div className="text-xs text-gray-500">System timestamp</div>
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                className="text-xs md:text-sm font-semibold ml-2 flex-shrink-0"
              >
                {s.time}
              </motion.div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
