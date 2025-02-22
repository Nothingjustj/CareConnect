"use client";

import { useEffect, useState } from "react";
import { AppSidebar } from "@/components/dashboard-sidebar";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";
import { getUserSession } from "@/actions/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setUser } from "@/store/userSlice";
import LoadingSpinner from "./loading-screen";
import { User } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role) {
      setLoading(false);
      return;
    }

    async function fetchUserRole() {
      const result = await getUserSession();

      if (!result?.user) {
        setLoading(false);
        return;
      }

      if (result.status === "success") {
        dispatch(
          setUser({
            id: result.user.id,
            name: result.name,
            email: result.email,
            role: result.role,
          })
        );
      }

      setLoading(false);
    }

    fetchUserRole();
  }, [user?.role, dispatch]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex min-h-screen">
        <SidebarProvider>
        <AppSidebar role={user?.role} />
        <main className="flex-1 p-3">
            <div className="flex items-center justify-between py-2">
              <SidebarTrigger />
              <span className="capitalize bg-secondary border border-primary/20 py-1 px-2 rounded-md text-primary text-sm flex items-center gap-1"><User className="w-4 h-4" />{user?.role}</span>
            </div>
            {children}
        </main>
        </SidebarProvider>       
    </div>
  );
}
