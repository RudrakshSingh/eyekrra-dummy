'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { MapPin, Phone, Clock, Camera, FileText, CheckCircle2 } from 'lucide-react';
import apiClient from '@/lib/api-client';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'eye-test' | 'try-on'>('eye-test');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJob();
  }, [params.id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getOrder(params.id as string);
      setJob(data);
    } catch (error) {
      console.error('Failed to fetch job:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (stage: string, data?: any) => {
    try {
      await apiClient.updateOrderStatus(job._id, stage, data);
      await fetchJob();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  if (loading || !job) {
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
          <button onClick={() => router.back()} className="text-gray-500">
            ← Back
          </button>
          <div className="flex-1">
            <h1 className="font-bold">Order #{job.orderId}</h1>
            <p className="text-xs text-gray-500">{job.address?.full}</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Customer Info */}
        <div className="bg-white rounded-2xl border border-gray-200 p-4">
          <h2 className="font-semibold mb-3">Customer Details</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{job.customerId?.phone || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{job.address?.full}</span>
            </div>
            {job.address?.landmark && (
              <div className="text-gray-500 text-xs">Landmark: {job.address.landmark}</div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-gray-200 p-1 flex gap-1">
          <button
            onClick={() => setActiveTab('eye-test')}
            className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeTab === 'eye-test'
                ? 'bg-orange-600 text-white'
                : 'text-gray-600'
            }`}
          >
            Eye Test
          </button>
          <button
            onClick={() => setActiveTab('try-on')}
            className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeTab === 'try-on'
                ? 'bg-orange-600 text-white'
                : 'text-gray-600'
            }`}
          >
            Try-On
          </button>
        </div>

        {/* Eye Test Module */}
        {activeTab === 'eye-test' && (
          <EyeTestModule job={job} onUpdate={updateStatus} />
        )}

        {/* Try-On Module */}
        {activeTab === 'try-on' && (
          <TryOnModule job={job} onUpdate={updateStatus} />
        )}
      </div>
    </div>
  );
}

function EyeTestModule({ job, onUpdate }: { job: any; onUpdate: (stage: string, data?: any) => void }) {
  const [formData, setFormData] = useState({
    prescription: '',
    summary: '',
    photos: [] as string[],
  });

  const handleStart = () => {
    onUpdate('eye_test_started');
  };

  const handleComplete = () => {
    onUpdate('eye_test_completed', {
      eyeTestData: formData,
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <h3 className="font-semibold mb-4">Eye Test Module</h3>
        
        {job.currentStage === 'eye_test_started' || job.eyeTestData ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Prescription Data</label>
              <textarea
                value={formData.prescription}
                onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                placeholder="Enter prescription details..."
                rows={6}
                className="w-full rounded-xl border border-gray-200 p-3 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Photos</label>
              <div className="grid grid-cols-3 gap-2">
                {formData.photos.map((photo, i) => (
                  <div key={i} className="aspect-square bg-gray-100 rounded-xl"></div>
                ))}
                <button className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center">
                  <Camera className="h-6 w-6 text-gray-400" />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Summary</label>
              <textarea
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                placeholder="Test summary for customer approval..."
                rows={3}
                className="w-full rounded-xl border border-gray-200 p-3 text-sm"
              />
            </div>

            <button
              onClick={handleComplete}
              className="w-full rounded-xl bg-orange-600 text-white px-4 py-3 font-semibold"
            >
              Complete Eye Test
            </button>
          </div>
        ) : (
          <button
            onClick={handleStart}
            className="w-full rounded-xl bg-orange-600 text-white px-4 py-3 font-semibold"
          >
            Start Eye Test
          </button>
        )}
      </div>
    </div>
  );
}

function TryOnModule({ job, onUpdate }: { job: any; onUpdate: (stage: string, data?: any) => void }) {
  const [selectedFrames, setSelectedFrames] = useState<any[]>([]);

  const handleStart = () => {
    onUpdate('try_on_started');
  };

  const handleComplete = () => {
    onUpdate('try_on_completed', {
      tryOnData: {
        selectedFrames,
      },
    });
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-200 p-4">
        <h3 className="font-semibold mb-4">Try-On Module</h3>
        
        {job.currentStage === 'try_on_started' || job.tryOnData ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Frames</label>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm">Frame {i}</div>
                      <div className="text-xs text-gray-500">₹799</div>
                    </div>
                    <select className="rounded-lg border border-gray-200 px-2 py-1 text-sm">
                      <option>Priority 1</option>
                      <option>Priority 2</option>
                      <option>Priority 3</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleComplete}
              className="w-full rounded-xl bg-orange-600 text-white px-4 py-3 font-semibold"
            >
              Complete Try-On
            </button>
          </div>
        ) : (
          <button
            onClick={handleStart}
            className="w-full rounded-xl bg-orange-600 text-white px-4 py-3 font-semibold"
          >
            Start Try-On
          </button>
        )}
      </div>
    </div>
  );
}

