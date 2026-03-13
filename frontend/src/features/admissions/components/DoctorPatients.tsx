'use client'

import { useDoctorAdmissions } from '../hooks/useDoctorAdmissions'
import { useRequestDischarge } from '../hooks/useRequestDischarge'

export default function DoctorPatients() {

  const { data, isLoading } = useDoctorAdmissions()

  const dischargeMutation = useRequestDischarge()

  if (isLoading) {
    return <div>Loading patients...</div>
  }

  if (!data?.length) {
    return (
      <div className="bg-white rounded shadow p-6">
        No admitted patients
      </div>
    )
  }

  return (

    <div className="bg-white rounded shadow">

      {data.map((admission:any)=>(
        <div
          key={admission.id}
          className="flex justify-between items-center border-b p-4"
        >

          <div className="space-y-1">

            <div className="font-medium">
              Patient: {admission.patient_id}
            </div>

            <div className="text-sm text-gray-500">
              Ward: {admission.ward}
            </div>

            <div className="text-sm text-gray-500">
              Bed: {admission.bed_number}
            </div>

          </div>

          <button
            onClick={() => dischargeMutation.mutate(admission.id)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Discharge
          </button>

        </div>
      ))}

    </div>
  )
}