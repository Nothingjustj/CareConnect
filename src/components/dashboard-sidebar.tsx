"use client"

import { Building, Calendar, ChevronUp, Home, LogOut, User, User2, Users } from "lucide-react"

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
import { useDispatch, useSelector } from "react-redux"
import { clearUser } from "@/store/userSlice"
import { RootState } from "@/store/store"

const navItems = {
  patient: [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/appointments", label: "My Appointments", icon: Calendar },
    { href: "/dashboard/book-opd", label: "Book OPD", icon: Calendar },
    { href: "/dashboard/track-opd", label: "Track OPD", icon: Calendar },
  ],
  department_admin: [
    { href: "/admin/dashboard", label: "Admin Dashboard", icon: Home },
    { href: "/admin/manage-tokens", label: "Manage Tokens", icon: Users },
  ],
  super_admin: [
    { href: "/super-admin/dashboard", label: "Admin Dashboard", icon: Home },
    { href: "/super-admin/manage-hospitals", label: "Hospitals", icon: Building },
    { href: "/super-admin/manage-admins", label: "Manage Admins", icon: Users },
  ],
};


export function AppSidebar({ role }: { role: string | null }) {
  
  const items = navItems[role as keyof typeof navItems] || [];
  const { setOpenMobile } = useSidebar();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    toast.promise(signOut(), {
      loading: "Logging out..."
    })
    // setTimeout(() => dispatch(clearUser()), 2000);
    dispatch(clearUser());
  }
  

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/" className="p-2">
          <Image src="/logo.png" width={150} height={150} alt="logo" />
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href} onClick={() => setOpenMobile(false)}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
                <DropdownMenuItem className="flex items-center">
                  <User /> <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                  <LogOut /> <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}