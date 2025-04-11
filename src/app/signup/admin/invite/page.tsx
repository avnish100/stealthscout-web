import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function InviteUsers() {
  return (
    <div className="min-h-screen my-auto container mx-auto max-w-md py-8">
      <Card>
        <CardHeader>
          <CardTitle>Invite Team Members</CardTitle>
          <CardDescription>
            Invite your team members to join your organization
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="emails">Email Addresses</Label>
                <Input
                  id="emails"
                  placeholder="Enter email addresses separated by commas"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="role">Role</Label>
                <select className="form-select w-full" id="role">
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="message">Personal Message (Optional)</Label>
                <textarea
                  id="message"
                  className="min-h-[100px] w-full rounded-md border p-2"
                  placeholder="Add a personal message to the invitation..."
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              Send Invitations
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}