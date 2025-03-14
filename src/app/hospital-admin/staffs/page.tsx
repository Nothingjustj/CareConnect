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
import { createClient } from "@/utils/supabase/client";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

type Admin = {
  id: string;
  name: string;
  email: string;
  department_id: string;
};

const ManageStaffs = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<any[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);

  // Local state for form inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);

  useEffect(() => {
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

    const fetchDepartmentAdmin = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("admins")
          .select("*")
          .eq("role", "department_admin");
        setAdmins(data as Admin[]);
        if (error) {
          setError(error.message);
        }
      } catch (error) {
        console.error(`Error fetching department admins: ${error}`);
        toast.error(`Error fetching department admins: ${error}`);
      }
    };

    fetchDepartments();
    fetchDepartmentAdmin();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!selectedDepartment) {
      toast.error("Please select a department.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("password", password);
    formData.set("department", selectedDepartment || "");

    try {
      const result = await signUpAsDeptAdmin(formData);
      if (result.status === "success") {
        toast.success("Department Admin created successfully");
        setName("");
        setEmail("");
        setPassword("");
        setSelectedDepartment(null);
        setError("");
      }
    } catch (error) {
      console.error("Error in handleSubmit (Manage Staffs): ", error);
      toast.error("Error in handleSubmit (Manage Staffs)");
    }

    setLoading(false);
  };

  return (
    <div className="px-2 py-6">
      <h1 className="text-2xl font-semibold mb-10">Manage Department Staffs</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {error && <p className="text-red-600 font-medium">{error}</p>}

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" placeholder="Tony Stark" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="deptadmin@rogisetu.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <div className="grid gap-2">
            <Label>Department:</Label>
            <Select onValueChange={(value) => setSelectedDepartment(value)} value={selectedDepartment || ""} required>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {departments.length > 0 ? (
                    departments.map((department_types) => (
                      <SelectItem key={department_types.id} value={department_types.id.toString()} className="truncate">
                        {department_types.name}
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

          <Button type="submit" className="w-full md:col-span-2" disabled={loading}>
            {loading ? "Adding..." : "Add Department Admins"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ManageStaffs;
