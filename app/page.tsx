import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, Database, Settings } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold">Admin Panel</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive user management system for Firestore. View, edit, suspend, and manage user accounts with ease.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="h-8 w-8 text-primary mb-2" />
              <CardTitle>User Management</CardTitle>
              <CardDescription>View and manage all user accounts in your Firestore database</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• View all user documents</li>
                <li>• Edit user information</li>
                <li>• Suspend/unsuspend accounts</li>
                <li>• Delete user accounts</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Database className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Bulk Operations</CardTitle>
              <CardDescription>Perform actions on multiple users simultaneously</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Select multiple users</li>
                <li>• Bulk suspend/activate</li>
                <li>• Batch role updates</li>
                <li>• Mass user deletion</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Settings className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Advanced Features</CardTitle>
              <CardDescription>Powerful tools for comprehensive user administration</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Real-time user statistics</li>
                <li>• Search and filtering</li>
                <li>• Pagination support</li>
                <li>• Audit trail logging</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12">
          <Link href="/admin">
            <Button size="lg" className="text-lg px-8 py-3">
              <Shield className="mr-2 h-5 w-5" />
              Access Admin Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
