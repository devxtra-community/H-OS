'use client'

import { useState } from 'react'
import { useCreateWard } from '../hooks/useCreateWard'

export default function CreateWardForm() {

  const [name,setName] = useState('')
  const mutation = useCreateWard()

  const handleSubmit = () => {
    mutation.mutate({ name })
    setName('')
  }

  return (

    <div className="flex gap-2">

      <input
        value={name}
        onChange={(e)=>setName(e.target.value)}
        placeholder="Ward name"
        className="border p-2 rounded"
      />

      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create Ward
      </button>

    </div>

  )
}