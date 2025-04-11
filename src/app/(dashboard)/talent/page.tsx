"use client"

import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import { createClient } from "@/lib/supabase/client"
import { ExternalLink } from "lucide-react"
import { useTheme } from "next-themes"

// Initialize Supabase client
const supabase = createClient()

interface Role {
  title: string
  company: string
}

interface StatusUpdate {
  id: string
  profile_id?: string
  linkedin_url: string
  full_name: string
  company: string
  old_status: string
  new_status: string
  prev_role: Role
  curr_role: Role
  timestamp: string
  avatarUrl?: string
}

interface ProfileDetails {
  full_name: string
  search_company?: string
  current_company?: string
  [key: string]: any
}

// Get profile details
async function getProfileDetails(profileId = "", linkedinUrl = ""): Promise<ProfileDetails | null> {
  try {
    if (profileId) {
      const { data, error } = await supabase
        .from("Unicorn-Stealth-Founder-Profiles")
        .select("full_name, search_company")
        .eq("id", profileId)
        .single()

      if (error) throw error
      return data
    } else if (linkedinUrl) {
      const { data, error } = await supabase
        .from("Current-Employee-Profiles")
        .select("full_name, current_company")
        .eq("linkedin_url", linkedinUrl)
        .single()

      if (error) throw error
      return data
    }
    return null
  } catch (error) {
    console.error("Error fetching profile details:", error)
    return null
  }
}

// Fetch status updates
async function getStatusUpdates(): Promise<StatusUpdate[]> {
  try {
    // Calculate date 3 months ago
    const threeMonthsAgo = new Date()
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

    const { data, error } = await supabase
      .from("stealth_founder_status_update_table")
      .select("*")
      .gte("timestamp", threeMonthsAgo.toISOString())
      .neq("new_status", "currently_employed")
      .order("timestamp", { ascending: false })

    if (error) throw error

    // Enrich with profile details
    const enrichedUpdates = await Promise.all(
      (data || []).map(async (update) => {
        // Determine which identifier to use
        const identifier = update.profile_id || update.linkedin_url
        const isFounder = !!update.profile_id

        let profileDetails = null
        if (isFounder) {
          profileDetails = await getProfileDetails(identifier, "")
        } else {
          profileDetails = await getProfileDetails("", identifier)
        }

        // Generate avatar URL
        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileDetails?.full_name || "Unknown"}`

        return {
          ...update,
          full_name: profileDetails?.full_name || "Unknown User",
          company: profileDetails?.search_company || profileDetails?.current_company || "Unknown Company",
          avatarUrl,
        }
      }),
    )

    return enrichedUpdates
  } catch (error) {
    console.error("Error fetching status updates:", error)
    return []
  }
}

// Format status text for display
function formatStatus(status: string): string {
  return status
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Get appropriate badge variant based on status
function getStatusBadgeVariant(status: string): "default" | "secondary" | "destructive" | "outline" | "success" {
  if (status.includes("building") || status.includes("stealth")) {
    return "success"
  } else if (status.includes("job_searching") || status.includes("interviewing") || status.includes("currently_employed")) {
    return "secondary"
  } else if (status.includes("laid_off") || status.includes("quit")) {
    return "destructive"
  } else {
    return "outline"
  }
}

export default function StatusUpdatesPage() {
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const { theme } = useTheme()

  useEffect(() => {
    async function loadStatusUpdates() {
      try {
        const updates = await getStatusUpdates()
        setStatusUpdates(updates)
      } catch (error) {
        console.error("Failed to fetch status updates:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStatusUpdates()
  }, [])

  // Format timestamp into "X days/hours/minutes ago" format
  function formatTimeAgo(timestamp: string): string {
    try {
      const date = new Date(timestamp)
      return formatDistanceToNow(date, { addSuffix: true })
    } catch (error) {
      return "Recently"
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-6 px-4 md:px-6">
      <Card className="shadow-sm">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl">Recent Status Changes</CardTitle>
        </CardHeader>

        <CardContent className="p-0">
          <div className="divide-y">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[400px]" />
                      <Skeleton className="h-4 w-[350px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : statusUpdates.length > 0 ? (
              statusUpdates.map((update) => (
                <div key={update.id} className="p-6 transition-colors">
                  <div className="flex items-start gap-4">

                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground mb-1">
                        Last updated {formatTimeAgo(update.timestamp)}
                      </div>

                      <div className="mb-3 font-medium">
                        <span className="font-semibold">{update.full_name}</span>, ex-employee at{" "}
                        <span className="font-medium">{update.company}</span>, moved from{" "}
                        <Badge variant="outline" className="mx-1">
                          {formatStatus(update.old_status)}
                        </Badge>
                        <span className="inline-block mx-1">→</span>
                        <Badge variant={getStatusBadgeVariant(update.new_status)} className="mx-1">
                          {formatStatus(update.new_status)}
                        </Badge>
                      </div>

                      <div className="text-sm space-y-1">
                        <div>
                          <span className="font-medium">Previously:</span> {update.prev_role.title} at{" "}
                          {update.prev_role.company}
                        </div>
                        <div>
                          <span className="font-medium">Now:</span> {update.curr_role.title} at{" "}
                          {update.curr_role.company}
                        </div>
                      </div>

                      <div className="mt-4">
                        <Button variant="ghost" size="sm" className="text-sm h-8 px-2 text-primary" asChild>
                          <a href={update.linkedin_url} target="_blank" rel="noopener noreferrer">
                            View LinkedIn Profile
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-muted-foreground">No recent status updates found.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

