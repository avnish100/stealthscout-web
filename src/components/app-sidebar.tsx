"use client"

import * as React from "react"
import {
  Command,
  Users,
  Rocket,
  LineChart,
  Building2,
  Briefcase,
  Signal,
  Star,
  Settings2,
  BookMarked,
  Bell,
  Send,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Command,
      isActive: true,
      items: [
        {
          title: "Overview",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Talent Pool",
      url: "/talent",
      icon: Users,
      items: [
        {
          title: "Recent Updates",
          url: "/talent",
        },
        {
          title: "Search",
          url: "/talent/search",
        },
      ],
    },
    {
      title: "Founders",
      url: "/founders",
      icon: Rocket,
      items: [
        {
          title: "Top Prospects",
          url: "/founders/prospects",
        },
        {
          title: "Recent Exits",
          url: "/founders/exits",
        },
        {
          title: "Serial Founders",
          url: "/founders/repeat-founders",
        },
      ],
    },
    {
      title: "Companies",
      url: "/companies",
      icon: Building2,
      items: [
        {
          title: "Browse",
          url: "/companies/browse",
        },
        {
          title: "Talent Sources",
          url: "/companies/sources",
        },
        {
          title: "Industry Map",
          url: "/companies/map",
        },
      ],
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const supabase = createClient(); 
  const [user,setUser] = useState<{
    name: string | null
    email: string | null
    avatar: string | null
  }|null>(null);
  
  useEffect(() => {
    const fetchUser = async()=> {
      const { data: { user: supabaseUser } } = await supabase.auth.getUser()
      
      if (supabaseUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', supabaseUser.id)
          .single()

          console.log('profile', profile)

        setUser({
          name: profile?.full_name || 'User',
          email: supabaseUser.email || '',
          avatar: null
        })
      }
    }

    fetchUser()
  }, [supabase])

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/dashboard">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Rocket className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">StealthScout</span>
                  <span className="truncate text-xs text-primary">Talent Intelligence</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        {user && <NavUser user={user as { name: string; email: string; avatar: string }} />}
      </SidebarFooter>
    </Sidebar>
  )
}

