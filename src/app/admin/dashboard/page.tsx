"use client"

import { getUserSession } from '@/actions/auth'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const AdminDashboard = () => {

  const [user, setUser] = useState<any>("")
  const [userRole, setUserRole] = useState<any>("")

  const router = useRouter();
  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserSession();

      if (data?.status === "success") {
        setUser(data?.user);
        setUserRole(data?.role);
        
        if (userRole === "patient") {
          router.push("/dashboard");
        }
        else if (userRole === "department_admin") {
          router.push("/admin/dashboard");
        }
        else if (userRole === "super_admin") {
          router.push("/super-admin/dashboard");
        }
      }


    }

    fetchUser();
  }, [])


  return (
    <div className='p-6'>
      <h1 className="text-lg md:text-xl">Department Admin Dashboard</h1>
      <h2 className="text-xl md:text-3xl font-semibold mt-3">Welcome, <span className="font-bold">{user?.user_metadata?.name} 👋</span></h2>
    </div>
  )
}

export default AdminDashboard