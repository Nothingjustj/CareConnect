import { AppSidebar } from "@/components/dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Metadata } from "next";
import DashboardLayout from "@/components/dashboard-layout";

export const metadata: Metadata = {
    title: 'Dashboard - RogiSetu',
    description: 'Simplifying Hospital OPD Management System',
}

export default function PatientDashboardLayout({children}: Readonly<{children: React.ReactNode}>) {

    return (
        <>
            <DashboardLayout>{children}</DashboardLayout>
        </>
    )
}