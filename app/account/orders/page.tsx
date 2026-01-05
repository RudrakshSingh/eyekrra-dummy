'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import TopBar from '@/components/TopBar';
import { storage } from '@/lib/storage';

export default function CustomerOrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = storage.getUser();
    if (!currentUser) {
      router.push('/login?redirect=/account/orders');
    } else {
      setUser(currentUser);
      const userOrders = storage.getUserOrders(currentUser.id);
      setOrders(userOrders);
      setLoading(false);
    }
  }, [router]);

  if (loading) {
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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-4 md:mb-6"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => router.back()}
              className="text-gray-500"
            >
              <ArrowLeft className="h-5 w-5" />
            </motion.button>
            <h1 className="text-xl md:text-2xl font-bold">My Orders</h1>
          </motion.div>

          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <p className="text-gray-500 mb-4">No orders yet</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/book" className="text-orange-600 text-sm font-semibold inline-block">
                  Book your first eye test
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {orders.map((order, i) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <Link href={`/track?id=${order.orderId}`}>
                    <div className="block bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition cursor-pointer">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-sm md:text-base font-semibold">#{order.orderId}</h3>
                          <p className="text-xs text-gray-500">{order.serviceType}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          order.status === 'completed' ? 'bg-green-50 text-green-700' :
                          order.status === 'in_progress' ? 'bg-orange-50 text-orange-700' :
                          'bg-gray-50 text-gray-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs md:text-sm">
                        <span className="text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                        <span className="font-semibold">₹0</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

