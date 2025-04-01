// src/components/dashboard-sidebar.tsx
"use client"

import { Building, Calendar, ChartPie, ChevronUp, Home, LogOut, User, User2, Users } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { signOut } from "@/actions/auth"
import { toast } from "sonner"
import { useDispatch } from "react-redux"
import { clearUser } from "@/store/userSlice"
import { usePathname, useRouter } from "next/navigation"

// In src/components/dashboard-sidebar.tsx

// Update the navItems object
const navItems = {
  patient: [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/appointments", label: "My Appointments", icon: Calendar },
    { href: "/dashboard/book-opd", label: "Book OPD", icon: Calendar },
    { href: "/dashboard/track-opd", label: "Track OPD", icon: Calendar },
    { href: "/dashboard/account", label: "My Account", icon: User },
  ],
  department_admin: [
    { href: "/admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin/manage-tokens", label: "Manage Tokens", icon: Users },
    { href: "/admin/queue-status", label: "Queue Status", icon: Users },
    { href: "/admin/analytics", label: "Analytics", icon: ChartPie }, // Add analytics link
    { href: "/admin/account", label: "My Account", icon: User },
  ],
  hospital_admin: [
    { href: "/hospital-admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/hospital-admin/departments", label: "Manage Departments", icon: Users },
    { href: "/hospital-admin/staffs", label: "Manage Staffs", icon: Users },
    { href: "/hospital-admin/analytics", label: "Analytics", icon: ChartPie }, // Add analytics link
    { href: "/hospital-admin/account", label: "My Account", icon: User },
  ],
  super_admin: [
    { href: "/super-admin/dashboard", label: "Dashboard", icon: Home },
    { href: "/super-admin/manage-hospitals", label: "Manage Hospitals", icon: Building },
    { href: "/super-admin/manage-admins", label: "Manage Admins", icon: Users },
    { href: "/super-admin/department-types", label: "Department Types", icon: Users },
    { href: "/super-admin/analytics", label: "View Analytics", icon: ChartPie },
    { href: "/super-admin/account", label: "My Account", icon: User },
  ],
};


export function AppSidebar({ user, role }: { user: any; role: string | null}) {
  
  const items = navItems[role as keyof typeof navItems] || [];
  const { setOpenMobile } = useSidebar();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    try {
      toast.promise(signOut(), {
        loading: "Logging out...",
        success: "Logged out successfully",
        error: "Logout failed",
      });
  
      dispatch(clearUser());
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
  

  return (
    <Sidebar> 
      <SidebarHeader>
        <Link href="/" className="p-2">
          <Image src="/logo.png" width={135} height={135} alt="logo" />
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                <SidebarMenuItem className={`rounded-md ${isActive ? "bg-primary/10 text-primary" : "bg-none"}`} key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href} onClick={() => setOpenMobile(false)}>  
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )})}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> <span className="truncate">{user?.email || "Loading..."}</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem asChild className="flex items-center">
                  <Link href={
                    !user?.role 
                      ? '/login'
                      : user.role === 'patient'
                        ? '/dashboard/account'
                        : user.role === 'department_admin'
                          ? '/admin/account'
                          : user.role === 'hospital_admin'
                            ? '/hospital-admin/account'
                            : user.role === 'super_admin'
                              ? '/super-admin/account'
                              : '/login'
                  }>
                    <User className="mr-2 h-4 w-4" /> <span>My Account</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                  <LogOut className="mr-2 h-4 w-4" /> <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}