'use client'
import { useState, useEffect } from 'react'
import type { DepartmentType } from '@/types'
import { createClient } from '@/utils/supabase/client'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default function DepartmentTypesPage() {
  const [departmentTypes, setDepartmentTypes] = useState<DepartmentType[]>([])
  const [newDepartmentType, setNewDepartmentType] = useState({
    name: '',
    description: ''
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchDepartmentTypes()
  }, [])

  async function fetchDepartmentTypes() {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('department_types')
        .select('*')
        .order('name')

      if (error) throw error
      setDepartmentTypes(data || [])
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
        .from('department_types')
        .insert([newDepartmentType])

      if (error) throw error

      setNewDepartmentType({ name: '', description: '' })
      fetchDepartmentTypes()
    } catch (error) {
      setError((error as Error).message)
    }
  }

  return (
    <div className="space-y-6 px-2">
      <h1 className="text-2xl font-semibold mt-4">Department Types Management</h1>

      {/* Add Department Type Form */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Add New Department Type</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              type="text"
              value={newDepartmentType.name}
              onChange={(e) => setNewDepartmentType({ ...newDepartmentType, name: e.target.value })}
              className="mt-1"
              required
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={newDepartmentType.description}
              onChange={(e) => setNewDepartmentType({ ...newDepartmentType, description: e.target.value })}
              className="mt-1"
              rows={3}
              required
            />
          </div>
          <Button
            type="submit"
          >
            Add Department Type
          </Button>
        </form>
      </div>

      {/* Department Types List */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-medium mb-4">Department Types List</h2>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {departmentTypes.map((type) => (
                  <tr key={type.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{type.name}</td>
                    <td className="px-6 py-4">{type.description}</td>
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