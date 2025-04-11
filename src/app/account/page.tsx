import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Account Management',
  description: 'Manage your account settings and profile information.',
}

export default function AccountPage() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-4xl font-bold tracking-tight">Account Management</h1>
      
      {/* Profile Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Profile Details</h2>
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Name</label>
              <input
                type="text"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Email</label>
              <input
                type="email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="your@email.com"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Security</h2>
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Current Password</label>
              <input
                type="password"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div>
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">New Password</label>
              <input
                type="password"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              Update Password
            </button>
          </div>
        </div>
      </section>

      {/* Preferences Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Preferences</h2>
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="emailNotifications"
                className="h-4 w-4 rounded border-primary text-primary focus:ring-primary focus:ring-offset-2"
              />
              <label htmlFor="emailNotifications" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Receive email notifications
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="marketingEmails"
                className="h-4 w-4 rounded border-primary text-primary focus:ring-primary focus:ring-offset-2"
              />
              <label htmlFor="marketingEmails" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Receive marketing emails
              </label>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 