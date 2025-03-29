// src/app/admin/dashboard/page.tsx
"use client"

import { RootState } from '@/store/store';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { createClient } from '@/utils/supabase/client';
import AnalyticsSummaryCard from '@/components/analytics/summary-card';

const AdminDashboard = () => {
  // --- MODIFICATION START ---
  const user = useSelector((state: RootState) => state.user);
  const [hospitalId, setHospitalId] = useState<string | undefined>(undefined);
  const [hospitalName, setHospitalName] = useState<string | undefined>(undefined); // Added state for hospital name
  const [departmentId, setDepartmentId] = useState<number | undefined>(undefined);
  const [departmentName, setDepartmentName] = useState<string | undefined>(undefined); // Added state for department name
  const [adminDetails, setAdminDetails] = useState<{ hospital_id: string, department_id: number } | null>(null);
  const [loading, setLoading] = useState(true); // Added loading state

  useEffect(() => {
    const fetchAdminDetails = async () => {
      if (!user?.id) return;
      
      setLoading(true); // Start loading
      const supabase = createClient();
      const { data, error } = await supabase
        .from("admins")
        .select("hospital_id, department_id")
        .eq("id", user.id)
        .single();
        
        if (!error && data) {
          setHospitalId(data.hospital_id || null);
          setDepartmentId(data.department_id || null);

          // Fetch hospital name if hospital_id exists
          if (data.hospital_id) {
            const { data: hospData, error: hospError } = await supabase
              .from("hospitals")
              .select("name")
              .eq("id", data.hospital_id)
              .single();
            if (!hospError && hospData) {
              setHospitalName(hospData.name);
            }
          }

          // Fetch department name if department_id exists
          if (data.department_id) {
            const { data: deptData, error: deptError } = await supabase
              .from("department_types")
              .select("name")
              .eq("id", data.department_id)
              .single();
            if (!deptError && deptData) {
              setDepartmentName(deptData.name);
            }
          }
        }
      setLoading(false); // End loading
    };
    
    fetchAdminDetails();
  }, [user]);
  // --- MODIFICATION END ---

  return (
    <div className='py-6 px-2'>
      <h1 className="text-xl md:text-3xl font-semibold mb-1 md:mb-2">Welcome, <span className="font-bold">{user?.name} 👋</span></h1>
      {/* --- MODIFICATION START: Display Hospital and Dept Name --- */}
      <h2 className="md:text-xl text-muted-foreground">
        {loading ? "Loading details..." : 
          `${departmentName ? departmentName + ' Department' : 'Department Admin'} ${hospitalName ? 'at ' + hospitalName : ''}`
        }
      </h2>
      {/* --- MODIFICATION END --- */}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {hospitalId && departmentId && (
          <AnalyticsSummaryCard 
            hospitalId={hospitalId}
            departmentId={departmentId}
            linkTo="/admin/analytics" 
          />
        )}
        {/* Other dashboard cards can go here */}
      </div>
    </div>
  )
}

export default AdminDashboard