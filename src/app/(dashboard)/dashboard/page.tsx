"use client"

import { useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { createClient } from "@/lib/supabase/client"
import { formatDistanceToNow } from "date-fns"
import { 
  BarChart3, 
  Users, 
  Rocket,
  TrendingUp,
  Building2,
  GraduationCap,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Collapse } from "@/components/ui/motion"
import { queryCache } from "@/lib/cache"
import { formatStatus, formatTimeAgo, getStatusBadgeVariant } from "@/utils/formatting"

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
}

interface ProfileDetails {
  full_name: string
  search_company?: string
  current_company?: string
  [key: string]: any
}

// Get profile details
async function getProfileDetails(profileId = "", linkedinUrl = ""): Promise<ProfileDetails | null> {
  const cacheKey = `profile_${profileId || linkedinUrl}`;
  const cached = queryCache.get<ProfileDetails>(cacheKey);
  if (cached) return cached;

  try {
    if (profileId) {
      const { data, error } = await supabase
        .from("Unicorn-Stealth-Founder-Profiles")
        .select("full_name, search_company")
        .eq("id", profileId)
        .single()

      if (error) throw error
      if (data) {
        queryCache.set(cacheKey, data);
      }
      return data
    } else if (linkedinUrl) {
      const { data, error } = await supabase
        .from("Current-Employee-Profiles")
        .select("full_name, current_company")
        .eq("linkedin_url", linkedinUrl)
        .single()

      if (error) throw error
      if (data) {
        queryCache.set(cacheKey, data);
      }
      return data
    }
    return null
  } catch (error) {
    console.error("Error fetching profile details:", error)
    return null
  }
}

async function getRecentStatusUpdates(): Promise<StatusUpdate[]> {
  const cacheKey = 'recent_status_updates';
  const cached = queryCache.get<StatusUpdate[]>(cacheKey);
  if (cached)
  {
    console.log("cache hit")
    return cached;
  }

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
      .limit(5) // Limit to 5 most recent updates

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

    queryCache.set(cacheKey, enrichedUpdates, 60 * 1000 * 60); // 1 minute TTL for updates
    return enrichedUpdates
  } catch (error) {
    console.error("Error fetching status updates:", error)
    return []
  }
}


async function getCompanyAndProfileCounts() {
  const cacheKey = 'company_profile_counts';
  const cached = queryCache.get<{ companyCount: number; profileCount: number }>(cacheKey);
  if (cached) return cached;

  try {
    // Get unique companies count
    const { data: companyData, error: companyError } = await supabase
      .from("Unicorn-Stealth-Founder-Profiles")
      .select("search_company")
      .not("search_company", "is", null);

    if (companyError) throw companyError;
    const uniqueCompanies = new Set(companyData.map(item => item.search_company));

    // Get profiles count
    const { count: profileCount, error: profileError } = await supabase
      .from("list_of_companies")
      .select("*", { count: "exact" });

    if (profileError) throw profileError;

    const result = {
      companyCount: uniqueCompanies.size,
      profileCount: profileCount || 0
    };
    queryCache.set(cacheKey, result);
    return result;
  } catch (error) {
    console.error("Error fetching counts:", error);
    return { companyCount: 0, profileCount: 0 };
  }
}

export default function Page() {
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedUpdates, setExpandedUpdates] = useState<Set<string>>(new Set())
  const [talentPool, setTalentPool] = useState<any[]>([])
  const [highPotentialFounders, setHighPotentialFounders] = useState<any[]>([])
  const [companyCount, setCompanyCount] = useState(0)
  const [profileCount, setProfileCount] = useState(0)

  useEffect(() => {
    async function loadData() {
      const updates = await getRecentStatusUpdates();
      const { companyCount, profileCount } = await getCompanyAndProfileCounts();

      setStatusUpdates(updates);
      setCompanyCount(companyCount);
      setProfileCount(profileCount);
      setLoading(false);
    }
    loadData();
  }, [])

  // Add toggle function
  const toggleUpdate = (id: string) => {
    setExpandedUpdates(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <div className="[--header-height:calc(theme(spacing.14))]">
      <div className="flex flex-1 flex-col gap-4 p-4">
        {/* Top metrics row */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="justify-center">
            <CardContent className="flex flex-row items-center self-center gap-4">
              <div className="rounded-full bg-primary/10 p-2">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Talent Pool</p>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <h3 className="text-2xl font-bold">{profileCount}</h3>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="justify-center">
            <CardContent className="flex flex-row items-center gap-4">
              <div className="rounded-full bg-green-500/10 p-2">
                <Rocket className="h-4 w-4 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">High Potential Founders</p>
                <h3 className="text-2xl font-bold">842</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="justify-center">
            <CardContent className="flex flex-row items-center gap-4 ">
              <div className="rounded-full bg-blue-500/10 p-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Growth Score Avg</p>
                <h3 className="text-2xl font-bold">8.4</h3>
              </div>
            </CardContent>
          </Card>

          <Card className="justify-center">
            <CardContent className="flex flex-row items-center gap-4">
              <div className="rounded-full bg-purple-500/10 p-2">
                <Building2 className="h-4 w-4 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Companies Tracked</p>
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <h3 className="text-2xl font-bold">{companyCount}</h3>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content area */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Recent Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  // Loading skeletons
                  [...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <Skeleton className="h-5 w-5 rounded" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  ))
                ) : statusUpdates.length > 0 ? (
                  statusUpdates.map((update) => (
                    <div key={update.id} className="p-6 rounded-lg bg-muted/50">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          {/* Preview Section - Always Visible */}
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="text-sm text-muted-foreground mb-1">
                                Last updated {formatTimeAgo(update.timestamp)}
                              </div>
                              <div className="font-medium">
                                <span className="font-semibold">{update.full_name}</span> moved to{" "}
                                <Badge variant={getStatusBadgeVariant(update.new_status)}>
                                  {formatStatus(update.new_status)}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleUpdate(update.id)}
                              className="ml-2"
                            >
                              {expandedUpdates.has(update.id) ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : (
                                <ChevronDown className="h-4 w-4" />
                              )}
                            </Button>
                          </div>

                          {/* Expanded Details Section */}
                          <Collapse open={expandedUpdates.has(update.id)}>
                            <div className="mt-4 pt-4 border-t border-border opacity-100 transition-opacity duration-200">
                              <div className="text-sm space-y-3">
                                <div>
                                  Previously{" "}
                                  <Badge variant="outline" className="ml-1">
                                    {formatStatus(update.old_status)}
                                  </Badge>
                                </div>
                                <div>
                                  <div className="font-medium mb-1">Career History</div>
                                  <div className="ml-2">
                                    <div>
                                      <span className="text-muted-foreground">Previously:</span>{" "}
                                      {update.prev_role.title} at {update.prev_role.company}
                                    </div>
                                    <div>
                                      <span className="text-muted-foreground">Now:</span>{" "}
                                      {update.curr_role.title} at {update.curr_role.company}
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-sm h-8 px-2 text-primary"
                                  asChild
                                >
                                  <a
                                    href={update.linkedin_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    View LinkedIn Profile
                                    <ExternalLink className="ml-1 h-3 w-3" />
                                  </a>
                                </Button>
                              </div>
                            </div>
                          </Collapse>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground">No recent activities</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
