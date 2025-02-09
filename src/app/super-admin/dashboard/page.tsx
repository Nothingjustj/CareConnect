"use client"

import { getUserSession } from '@/actions/auth';
import { redirect, useRouter } from 'next/navigation';
import React, { useEffect } from 'react'

const SuperAdminDashboard = () => {

  const router = useRouter();
  
      useEffect(() => {
        const fetchUser = async () => {
          const result = await getUserSession();
  
          if (result?.status === "success") {
              if (result.role === "patient") {
                  router.push("/dashboard");
              }
              else if (result.role === "department_admin") {
                  router.push("/admin/dashboard");
              }
              else if (result.role === "super_admin") {
                  router.push("/super-admin/dashboard");
              }
          }
  
          if (!result || !result?.user) {
              redirect('/login');
          }
          
        }
  
        fetchUser();
      }, [])

  return (
    <div>SuperAdminDashboard</div>
  )
}

export default SuperAdminDashboard