"use client"

import { useState } from "react"
import { UserList } from "./user-list"
import { UserStats } from "./user-stats"
import { UserEditModal } from "./user-edit-modal"
import { UserDeleteDialog } from "./user-delete-dialog"
import { BulkUserActions } from "./bulk-user-actions"
import { useUsers } from "@/hooks/use-users"
import { useUserSelection } from "@/hooks/use-user-selection"
import { toggleUserSuspension, type User } from "@/lib/firestore-admin"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Shield, Users, Database } from "lucide-react"

export function AdminDashboard() {
  const { users, loading, error, refresh } = useUsers()
  const { selectedUsers, toggleUser, clearSelection, isSelected, setSelectedUsers } = useUserSelection()
  const { toast } = useToast()

  // Modal states
  const [editUser, setEditUser] = useState<User | null>(null)
  const [deleteUser, setDeleteUser] = useState<User | null>(null)

  const handleEditUser = (user: User) => {
    setEditUser(user)
  }

  const handleDeleteUser = (user: User) => {
    setDeleteUser(user)
  }

  const handleToggleSuspension = async (user: User) => {
    try {
      await toggleUserSuspension(user.id, !user.isSuspended)
      toast({
        title: user.isSuspended ? "User unsuspended" : "User suspended",
        description: `${user.email} has been ${user.isSuspended ? "unsuspended" : "suspended"}.`,
      })
      refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUserUpdated = () => {
    refresh()
    clearSelection()
  }

  const handleUserDeleted = () => {
    refresh()
    clearSelection()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Manage users and system settings</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Stats Overview */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Users className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-xl font-semibold">User Overview</h2>
            </div>
            <UserStats users={users} />
          </div>

          <Separator />

          {/* User Management */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <Database className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-xl font-semibold">User Management</h2>
              </div>
            </div>

            {/* Bulk Actions */}
            {users.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">Bulk Actions</CardTitle>
                  <CardDescription>Select multiple users to perform batch operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <BulkUserActions
                    users={users}
                    selectedUsers={selectedUsers}
                    onSelectionChange={setSelectedUsers}
                    onUsersUpdated={handleUserUpdated}
                  />
                </CardContent>
              </Card>
            )}

            {/* User List */}
            <UserList
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
              onToggleSuspension={handleToggleSuspension}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <UserEditModal
        user={editUser}
        open={!!editUser}
        onOpenChange={(open) => !open && setEditUser(null)}
        onUserUpdated={handleUserUpdated}
      />

      <UserDeleteDialog
        user={deleteUser}
        open={!!deleteUser}
        onOpenChange={(open) => !open && setDeleteUser(null)}
        onUserDeleted={handleUserDeleted}
      />
    </div>
  )
}
