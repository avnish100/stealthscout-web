"use client"; // Required for components using React Hooks (useState, useEffect)

import { useState, useEffect } from "react";
import { Search, Filter, User, X, Clock, MapPin, Briefcase, School, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner"; // Using sonner for toast notifications


// --- Interfaces ---
interface Experience {
    company: string;
    title: string;
    date_range: string;
    duration: string;
}

interface Education {
    school: string;
    degree: string;
    date_range: string;
}

interface TalentProfile {
    id: string | number; // Use string or number depending on your schema
    first_name: string;
    last_name: string;
    linkedin_url: string;
    experience: Experience[];
    education?: Education[];
    location?: string;
    profile_status: "stealth" | "building_in_public" | "recently_quit";
    status_confidence_label?: "HIGH" | "LOW";
    is_senior_operator?: boolean;
    is_repeat_founder?: boolean;
    role_at_company_searched?: string; // Derived during/after search
    last_attempted_refresh_timestamp?: string; // ISO 8601 string expected
    // Add other relevant fields from your Supabase table
    search_company?: string; // Added based on original example's profile card display
    role?: string;    // Added based on original example's profile card display
}

// --- Supabase Client Initialization ---


const supabase = createClient()

// --- Helper Functions ---

/**
 * Parses duration string into total months.
 */
function parseDuration(durationString: string | null | undefined): number {
    if (!durationString) return 0;
    let totalMonths = 0;
    try {
        const yearMatch = durationString.match(/(\d+)\s+yr(s)?/);
        if (yearMatch) totalMonths += parseInt(yearMatch[1], 10) * 12;
        const monthMatch = durationString.match(/(\d+)\s+mo(s)?/);
        if (monthMatch) totalMonths += parseInt(monthMatch[1], 10);
        return totalMonths;
    } catch (e) {
        console.error("Error parsing duration:", durationString, e);
        return 0;
    }
}

/**
 * Formats an ISO date string into a "time ago" string.
 */
function formatTimeAgo(dateString: string | null | undefined): string {
    if (!dateString) return "unknown";
    try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        const diffMonths = Math.floor(diffDays / 30);
        const diffYears = Math.floor(diffDays / 365);

        if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
        if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
        if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
        return `just now`;
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return "invalid date";
    }
}

// --- Main Component ---
export default function TalentSearchPage() {
    // --- State Variables ---
    const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
    const [profileStatusFilters, setProfileStatusFilters] = useState<string[]>([]);
    const [filterRepeatFounder, setFilterRepeatFounder] = useState(false);
    const [filterSeniorOperator, setFilterSeniorOperator] = useState(false);
    const [profiles, setProfiles] = useState<TalentProfile[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [companyList, setCompanyList] = useState<string[]>([]);
    // Added state for advanced filters visibility, similar to the initial React example
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
     // Added state for text search query
    const [searchQuery, setSearchQuery] = useState("");


    // --- Fetch Company List on Mount ---
    useEffect(() => {
        async function fetchCompanyList() {
            if (!supabase) return;
            try {
                // Replace with your actual view or table for getting distinct companies
                const { data, error } = await supabase
                    .from('list_of_companies') // ADJUST AS NEEDED
                    .select('name')          // ADJUST AS NEEDED
                    .order('name');

                if (error) {
                    console.error("Error fetching distinct companies:", error);
                    toast.error("Failed to load company list.");
                    return;
                }
                if (data) {
                    setCompanyList(data.map(item => item.name));
                }
            } catch (error) {
                console.error("Exception fetching company list:", error);
                toast.error("An error occurred while loading companies.");
            }
        }
        fetchCompanyList();
    }, []);


    // --- Handlers ---
    const handleAddCompany = (company: string) => {
        if (company && selectedCompanies.length < 3 && !selectedCompanies.includes(company)) {
            setSelectedCompanies([...selectedCompanies, company]);
        } else if (selectedCompanies.length >= 3) {
            toast.warning("You can select a maximum of 3 companies.");
        }
    };

    const handleRemoveCompany = (companyToRemove: string) => {
        setSelectedCompanies(selectedCompanies.filter(company => company !== companyToRemove));
    };

    const handleToggleProfileStatus = (status: string) => {
        setProfileStatusFilters(prev =>
            prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
        );
    };

    // --- Search Function ---
    const handleSearch = async () => {
        if (!supabase) {
            toast.error("Database connection is not available.");
            return;
        }
        if (selectedCompanies.length === 0) {
            toast.warning("Please select at least one company to search.");
            return;
        }

        setIsLoading(true);
        setHasSearched(true);
        setProfiles([]);
        console.log("Starting search for companies:", selectedCompanies);
        console.log("Filters - Status:", profileStatusFilters, "Repeat:", filterRepeatFounder, "Senior:", filterSeniorOperator, "Query:", searchQuery);

        let allFoundProfiles: TalentProfile[] = [];
        const fetchedProfileIds = new Set<string | number>();

        try {
            const statusMap: Record<string, string> = {
                "Stealth": "stealth",
                "Building in Public": "building_in_public",
                "Recently Quit": "recently_quit"
            };
            const dbStatuses = profileStatusFilters.map(status => statusMap[status]).filter(Boolean);

            for (const companyName of selectedCompanies) {
                console.log(`Querying for company: ${companyName}`);
                let query = supabase
                    .from('Unicorn-Stealth-Founder-Profiles')
                    .select('*').ilike('search_company', `%${companyName}%`);

                if (dbStatuses.length > 0) {
                    query = query.in('profile_status', dbStatuses);
                }
                if (filterRepeatFounder) {
                    query = query.eq('is_repeat_founder', true);
                }
                if (filterSeniorOperator) {
                    query = query.eq('is_senior_operator', true);
                }

                // Apply text search query (optional - searches across name, role, company, experience)
                // This requires careful consideration of performance on large tables.
                // It might be better to filter client-side *after* fetching if performance is an issue.
                if (searchQuery) {
                     const queryLower = searchQuery.toLowerCase();
                    // This uses Supabase 'or' condition - adapt based on your specific text search needs
                    // and potentially full-text search capabilities if set up in Postgres.
                     query = query.or(
                        `first_name.ilike.%${queryLower}%,last_name.ilike.%${queryLower}%,role.ilike.%${queryLower}%,company.ilike.%${queryLower}%`
                        // Add more fields to search if needed, e.g., experience text.
                        // Searching within JSONB (experience) directly in the query is more complex.
                    );
                 }


                const { data, error } = await query;

                if (error) {
                    console.error(`Error fetching profiles for ${companyName}:`, error);
                    console.log("query used",query)
                    toast.error(`Failed to fetch profiles for ${companyName}.`);
                    continue;
                }

                if (data && data.length > 0) {
                    console.log(`Found ${data.length} profiles for ${companyName}`);
                    data.forEach((profile: any) => {
                         const roleAtSearched = profile.experience?.find((exp: Experience) => exp.company === companyName)?.title;
                        if (!fetchedProfileIds.has(profile.id)) {
                            allFoundProfiles.push({ ...profile, role_at_company_searched: roleAtSearched });
                            fetchedProfileIds.add(profile.id);
                        }
                    });
                } else {
                    console.log(`No profiles found for ${companyName} with current filters.`);
                }
                 await new Promise(resolve => setTimeout(resolve, 300)); // Shorter simulated delay
            }

            const sortedProfiles = allFoundProfiles.sort((a, b) => {
                const durationA = a.experience?.length > 0 ? parseDuration(a.experience[0].duration) : 0;
                const durationB = b.experience?.length > 0 ? parseDuration(b.experience[0].duration) : 0;
                return durationB - durationA;
            });

            setProfiles(sortedProfiles);
            console.log(`Search complete. Total unique profiles found: ${sortedProfiles.length}`);
            if (sortedProfiles.length === 0 && selectedCompanies.length > 0) {
                 toast.info("No profiles found matching your criteria.");
             } else if (sortedProfiles.length > 0) {
                 toast.success(`Found ${sortedProfiles.length} profiles.`);
             }

        } catch (error) {
            console.error("Error during profile search:", error);
            toast.error("An unexpected error occurred during the search.");
        } finally {
            setIsLoading(false);
        }
    };

     // --- Render Logic ---
    if (!supabase) {
        // Render error state if Supabase client failed to initialize
        return (
             <div className="flex items-center justify-center h-screen p-4">
                 <Card className="w-full max-w-md">
                    <CardHeader>
                         <CardTitle className="text-center text-destructive">Configuration Error</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-muted-foreground">
                             Supabase client could not be initialized. Check environment variables.
                         </p>
                    </CardContent>
                </Card>
             </div>
         );
     }


    return (
        // Main container using flex layout from initial React example
        <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            {/* --- Search Form Card --- */}
             <Card>
                {/* Using CardHeader for title now */}
                <CardHeader>
                    <CardTitle className="text-2xl">Talent Scout</CardTitle>
                     {/* Optional: Add a description if desired */}
                    {/* <CardDescription>Find potential founders based on their past experience.</CardDescription> */}
                 </CardHeader>
                 <CardContent className="space-y-4">
                     {/* Company Selection */}
                     <div className="space-y-2">
                         <Label className="text-sm font-medium">Select Past Companies (Max 3)</Label>
                        <div className="flex flex-wrap items-center gap-2">
                            {selectedCompanies.map(company => (
                                <Badge key={company} variant="secondary" className="py-1 px-2 text-sm">
                                    {company}
                                    <button
                                        onClick={() => handleRemoveCompany(company)}
                                        className="ml-1.5 text-muted-foreground hover:text-foreground"
                                        aria-label={`Remove ${company}`}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                            {selectedCompanies.length < 3 && (
                                <Select onValueChange={handleAddCompany} value="">
                                    <SelectTrigger className="w-[250px] h-9">
                                        <SelectValue placeholder="Add a company..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {companyList
                                            .filter(company => !selectedCompanies.includes(company))
                                            .map(company => (
                                                <SelectItem key={company} value={company}>{company}</SelectItem>
                                            ))}
                                        {companyList.length === 0 && <SelectItem value="loading" disabled>Loading...</SelectItem>}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    </div>

                    {/* Search Input and Buttons Row */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-grow">
                             <Label htmlFor="search-query" className="sr-only">Search Query</Label> {/* For accessibility */}
                             <Input
                                id="search-query"
                                placeholder="Search by name, role, keyword..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full"
                            />
                         </div>
                         <Button onClick={handleSearch} disabled={isLoading || selectedCompanies.length === 0} className="w-full sm:w-auto">
                             {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                             Search Profiles
                         </Button>
                         <Button
                             variant="outline"
                             onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                            className="w-full sm:w-auto"
                        >
                             <Filter className="mr-2 h-4 w-4" />
                             {showAdvancedFilters ? "Hide Filters" : "Show Filters"}
                         </Button>
                     </div>

                     {/* Advanced Filters Section (Conditional) */}
                    {showAdvancedFilters && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 p-4 border bg-muted/50 rounded-lg">
                            {/* Profile Status Filters */}
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium text-muted-foreground">Filter by Profile Status</h4>
                                {["Stealth", "Building in Public", "Recently Quit"].map((status) => (
                                    <div key={status} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`status-${status}`}
                                            checked={profileStatusFilters.includes(status)}
                                            onCheckedChange={() => handleToggleProfileStatus(status)}
                                        />
                                        <Label htmlFor={`status-${status}`} className="text-sm font-medium cursor-pointer">
                                            {status}
                                        </Label>
                                    </div>
                                ))}
                             </div>
                             {/* Talent Type Filters */}
                             <div className="space-y-2">
                                 <h4 className="text-sm font-medium text-muted-foreground">Filter by Talent Type</h4>
                                 <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="repeat-founder"
                                        checked={filterRepeatFounder}
                                        onCheckedChange={(checked) => setFilterRepeatFounder(checked === true)}
                                    />
                                    <Label htmlFor="repeat-founder" className="text-sm font-medium cursor-pointer">Repeat Founders</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="senior-operator"
                                        checked={filterSeniorOperator}
                                        onCheckedChange={(checked) => setFilterSeniorOperator(checked === true)}
                                    />
                                    <Label htmlFor="senior-operator" className="text-sm font-medium cursor-pointer">Senior Operators</Label>
                                </div>
                             </div>
                         </div>
                     )}
                 </CardContent>
             </Card>

            {/* --- Results Area --- */}
            {isLoading && (
                <div className="flex justify-center items-center p-10">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            )}

            {!isLoading && hasSearched && (
                <div className="text-sm font-medium text-muted-foreground mb-4">
                    Found {profiles.length} profile{profiles.length !== 1 ? 's' : ''}.
                </div>
            )}

            {!isLoading && profiles.length > 0 && (
                 // Grid layout for profile cards
                 <div className="grid gap-4 md:gap-6 lg:gap-8 sm:grid-cols-1">
                    {profiles.map((profile) => (
                        <ProfileCard key={profile.id} profile={profile} />
                    ))}
                </div>
            )}

             {!isLoading && hasSearched && profiles.length === 0 && (
                 <div className="text-center py-10 text-muted-foreground">
                     No profiles found matching your criteria.
                 </div>
             )}
              {!isLoading && !hasSearched && (
                 <div className="text-center py-10 text-muted-foreground">
                     Select companies and apply filters to start searching.
                 </div>
             )}
        </div>
    );
}


// --- Profile Card Component (Using shadcn/ui) ---
interface ProfileCardProps {
    profile: TalentProfile;
}

function ProfileCard({ profile }: ProfileCardProps) {
     // Determine status badge variant based on confidence and status
    const getStatusBadgeVariant = (): "default" | "destructive" | "secondary" | "outline" => {
         const confidence = profile.status_confidence_label ?? 'HIGH';
         // Example: Make low confidence stand out more
         return confidence === 'HIGH' ? 'default' : 'destructive'; // default (often green/blue), destructive (often red)
     };

    return (
        // Using Card component from shadcn/ui
        <Card className="overflow-hidden shadow-sm hover:shadow-md transition-shadow py-0">
  <div className="flex flex-col md:flex-row">
    {/* Left Area: Name, Role, Status */}
    <div className="bg-muted/50 p-6 flex flex-col md:flex-row justify-between w-full md:w-1/4">
      <div className="space-y-3">
        {/* Name */}
        <h3 className="text-2xl font-bold text-primary">
          {profile.first_name} {profile.last_name}
        </h3>

        {/* Role and Company */}
        {(profile.role || profile.search_company) && (
          <p className="text-sm text-subtle">
            {profile.role}{profile.role && profile.search_company && ' at '}{profile.search_company}
          </p>
        )}

        {/* Status Badge */}
        <div className="pt-2">
          <Badge variant={getStatusBadgeVariant()} className="text-xs">
            {profile.profile_status === "stealth" ? "Building in Stealth"
              : profile.profile_status === "building_in_public" ? "Building in Public"
              : "Recently Quit"}
          </Badge>
        </div>

        {/* Location */}
        {profile.location && (
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 mr-2" />
            {profile.location}
          </div>
        )}

        {/* Labels */}
        <div className="flex flex-wrap gap-2">
          {profile.role_at_company_searched && (
            <Badge variant="outline" className="text-sm bg-muted/50">
              {profile.role_at_company_searched}
            </Badge>
          )}
          {profile.is_senior_operator && (
            <Badge variant="outline" className="text-sm border-blue-500 text-blue-700 bg-blue-50">
              Senior Operator
            </Badge>
          )}
          {profile.is_repeat_founder && (
            <Badge variant="outline" className="text-sm border-purple-500 text-purple-700 bg-purple-50">
              Repeat Founder
            </Badge>
          )}
        </div>
        {profile.last_attempted_refresh_timestamp && (
        <div className="text-xs text-muted-foreground flex items-center pt-4">
          <Clock className="h-3 w-3 mr-1" />
          {formatTimeAgo(profile.last_attempted_refresh_timestamp)}
        </div>
      )}
      </div>

      {/* Last Refresh Timestamp */}
      
    </div>

    {/* Center Area: Details */}
    <div className="bg-muted p-6 w-full md:flex-1">
      <div className="space-y-4">
        {/* Experience */}
        {profile.experience && profile.experience.length > 0 && (
          <div>
            <h4 className="text-md font-medium mb-2">Experience</h4>
            <ul className="space-y-2">
              {profile.experience.slice(0, 2).map((exp, idx) => (
                <li key={`exp-${idx}`}>
                  <p className="font-medium">{exp.title}</p>
                  <p className="text-muted-foreground">{exp.company}</p>
                  <p className="text-xs text-muted-foreground/80">{exp.date_range} ({exp.duration})</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Education */}
        {profile.education && profile.education.length > 0 && (
          <div>
            <h4 className="text-md font-medium mb-2">Education</h4>
            <ul className="space-y-2">
              {profile.education.slice(0, 1).map((edu, idx) => (
                <li key={`edu-${idx}`}>
                  <p className="font-medium">{edu.degree}</p>
                  <p className="text-muted-foreground">{edu.school}</p>
                  <p className="text-xs text-muted-foreground/80">{edu.date_range}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>

    {/* Right Area: LinkedIn Link */}
    <div className="bg-muted/50 p-6 flex items-center justify-center w-full md:w-1/6">
      {profile.linkedin_url && (
        <a
          href={profile.linkedin_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium inline-flex items-center"
        >
          LinkedIn <ExternalLink className="h-4 w-4 ml-1" />
        </a>
      )}
    </div>
  </div>
</Card>

    );
}

// Add ExternalLink icon if you want it for the LinkedIn link
import { ExternalLink } from 'lucide-react';