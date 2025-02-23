'use client'
import { useState, useEffect } from 'react'
// import { supabase } from '@/lib/supabase'
import type { Hospital } from '@/types'
import { createClient } from '@/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const [newHospital, setNewHospital] = useState({
    name: '',
    address: '',
    contact_number: '',
    email: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchHospitals()
  }, [])

  async function fetchHospitals() {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .order('name')

      if (error) throw error
      setHospitals(data || [])
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from('hospitals')
        .insert([newHospital])

      if (error) throw error

      setNewHospital({ name: '', address: '', contact_number: '', email: '' })
      fetchHospitals()
    } catch (error) {
      setError((error as Error).message)
    }
  }

  return (
    <div className="space-y-6 px-2">
      <h1 className="text-2xl font-semibold mt-4">Hospitals Management</h1>

      {/* Add Hospital Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Add New Hospital</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              type="text"
              value={newHospital.name}
              onChange={(e) => setNewHospital({ ...newHospital, name: e.target.value })}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label>Address</Label>
            <Input
              type="text"
              value={newHospital.address}
              onChange={(e) => setNewHospital({ ...newHospital, address: e.target.value })}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label>Contact Number</Label>
            <Input
              type="text"
              value={newHospital.contact_number}
              onChange={(e) => setNewHospital({ ...newHospital, contact_number: e.target.value })}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={newHospital.email}
              onChange={(e) => setNewHospital({ ...newHospital, email: e.target.value })}
              className="mt-1"
              required
            />
          </div>
          <Button
            type="submit"
          >
            Add Hospital
          </Button>
        </form>
      </div>

      {/* Hospitals List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Hospitals List</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {hospitals.map((hospital) => (
                  <tr key={hospital.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{hospital.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{hospital.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{hospital.contact_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{hospital.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}