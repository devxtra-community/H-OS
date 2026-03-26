'use client';

import { useEffect, useState } from 'react';
import { getCurrentAdmission } from '../api/getCurrentAdmission';
import { Bed, User, Clock, MapPin, AlertCircle } from 'lucide-react';

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
            <div className="bg-white border rounded-2xl p-6 shadow-sm animate-pulse">
                <div className="h-6 bg-slate-200 rounded w-1/4 mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-10 bg-slate-100 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!admission) {
        return (
            <div className="bg-white border rounded-2xl p-6 shadow-sm flex items-center gap-4 border-l-4 border-l-blue-500">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                    <AlertCircle size={22} />
                </div>
                <div>
                    <h3 className="font-semibold text-slate-800">No Active Admission</h3>
                    <p className="text-sm text-slate-500">You are currently not admitted to any ward.</p>
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
        <div className="bg-white border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    Current Admission Status
                    <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">
                        {admission.status}
                    </span>
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600 mt-1">
                        <MapPin size={18} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Ward / Department</p>
                        <p className="font-medium text-slate-800">{admission.ward || 'General'}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-purple-50 text-purple-600 mt-1">
                        <Bed size={18} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Bed Number</p>
                        <p className="font-medium text-slate-800">{admission.bed_number || 'TBD'}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-green-50 text-green-600 mt-1">
                        <User size={18} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Admitting Doctor</p>
                        <p className="font-medium text-slate-800">Dr. {admission.doctor_name || 'Assigned Doctor'}</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-orange-50 text-orange-600 mt-1">
                        <Clock size={18} />
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Admitted On</p>
                        <p className="font-medium text-slate-800">{formattedDate} at {formattedTime}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
