import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>This is your personal dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Here you can manage your account and view your activity.</p>
            <Button className="mt-4">Get Started</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside">
              <li>Logged in</li>
              <li>Updated profile</li>
              <li>Created new prompt</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used features</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="mr-2 mb-2">Create Prompt</Button>
            <Button className="mr-2 mb-2">View History</Button>
            <Button className="mr-2 mb-2">Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
