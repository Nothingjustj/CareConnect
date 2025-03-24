'use client'
import { useState, useEffect } from 'react'
import type { DepartmentType } from '@/types'
import { createClient } from '@/utils/supabase/client'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Edit, Trash } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from 'sonner'

export default function DepartmentTypesPage() {
  const [departmentTypes, setDepartmentTypes] = useState<DepartmentType[]>([])
  const [newDepartmentType, setNewDepartmentType] = useState({
    name: '',
    description: ''
  })
  const [editingDepartment, setEditingDepartment] = useState<DepartmentType | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [departmentToDelete, setDepartmentToDelete] = useState<number | null>(null)
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
      toast.success("Department type added successfully")
      fetchDepartmentTypes()
    } catch (error) {
      setError((error as Error).message)
      toast.error(`Failed to add department type: ${(error as Error).message}`)
    }
  }

  const handleEdit = (department: DepartmentType) => {
    setEditingDepartment(department)
    setNewDepartmentType({
      name: department.name,
      description: department.description
    })
  }

  const handleUpdateDepartment = async () => {
    if (!editingDepartment) return
    
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from('department_types')
        .update({
          name: newDepartmentType.name,
          description: newDepartmentType.description
        })
        .eq('id', editingDepartment.id)
      
      if (error) throw error
      
      toast.success("Department type updated successfully")
      setEditingDepartment(null)
      setNewDepartmentType({ name: '', description: '' })
      fetchDepartmentTypes()
    } catch (error) {
      console.error("Error updating department:", error)
      toast.error(`Failed to update department: ${(error as Error).message}`)
    }
  }

  const handleDelete = async () => {
    if (!departmentToDelete) return
    
    const supabase = createClient();
    try {
      const { error } = await supabase
        .from('department_types')
        .delete()
        .eq('id', departmentToDelete)
      
      if (error) throw error
      
      toast.success("Department type deleted successfully")
      setDepartmentToDelete(null)
      setDeleteConfirmOpen(false)
      fetchDepartmentTypes()
    } catch (error) {
      console.error("Error deleting department:", error)
      toast.error(`Failed to delete department: ${(error as Error).message}`)
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
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            {/* Mobile view - cards */}
            <div className="md:hidden space-y-4">
              {departmentTypes.map((dept) => (
                <div key={dept.id} className="bg-white p-4 rounded-lg border shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{dept.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{dept.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEdit(dept)}
                    >
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        setDepartmentToDelete(dept.id);
                        setDeleteConfirmOpen(true);
                      }}
                    >
                      <Trash className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Desktop view - table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {departmentTypes.map((type) => (
                    <tr key={type.id}>
                      <td className="px-6 py-4 whitespace-nowrap">{type.name}</td>
                      <td className="px-6 py-4">{type.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleEdit(type)}
                          >
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={() => {
                              setDepartmentToDelete(type.id);
                              setDeleteConfirmOpen(true);
                            }}
                          >
                            <Trash className="h-4 w-4 mr-1" /> Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Edit Department Dialog */}
      {editingDepartment && (
        <Dialog open={!!editingDepartment} onOpenChange={(open) => !open && setEditingDepartment(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Department Type</DialogTitle>
              <DialogDescription>
                Update the department type details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={newDepartmentType.name}
                  onChange={(e) => setNewDepartmentType({ ...newDepartmentType, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={newDepartmentType.description}
                  onChange={(e) => setNewDepartmentType({ ...newDepartmentType, description: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingDepartment(null)}>Cancel</Button>
              <Button onClick={handleUpdateDepartment}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this department type? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}