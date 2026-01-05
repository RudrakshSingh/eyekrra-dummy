'use client';

import { CheckCircle2, Clock } from 'lucide-react';
import { OrderStage, TimelineEvent } from '@/types';

interface OrderStatusTimelineProps {
  stages: Array<{
    name: string;
    stage: OrderStage;
    done: boolean;
    time?: string;
  }>;
  timeline?: TimelineEvent[];
}

export default function OrderStatusTimeline({ stages, timeline }: OrderStatusTimelineProps) {
  return (
    <div className="space-y-2">
      {stages.map((s) => (
        <div
          key={s.name}
          className="flex items-center justify-between rounded-2xl border border-gray-200 p-3"
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-2xl ${
                s.done ? 'bg-orange-50' : 'bg-gray-100'
              }`}
            >
              {s.done ? (
                <CheckCircle2 className="h-5 w-5 text-orange-600" />
              ) : (
                <Clock className="h-5 w-5 text-gray-500" />
              )}
            </div>
            <div>
              <div className="text-sm font-semibold">{s.name}</div>
              <div className="text-xs text-gray-500">System timestamp</div>
            </div>
          </div>
          <div className="text-sm font-semibold">{s.time || '—'}</div>
        </div>
      ))}
    </div>
  );
}

