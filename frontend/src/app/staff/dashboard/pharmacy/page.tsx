'use client';

import { Pill, CheckCircle, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { usePendingPrescriptions } from '../../../../features/pharmacy/hooks/usePharmacy';
import { useStaffAuth } from '../../../../staff/auth/staff.auth.provider';
import { useDispensePrescription } from '../../../../features/pharmacy/hooks/usePharmacyActions';
import { useRouter } from 'next/navigation';

export default function PharmacyPage() {
  const { auth } = useStaffAuth();
  const router = useRouter();

  if (auth.staff?.role === 'DOCTOR') {
    router.replace('/staff/dashboard');
    return null;
  }

  const { data: prescriptions, isLoading } = usePendingPrescriptions();
  const dispenseMutation = useDispensePrescription();

  if (isLoading) return (
    <div className="flex justify-center items-center py-20">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-100 border-t-teal-600" />
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="relative overflow-hidden bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-sm shadow-teal-500/25">
            <Pill size={24} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Pharmacy & Medication Dispensing
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200/60">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                Active Dispensary
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Verify physician prescriptions, inspect inventory stock levels, and dispense medications
            </p>
          </div>
        </div>
      </div>

      {prescriptions?.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto">
            <CheckCircle2 size={28} />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-base">Prescription Queue Clear</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
              No pending prescriptions currently waiting to be dispensed. You are completely caught up!
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-6">
          {prescriptions?.map((prescription: any) => {
            const canDispense = prescription.items.every((item: any) => item.stock_available >= item.quantity);

            return (
              <div
                key={prescription.id}
                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200/80 hover:border-slate-300 hover:shadow-md transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-5 border-b border-slate-100 pb-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Patient Name</p>
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-teal-700 transition">
                        {prescription.patient_name || 'Anonymous Patient'}
                      </h3>
                      <p className="text-xs text-indigo-600 font-semibold flex items-center gap-1.5">
                        <span className="text-slate-400 font-normal">Physician:</span> Dr. {prescription.doctor_name}
                      </p>
                    </div>

                    <span className="px-2.5 py-1 text-xs font-bold tracking-wide rounded-full bg-amber-50 text-amber-700 border border-amber-200/70">
                      {prescription.status}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Prescribed Medicines ({prescription.items.length})
                    </p>

                    {prescription.items.map((item: any) => {
                      const hasStock = item.stock_available >= item.quantity;
                      return (
                        <div
                          key={item.id}
                          className="flex justify-between items-center bg-slate-50/80 p-3 rounded-2xl border border-slate-100"
                        >
                          <div className="min-w-0 pr-2">
                            <p className="font-bold text-slate-800 text-xs sm:text-sm truncate">{item.item_name}</p>
                            {item.instructions && (
                              <p className="text-xs text-slate-500 italic mt-0.5 truncate">{item.instructions}</p>
                            )}
                            <p className={`text-[11px] font-semibold mt-0.5 ${!hasStock ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                              Stock: {item.stock_available} units
                            </p>
                          </div>

                          <div className="flex items-center justify-center bg-white text-teal-700 font-extrabold text-xs border border-slate-200/80 rounded-xl px-2.5 py-1.5 shadow-2xs shrink-0">
                            x{item.quantity}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <button
                    disabled={!canDispense || dispenseMutation.isPending}
                    onClick={() => dispenseMutation.mutate(prescription.id)}
                    className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-xl font-bold text-xs transition shadow-sm shadow-teal-500/20 disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <CheckCircle size={16} />
                    <span>
                      {dispenseMutation.isPending
                        ? 'Dispensing Medicines...'
                        : canDispense
                          ? 'Dispense Medicines'
                          : 'Insufficient Stock to Dispense'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
