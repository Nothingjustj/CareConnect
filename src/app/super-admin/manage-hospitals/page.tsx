"use client";
import { useState, useEffect } from "react";
import type { Hospital } from "@/types";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Edit, RefreshCcw, Trash } from "lucide-react";
import { AddHospitalBtn } from "@/components/add-hospital-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function HospitalsPage() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingHospital, setEditingHospital] = useState<Hospital | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [hospitalToDelete, setHospitalToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    contact_number: "",
    email: ""
  });

  useEffect(() => {
    fetchHospitals();
  }, []);

  async function fetchHospitals() {
    const supabase = createClient();
    
    const fetchPromise = new Promise(async (resolve, reject) => {
      try {
        const { data, error } = await supabase
          .from("hospitals")
          .select("*")
          .order("name");
  
        if (error) throw error;
        setHospitals(data || []);
        resolve("Hospitals fetched successfully");
      } catch (error) {
        setError((error as Error).message);
        reject(error);
      } finally {
        setLoading(false);
      }
    });
  
    toast.promise(fetchPromise, {
      loading: "Fetching hospitals...",
      success: "Hospitals loaded successfully!",
      error: "Failed to fetch hospitals. Please try again.",
    });
  }

  const handleEdit = (hospital: Hospital) => {
    setEditingHospital(hospital);
    setFormData({
      name: hospital.name || "",
      address: hospital.address || "",
      city: hospital.city || "",
      contact_number: hospital.contact_number || "",
      email: hospital.email || ""
    });
  };

  const handleUpdateHospital = async () => {
    if (!editingHospital) return;
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("hospitals")
        .update({
          name: formData.name,
          address: formData.address,
          city: formData.city,
          contact_number: formData.contact_number,
          email: formData.email
        })
        .eq("id", editingHospital.id);
      
      if (error) throw error;
      
      toast.success("Hospital updated successfully");
      setEditingHospital(null);
      fetchHospitals();
    } catch (error) {
      console.error("Error updating hospital:", error);
      toast.error("Failed to update hospital");
    }
  };

  const handleDelete = async () => {
    if (!hospitalToDelete) return;
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("hospitals")
        .delete()
        .eq("id", hospitalToDelete);
      
      if (error) throw error;
      
      toast.success("Hospital deleted successfully");
      setHospitalToDelete(null);
      setDeleteConfirmOpen(false);
      fetchHospitals();
    } catch (error) {
      console.error("Error deleting hospital:", error);
      toast.error("Failed to delete hospital");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="px-2 my-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Manage Hospitals</h1>
          <p className="text-muted-foreground">
            Here is the list of govt hospitals currently present in Mumbai
          </p>
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex items-center gap-2">
          <Button size={"sm"} variant={"outline"} onClick={fetchHospitals}>
            <RefreshCcw className="h-4 w-4 mr-1" /> Refresh
          </Button>
          <AddHospitalBtn />
        </div>
      </div>

      {/* Mobile view - cards */}
      <div className="md:hidden space-y-4">
        {hospitals.map((hospital) => (
          <div key={hospital.id} className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{hospital.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{hospital.address}, {hospital.city}</p>
                {hospital.contact_number && (
                  <p className="text-sm mt-1">
                    <span className="text-muted-foreground">Contact:</span> {hospital.contact_number}
                  </p>
                )}
                {hospital.email && (
                  <p className="text-sm">
                    <span className="text-muted-foreground">Email:</span> {hospital.email}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1"
                onClick={() => handleEdit(hospital)}
              >
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="flex-1"
                onClick={() => {
                  setHospitalToDelete(hospital.id);
                  setDeleteConfirmOpen(true);
                }}
              >
                <Trash className="h-4 w-4 mr-1" /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop view - data table */}
      <div className="hidden md:block">
      <DataTable 
  columns={[
    ...columns.filter(col => col.id !== "actions"), // Filter out any existing actions column
    {
      id: "custom_actions", // Use a unique ID
      header: "Actions",
      cell: ({ row }) => {
        const hospital = row.original;
        return (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => handleEdit(hospital as any)}
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
            <Button 
              variant="destructive" 
              size="sm" 
              onClick={() => {
                setHospitalToDelete(hospital.id);
                setDeleteConfirmOpen(true);
              }}
            >
              <Trash className="h-4 w-4 mr-1" /> Delete
            </Button>
          </div>
        );
      }
    }
  ]} 
  data={hospitals} 
/>

      </div>

      {/* Edit Hospital Dialog */}
      {editingHospital && (
        <Dialog open={!!editingHospital} onOpenChange={(open) => !open && setEditingHospital(null)}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Hospital</DialogTitle>
              <DialogDescription>
                Update the hospital details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Hospital Name</Label>
                <Input
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-address">Address</Label>
                <Textarea
                  id="edit-address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-city">City</Label>
                <Input
                  id="edit-city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-contact">Contact Number</Label>
                <Input
                  id="edit-contact"
                  name="contact_number"
                  value={formData.contact_number}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingHospital(null)}>Cancel</Button>
              <Button onClick={handleUpdateHospital}>Save Changes</Button>
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
              Are you sure you want to delete this hospital? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}