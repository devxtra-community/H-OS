'use client'

import { useRequestAdmission } from '@/src/features/admissions/hooks/useRequestAdmission'

export default function StaffQueueCard({ appointment }: any) {

  const requestAdmissionMutation = useRequestAdmission()

  const handleAdmit = () => {
    requestAdmissionMutation.mutate({
      patientId: appointment.patient_id,
      doctorId: appointment.doctor_id,
      departmentId: appointment.department_id
    })
  }

  return (

    <div className="border p-4 rounded flex justify-between items-center">

      <div>
        <div className="font-medium">
          Patient: {appointment.patient_name}
        </div>

        <div className="text-sm text-gray-500">
          Time: {appointment.appointment_time}
        </div>
      </div>

      <button
        onClick={handleAdmit}
        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
      >
        Admit Patient
      </button>

    </div>

  )
}