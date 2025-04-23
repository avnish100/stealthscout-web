import { formatDistanceToNow } from "date-fns";

/**
 * Formats a status string into a readable format
 * @param status The status string to format
 */
export function formatStatus(status: string): string {
  return status
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Formats an ISO date string into a "time ago" string
 * @param dateString The ISO date string to format
 */
export function formatTimeAgo(dateString: string | null | undefined): string {
  if (!dateString) return "unknown";
  try {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    console.error("Error formatting date:", dateString, error);
    return "Recently";
  }
}

/**
 * Returns the appropriate badge variant based on status
 * @param status The status to get the variant for
 */
export function getStatusBadgeVariant(
  status: string
): "default" | "secondary" | "destructive" | "outline" | "success" {
  if (status.includes("building") || status.includes("stealth")) {
    return "success";
  } else if (
    status.includes("job_searching") ||
    status.includes("interviewing") ||
    status.includes("currently_employed")
  ) {
    return "secondary";
  } else if (status.includes("laid_off") || status.includes("quit")) {
    return "destructive";
  }
  return "outline";
}
