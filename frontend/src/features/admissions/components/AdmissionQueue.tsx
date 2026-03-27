'use client'

import { useState } from 'react'
import { useAdmissions } from '../hooks/useAdmissions'
import AssignBedModal from './AssignBedModal'
import { UserPlus, Stethoscope, Building2 } from 'lucide-react'

export default function AdmissionQueue() {
  const { data, isLoading } = useAdmissions()
  const [selectedAdmission, setSelectedAdmission] = useState<any>(null)

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
        No pending admissions
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {data.map((admission: any) => (
          <div
            key={admission.id}
            className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-100 text-purple-600">
                  <UserPlus size={20} />
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

              <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-2 border border-slate-100">
                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <Stethoscope size={16} className="opacity-50 mt-0.5" />
                  <div>
                    <span className="block font-medium">Dr. {admission.doctor_name}</span>
                    {admission.doctor_id && <span className="text-xs opacity-70">({admission.doctor_id.split('-')[0]}...)</span>}
                  </div>
                </div>

                <div className="flex items-start gap-2 text-sm text-slate-600">
                  <Building2 size={16} className="opacity-50 mt-0.5" />
                  <span className="block font-medium">{admission.department_name}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedAdmission(admission)}
                className="w-full bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 font-medium transition-colors"
              >
                Assign Bed
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
  )
}