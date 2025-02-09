import DashboardLayout from "@/components/dashboard-layout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Admin Dashboard - RogiSetu',
    description: 'Simplifying Hospital OPD Management System',
}

export default function AdminDashboardLayout({children}: Readonly<{children: React.ReactNode}>) {

    return (
        <>
            <DashboardLayout>{children}</DashboardLayout>
        </>
    )
}