"use client"

import { ActivityIcon, BarChart3Icon, Building2Icon, CalendarCheck2Icon, CalendarPlusIcon, CoinsIcon, HospitalIcon, LayoutDashboardIcon, ListOrderedIcon, Settings2Icon, ShieldCheck, TicketIcon, UserCircleIcon, Users } from "lucide-react"

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
import { usePathname } from "next/navigation"
import { NavUser } from "./nav-menu"


const navItems = {
  patient: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
    { href: "/dashboard/appointments", label: "My Appointments", icon: CalendarCheck2Icon },
    { href: "/dashboard/book-opd", label: "Book OPD", icon: CalendarPlusIcon },
    { href: "/dashboard/track-opd", label: "Track OPD", icon: ActivityIcon },
    { href: "/dashboard/account", label: "My Account", icon: UserCircleIcon },
  ],
  department_admin: [
    { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
    { href: "/admin/manage-tokens", label: "Manage Tokens", icon: CoinsIcon },
    { href: "/admin/queue-status", label: "Queue Status", icon: ListOrderedIcon },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart3Icon },
    { href: "/admin/account", label: "My Account", icon: UserCircleIcon },
  ],
  hospital_admin: [
    { href: "/hospital-admin/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
    { href: "/hospital-admin/departments", label: "Manage Departments", icon: Building2Icon },
    { href: "/hospital-admin/staffs", label: "Manage Staffs", icon: Users },
    { href: "/hospital-admin/analytics", label: "Analytics", icon: BarChart3Icon },
    { href: "/hospital-admin/account", label: "My Account", icon: UserCircleIcon },
  ],
  super_admin: [
    { href: "/super-admin/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
    { href: "/super-admin/manage-hospitals", label: "Manage Hospitals", icon: HospitalIcon },
    { href: "/super-admin/manage-admins", label: "Manage Admins", icon: ShieldCheck },
    { href: "/super-admin/department-types", label: "Department Types", icon: Settings2Icon },
    { href: "/super-admin/analytics", label: "View Analytics", icon: BarChart3Icon },
    { href: "/super-admin/account", label: "My Account", icon: UserCircleIcon },
  ],
};


export function AppSidebar({ user, role }: { user: any; role: string | null}) {
  
  const items = navItems[role as keyof typeof navItems] || [];
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();
  
  return (
    <Sidebar> 
      <SidebarHeader>
        <Link href="/" className="p-2">
          <Image src="/logo.png" width={135} height={135} alt="logo" />
        </Link>
      </SidebarHeader>
      {/* <SidebarSeparator /> */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                <SidebarMenuItem className={`rounded-none rounded-tr-full rounded-br-full transition-all duration-150 ease-in-out ${isActive ? "bg-primary/10 text-primary border-l-[3px] border-l-primary pl-1" : "bg-none"}`} key={item.label}>
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
      {/* <SidebarSeparator /> */}
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}