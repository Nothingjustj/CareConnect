import DashboardLayout from "@/components/dashboard-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Hospital Admin Dashboard',
    description: 'Simplifying Hospital OPD Management System',
}

export default function HospitalAdminLayout ({children}: {children: React.ReactNode}) {
    return (
        <DashboardLayout>{children}</DashboardLayout>
    )
}