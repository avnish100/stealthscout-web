import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function AdminSignup() {
  return (
    <div className="container mx-auto max-w-md py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Admin Account</CardTitle>
          <CardDescription>
            Set up your organization and admin account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <h3 className="font-medium mb-2">Important Information</h3>
            <p className="text-sm text-muted-foreground">
              • The organization name will be displayed across your instance
              <br />
              • The domain will be used for email configurations
              <br />
              • Admin account credentials will be your primary login
              <br />
              • Make sure to use a strong password for security
            </p>
          </div>
          
          <form className="space-y-6">
            {/* Organization Details */}
            <div className="space-y-4">
              <h3 className="font-medium">Organization Details</h3>
              <div className="grid gap-2">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input id="orgName" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="orgDomain">Organization Domain</Label>
                <Input id="orgDomain" type="text" placeholder="example.com" required />
              </div>
            </div>

            {/* Admin Account Details */}
            <div className="space-y-4">
              <h3 className="font-medium">Admin Account</h3>
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Create Organization & Account
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}