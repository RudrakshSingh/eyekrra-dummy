'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Package, DollarSign, Users, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import apiClient from '@/lib/api-client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/admin');
      return;
    }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      // Fetch dashboard stats
      const today = new Date().toISOString().split('T')[0];
      const orders = await apiClient.getOrders({ date: today });
      
      const completed = orders.filter((o: any) => o.status === 'completed');
      const inProgress = orders.filter((o: any) => o.status === 'in_progress');
      const revenue = completed.reduce((sum: number, o: any) => sum + (o.payment?.amount || 0), 0);
      
      // Calculate SLA compliance
      const slaCompliant = completed.filter((o: any) => {
        const elapsed = Math.floor((new Date(o.updatedAt).getTime() - new Date(o.startedAt).getTime()) / 60000);
        return elapsed <= o.targetMinutes;
      });

      setStats({
        ordersToday: orders.length,
        revenueToday: revenue,
        inProgress: inProgress.length,
        slaCompliance: orders.length > 0 ? (slaCompliant.length / completed.length) * 100 : 0,
        funnel: {
          bookings: orders.length,
          orders: completed.length,
          delivered: completed.filter((o: any) => o.currentStage === 'delivered').length,
        },
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
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

  const chartData = [
    { name: 'Mon', orders: 12, revenue: 24000 },
    { name: 'Tue', orders: 19, revenue: 38000 },
    { name: 'Wed', orders: 15, revenue: 30000 },
    { name: 'Thu', orders: 22, revenue: 44000 },
    { name: 'Fri', orders: 18, revenue: 36000 },
    { name: 'Sat', orders: 25, revenue: 50000 },
    { name: 'Sun', orders: 20, revenue: 40000 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-lg font-bold">Admin Dashboard</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon={Package}
            label="Orders Today"
            value={stats?.ordersToday || 0}
            color="orange"
          />
          <StatCard
            icon={DollarSign}
            label="Revenue Today"
            value={`₹${(stats?.revenueToday || 0).toLocaleString()}`}
            color="green"
          />
          <StatCard
            icon={Clock}
            label="In Progress"
            value={stats?.inProgress || 0}
            color="blue"
          />
          <StatCard
            icon={TrendingUp}
            label="SLA Compliance"
            value={`${(stats?.slaCompliance || 0).toFixed(0)}%`}
            color={stats?.slaCompliance >= 80 ? 'green' : 'red'}
          />
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <h3 className="font-semibold mb-4">Orders & Revenue (Last 7 Days)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#f97316" />
                <Bar dataKey="revenue" fill="#22c55e" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-4">
            <h3 className="font-semibold mb-4">Funnel</h3>
            <div className="space-y-4">
              <FunnelStep label="Bookings" value={stats?.funnel?.bookings || 0} total={stats?.funnel?.bookings || 1} />
              <FunnelStep label="Orders" value={stats?.funnel?.orders || 0} total={stats?.funnel?.bookings || 1} />
              <FunnelStep label="Delivered" value={stats?.funnel?.delivered || 0} total={stats?.funnel?.bookings || 1} />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <button
              onClick={() => router.push('/admin/orders')}
              className="rounded-xl border border-gray-200 p-3 text-sm font-semibold hover:bg-gray-50"
            >
              Manage Orders
            </button>
            <button
              onClick={() => router.push('/admin/bookings')}
              className="rounded-xl border border-gray-200 p-3 text-sm font-semibold hover:bg-gray-50"
            >
              Manage Bookings
            </button>
            <button
              onClick={() => router.push('/admin/products')}
              className="rounded-xl border border-gray-200 p-3 text-sm font-semibold hover:bg-gray-50"
            >
              Manage Catalog
            </button>
            <button
              onClick={() => router.push('/admin/staff')}
              className="rounded-xl border border-gray-200 p-3 text-sm font-semibold hover:bg-gray-50"
            >
              Manage Staff
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  const colorClasses = {
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
    blue: 'bg-blue-50 text-blue-600',
    red: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4">
      <div className={`w-10 h-10 rounded-xl ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center mb-2`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  );
}

function FunnelStep({ label, value, total }: { label: string; value: number; total: number }) {
  const percentage = (value / total) * 100;
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium">{label}</span>
        <span className="text-sm text-gray-500">{value} ({percentage.toFixed(0)}%)</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-orange-600 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

