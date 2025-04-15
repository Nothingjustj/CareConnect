import { Metadata } from "next";
import DashboardLayout from "@/components/dashboard-layout";

export const metadata: Metadata = {
    title: 'Dashboard',
    description: 'Simplifying Hospital OPD Management System',
}

export default function PatientDashboardLayout({children}: Readonly<{children: React.ReactNode}>) {

    return (
        <>
            <DashboardLayout>{children}</DashboardLayout>
        </>
    )
}