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
import { useI18n } from "@/components/i18n/LanguageProvider";


const navItems = {
  patient: [
    { href: "/dashboard", label: "sidebar.patient.dashboard", icon: LayoutDashboardIcon },
    { href: "/dashboard/appointments", label: "sidebar.patient.my_appointments", icon: CalendarCheck2Icon },
    { href: "/dashboard/book-opd", label: "sidebar.patient.book_opd", icon: CalendarPlusIcon },
    { href: "/dashboard/track-opd", label: "sidebar.patient.track_opd", icon: ActivityIcon },
    { href: "/dashboard/account", label: "sidebar.patient.my_account", icon: UserCircleIcon },
  ],
  department_admin: [
    { href: "/admin/dashboard", label: "sidebar.dept.dashboard", icon: LayoutDashboardIcon },
    { href: "/admin/manage-tokens", label: "sidebar.dept.manage_tokens", icon: CoinsIcon },
    { href: "/admin/queue-status", label: "sidebar.dept.queue_status", icon: ListOrderedIcon },
    { href: "/admin/analytics", label: "sidebar.dept.analytics", icon: BarChart3Icon },
    { href: "/admin/account", label: "sidebar.dept.my_account", icon: UserCircleIcon },
  ],
  hospital_admin: [
    { href: "/hospital-admin/dashboard", label: "sidebar.hosp.dashboard", icon: LayoutDashboardIcon },
    { href: "/hospital-admin/departments", label: "sidebar.hosp.manage_departments", icon: Building2Icon },
    { href: "/hospital-admin/staffs", label: "sidebar.hosp.manage_staffs", icon: Users },
    { href: "/hospital-admin/analytics", label: "sidebar.hosp.analytics", icon: BarChart3Icon },
    { href: "/hospital-admin/account", label: "sidebar.hosp.my_account", icon: UserCircleIcon },
  ],
  super_admin: [
    { href: "/super-admin/dashboard", label: "sidebar.super.dashboard", icon: LayoutDashboardIcon },
    { href: "/super-admin/manage-hospitals", label: "sidebar.super.manage_hospitals", icon: HospitalIcon },
    { href: "/super-admin/manage-admins", label: "sidebar.super.manage_admins", icon: ShieldCheck },
    { href: "/super-admin/department-types", label: "sidebar.super.department_types", icon: Settings2Icon },
    { href: "/super-admin/analytics", label: "sidebar.super.view_analytics", icon: BarChart3Icon },
    { href: "/super-admin/account", label: "sidebar.super.my_account", icon: UserCircleIcon },
  ],
};


export function AppSidebar({ user, role }: { user: any; role: string | null}) {
  
  const items = navItems[role as keyof typeof navItems] || [];
  const { setOpenMobile } = useSidebar();
  const pathname = usePathname();
  const { t } = useI18n();
  
  return (
    <Sidebar> 
      <SidebarHeader>
        <Link href="/" className="p-2">
          <Image src="/logoCare.png" width={135} height={135} alt="logo" />
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
                <SidebarMenuItem className={`rounded-none rounded-tr-full rounded-br-full transition-all duration-150 ease-in-out ${isActive ? "bg-primary/10 text-primary border-l-[3px] border-l-primary pl-1.5" : "bg-none"}`} key={item.label}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href} onClick={() => setOpenMobile(false)}>  
                      <item.icon />
                      <span>{t(item.label)}</span>
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