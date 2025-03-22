// src/app/hospital-admin/staffs/page.tsx (modified)

"use client";

import signUpAsDeptAdmin from "@/actions/auth";
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
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

type Admin = {
  id: string;
  name: string;
  email: string;
  department_id: number;
  phone_no?: string;
};

const ManageStaffs = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [hospitalDepartments, setHospitalDepartments] = useState<any[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState<string | null>(null);
  const [hospitalId, setHospitalId] = useState<string | null>(null);

  // Local state for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  // Get current user
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const fetchHospitalId = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("admins")
          .select("hospital_id")
          .eq("id", user.id)
          .single();
          
        if (error) throw error;
        
        if (data && data.hospital_id) {
          setHospitalId(data.hospital_id);
          fetchData(data.hospital_id);
        }
      } catch (error) {
        console.error("Error fetching hospital ID:", error);
        toast.error("Failed to fetch hospital information");
      }
    };
    
    if (user?.id) {
      fetchHospitalId();
    }
  }, [user]);

  const fetchData = async (hospitalId: string) => {
    await Promise.all([
      fetchDepartments(),
      fetchHospitalDepartments(hospitalId),
      fetchDepartmentAdmins(hospitalId)
    ]);
  };

  const fetchDepartments = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("department_types").select("*");

      if (error) {
        setError(error.message);
        return;
      }

      setDepartments(data || []);
    } catch (error) {
      console.error("Error in fetchDepartments:", error);
      toast.error(`Error in fetchDepartments: ${error}`);
    }
  };

  // src/app/hospital-admin/staffs/page.tsx (fix for fetching departments)

const fetchHospitalDepartments = async (hospitalId: string) => {
  try {
      const supabase = createClient();
      const { data, error } = await supabase
          .from("hospital_departments")
          .select(`
              id,
              department_type_id,
              department_types:department_type_id(id, name)
          `)
          .eq("hospital_id", hospitalId);

      if (error) {
          setError(error.message);
          return;
      }

      console.log("Hospital departments data:", data);

      // Transform the data to make it easier to use
      const transformedData = data.map(dept => ({
          id: dept.id,
          department_id: dept.department_type_id,
          name: dept.department_types ? (dept.department_types as any).name : `Department ${dept.department_type_id}`
      }));

      console.log("Transformed hospital departments:", transformedData);
      setHospitalDepartments(transformedData || []);
  } catch (error) {
      console.error("Error in fetchHospitalDepartments:", error);
      toast.error(`Error in fetchHospitalDepartments: ${error}`);
  }
};

  const fetchDepartmentAdmins = async (hospitalId: string) => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("admins")
        .select("*")
        .eq("role", "department_admin")
        .eq("hospital_id", hospitalId);
      
      if (error) {
        setError(error.message);
        return;
      }
      
      setAdmins(data as Admin[]);
    } catch (error) {
      console.error(`Error fetching department admins: ${error}`);
      toast.error(`Error fetching department admins: ${error}`);
    }
  };

// src/app/hospital-admin/staffs/page.tsx (fix for department ID handling)

// In the handleSubmit function:
const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  setLoading(true);

  if (!selectedDepartment || !hospitalId) {
      toast.error("Please select a department.");
      setLoading(false);
      return;
  }

  // Debug log to see what values we're sending
  console.log("Submitting department admin with:", {
      name,
      email,
      password,
      hospitalId,
      departmentId: selectedDepartment,
      phone: phoneNo
  });

  const formData = new FormData();
  formData.set("name", name);
  formData.set("email", email);
  formData.set("password", password);
  formData.set("hospitalId", hospitalId);
  formData.set("departmentId", selectedDepartment);
  if (phoneNo) formData.set("phone", phoneNo);

  try {
      const result = await signUpAsDeptAdmin(formData);
      console.log("Result from signUpAsDeptAdmin:", result);
      
      if (result.status === "success") {
          toast.success("Department Admin created successfully");
          setName("");
          setEmail("");
          setPassword("");
          setPhoneNo("");
          setSelectedDepartment(null);
          setError("");
          fetchDepartmentAdmins(hospitalId);
      } else {
          toast.error(result.status);
          setError(result.status);
      }
  } catch (error) {
      console.error("Error in handleSubmit (Manage Staffs): ", error);
      toast.error("Error in handleSubmit (Manage Staffs)");
      setError(error instanceof Error ? error.message : String(error));
  }

  setLoading(false);
};

  const handleEdit = (admin: Admin) => {
    setEditingAdmin(admin);
    setName(admin.name || "");
    setEmail(admin.email || "");
    setPhoneNo(admin.phone_no || "");
    setSelectedDepartment(admin.department_id?.toString() || null);
  };

  const handleUpdateAdmin = async () => {
    if (!editingAdmin || !selectedDepartment || !hospitalId) return;
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("admins")
        .update({
          name,
          phone_no: phoneNo,
          department_id: parseInt(selectedDepartment),
          updated_at: new Date().toISOString()
        })
        .eq("id", editingAdmin.id);
      
      if (error) throw error;
      
      toast.success("Department Admin updated successfully");
      setEditingAdmin(null);
      fetchDepartmentAdmins(hospitalId);
    } catch (error) {
      console.error("Error updating admin:", error);
      toast.error("Failed to update department admin");
    }
  };

  const handleDelete = async () => {
    if (!adminToDelete || !hospitalId) return;
    
    try {
      const supabase = createClient();
      
      // Delete from admins table
      const { error } = await supabase
        .from("admins")
        .delete()
        .eq("id", adminToDelete);
      
      if (error) throw error;
      
      toast.success("Department Admin deleted successfully");
      setAdminToDelete(null);
      setDeleteConfirmOpen(false);
      fetchDepartmentAdmins(hospitalId);
    } catch (error) {
      console.error("Error deleting admin:", error);
      toast.error("Failed to delete department admin");
    }
  };

  return (
    <div className="px-2 py-6">
      <h1 className="text-2xl font-semibold mb-10">Manage Department Staffs</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {error && <p className="text-red-600 font-medium">{error}</p>}

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input 
              id="name" 
              type="text" 
              placeholder="Tony Stark" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="deptadmin@rogisetu.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
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
              type="text"
              placeholder="1234567890"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Department:</Label>
            <Select 
              onValueChange={(value) => setSelectedDepartment(value)} 
              value={selectedDepartment || ""} 
              required
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {hospitalDepartments.length > 0 ? (
                    hospitalDepartments.map((department) => (
                      <SelectItem 
                        key={department.department_id} 
                        value={department.department_id.toString()} 
                        className="truncate"
                      >
                        {department.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="No department available" disabled>
                      No department available
                    </SelectItem>
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full md:col-span-2" 
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Department Admin"}
          </Button>
        </div>
      </form>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Department Admins</h2>
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
                  Department
                </th>
                <th className="px-4 py-2 border-b text-left whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => {
                const departmentName = departments.find(
                  (d) => d.id === admin.department_id
                )?.name || "Unknown Department";
                
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
                      {departmentName}
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
              <DialogTitle>Edit Department Admin
              </DialogTitle>
<DialogDescription>
  Update the department admin details below.
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
  <Label>Department</Label>
  <Select
    value={selectedDepartment || ""}
    onValueChange={(value) => setSelectedDepartment(value)}
  >
    <SelectTrigger>
      <SelectValue placeholder="Select department" />
    </SelectTrigger>
    <SelectContent>
      {hospitalDepartments.map((dept) => (
        <SelectItem key={dept.department_id} value={dept.department_id.toString()}>
          {dept.name}
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
Are you sure you want to delete this department admin? This action cannot be undone.
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

export default ManageStaffs;