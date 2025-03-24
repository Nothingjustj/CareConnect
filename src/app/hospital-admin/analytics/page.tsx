// src/app/hospital-admin/analytics/page.tsx
"use client";

import { useState, useEffect } from "react";
import AnalyticsDashboard from "@/components/analytics/dashboard";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function HospitalAnalyticsPage() {
  const [departments, setDepartments] = useState<{id: number, name: string}[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [hospitalId, setHospitalId] = useState<string | null>(null);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient();
        
        // Get admin's hospital ID
        const { data: adminData, error: adminError } = await supabase
          .from("admins")
          .select("hospital_id")
          .eq("id", user.id)
          .single();
        
        if (adminError) throw adminError;
        setHospitalId(adminData.hospital_id);
        
        // Fetch departments for this hospital
        const { data: hospitalDepts, error: deptsError } = await supabase
          .from("hospital_departments")
          .select(`
            department_type_id,
            department_types:department_type_id(id, name)
          `)
          .eq("hospital_id", adminData.hospital_id);
        
        if (deptsError) throw deptsError;
        
        // Transform the data
        const deptData = hospitalDepts.map(dept => {
          // Use type assertion to tell TypeScript what we know about the structure
          const deptTypes = dept.department_types as unknown as { id: number; name: string };
          
          return {
            id: dept.department_type_id,
            name: deptTypes.name || 'Unknown'
          };
        });

        setDepartments(deptData || []);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    if (user?.id) {
      fetchData();
    }
  }, [user]);

  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value === "all" ? null : parseInt(value));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Hospital Analytics</h1>
      
      <div className="w-full md:w-1/2">
        <Label htmlFor="department">Filter by Department</Label>
        <Select onValueChange={handleDepartmentChange} defaultValue="all">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {departments.map((department) => (
              <SelectItem key={department.id} value={department.id.toString()}>
                {department.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="overflow-hidden">
        <AnalyticsDashboard 
          hospitalId={hospitalId} 
          departmentId={selectedDepartment} 
        />
      </div>
    </div>
  );
}