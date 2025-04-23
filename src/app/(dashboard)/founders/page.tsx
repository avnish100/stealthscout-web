'use client';

import { Card, CardContent } from '@/components/ui/card';

export default function FoundersPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Founders Directory</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((id) => (
          <Card key={id}>
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-gray-200" />
                <div>
                  <h3 className="font-semibold">Founder {id}</h3>
                  <p className="text-sm text-gray-500">Company {id}</p>
                </div>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
