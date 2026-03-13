'use client'

import { useState } from 'react'
import { useAssignBed } from '../hooks/useAssignBed'
import { useWards } from '../hooks/useWards'
import { useRooms } from '../hooks/useRooms'
import { useBeds } from '../hooks/useBeds'

export default function AssignBedModal({ admission, onClose }: any) {

  const [wardId, setWardId] = useState('')
  const [roomId, setRoomId] = useState('')
  const [bedId, setBedId] = useState('')

  const { data: wards = [] } = useWards()
  const { data: rooms = [] } = useRooms(wardId)
  const { data: beds = [] } = useBeds(roomId)

  const assignMutation = useAssignBed()

  const handleAssign = () => {

    assignMutation.mutate({
      admissionId: admission.id,
      patientId: admission.patient_id,
      bedId
    },{
      onSuccess(){
        onClose()
      }
    })

  }

  return (

    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

      <div className="bg-white p-6 rounded-xl w-96 space-y-4">

        <h2 className="text-lg font-semibold">
          Assign Bed
        </h2>

        {/* Ward */}

        <select
          className="w-full border p-2 rounded"
          value={wardId}
          onChange={(e)=>setWardId(e.target.value)}
        >
          <option value="">Select Ward</option>

          {wards.map((w:any)=>(
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}

        </select>

        {/* Room */}

        <select
          className="w-full border p-2 rounded"
          value={roomId}
          onChange={(e)=>setRoomId(e.target.value)}
          disabled={!wardId}
        >
          <option value="">Select Room</option>

          {rooms.map((r:any)=>(
            <option key={r.id} value={r.id}>
              Room {r.room_number}
            </option>
          ))}

        </select>

        {/* Bed */}

        <select
          className="w-full border p-2 rounded"
          value={bedId}
          onChange={(e)=>setBedId(e.target.value)}
          disabled={!roomId}
        >
          <option value="">Select Bed</option>

          {beds.map((b:any)=>(
            <option key={b.id} value={b.id}>
              Bed {b.bed_number}
            </option>
          ))}

        </select>

        <div className="flex justify-end gap-3">

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>

          <button
            onClick={handleAssign}
            disabled={!bedId}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Assign
          </button>

        </div>

      </div>

    </div>
  )
}