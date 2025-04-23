"use client" 

import { useRouter } from 'next/navigation'; 
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useState } from 'react';

// --- Authentication Library Check (Important!) ---
// If you are using an authentication library like NextAuth.js, Clerk, Supabase Auth, Auth0 etc.,
// you should use THEIR specific logout function (e.g., signOut() from NextAuth.js).
// Using the library's function is generally safer and handles session cleanup correctly.
// Example for NextAuth.js:
// import { signOut } from "next-auth/react";
// const handleLogout = () => signOut({ callbackUrl: '/login' });
// --------------------------------------------------


export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar();
  const router = useRouter(); // Initialize the router
  // --- Define the Logout Handler ---
  const handleLogout = async () => {
    try {
      // 1. Call your backend logout endpoint
      // Replace '/api/auth/logout' with your actual logout API route
      const response = await fetch('/auth/logout', {
        method: 'POST', // Or GET, depending on your API design
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Handle logout error (e.g., show a notification)
        console.error("Logout failed:", response.statusText);
        // Optionally, still try to redirect or clear local state
      }

      // 2. Clear any sensitive client-side state if needed (often not required if redirecting)
      // Example: localStorage.removeItem('userToken');

      // 3. Redirect to the login page (or home page)
      // Replace '/login' with your desired redirect path
      router.push('/auth/signin');
      // Use router.refresh() if you need to ensure fresh server data after redirect
      // router.refresh();

    } catch (error) {
      console.error("Error during logout:", error);
      // Handle unexpected errors (e.g., network issue)
    }
  };
  // -------------------------------------

  const handleAccountClick = () => {
    router.push('account/settings');
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {/* ... (rest of your trigger code) */}
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {(user.name.split(' ')[0]?.[0] + (user.name.split(' ').slice(-1)[0]?.[0] || '')).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {/* ... (rest of your dropdown content) */}
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {(user.name.split(' ')[0]?.[0] + (user.name.split(' ').slice(-1)[0]?.[0] || '')).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles className="mr-2 h-4 w-4" /> {/* Added spacing */}
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onSelect={handleAccountClick}>
                 <BadgeCheck className="mr-2 h-4 w-4" /> {/* Added spacing */}
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" /> {/* Added spacing */}
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" /> {/* Added spacing */}
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {/* --- Attach onClick handler here --- */}
            <DropdownMenuItem asChild>
              <form action="/auth/logout" method="post">
                <button type="submit" className="flex w-full items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </button>
              </form>
            </DropdownMenuItem>
            {/* ------------------------------------ */}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}