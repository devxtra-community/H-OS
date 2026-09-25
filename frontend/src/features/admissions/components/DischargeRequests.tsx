'use client';

import { useDischargeRequests } from '../hooks/useDischargeRequests';
import { useDischargePatient } from '../hooks/useDischargePatient';
import { LogOut, Building, BedDouble, CheckCircle2, User } from 'lucide-react';

export default function DischargeRequests() {
  const { data, isLoading } = useDischargeRequests();
  const dischargeMutation = useDischargePatient();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-100 border-t-amber-600" />
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-12 text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
          <CheckCircle2 size={28} />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 text-base">No Pending Discharges</h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            All physician discharge clearances have been processed. Ward beds are synchronized.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {data.map((req: any) => (
        <div
          key={req.id}
          className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between group"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold text-sm shadow-sm shadow-amber-500/20 shrink-0">
                  {req.patient_name?.charAt(0) || 'P'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-amber-700 transition">
                    {req.patient_name}
                  </h3>
                  <p className="text-xs text-slate-400">
                    ID: {req.patient_id.slice(0, 8)}...
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                Ready for Discharge
              </span>
            </div>

            <div className="bg-slate-50/80 rounded-2xl p-3.5 grid grid-cols-2 gap-3 border border-slate-100 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Building size={16} className="text-blue-500 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Ward</p>
                  <p className="font-semibold text-slate-800 truncate">{req.ward || 'General'}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-600">
                <BedDouble size={16} className="text-indigo-500 shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">Bed</p>
                  <p className="font-semibold text-slate-800">{req.bed_number || 'TBD'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              disabled={dischargeMutation.isPending}
              onClick={() =>
                dischargeMutation.mutate({
                  bedId: req.bed_id,
                  admissionId: req.id
                })
              }
              className="inline-flex items-center justify-center gap-2 w-full bg-rose-600 hover:bg-rose-700 active:scale-[0.99] text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-sm shadow-rose-500/20 transition disabled:opacity-50 cursor-pointer"
            >
              <LogOut size={15} />
              <span>{dischargeMutation.isPending ? 'Processing Discharge...' : 'Complete Discharge'}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}