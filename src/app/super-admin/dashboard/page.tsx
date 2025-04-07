// src/app/super-admin/dashboard/page.tsx
"use client"

import { RootState } from '@/store/store';
import React from 'react'
import { useSelector } from 'react-redux';
import AnalyticsSummaryCard from '@/components/analytics/summary-card';
import Link from 'next/link';
import { Hospital, Users } from 'lucide-react';

const SuperAdminDashboard = () => {
  const user = useSelector((state: RootState) => state.user);

  return (
    <main className='py-6 px-2'>
      <div className="text-xl md:text-3xl">
        <h1 className='mb-1 md:mb-2 font-semibold'>Welcome, <span className="font-bold">{user?.name}</span> 👋</h1>
        <h2 className='text-sm md:text-lg'>Super Admin Dashboard</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <AnalyticsSummaryCard linkTo="/super-admin/analytics" />
        {/* Other dashboard cards can go here */}
        <Link href="manage-hospitals" className="bg-muted p-4 rounded-xl border hover:border-primary">
            <Hospital className="text-primary w-10 h-10" />
            <h3 className="text-xl font-semibold mt-4">Manage Hospitals</h3>
            <p>Manage all hospitals in Mumbai</p>
        </Link>
        <Link href="manage-admins" className="bg-muted p-4 rounded-xl border hover:border-primary">
            <Users className="text-primary w-10 h-10" />
            <h3 className="text-xl font-semibold mt-4">Manage Hospital Admins</h3>
            <p>Manage hospital admins across all the hospitals</p>
        </Link>
        <Link href="department-types" className="bg-muted p-4 rounded-xl border hover:border-primary">
            <Hospital className="text-primary w-10 h-10" />
            <h3 className="text-xl font-semibold mt-4">Manage Department Types</h3>
            <p>Manage department types across all the hospitals</p>
        </Link>
      </div>
    </main>
  )
}

export default SuperAdminDashboard