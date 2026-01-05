'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import apiClient from '@/lib/api-client';

export default function CustomerOrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/customer/orders');
      return;
    }
    fetchOrders();
  }, [user]);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <Link href="/customer" className="text-gray-500">← Back</Link>
          <h1 className="text-lg font-bold">My Orders</h1>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {orders.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No orders yet</p>
            <Link href="/book" className="text-orange-600 text-sm mt-2 inline-block">
              Book your first eye test
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <Link
              key={order._id}
              href={`/track?id=${order._id}`}
              className="block bg-white rounded-2xl border border-gray-200 p-4 hover:shadow-md transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">#{order.orderId}</h3>
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
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
                <span className="font-semibold">₹{order.payment?.amount || 0}</span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

