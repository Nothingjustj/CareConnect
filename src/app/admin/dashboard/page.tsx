"use client"

import { getUserSession } from '@/actions/auth'
import React, { useEffect, useState } from 'react'

const AdminDashboard = () => {

  const [user, setUser] = useState<any>("")
  const [userRole, setUserRole] = useState<any>("")

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getUserSession();

      if (data?.status === "success") {
        setUser(data?.user);
        setUserRole(data?.role);
      }
    }

    fetchUser();
  }, [])


  return (
    <div className='px-2 py-8'>
      <h1 className="text-xl md:text-3xl font-semibold mb-2">Welcome, <span className="font-bold">{user?.user_metadata?.name} 👋</span></h1>
      <h2 className="text-lg md:text-xl">Department Admin Dashboard</h2>
    </div>
  )
}

export default AdminDashboard