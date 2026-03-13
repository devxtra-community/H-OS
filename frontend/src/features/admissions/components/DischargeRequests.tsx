'use client'

import { useDischargeRequests } from '../hooks/useDischargeRequests'
import { useDischargePatient } from '../hooks/useDischargePatient'

export default function DischargeRequests() {

  const { data, isLoading } = useDischargeRequests()

  const dischargeMutation = useDischargePatient()

  if (isLoading) {
    return <div>Loading discharge requests...</div>
  }

  if (!data?.length) {
    return (
      <div className="bg-white rounded shadow p-6">
        No discharge requests
      </div>
    )
  }

  return (

    <div className="bg-white rounded shadow">

      {data.map((req:any)=>(
        <div
          key={req.id}
          className="flex justify-between items-center border-b p-4"
        >

          <div className="space-y-1">

            <div className="font-medium">
              Patient: {req.patient_id}
            </div>

            <div className="text-sm text-gray-500">
              Ward: {req.ward}
            </div>

            <div className="text-sm text-gray-500">
              Bed: {req.bed_number}
            </div>

          </div>

<button
  onClick={() =>
    dischargeMutation.mutate({
      bedId: req.bed_id,
      admissionId: req.id
    })
  }
  className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
>
  Discharge Patient
</button>

        </div>
      ))}

    </div>
  )
}