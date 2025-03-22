// src/app/super-admin/manage-admins/page.tsx (modified)

"use client";

import { createHospitalAdmin } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Edit, Trash } from "lucide-react";

type Admin = {
  id: string;
  name: string;
  email: string;
  hospital_id: string;
  phone_no?: string;
};

const ManageAdmins = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [hospitals, setHospitals] = useState<any[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null);

  // Local state for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchHospitals(), fetchHospitalAdmins()]);
  };

  const fetchHospitals = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("hospitals").select("*");

      if (error) {
        setError(error.message);
        return;
      }

      setHospitals(data || []);
    } catch (error) {
      console.error("Error in fetchHospitals:", error);
      toast.error(`Error in fetchHospitals: ${error}`);
    }
  };

  const fetchHospitalAdmins = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("admins")
        .select("*")
        .eq("role", "hospital_admin");
      
      if (error) {
        setError(error.message);
        return;
      }
      
      setAdmins(data as Admin[]);
    } catch (error) {
      console.error(`Error fetching hospital admins: ${error}`);
      toast.error(`Error fetching hospital admins: ${error}`);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!selectedHospital) {
      toast.error("Please select a hospital.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("password", password);
    formData.set("hospital", selectedHospital || "");

    try {
      const result = await createHospitalAdmin(formData);
      if (result.status === "success") {
        toast.success("Admin created successfully");

        // Clear form fields on success
        setName("");
        setEmail("");
        setPassword("");
        setPhoneNo("");
        setSelectedHospital(null);
        setError("");
        
        // Refresh admin list
        fetchHospitalAdmins();
      } else {
        toast.error(result.status);
      }
    } catch (error) {
      console.error("Error in handleSubmit (Manage Admins): ", error);
      toast.error("Error in handleSubmit (Manage Admins)");
    }

    setLoading(false);
  };

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setName(admin.name || "");
    setEmail(admin.email || "");
    setPhoneNo(admin.phone_no || "");
    setSelectedHospital(admin.hospital_id || null);
  };

  const handleUpdateAdmin = async () => {
    if (!editingAdmin || !selectedHospital) return;
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("admins")
        .update({
          name,
          phone_no: phoneNo,
          hospital_id: selectedHospital,
          updated_at: new Date().toISOString()
        })
        .eq("id", editingAdmin.id);
      
      if (error) throw error;
      
      toast.success("Admin updated successfully");
      setEditingAdmin(null);
      fetchHospitalAdmins();
    } catch (error) {
      console.error("Error updating admin:", error);
      toast.error("Failed to update admin");
    }
  };

  const handleDelete = async () => {
    if (!adminToDelete) return;
    
    try {
      const supabase = createClient();
      
      // First delete from admins table
      const { error } = await supabase
        .from("admins")
        .delete()
        .eq("id", adminToDelete);
      
      if (error) throw error;
      
      toast.success("Admin deleted successfully");
      setAdminToDelete(null);
      setDeleteConfirmOpen(false);
      fetchHospitalAdmins();
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast.error("Failed to delete admin");
    }
  };

  return (
    <div className="px-2 py-6">
      <h1 className="text-2xl font-semibold mb-10">Manage Hospital Admins</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-none md:grid-cols-2 gap-6">
          {error && <p className="text-red-600 font-medium">{error}</p>}

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="text"
              placeholder="1234567890"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Hospital:</Label>
            <Select
              onValueChange={(value) => setSelectedHospital(value)}
              value={selectedHospital || ""}
              required
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select hospital" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {hospitals.length > 0 ? (
                    hospitals.map((hospital) => (
                      <SelectItem
                        key={hospital.id}
                        value={hospital.id.toString()}
                        className="truncate"
                      >
                        {hospital.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="No hospital available" disabled>
                      No hospital available
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button
            type="submit"
            className="w-full col-span-2"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Adding...</span>
              </div>
            ) : (
              "Add Hospital Admin"
            )}
          </Button>
        </div>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Hospital Admins</h2>
        <div className="overflow-x-auto w-full">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b text-left whitespace-nowrap">
                  Name
                </th>
                <th className="px-4 py-2 border-b text-left whitespace-nowrap">
                  Email
                </th>
                <th className="px-4 py-2 border-b text-left whitespace-nowrap">
                  Phone
                </th>
                <th className="px-4 py-2 border-b text-left whitespace-nowrap">
                  Hospital
                </th>
                <th className="px-4 py-2 border-b text-left whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => {
                const hospitalName =
                  hospitals.find((h) => h.id.toString() === admin.hospital_id)
                    ?.name ?? "Unknown Hospital";
                return (
                  <tr key={admin.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b whitespace-nowrap">
                      {admin.name ?? "Unnamed Admin"}
                    </td>
                    <td className="px-4 py-2 border-b whitespace-nowrap">
                      {admin.email}
                    </td>
                    <td className="px-4 py-2 border-b whitespace-nowrap">
                      {admin.phone_no || "N/A"}
                    </td>
                    <td className="px-4 py-2 border-b whitespace-nowrap">
                      {hospitalName}
                    </td>
                    <td className="px-4 py-2 border-b whitespace-nowrap">
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(admin)}
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => {
                            setAdminToDelete(admin.id);
                            setDeleteConfirmOpen(true);
                          }}
                        >
                          <Trash className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Admin Dialog */}
      {editingAdmin && (
        <Dialog open={!!editingAdmin} onOpenChange={(open) => !open && setEditingAdmin(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Hospital Admin</DialogTitle>
              <DialogDescription>
                Update the hospital admin details below.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  value={email}
                  disabled
                  className="bg-gray-100"
                />
                <p className="text-xs text-muted-foreground">Email cannot be changed</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Phone Number</Label>
                <Input
                  id="edit-phone"
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label>Hospital</Label>
                <Select
                  value={selectedHospital || ""}
                  onValueChange={(value) => setSelectedHospital(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select hospital" />
                  </SelectTrigger>
                  <SelectContent>
                    {hospitals.map((hospital) => (
                      <SelectItem key={hospital.id} value={hospital.id}>
                        {hospital.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingAdmin(null)}>Cancel</Button>
              <Button onClick={handleUpdateAdmin}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this hospital admin? This action cannot be undone.
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
};

export default ManageAdmins;