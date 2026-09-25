'use client';

import BedsBoard from '@/src/features/beds/components/BedsBoard';
import { Bed } from 'lucide-react';

export default function StaffBedsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm shadow-blue-500/20">
          <Bed size={20} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Ward & Bed Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time ward occupancy, room availability, and bed status
          </p>
        </div>
      </div>

      <BedsBoard />
    </div>
  );
}