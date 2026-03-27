'use client'

import { Pill, CheckCircle } from 'lucide-react'
import { usePendingPrescriptions } from '../../../../features/pharmacy/hooks/usePharmacy'
import { useStaffAuth } from '../../../../staff/auth/staff.auth.provider'
import { useDispensePrescription } from '../../../../features/pharmacy/hooks/usePharmacyActions'
import { useRouter } from 'next/navigation'

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
        <div className="flex justify-center p-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border">
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-teal-100 text-teal-600">
                        <Pill size={24} />
                    </div>
                    Pharmacy & Dispensing
                </h1>
            </div>

            {prescriptions?.length === 0 ? (
                <div className="bg-white rounded-2xl border shadow-sm p-8 text-center text-slate-500 font-medium">
                    No pending prescriptions right now. You're all caught up!
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-6">
                    {prescriptions?.map((prescription: any) => {
                        const canDispense = prescription.items.every((item: any) => item.stock_available >= item.quantity);

                        return (
                            <div key={prescription.id} className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-md transition flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patient</p>
                                            <h3 className="font-bold text-xl text-slate-800">{prescription.patient_name || 'Anonymous Patient'}</h3>
                                            <p className="text-sm text-indigo-600 font-semibold mt-1 flex items-center gap-1.5">
                                                <span className="text-slate-400 font-normal">Prescribed by:</span> Dr. {prescription.doctor_name}
                                            </p>
                                        </div>
                                        <span className="px-3 py-1 text-xs font-bold tracking-wide rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                                            {prescription.status}
                                        </span>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Prescribed Medicines</p>
                                        {prescription.items.map((item: any) => (
                                            <div key={item.id} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                <div>
                                                    <p className="font-bold text-slate-700">{item.item_name}</p>
                                                    {item.instructions && <p className="text-sm font-medium text-slate-500 mt-1">{item.instructions}</p>}
                                                    <p className={`text-xs font-semibold mt-0.5 ${item.stock_available < item.quantity ? 'text-rose-500' : 'text-slate-400'}`}>
                                                        Stock: {item.stock_available}
                                                    </p>
                                                </div>
                                                <div className="flex items-center justify-center bg-white text-teal-600 font-bold border border-slate-200 rounded-lg w-10 h-10 shadow-sm">
                                                    x{item.quantity}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100">
                                    <button
                                        disabled={!canDispense || dispenseMutation.isPending}
                                        onClick={() => dispenseMutation.mutate(prescription.id)}
                                        className="w-full flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-3.5 rounded-xl font-bold transition shadow-md disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed"
                                    >
                                        <CheckCircle size={20} />
                                        {dispenseMutation.isPending ? 'Dispensing...' : canDispense ? 'Dispense Medicines' : 'Insufficient Stock'}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    )
}
