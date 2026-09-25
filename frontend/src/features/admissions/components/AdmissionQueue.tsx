'use client';

import { useState } from 'react';
import { useAdmissions } from '../hooks/useAdmissions';
import AssignBedModal from './AssignBedModal';
import { UserPlus, Stethoscope, Building2, Bed, CheckCircle2 } from 'lucide-react';

export default function AdmissionQueue() {
  const { data, isLoading } = useAdmissions();
  const [selectedAdmission, setSelectedAdmission] = useState<any>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-100 border-t-purple-600" />
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-12 text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
          <CheckCircle2 size={28} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-base">All Caught Up</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            There are currently no pending admission requests awaiting ward or bed allocation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.map((admission: any) => (
          <div
            key={admission.id}
            className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-purple-500/20 shrink-0">
                    {admission.patient_name?.charAt(0) || 'P'}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-purple-700 transition">
                      {admission.patient_name}
                    </h3>
                    <p className="text-xs text-slate-400">
                      ID: {admission.patient_id.slice(0, 8)}...
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Pending Bed
                </span>
              </div>

              <div className="bg-slate-50/80 rounded-2xl p-3.5 space-y-2 border border-slate-100 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Stethoscope size={15} className="text-indigo-500 shrink-0" />
                  <div className="truncate">
                    <span className="text-slate-400">Ordering Physician: </span>
                    <span className="font-semibold text-slate-800">Dr. {admission.doctor_name}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <Building2 size={15} className="text-blue-500 shrink-0" />
                  <div className="truncate">
                    <span className="text-slate-400">Target Ward: </span>
                    <span className="font-semibold text-slate-800">{admission.department_name}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedAdmission(admission)}
                className="inline-flex items-center justify-center gap-2 w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm shadow-indigo-500/20 transition cursor-pointer"
              >
                <Bed size={15} />
                <span>Assign Ward Bed</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedAdmission && (
        <AssignBedModal
          admission={selectedAdmission}
          onClose={() => setSelectedAdmission(null)}
        />
      )}
    </>
  );
}