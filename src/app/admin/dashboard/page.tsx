"use client"

import { getUserSession } from '@/actions/auth'
import { RootState } from '@/store/store'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

const AdminDashboard = () => {

  const user = useSelector((state: RootState) => state.user);

  // const [user, setUser] = useState<any>("")
  // const [userRole, setUserRole] = useState<any>("")

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const data = await getUserSession();

  //     if (data?.status === "success") {
  //       setUser(data?.user);
  //       setUserRole(data?.role);
  //     }
  //   }

  //   fetchUser();
  // }, [])


  return (
    <div className='py-6 px-2'>
      <h1 className="text-xl md:text-3xl font-semibold mb-1 md:mb-2">Welcome, <span className="font-bold">{user?.name} 👋</span></h1>
      <h2 className="md:text-xl">Department Admin Dashboard</h2>
    </div>
  )
}

export default AdminDashboard