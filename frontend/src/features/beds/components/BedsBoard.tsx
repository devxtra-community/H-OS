'use client'

import { useBeds } from '../hooks/useBeds'

export default function BedsBoard() {
  const { data, isLoading } = useBeds()

  if (isLoading) return <p>Loading beds...</p>

  return (
    <div className="grid gap-4">
      {data?.map((bed: any) => (
        <div
          key={bed.id}
          className="bg-white p-4 rounded shadow flex justify-between"
        >
          <div>
            <p className="font-medium">
              Ward: {bed.ward} | Room: {bed.room_number}
            </p>

            <p>Bed: {bed.bed_number}</p>
          </div>

          <span
            className={`px-3 py-1 rounded text-white ${
              bed.status === 'AVAILABLE'
                ? 'bg-green-500'
                : bed.status === 'OCCUPIED'
                ? 'bg-red-500'
                : 'bg-yellow-500'
            }`}
          >
            {bed.status}
          </span>
        </div>
      ))}
    </div>
  )
}