"use client"

import { usePathname } from "next/navigation"
import { SidebarIcon, Filter, Download } from "lucide-react"

import { SearchForm } from "@/components/search-form"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"

const routeConfig: Record<string, { title: string, parent?: string }> = {
  "/dashboard": { title: "Dashboard" },
  "/talent": { title: "Talent", parent: "Talent Intelligence" },
  "/companies": { title: "Companies", parent: "Talent Intelligence" },
  "/talent/search": {title:"Talent Search", parent: "Talent Intelligence"},
  "/founders": { title: "Founders"},
  "/founders/repeat-founders": { title: "Serial Founders", parent: "Founders" },
  "/account/settings": { title: "Account Settings", parent: "Account" },
  "/account": { title: "Account" },
  // Add more routes as needed
}

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  const pathname = usePathname()
  
  const currentRoute = routeConfig[pathname] || { title: "Not Found" }

  return (
    <header className="bg-background/80 sticky top-0 z-50 flex w-full items-center border-b backdrop-blur-sm supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-(--header-height) w-full items-center gap-2 px-4">
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            {currentRoute.parent && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">
                    {currentRoute.parent}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage>{currentRoute.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        
      </div>
    </header>
  )
}
