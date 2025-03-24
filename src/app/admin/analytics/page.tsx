// src/app/admin/analytics/page.tsx
"use client";

import { useState, useEffect } from "react";
import AnalyticsDashboard from "@/components/analytics/dashboard";
import { createClient } from "@/utils/supabase/client";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function DepartmentAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [hospitalId, setHospitalId] = useState<string | null>(null);
  const [departmentId, setDepartmentId] = useState<number | null>(null);
  const user = useSelector((state: RootState) => state.user);

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient();
        
        // Get admin's hospital and department ID
        const { data: adminData, error: adminError } = await supabase
          .from("admins")
          .select("hospital_id, department_id")
          .eq("id", user.id)
          .single();
        
        if (adminError) throw adminError;
        setHospitalId(adminData.hospital_id);
        setDepartmentId(adminData.department_id);
        
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Department Analytics</h1>
      
      <div className="overflow-hidden">
        <AnalyticsDashboard 
          hospitalId={hospitalId} 
          departmentId={departmentId} 
        />
      </div>
    </div>
  );
}