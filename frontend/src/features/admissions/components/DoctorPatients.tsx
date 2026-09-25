'use client';

import { useDoctorAdmissions } from '../hooks/useDoctorAdmissions';
import { useRequestDischarge } from '../hooks/useRequestDischarge';
import { User, Building, BedDouble, Plus, PackageOpen, LogOut, CheckCircle2, Bed } from 'lucide-react';
import { UseItemModal } from '../../inventory/components/UseItemModal';
import { useState } from 'react';

export default function DoctorPatients() {
  const { data, isLoading } = useDoctorAdmissions();
  const dischargeMutation = useRequestDischarge();
  const [useItemPatientId, setUseItemPatientId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-100 border-t-emerald-600" />
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-12 text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
          <Bed size={28} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-base">No Admitted Inpatients</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            You currently have no hospitalized patients assigned under your care in the hospital wards.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {data.map((admission: any) => (
        <div
          key={admission.id}
          className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between group"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-emerald-500/20 shrink-0">
                  {admission.patient_name?.charAt(0) || 'P'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition">
                    {admission.patient_name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    MRN: {admission.patient_id.slice(0, 8)}...
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Inpatient
              </span>
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-3.5 grid grid-cols-2 gap-3 border border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Building size={16} className="text-blue-500 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Ward</p>
                  <p className="font-semibold text-slate-800 truncate">{admission.ward || 'General'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <BedDouble size={16} className="text-indigo-500 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Bed</p>
                  <p className="font-semibold text-slate-800">{admission.bed_number || 'TBD'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2.5">
            <button
              onClick={() => setUseItemPatientId(admission.patient_id)}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60 transition cursor-pointer"
            >
              <PackageOpen size={14} />
              <span>Use Item</span>
            </button>

            {admission.discharge_requested ? (
              <span className="inline-flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-500 border border-slate-200 cursor-not-allowed">
                <CheckCircle2 size={13} />
                <span>Requested</span>
              </span>
            ) : (
              <button
                disabled={dischargeMutation.isPending}
                onClick={() => dischargeMutation.mutate(admission.id)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 transition disabled:opacity-50 cursor-pointer"
              >
                <LogOut size={14} />
                <span>{dischargeMutation.isPending ? 'Requesting...' : 'Discharge'}</span>
              </button>
            )}
          </div>
        </div>
      ))}

      {useItemPatientId && (
        <UseItemModal
          onClose={() => setUseItemPatientId(null)}
          patientId={useItemPatientId}
        />
      )}
    </div>
  );
}