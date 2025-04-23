"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { Loader2, School, Building2, ExternalLink, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

// Initialize Supabase client
const supabase = createClient();

interface Founder {
    id: string;
    first_name: string;
    last_name: string;
    linkedin_url: string;
    experience: Array<{
        company: string;
        title: string;
        date_range: string;
    }>;
    education: Array<{
        school: string;
        degree: string;
        date_range: string;
    }>;
    companies_founded: string[];
}

export default function RepeatFoundersPage() {
    const [founders, setFounders] = useState<Founder[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [pageSize] = useState(10);

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce(async (query: string) => {
            setIsLoading(true);
            try {
                let baseQuery = supabase
                    .from('Unicorn-Stealth-Founder-Profiles')
                    .select('*')
                    .eq('is_repeat_founder', true);

                if (query) {
                    baseQuery = baseQuery.or(
                        `first_name.ilike.%${query}%,` +
                        `last_name.ilike.%${query}%`
                    );
                }

                // Get total count
                const { count } = await supabase
                    .from('Unicorn-Stealth-Founder-Profiles')
                    .select('*', { count: 'exact' })
                    .eq('is_repeat_founder', true);

                // Get paginated results
                const { data, error } = await baseQuery
                    .range((currentPage - 1) * pageSize, currentPage * pageSize - 1)
                    .order('first_name', { ascending: true });

                if (error) throw error;

                setFounders(data || []);
                setTotalCount(count || 0);
            } catch (error) {
                console.error("Error fetching repeat founders:", error);
                toast.error("Failed to load repeat founders");
            } finally {
                setIsLoading(false);
            }
        }, 300),
        []
    );

    useEffect(() => {
        debouncedSearch(searchQuery);
    }, [searchQuery, currentPage, debouncedSearch]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold">Repeat Founders</h1>
            
            {/* Smart Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search by name, school, or company..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="pl-10"
                />
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <>
                    <div className="grid gap-6">
                        {founders.map((founder) => (
                            <Card key={founder.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-2xl">
                                                {founder.first_name} {founder.last_name}
                                            </CardTitle>
                                            <div className="mt-2">
                                                <Badge variant="secondary">Repeat Founder</Badge>
                                            </div>
                                        </div>
                                        {founder.linkedin_url && (
                                            <Button asChild variant="outline">
                                                <a
                                                    href={founder.linkedin_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2"
                                                >
                                                    LinkedIn <ExternalLink className="h-4 w-4" />
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>
                                <CardContent className="grid md:grid-cols-2 gap-6">
                                    {/* Companies Founded Section */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <Building2 className="h-5 w-5" /> Companies Founded
                                        </h3>
                                        <div className="space-y-2">
                                            {founder.experience?.filter(company => 
                                                company.title.includes('Founder') || 
                                                company.title.includes('Co-Founder')
                                            ).map((company, idx) => (
                                                <div key={idx} className="p-3 bg-muted rounded-lg">
                                                    <div>
                                                        <p className="font-medium">{company.company}</p>
                                                        <p className="text-sm text-muted-foreground">{company.title}</p>
                                                        <p className="text-sm text-muted-foreground">{company.date_range}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Education Section */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <School className="h-5 w-5" /> Education
                                        </h3>
                                        <div className="space-y-4">
                                            {founder.education?.map((edu, idx) => (
                                                <div key={idx} className="p-3 bg-muted rounded-lg">
                                                    <p className="font-medium">{edu.degree}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {edu.school}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {edu.date_range}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between mt-6">
                        <p className="text-sm text-muted-foreground">
                            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} results
                        </p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}