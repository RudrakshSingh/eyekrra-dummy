'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { MapPin, Phone, Clock, CheckCircle2, Navigation, Package } from 'lucide-react';
import apiClient from '@/lib/api-client';

export default function StaffPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/staff');
      return;
    }
    fetchJobs();
  }, [user]);

  const fetchJobs = async () => {
    if (!user) return;
    try {
      setLoading(true);
      // Fetch today's jobs for this staff member
      const today = new Date().toISOString().split('T')[0];
      const orders = await apiClient.getOrders({ 
        assignedStaffId: user.id,
        date: today 
      });
      setJobs(orders);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: string, stage: string, data?: any) => {
    try {
      await apiClient.updateOrderStatus(orderId, stage, data);
      await fetchJobs();
      if (selectedJob?._id === orderId) {
        const updated = await apiClient.getOrder(orderId);
        setSelectedJob(updated);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      alert('Failed to update status');
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
      {/* Mobile-first header */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold">Today's Jobs</h1>
            <p className="text-xs text-gray-500">{jobs.length} jobs assigned</p>
          </div>
          <button
            onClick={() => router.push('/staff/profile')}
            className="rounded-full bg-orange-50 p-2"
          >
            <span className="text-sm font-semibold text-orange-600">
              {user?.name?.charAt(0) || user?.phone?.charAt(0) || 'U'}
            </span>
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No jobs assigned for today</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">Order #{job.orderId}</h3>
                  <p className="text-xs text-gray-500">{job.serviceType}</p>
                </div>
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700">
                  {job.currentStage}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">{job.address?.full}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-600">Customer contact</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedJob(job)}
                  className="flex-1 rounded-xl bg-orange-600 text-white px-4 py-2 text-sm font-semibold"
                >
                  View Details
                </button>
                <button
                  onClick={() => router.push(`/staff/job/${job._id}`)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-semibold"
                >
                  Start Job
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="font-bold">Job Details</h2>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-gray-500"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-4 space-y-4">
              <JobActions job={selectedJob} onUpdate={updateStatus} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function JobActions({ job, onUpdate }: { job: any; onUpdate: (id: string, stage: string, data?: any) => void }) {
  const stages = [
    { key: 'call_verified', label: 'Call & Verify', icon: Phone },
    { key: 'start_travel', label: 'Start Travel', icon: Navigation },
    { key: 'arrived', label: 'Arrived', icon: MapPin },
    { key: 'eye_test_started', label: 'Eye Test Started', icon: Clock },
    { key: 'eye_test_completed', label: 'Eye Test Completed', icon: CheckCircle2 },
    { key: 'try_on_started', label: 'Try-On Started', icon: Package },
    { key: 'try_on_completed', label: 'Try-On Completed', icon: CheckCircle2 },
  ];

  const currentStageIndex = stages.findIndex((s) => s.key === job.currentStage);

  return (
    <div className="space-y-3">
      {stages.map((stage, index) => {
        const Icon = stage.icon;
        const isDone = index < currentStageIndex;
        const isNext = index === currentStageIndex;
        const isDisabled = index > currentStageIndex + 1;

        // Special rule: Can't start travel without calling
        if (stage.key === 'start_travel' && currentStageIndex < 0) {
          return null;
        }

        return (
          <button
            key={stage.key}
            onClick={() => !isDisabled && onUpdate(job._id, stage.key)}
            disabled={isDisabled}
            className={`w-full flex items-center gap-3 rounded-xl p-3 text-left transition ${
              isDone
                ? 'bg-green-50 text-green-700'
                : isNext
                  ? 'bg-orange-600 text-white'
                  : isDisabled
                    ? 'bg-gray-50 text-gray-400'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-semibold">{stage.label}</span>
            {isDone && <CheckCircle2 className="h-5 w-5 ml-auto" />}
          </button>
        );
      })}
    </div>
  );
}

