'use client'

import { useDischargeRequests } from '../hooks/useDischargeRequests'
import { useDischargePatient } from '../hooks/useDischargePatient'
import { LogOut, Building, BedDouble } from 'lucide-react'

export default function DischargeRequests() {
  const { data, isLoading } = useDischargeRequests()
  const dischargeMutation = useDischargePatient()

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
        No discharge requests
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {data.map((req: any) => (
        <div
          key={req.id}
          className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-100 text-orange-600">
                <LogOut size={20} />
              </div>
              <div>
                <div className="font-bold text-slate-800">
                  {req.patient_name}
                </div>
                <div className="text-xs text-slate-400">
                  ID: {req.patient_id.split('-')[0]}...
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl p-4 flex gap-6 border border-slate-100">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Building size={16} className="opacity-50" />
                <span className="font-medium">{req.ward}</span>
              </div>

              <div className="flex items-center gap-2 text-sm text-slate-600">
                <BedDouble size={16} className="opacity-50" />
                <span className="font-medium">Bed {req.bed_number}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() =>
                dischargeMutation.mutate({
                  bedId: req.bed_id,
                  admissionId: req.id
                })
              }
              className="w-full bg-red-600 text-white px-4 py-2.5 rounded-xl hover:bg-red-700 font-medium transition-colors"
            >
              Complete Discharge
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}