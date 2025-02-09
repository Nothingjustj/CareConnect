"use client"

import { getUserSession } from '@/actions/auth';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react'

const SuperAdminDashboard = () => {
  
      useEffect(() => {
        const fetchUser = async () => {
          const result = await getUserSession();
  
          if (!result || !result?.user) {
              redirect('/login');
          }
          
        }
  
        fetchUser();
      }, [])

  return (
    <div className="px-2 py-8 text-2xl">Welcome, <span className="font-medium">Super Admin</span> 👋</div>
  )
}

export default SuperAdminDashboard