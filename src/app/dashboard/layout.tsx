import { AppSidebar } from "@/components/dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Dashboard - RogiSetu',
    description: 'Simplifying Hospital OPD Management System',
}

export default function DashboardLayout({children}: Readonly<{children: React.ReactNode}>) {

    return (
        <>
            <SidebarProvider>
            <AppSidebar />
            <main className="w-full flex flex-col">
                <SidebarTrigger />
                {children}
            </main>
            </SidebarProvider>
        </>
    )
}