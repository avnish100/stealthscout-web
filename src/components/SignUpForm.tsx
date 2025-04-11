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

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const supabase = createClient();
  const router = useRouter();
  const [name, setName] = useState(""); // Added state for name
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null); // For success messages
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // You can store additional user metadata here
        data: {
          full_name: name, // Example: storing full name
        },
        // Optional: Email confirmation redirect URL
        // emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error("Sign up error:", error);
      setError(error.message);
    } else if (data.user && data.user.identities?.length === 0) {
      // This case can happen if email confirmation is required but the user already exists
      // without a confirmed email. Supabase might send a confirmation email again.
      setError("User potentially exists but is unconfirmed. Check your email.");
      setMessage(null);
    } else if (data.session) {
      // User signed up and logged in (if email confirmation is disabled)
      setMessage("Sign up successful! Redirecting...");
      router.push("/"); // Or '/dashboard'
      router.refresh();
    } else if (data.user) {
       // User signed up, but email confirmation is likely required
       setMessage("Sign up successful! Please check your email to confirm your account.");
       setError(null);
       // Optionally clear form or redirect to a 'check email' page
       // router.push('/check-email');
    } else {
       setError("An unexpected error occurred during sign up.");
    }

    setLoading(false);
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setError(null);
    // Note: Google Sign up uses the same method as Google Login
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        // You can add scopes if needed, e.g., 'profile email'
      },
    });

    if (error) {
      console.error("Google sign up error:", error);
      setError(error.message);
      setLoading(false);
    }
    // Redirect happens via Supabase
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>
            Enter your details below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Use the handleSignUp function */}
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                />
              </div>
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
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  // Suggest adding minLength for security
                  // minLength={8}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                />
              </div>
               {/* Display errors or success messages */}
              {error && <p className="text-sm text-red-600">{error}</p>}
              {message && <p className="text-sm text-green-600">{message}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Create Account"}
              </Button>
              {/* Use the handleGoogleSignUp function */}
              <Button
                variant="outline"
                className="w-full"
                onClick={handleGoogleSignUp} // Changed to onClick
                type="button" // Prevent form submission
                disabled={loading}
              >
                 {loading ? "Redirecting..." : "Sign up with Google"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <a href="/auth/signin" className="underline underline-offset-4"> {/* Updated link */}
                Login
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}