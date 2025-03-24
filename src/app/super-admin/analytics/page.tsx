// src/app/super-admin/analytics/page.tsx
"use client";

import { useState, useEffect } from "react";
import AnalyticsDashboard from "@/components/analytics/dashboard";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createClient } from "@/utils/supabase/client";

export default function AnalyticsPage() {
  const [hospitals, setHospitals] = useState<{id: string, name: string}[]>([]);
  const [departments, setDepartments] = useState<{id: number, name: string}[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFilters() {
      try {
        const supabase = createClient();
        
        // Fetch hospitals
        const { data: hospitalData, error: hospitalError } = await supabase
          .from("hospitals")
          .select("id, name")
          .order("name");
        
        if (hospitalError) throw hospitalError;
        setHospitals(hospitalData || []);
        
        // Fetch department types
        const { data: departmentData, error: departmentError } = await supabase
          .from("department_types")
          .select("id, name")
          .order("name");
        
        if (departmentError) throw departmentError;
        setDepartments(departmentData || []);
        
      } catch (error) {
        console.error("Error fetching filters:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchFilters();
  }, []);

  const handleHospitalChange = (value: string) => {
    setSelectedHospital(value === "all" ? null : value);
  };
  
  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value === "all" ? null : parseInt(value));
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="hospital">Filter by Hospital</Label>
          <Select onValueChange={handleHospitalChange} defaultValue="all">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All Hospitals" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Hospitals</SelectItem>
              {hospitals.map((hospital) => (
                <SelectItem key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
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
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="overflow-hidden">
          <AnalyticsDashboard 
            hospitalId={selectedHospital} 
            departmentId={selectedDepartment} 
          />
        </div>
      )}
    </div>
  );
}