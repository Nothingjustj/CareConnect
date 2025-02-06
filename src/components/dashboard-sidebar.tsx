import { Calendar, ChevronUp, Home, Inbox, Search, Settings, User2 } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import Link from "next/link"
import Image from "next/image"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Logout from "./Logout"

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Book OPD",
    url: "/dashboard/book-opd",
    icon: Inbox,
  },
  {
    title: "Track OPD",
    url: "/dashboard/track-opd",
    icon: Calendar,
  },
]

const deptAdminItems = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },  
  {
    title: "Manage OPD",
    url: "/dashboard/manage-opd",
    icon: Inbox,
  },
  {
    title: "Update Counter",
    url: "/dashboard/update-counter",
    icon: Calendar,
  }
]

export async function AppSidebar() {

  const supabase = await createClient();

  const {data, error} = await supabase.auth.getUser();

  if(error || !data?.user) {
    redirect("/login")
  }

  const username = data?.user?.user_metadata?.name;
  const useremail = data?.user?.email;
  const role = data?.user?.user_metadata?.role;

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
          {/* <SidebarGroupLabel>Application</SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
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
                  <User2 /> {useremail}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Logout />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}