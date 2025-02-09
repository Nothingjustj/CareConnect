"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { getUserSession } from "@/actions/auth";
import { createClient } from "@/utils/supabase/client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserRole() {

      const supabase = createClient();

      const result = await getUserSession();
      if (!result?.user) return;

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", result?.user.id)
        .single();

      if (!error && profile) {
        setRole(profile.role);
      }
      setLoading(false);
    }

    fetchUserRole();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen text-xl">
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    Loading...
    </div>;

  return (
    <div className="flex min-h-screen">
        <SidebarProvider>
        <AppSidebar role={role} />
        <main className="flex-1 p-6">
            <SidebarTrigger />
            {children}
        </main>
        </SidebarProvider>       
    </div>
  );
}
