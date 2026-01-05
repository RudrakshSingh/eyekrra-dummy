'use client';

import { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';
import { motion } from 'framer-motion';
import { getSLAStatus } from '@/lib/utils';

interface SLATimerProps {
  startedAt: Date | string;
  targetMinutes: number;
  currentStage: string;
}

export default function SLATimer({ startedAt, targetMinutes, currentStage }: SLATimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const startTime = new Date(startedAt).getTime();
    
    const updateElapsed = () => {
      const now = Date.now();
      const elapsedMs = now - startTime;
      setElapsed(Math.max(0, Math.floor(elapsedMs / 60000))); // Convert to minutes
    };

    updateElapsed();
    const interval = setInterval(updateElapsed, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [startedAt]);

  const remaining = Math.max(0, targetMinutes - elapsed);
  const percentage = Math.min(100, (elapsed / targetMinutes) * 100);
  const status = getSLAStatus(elapsed, targetMinutes);

  const statusConfig = {
    breached: { bg: 'bg-red-50', text: 'text-red-700', bar: 'bg-red-600', label: 'Breached' },
    at_risk: { bg: 'bg-yellow-50', text: 'text-yellow-700', bar: 'bg-yellow-600', label: 'At Risk' },
    on_track: { bg: 'bg-orange-50', text: 'text-orange-700', bar: 'bg-orange-600', label: 'Live' },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
          className="flex items-center gap-2 text-sm font-semibold"
        >
          <Timer className="h-4 w-4 text-orange-600" /> 4-Hour SLA Timer
        </motion.div>
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className={`rounded-full px-3 py-1 text-xs font-semibold ${config.bg} ${config.text}`}
        >
          {config.label}
        </motion.span>
      </div>
      <div className="space-y-2">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between text-sm"
        >
          <span className="text-gray-500">Elapsed</span>
          <motion.span
            key={elapsed}
            initial={{ scale: 1.2, color: '#ea580c' }}
            animate={{ scale: 1, color: '#000' }}
            className="font-semibold"
          >
            {elapsed} min
          </motion.span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between text-sm"
        >
          <span className="text-gray-500">Remaining</span>
          <motion.span
            key={remaining}
            initial={{ scale: 1.2, color: '#ea580c' }}
            animate={{ scale: 1, color: '#000' }}
            className="font-semibold"
          >
            {remaining} min
          </motion.span>
        </motion.div>
        <div className="mt-2 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-2 rounded-full ${config.bar}`}
          />
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs text-gray-500 mt-2"
        >
          Stages update via system events (no manual ops).
        </motion.p>
      </div>
    </motion.div>
  );
}
