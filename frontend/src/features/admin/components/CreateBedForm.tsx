'use client'

import { useState } from 'react'
import { useCreateBed } from '../hooks/useCreateBed'
import { useQuery } from '@tanstack/react-query'
import { getWards, getRooms } from '../api/beds.api'

export default function CreateBedForm() {

  const [wardId, setWardId] = useState('')
  const [roomId, setRoomId] = useState('')
  const [bedNumber, setBedNumber] = useState('')

  const mutation = useCreateBed()

  const { data: wards } = useQuery({
    queryKey: ['wards'],
    queryFn: getWards
  })

  const { data: rooms } = useQuery({
    queryKey: ['rooms', wardId],
    queryFn: () => getRooms(wardId),
    enabled: !!wardId
  })

  const handleSubmit = async () => {

    if (!roomId || !bedNumber) return

    try {
      await mutation.mutateAsync({
        roomId,
        bedNumber
      })

      alert('✅ Bed created successfully')

      setBedNumber('')
      setRoomId('')
      setWardId('')

    } catch {
      alert('❌ Failed to create bed')
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-3">

      <h3 className="font-semibold text-lg">Create Bed</h3>

      {/* Ward dropdown */}
      <select
        value={wardId}
        onChange={(e) => {
          setWardId(e.target.value)
          setRoomId('')
        }}
        className="border p-2 rounded w-full"
      >
        <option value="">Select Ward</option>

        {wards?.map((ward: any) => (
          <option key={ward.id} value={ward.id}>
            {ward.name}
          </option>
        ))}

      </select>

      {/* Room dropdown */}
      <select
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        className="border p-2 rounded w-full"
        disabled={!wardId}
      >
        <option value="">Select Room</option>

        {rooms?.map((room: any) => (
          <option key={room.id} value={room.id}>
            Room {room.room_number}
          </option>
        ))}

      </select>

      <input
        value={bedNumber}
        onChange={(e) => setBedNumber(e.target.value)}
        placeholder="Bed Number"
        className="border p-2 rounded w-full"
      />

      <button
        onClick={handleSubmit}
        className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700"
      >
        Create Bed
      </button>

    </div>
  )
}