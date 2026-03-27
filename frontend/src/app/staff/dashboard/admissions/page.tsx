'use client'

import AdmissionQueue from '@/src/features/admissions/components/AdmissionQueue'

export default function StaffAdmissionsPage() {

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      <h1 className="text-2xl font-semibold mb-6">
        Admissions
      </h1>

      <AdmissionQueue />

    </div>
  )
}