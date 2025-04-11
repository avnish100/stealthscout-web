'use client'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { CheckCircle, Loader2 } from "lucide-react"

interface ActivationResponse {
  success: boolean;
  error?: string;
}

export default function AdminLicenseActivation() {
  const [licenseKey, setLicenseKey] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  const activateLicense = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("https://api.polar.sh/v1/customer-portal/license-keys/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: licenseKey,
          // You might want to configure these values based on your needs
          organization_id: "aa7d8fbe-3a52-4cae-9792-afa5209a410b",
          label: "Admin License",
          
        }),
      })

      const data: ActivationResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to activate license")
      }

      setShowSuccess(true)
      // Wait for 2 seconds to show the success message
      setTimeout(() => {
        router.push("/signup/admin")
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.stack? err.stack: "Not Permitted" : "Failed to activate license")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Activate Admin License</CardTitle>
            <CardDescription>
              Enter your Polar.sh license key to proceed with admin account creation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">Getting Started</h3>
              <p className="text-sm text-muted-foreground">
                1. Enter your Polar.sh license key below
                <br />
                2. Once activated, you'll be redirected to create your admin account
                <br />
                3. You can then set up your organization details
              </p>
            </div>
            <form onSubmit={activateLicense} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="licenseKey">License Key</Label>
                <Input
                  id="licenseKey"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  required
                />
              </div>
              {error && (
                <div className="text-sm text-destructive">{error}</div>
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Activating..." : "Activate License"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Need a license key? Visit <a href="https://polar.sh" className="text-primary hover:underline">Polar.sh</a> to purchase one.
            </p>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <CheckCircle className="h-6 w-6 text-green-500" />
              )}
              {isLoading ? "Activating License..." : "License Activated!"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-center text-muted-foreground">
            Redirecting you to create your admin account...
          </p>
        </DialogContent>
      </Dialog>
    </>
  )
}