'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function GriDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">GRI Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Overview of your compliance status</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Your recent GRI activities</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Tasks that need your attention</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
