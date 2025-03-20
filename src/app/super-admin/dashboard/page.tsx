// src/app/super-admin/dashboard/page.tsx
"use client"

import { RootState } from '@/store/store';
import React from 'react'
import { useSelector } from 'react-redux';
import AnalyticsSummaryCard from '@/components/analytics/summary-card';

const SuperAdminDashboard = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <main className='py-6 px-2'>
      <div className="text-xl md:text-3xl">
        <h1>Welcome, <span className="font-bold">{user?.name}</span> 👋</h1>
        <h2 className='md:text-xl mt-2'>Super Admin Dashboard</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <AnalyticsSummaryCard linkTo="/super-admin/analytics" />
        {/* Other dashboard cards can go here */}
      </div>
    </main>
  )
}

export default SuperAdminDashboard