'use client'

import { useDoctorAdmissions } from '../hooks/useDoctorAdmissions'
import { useRequestDischarge } from '../hooks/useRequestDischarge'
import { User, Building, BedDouble, Plus } from 'lucide-react'
import { UseItemModal } from '../../inventory/components/UseItemModal'
import { useState } from 'react'

export default function DoctorPatients() {
  const { data, isLoading } = useDoctorAdmissions()
  const dischargeMutation = useRequestDischarge()
  const [useItemPatientId, setUseItemPatientId] = useState<string | null>(null)

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
      </div>
    )
  }

  if (!data?.length) {
    return (
      <div className="bg-white rounded-2xl border shadow-sm p-6 text-slate-500 text-center">
        No admitted patients
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {data.map((admission: any) => (
        <div
          key={admission.id}
          className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
                  <User size={20} />
                </div>
                <div>
                  <div className="font-bold text-slate-800">
                    {admission.patient_name}
                  </div>
                  <div className="text-xs text-slate-400">
                    ID: {admission.patient_id.split('-')[0]}...
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 flex gap-6 border border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Building size={16} className="opacity-50" />
                <span className="font-medium">{admission.ward}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <BedDouble size={16} className="opacity-50" />
                <span className="font-medium">Bed {admission.bed_number}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex gap-2">
            <button
              onClick={() => setUseItemPatientId(admission.patient_id)}
              className="w-full bg-indigo-50 text-indigo-700 px-4 py-2.5 rounded-xl hover:bg-indigo-100 font-medium transition-colors border border-indigo-100 shadow-sm"
            >
              Use Item
            </button>
            {admission.discharge_requested ? (
              <span className="w-full text-center bg-slate-100 text-slate-500 px-4 py-2.5 rounded-xl font-medium border border-slate-200 cursor-not-allowed">
                Request Sent
              </span>
            ) : (
              <button
                disabled={dischargeMutation.isPending}
                onClick={() => dischargeMutation.mutate(admission.id)}
                className="w-full bg-rose-100 text-rose-700 px-4 py-2.5 rounded-xl hover:bg-rose-200 font-medium transition-colors disabled:opacity-50"
              >
                {dischargeMutation.isPending ? 'Requesting...' : 'Request Discharge'}
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
  )
}