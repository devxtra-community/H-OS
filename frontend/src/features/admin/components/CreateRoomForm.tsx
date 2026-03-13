'use client'

import { useState } from 'react'
import { useCreateRoom } from '../hooks/useCreateRoom'
import { useQuery } from '@tanstack/react-query'
import { getWards } from '../api/beds.api'

export default function CreateRoomForm() {

  const [wardId, setWardId] = useState('')
  const [roomNumber, setRoomNumber] = useState('')

  const mutation = useCreateRoom()

  const { data: wards } = useQuery({
    queryKey: ['wards'],
    queryFn: getWards
  })

  const handleSubmit = async () => {

    if (!wardId || !roomNumber) return

    try {
      await mutation.mutateAsync({
        wardId,
        roomNumber
      })

      alert('✅ Room created successfully')

      setRoomNumber('')
      setWardId('')

    } catch {
      alert('❌ Failed to create room')
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-3">

      <h3 className="font-semibold text-lg">Create Room</h3>

      <select
        value={wardId}
        onChange={(e) => setWardId(e.target.value)}
        className="border p-2 rounded w-full"
      >
        <option value="">Select Ward</option>

        {wards?.map((ward: any) => (
          <option key={ward.id} value={ward.id}>
            {ward.name}
          </option>
        ))}

      </select>

      <input
        value={roomNumber}
        onChange={(e) => setRoomNumber(e.target.value)}
        placeholder="Room Number"
        className="border p-2 rounded w-full"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
      >
        Create Room
      </button>

    </div>
  )
}