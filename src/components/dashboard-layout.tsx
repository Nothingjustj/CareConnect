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
