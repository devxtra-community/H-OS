'use client';

import { useEffect, useState } from 'react';
import { getCurrentAdmission } from '../api/getCurrentAdmission';
import { Bed, User, Clock, MapPin, ShieldCheck, Activity } from 'lucide-react';

export default function AdmissionStatus() {
    const [admission, setAdmission] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStatus() {
            try {
                const data = await getCurrentAdmission();
                setAdmission(data);
            } catch (err) {
                console.error('Failed to fetch admission status', err);
            } finally {
                setLoading(false);
            }
        }
        fetchStatus();
    }, []);

    if (loading) {
        return (
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="h-5 bg-slate-200 rounded w-1/4 mb-4"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-16 bg-slate-100 rounded-xl"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!admission) {
        return (
            <div className="relative overflow-hidden bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-white border border-blue-100 rounded-2xl p-5 shadow-sm transition hover:shadow-md">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                            <ShieldCheck size={22} />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-semibold text-slate-900 text-sm sm:text-base">No Active Admission</h3>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200/60">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Outpatient
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                                You are currently not admitted to any hospital ward. Outpatient services and consultations are active.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const admissionDate = new Date(admission.admitted_at || admission.created_at);
    const formattedDate = admissionDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
    const formattedTime = admissionDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="relative overflow-hidden bg-white border border-blue-200/80 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
                        <Activity size={18} />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Current Inpatient Admission
                        </h2>
                        <p className="text-xs text-slate-500">Live ward monitoring and bed allocation</p>
                    </div>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {admission.status || 'ACTIVE'}
                </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mt-0.5">
                        <MapPin size={18} />
                    </div>
                    <div>
                        <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Ward / Department</p>
                        <p className="font-semibold text-slate-800 text-sm mt-0.5">{admission.ward || 'General Ward'}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                    <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 mt-0.5">
                        <Bed size={18} />
                    </div>
                    <div>
                        <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Bed Allocation</p>
                        <p className="font-semibold text-slate-800 text-sm mt-0.5">{admission.bed_number || 'Assigned'}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 mt-0.5">
                        <User size={18} />
                    </div>
                    <div>
                        <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Attending Doctor</p>
                        <p className="font-semibold text-slate-800 text-sm mt-0.5">Dr. {admission.doctor_name || 'Staff Physician'}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50/70 border border-slate-100">
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-600 mt-0.5">
                        <Clock size={18} />
                    </div>
                    <div>
                        <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Admitted On</p>
                        <p className="font-semibold text-slate-800 text-sm mt-0.5">{formattedDate} • {formattedTime}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
