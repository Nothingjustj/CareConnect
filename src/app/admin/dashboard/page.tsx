// src/app/admin/dashboard/page.tsx
"use client"

import { RootState } from '@/store/store';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { createClient } from '@/utils/supabase/client';
import AnalyticsSummaryCard from '@/components/analytics/summary-card';

const AdminDashboard = () => {
  const user = useSelector((state: RootState) => state.user);
  const [hospitalId, setHospitalId] = useState<string | undefined>(undefined);
  const [departmentId, setDepartmentId] = useState<number | undefined>(undefined);
  const [adminDetails, setAdminDetails] = useState<{ hospital_id: string, department_id: number } | null>(null);

  useEffect(() => {
    const fetchAdminDetails = async () => {
      if (!user?.id) return;
      
      const supabase = createClient();
      const { data, error } = await supabase
        .from("admins")
        .select("hospital_id, department_id")
        .eq("id", user.id)
        .single();
        
        if (!error && data) {
          setHospitalId(data.hospital_id || null);
          setDepartmentId(data.department_id);
        }
    };
    
    fetchAdminDetails();
  }, [user]);

  return (
    <div className='py-6 px-2'>
      <h1 className="text-xl md:text-3xl font-semibold mb-1 md:mb-2">Welcome, <span className="font-bold">{user?.name} 👋</span></h1>
      <h2 className="md:text-xl">Department Admin Dashboard</h2>
      
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