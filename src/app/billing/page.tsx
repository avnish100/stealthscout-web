import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Billing',
  description: 'Manage your billing information and subscription details.',
}

export default function BillingPage() {
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
      <h1 className="text-4xl font-bold tracking-tight">Billing</h1>

      {/* Current Plan Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Current Plan</h2>
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Free Plan</h3>
              <p className="text-muted-foreground">Basic features included</p>
            </div>
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
              Upgrade Plan
            </button>
          </div>
        </div>
      </section>

      {/* Payment Methods Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Payment Methods</h2>
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-muted-foreground">No payment methods added</p>
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                Add Payment Method
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Billing History Section */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Billing History</h2>
        <div className="bg-card rounded-lg border shadow-sm p-6">
          <div className="space-y-4">
            <div className="border-b pb-4">
              <p className="text-muted-foreground">No billing history available</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 