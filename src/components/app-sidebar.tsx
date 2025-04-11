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

const data = {
  user: {
    name: "John Smith",
    email: "john@vc.com",
    avatar: "/avatars/john.jpg",
  },
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
          url: "/founders/serial",
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
  ],
  navSecondary: [
    {
      title: "Documentation",
      url: "/docs",
      icon: BookMarked,
    },
    {
      title: "Notifications",
      url: "/notifications",
      icon: Bell,
    },
    {
      title: "Feedback",
      url: "/feedback",
      icon: Send,
    },
  ],
  projects: [
    {
      name: "Saved Searches",
      url: "/saved",
      icon: Star,
    },
    {
      name: "Deal Flow",
      url: "/deals",
      icon: Briefcase,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}

