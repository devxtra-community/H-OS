'use client'

import { useState, useMemo } from 'react'
import { useBeds } from '../hooks/useBeds'
import { BedDouble, Building, Hash, Filter } from 'lucide-react'

export default function BedsBoard() {
  const { data, isLoading } = useBeds()

  const [selectedWard, setSelectedWard] = useState<string>('All')
  const [selectedRoom, setSelectedRoom] = useState<string>('All')

  // Extract unique wards and rooms for the dropdowns
  const { wards, rooms } = useMemo(() => {
    if (!data) return { wards: [], rooms: [] }

    // Set object ensures uniqueness
    const uniqueWards = Array.from(new Set(data.map((b: any) => b.ward))) as string[]

    // If a specific ward is selected, only show rooms for that ward
    let filteredForRooms = data
    if (selectedWard !== 'All') {
      filteredForRooms = data.filter((b: any) => b.ward === selectedWard)
    }
    const uniqueRooms = Array.from(new Set(filteredForRooms.map((b: any) => b.room_number))) as string[]

    return { wards: uniqueWards.sort(), rooms: uniqueRooms.sort() }
  }, [data, selectedWard])

  // Handle ward change: reset room if the new ward doesn't have the selected room
  const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newWard = e.target.value
    setSelectedWard(newWard)
    setSelectedRoom('All') // Reset room selection when ward changes
  }

  // Filter the actual bed data
  const filteredBeds = useMemo(() => {
    if (!data) return []
    return data.filter((bed: any) => {
      const matchWard = selectedWard === 'All' || bed.ward === selectedWard
      const matchRoom = selectedRoom === 'All' || bed.room_number === selectedRoom
      return matchWard && matchRoom
    })
  }, [data, selectedWard, selectedRoom])

  if (isLoading) return (
    <div className="flex justify-center p-8">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
    </div>
  )

  if (!data?.length) {
    return (
      <div className="bg-white rounded-2xl border shadow-sm p-6 text-slate-500 text-center">
        No beds configured yet.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 🔴 Filter Controls */}
      <div className="bg-white rounded-2xl border shadow-sm p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-2 text-slate-700 font-semibold mr-2">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <Filter size={20} />
          </div>
          Filter Beds
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Ward:</label>
          <select
            value={selectedWard}
            onChange={handleWardChange}
            className="border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px] bg-slate-50"
          >
            <option value="All">All Wards</option>
            {wards.map((w: string) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-600">Room:</label>
          <select
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            className="border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px] bg-slate-50"
            disabled={selectedWard === 'All' && rooms.length === 0}
          >
            <option value="All">All Rooms</option>
            {rooms.map((r: string) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        <div className="ml-auto text-sm font-medium px-4 py-2 bg-slate-100 text-slate-600 rounded-xl">
          Showing {filteredBeds.length} bed{filteredBeds.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* 🛏️ Bed Grid */}
      {filteredBeds.length === 0 ? (
        <div className="bg-white rounded-2xl border shadow-sm p-8 text-center text-slate-500 font-medium">
          No beds found matching the selected filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredBeds.map((bed: any) => (
            <div
              key={bed.id}
              className="bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${bed.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-600' :
                      bed.status === 'OCCUPIED' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'
                    }`}>
                    <BedDouble size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Bed {bed.bed_number}</h3>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 text-xs font-semibold rounded-full ${bed.status === 'AVAILABLE'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : bed.status === 'OCCUPIED'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                >
                  {bed.status}
                </span>
              </div>

              <div className="space-y-2 mt-2 border-t border-slate-100 pt-4">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Building size={16} className="opacity-50" />
                  <span className="font-medium">Ward: {bed.ward}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Hash size={16} className="opacity-50" />
                  <span className="font-medium">Room: {bed.room_number}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}