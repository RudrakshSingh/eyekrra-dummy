'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Clock, AlertTriangle, CheckCircle2, Package, Timer } from 'lucide-react';
import apiClient from '@/lib/api-client';

export default function LabPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [queue, setQueue] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/lab');
      return;
    }
    fetchQueue();
    const interval = setInterval(fetchQueue, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [user]);

  const fetchQueue = async () => {
    try {
      // Fetch orders in lab stages
      const orders = await apiClient.getOrders({ 
        status: 'in_progress',
        stage: ['job_received', 'lens_frame_allocation', 'cutting_fitting', 'assembly', 'qc_1', 'final_cleaning', 'qc_2', 'dispatch_ready']
      });
      
      // Categorize by SLA status
      const now = Date.now();
      const categorized = orders.map((order: any) => {
        const elapsed = Math.floor((now - new Date(order.startedAt).getTime()) / 60000);
        const remaining = order.targetMinutes - elapsed;
        const percentage = (elapsed / order.targetMinutes) * 100;
        
        let status: 'on_track' | 'at_risk' | 'breached' = 'on_track';
        if (percentage >= 100) status = 'breached';
        else if (percentage >= 80) status = 'at_risk';
        
        return { ...order, elapsed, remaining, status };
      });

      // Sort: breached first, then at_risk, then on_track
      categorized.sort((a, b) => {
        const statusOrder = { breached: 0, at_risk: 1, on_track: 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      });

      setQueue(categorized);
    } catch (error) {
      console.error('Failed to fetch queue:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStage = async (orderId: string, stage: string, qcResult?: 'pass' | 'fail', reason?: string) => {
    try {
      await apiClient.updateOrderStatus(orderId, stage, {
        qcResult,
        qcReason: reason,
      });
      await fetchQueue();
      if (selectedOrder?._id === orderId) {
        const updated = await apiClient.getOrder(orderId);
        setSelectedOrder(updated);
      }
    } catch (error) {
      alert('Failed to update stage');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  const breached = queue.filter((o) => o.status === 'breached');
  const atRisk = queue.filter((o) => o.status === 'at_risk');
  const onTrack = queue.filter((o) => o.status === 'on_track');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <h1 className="text-lg font-bold">Lab Queue - 20-Min Workflow</h1>
        <div className="flex gap-4 mt-2 text-xs">
          <span className="text-red-600">Breached: {breached.length}</span>
          <span className="text-yellow-600">At Risk: {atRisk.length}</span>
          <span className="text-green-600">On Track: {onTrack.length}</span>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Breached */}
        {breached.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Breached SLA
            </h2>
            <div className="space-y-2">
              {breached.map((order) => (
                <OrderCard key={order._id} order={order} onClick={() => setSelectedOrder(order)} />
              ))}
            </div>
          </div>
        )}

        {/* At Risk */}
        {atRisk.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-yellow-600 mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4" /> At Risk
            </h2>
            <div className="space-y-2">
              {atRisk.map((order) => (
                <OrderCard key={order._id} order={order} onClick={() => setSelectedOrder(order)} />
              ))}
            </div>
          </div>
        )}

        {/* On Track */}
        {onTrack.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-green-600 mb-2 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" /> On Track
            </h2>
            <div className="space-y-2">
              {onTrack.map((order) => (
                <OrderCard key={order._id} order={order} onClick={() => setSelectedOrder(order)} />
              ))}
            </div>
          </div>
        )}

        {queue.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No orders in lab queue
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <LabWorkbench order={selectedOrder} onUpdate={updateStage} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
}

function OrderCard({ order, onClick }: { order: any; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-4 cursor-pointer hover:shadow-md transition"
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="font-semibold">#{order.orderId}</h3>
          <p className="text-xs text-gray-500">{order.currentStage}</p>
        </div>
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            order.status === 'breached'
              ? 'bg-red-50 text-red-700'
              : order.status === 'at_risk'
                ? 'bg-yellow-50 text-yellow-700'
                : 'bg-green-50 text-green-700'
          }`}
        >
          {order.remaining}m left
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Timer className="h-3 w-3" />
        <span>Elapsed: {order.elapsed}m / {order.targetMinutes}m</span>
      </div>
    </div>
  );
}

function LabWorkbench({ order, onUpdate, onClose }: { order: any; onUpdate: (id: string, stage: string, qcResult?: 'pass' | 'fail', reason?: string) => void; onClose: () => void }) {
  const stages = [
    { key: 'job_received', label: 'Job Received' },
    { key: 'lens_frame_allocation', label: 'Lens & Frame Allocation' },
    { key: 'cutting_fitting', label: 'Cutting/Fitting' },
    { key: 'assembly', label: 'Assembly' },
    { key: 'qc_1', label: 'QC 1', isQC: true },
    { key: 'final_cleaning', label: 'Final Cleaning' },
    { key: 'qc_2', label: 'QC 2 / Dispatch Ready', isQC: true },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === order.currentStage);
  const [qcReason, setQcReason] = useState('');

  const handleStageUpdate = (stage: string, isQC?: boolean) => {
    if (isQC) {
      // For QC stages, show pass/fail options
      const result = window.confirm('QC Pass?') ? 'pass' : 'fail';
      if (result === 'fail') {
        const reason = prompt('Reason for fail (required):');
        if (reason) {
          onUpdate(order._id, stage, result, reason);
        }
      } else {
        onUpdate(order._id, stage, result);
      }
    } else {
      onUpdate(order._id, stage);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold">Order #{order.orderId}</h2>
              <p className="text-xs text-gray-500">20-Min Workflow</p>
            </div>
            <button onClick={onClose} className="text-gray-500">✕</button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {stages.map((stage, index) => {
            const isDone = index < currentStageIndex;
            const isCurrent = index === currentStageIndex;
            const isNext = index === currentStageIndex + 1;

            return (
              <div
                key={stage.key}
                className={`p-4 rounded-xl border-2 ${
                  isCurrent
                    ? 'border-orange-600 bg-orange-50'
                    : isDone
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-gray-300"></div>
                    )}
                    <span className="font-semibold">{stage.label}</span>
                  </div>
                  {isCurrent && <span className="text-xs bg-orange-600 text-white px-2 py-1 rounded">Current</span>}
                </div>

                {isCurrent && (
                  <div className="mt-3 space-y-2">
                    {stage.isQC ? (
                      <div className="space-y-2">
                        <button
                          onClick={() => handleStageUpdate(stage.key, true)}
                          className="w-full rounded-lg bg-green-600 text-white px-4 py-2 text-sm font-semibold"
                        >
                          QC Pass
                        </button>
                        <button
                          onClick={() => {
                            const reason = prompt('Reason for fail (required):');
                            if (reason) {
                              onUpdate(order._id, stage.key, 'fail', reason);
                            }
                          }}
                          className="w-full rounded-lg bg-red-600 text-white px-4 py-2 text-sm font-semibold"
                        >
                          QC Fail
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStageUpdate(stage.key)}
                        className="w-full rounded-lg bg-orange-600 text-white px-4 py-2 text-sm font-semibold"
                      >
                        Mark {stage.label} Complete
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

