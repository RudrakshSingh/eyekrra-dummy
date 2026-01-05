'use client';

import { useEffect, useState } from 'react';
import { Package, User, FileText, ShoppingBag, Settings, Wallet, ChevronRight, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import TopBar from '@/components/TopBar';
import { storage } from '@/lib/storage';

function Box({ children, className = '' }: { children?: React.ReactNode; className?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={`rounded-2xl border border-gray-200 bg-white p-4 shadow-sm ${className}`}
    >
      {children}
    </motion.div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg md:text-xl font-bold tracking-tight">{children}</h2>;
}

function Muted({ children }: { children: React.ReactNode }) {
  return <p className="text-xs md:text-sm text-gray-500">{children}</p>;
}

function MenuItem({ icon: Icon, label, href }: { icon: any; label: string; href: string }) {
  return (
    <motion.div whileHover={{ x: 5 }} whileTap={{ scale: 0.98 }}>
      <Link
        href={href}
        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition"
      >
        <Icon className="h-4 w-4 md:h-5 md:w-5 text-gray-400" />
        <span className="font-medium text-sm md:text-base">{label}</span>
        <ChevronRight className="ml-auto h-4 w-4 text-gray-400" />
      </Link>
    </motion.div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const currentUser = storage.getUser();
    if (!currentUser) {
      router.push('/login?redirect=/account');
    } else {
      setUser(currentUser);
      const userOrders = storage.getUserOrders(currentUser.id);
      setOrders(userOrders);
    }
  }, [router]);

  const handleLogout = () => {
    storage.clearUser();
    router.push('/');
  };

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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-4 md:mb-6"
          >
            <div>
              <h1 className="text-xl md:text-2xl font-bold">My Account</h1>
              <p className="text-xs md:text-sm text-gray-500">Welcome, {user.name || user.phone}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-3 md:px-4 py-2 text-xs md:text-sm font-semibold hover:bg-gray-50"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </motion.button>
          </motion.div>

          <div className="grid gap-4 md:gap-6 md:grid-cols-12">
            <div className="md:col-span-4">
              <Box>
                <div className="flex items-center gap-2 text-xs md:text-sm font-semibold mb-2">
                  <User className="h-4 w-4 md:h-5 md:w-5 text-orange-600" /> My Account
                </div>
                <Muted>Navigation</Muted>
                <div className="mt-4 grid gap-2">
                  <MenuItem icon={Package} label="Orders" href="/account/orders" />
                  <MenuItem icon={FileText} label="Prescriptions" href="/account/prescriptions" />
                  <MenuItem icon={ShoppingBag} label="Warranty" href="/account/warranty" />
                  <MenuItem icon={Wallet} label="Subscription" href="/account/subscription" />
                  <MenuItem icon={User} label="Referrals" href="/account/referrals" />
                  <MenuItem icon={Wallet} label="Wallet" href="/account/wallet" />
                  <MenuItem icon={Settings} label="Support" href="/account/support" />
                </div>
              </Box>
            </div>

            <div className="md:col-span-8 space-y-4 md:space-y-6">
              <Box>
                <H2>Dashboard</H2>
                <Muted>Stats tiles</Muted>
                <div className="mt-4 grid gap-3 md:gap-4 grid-cols-1 sm:grid-cols-3">
                  {[
                    { label: 'Rx valid till', value: 'June 30' },
                    { label: 'Wallet', value: '₹250' },
                    { label: 'Subscription', value: 'Active' },
                  ].map((t, i) => (
                    <motion.div
                      key={t.label}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="rounded-2xl border border-gray-200 p-3 md:p-4"
                    >
                      <div className="text-xs text-gray-500">{t.label}</div>
                      <div className="mt-1 text-sm md:text-base font-semibold">{t.value}</div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-4 md:mt-6 grid gap-3 md:gap-4 md:grid-cols-2">
                  {orders.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Box>
                        <div className="text-xs md:text-sm font-semibold">Active Order</div>
                        <Muted>#{orders[0].orderId} • {orders[0].status}</Muted>
                        <Link href={`/track?id=${orders[0].orderId}`}>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="mt-3 h-8 md:h-10 rounded-2xl bg-gradient-to-r from-orange-100 to-orange-200 flex items-center justify-center text-xs md:text-sm font-semibold text-orange-700 cursor-pointer"
                          >
                            Track Order
                          </motion.div>
                        </Link>
                      </Box>
                    </motion.div>
                  )}
                  <Box>
                    <div className="text-xs md:text-sm font-semibold">Reorder</div>
                    <Muted>One-click reorder within 6 months</Muted>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="mt-3 h-8 md:h-10 rounded-2xl bg-gray-100"
                    />
                  </Box>
                </div>
              </Box>

              {orders.length > 0 && (
                <Box>
                  <H2>Recent Orders</H2>
                  <div className="mt-4 space-y-2">
                    {orders.slice(0, 5).map((order, i) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5 }}
                      >
                        <Link href={`/track?id=${order.orderId}`}>
                          <div className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">
                            <div>
                              <div className="text-xs md:text-sm font-semibold">#{order.orderId}</div>
                              <div className="text-xs text-gray-500">{order.serviceType}</div>
                            </div>
                            <div className="text-right">
                              <div className={`text-xs px-2 py-1 rounded-full ${
                                order.status === 'completed' ? 'bg-green-50 text-green-700' :
                                order.status === 'in_progress' ? 'bg-orange-50 text-orange-700' :
                                'bg-gray-50 text-gray-700'
                              }`}>
                                {order.status}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </Box>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
