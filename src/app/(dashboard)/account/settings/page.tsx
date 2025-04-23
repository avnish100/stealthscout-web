"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function AccountSettings() {
  return (
    <div className="flex min-h-[85vh] items-center justify-center">
      <div className="w-full max-w-2xl px-4 py-8">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Account Settings</CardTitle>
            <CardDescription>Manage your account details and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-6">
            <div className="space-y-3">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="John Doe" className="w-full" />
            </div>
            <div className="space-y-3">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="john@example.com" className="w-full" />
            </div>
            <Button className="w-full sm:w-auto">Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
