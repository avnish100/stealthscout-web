// Ensure this is a Client Component
"use client"; // <--- Add this line

import { useState } from "react";
import { useRouter } from "next/navigation"; // Use next/navigation for App Router
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client"; // Import the client helper

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const supabase = createClient(); // Initialize Supabase client
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error);
      setError(error.message);
    } else {
      // Redirect to a protected page or dashboard on success
      // Using router.refresh() might be needed to update server component data
      router.push("/dashboard"); // Or '/dashboard', etc.
      router.refresh();
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // Ensure this matches the redirect URI configured in Supabase & Google Cloud Console
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Google login error:", error);
      setError(error.message);
      setLoading(false);
    }
    // No need to setLoading(false) here as the page will redirect
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Use the handleLogin function */}
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#" // TODO: Implement forgot password flow
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
              {/* Display errors */}
              {error && (
                 <p className="text-sm text-red-600">{error}</p>
              )}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>
              {/* Use the handleGoogleLogin function */}
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleLogin} // Changed to onClick
                type="button" // Prevent form submission
                disabled={loading}
              >
                {loading ? "Redirecting..." : "Login with Google"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <a href="/auth/signup" className="underline underline-offset-4"> {/* Updated link */}
                Sign up
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}