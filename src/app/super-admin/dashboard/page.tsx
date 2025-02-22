"use client"

import { getUserSession } from '@/actions/auth';
import { RootState } from '@/store/store';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux';

const SuperAdminDashboard = () => {

  const user = useSelector((state: RootState) => state.user);
  
      // useEffect(() => {
      //   const fetchUser = async () => {
      //     const result = await getUserSession();
  
      //     if (!result || !result?.user) {
      //         redirect('/login');
      //     }
          
      //   }
  
      //   fetchUser();
      // }, [])

  return (
    <main className='py-6 px-2'>
      <div className="text-xl md:text-3xl">
        <h1>Welcome, <span className="font-bold">{user?.name}</span> 👋</h1>
        <h2 className='md:text-xl mt-2'>Super Admin Dashboard</h2>
      </div>
    </main>
  )
}

export default SuperAdminDashboard