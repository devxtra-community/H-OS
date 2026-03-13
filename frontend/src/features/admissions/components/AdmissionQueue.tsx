'use client'

import { useState } from 'react'
import { useAdmissions } from '../hooks/useAdmissions'
import AssignBedModal from './AssignBedModal'

export default function AdmissionQueue() {

  const { data, isLoading } = useAdmissions()

  const [selectedAdmission,setSelectedAdmission] = useState<any>(null)

  if (isLoading) {
    return <div>Loading admissions...</div>
  }

  if (!data?.length) {
    return (
      <div className="bg-white rounded shadow p-6">
        No pending admissions
      </div>
    )
  }

  return (

    <>
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
                Doctor: {admission.doctor_id}
              </div>

              <div className="text-sm text-gray-500">
                Department: {admission.department_id}
              </div>

            </div>

            <button
              onClick={()=>setSelectedAdmission(admission)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Assign Bed
            </button>

          </div>

        ))}

      </div>

      {selectedAdmission && (
        <AssignBedModal
          admission={selectedAdmission}
          onClose={()=>setSelectedAdmission(null)}
        />
      )}

    </>
  )
}