'use client'

import BedsBoard from '@/src/features/beds/components/BedsBoard'
import CreateWardForm from '@/src/features/admin/components/CreateWardForm'
import CreateRoomForm from '@/src/features/admin/components/CreateRoomForm'
import CreateBedForm from '@/src/features/admin/components/CreateBedForm'

export default function StaffBedsPage() {

  return (

    <div className="min-h-screen p-8 bg-gray-50 space-y-6">

      <h1 className="text-2xl font-semibold">
        Bed Management
      </h1>

      <BedsBoard />

    </div>

  )
}