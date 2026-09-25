'use client';

import AdmissionQueue from '@/src/features/admissions/components/AdmissionQueue';
import { ClipboardPlus } from 'lucide-react';

export default function StaffAdmissionsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-600 text-white shadow-sm shadow-purple-500/20">
          <ClipboardPlus size={20} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Inpatient Admissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Acknowledge physician admission orders and assign ward beds to incoming patients
          </p>
        </div>
      </div>

      <AdmissionQueue />
    </div>
  );
}