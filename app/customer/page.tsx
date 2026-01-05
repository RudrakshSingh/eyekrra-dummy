'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Package, User, FileText, ShoppingBag, Settings, Wallet } from 'lucide-react';
import Link from 'next/link';
import apiClient from '@/lib/api-client';

export default function CustomerPortal() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/customer');
      return;
    }
    if (user) {
      fetchOrders();
    }
  }, [user, authLoading]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getOrders();
      setOrders(data);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-lg font-bold">My Account</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold">{orders.length}</div>
            <div className="text-xs text-gray-500">Total Orders</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold">
              {orders.filter((o) => o.status === 'in_progress').length}
            </div>
            <div className="text-xs text-gray-500">Active</div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-4 text-center">
            <div className="text-2xl font-bold">
              {orders.filter((o) => o.status === 'completed').length}
            </div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4 space-y-2">
          <MenuItem icon={Package} label="My Orders" href="/customer/orders" />
          <MenuItem icon={User} label="Profile" href="/customer/profile" />
          <MenuItem icon={FileText} label="Prescriptions" href="/customer/prescriptions" />
          <MenuItem icon={ShoppingBag} label="Reorder" href="/shop" />
          <MenuItem icon={Wallet} label="Wallet" href="/customer/wallet" />
          <MenuItem icon={Settings} label="Settings" href="/customer/settings" />
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <h2 className="font-semibold mb-4">Recent Orders</h2>
          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No orders yet</p>
              <Link href="/book" className="text-orange-600 text-sm mt-2 inline-block">
                Book your first eye test
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <Link
                  key={order._id}
                  href={`/track?id=${order._id}`}
                  className="flex items-center justify-between p-3 rounded-xl border border-gray-200 hover:bg-gray-50"
                >
                  <div>
                    <div className="font-semibold text-sm">#{order.orderId}</div>
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MenuItem({ icon: Icon, label, href }: { icon: any; label: string; href: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition"
    >
      <Icon className="h-5 w-5 text-gray-400" />
      <span className="font-medium">{label}</span>
      <span className="ml-auto text-gray-400">→</span>
    </Link>
  );
}

