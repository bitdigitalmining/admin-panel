"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { toggleUserSuspension, toggleUserStatus, deleteUser, type User } from "@/lib/firestore-admin"
import { useToast } from "@/hooks/use-toast"
import { ChevronDown, UserX, UserCheck, Trash2, Loader2 } from "lucide-react"

interface BulkUserActionsProps {
  users: User[]
  selectedUsers: string[]
  onSelectionChange: (userIds: string[]) => void
  onUsersUpdated: () => void
}

export function BulkUserActions({ users, selectedUsers, onSelectionChange, onUsersUpdated }: BulkUserActionsProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    title: string
    description: string
    action: () => Promise<void>
    destructive?: boolean
  }>({
    open: false,
    title: "",
    description: "",
    action: async () => {},
  })

  const selectedUserObjects = users.filter((user) => selectedUsers.includes(user.id))
  const allSelected = users.length > 0 && selectedUsers.length === users.length
  const someSelected = selectedUsers.length > 0 && selectedUsers.length < users.length

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([])
    } else {
      onSelectionChange(users.map((user) => user.id))
    }
  }

  const handleBulkSuspend = async () => {
    setLoading(true)
    try {
      await Promise.all(selectedUserObjects.map((user) => toggleUserSuspension(user.id, true)))
      toast({
        title: "Users suspended",
        description: `${selectedUsers.length} users have been suspended.`,
      })
      onUsersUpdated()
      onSelectionChange([])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to suspend some users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setConfirmDialog({ ...confirmDialog, open: false })
    }
  }

  const handleBulkUnsuspend = async () => {
    setLoading(true)
    try {
      await Promise.all(selectedUserObjects.map((user) => toggleUserSuspension(user.id, false)))
      toast({
        title: "Users unsuspended",
        description: `${selectedUsers.length} users have been unsuspended.`,
      })
      onUsersUpdated()
      onSelectionChange([])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to unsuspend some users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setConfirmDialog({ ...confirmDialog, open: false })
    }
  }

  const handleBulkActivate = async () => {
    setLoading(true)
    try {
      await Promise.all(selectedUserObjects.map((user) => toggleUserStatus(user.id, true)))
      toast({
        title: "Users activated",
        description: `${selectedUsers.length} users have been activated.`,
      })
      onUsersUpdated()
      onSelectionChange([])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to activate some users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setConfirmDialog({ ...confirmDialog, open: false })
    }
  }

  const handleBulkDeactivate = async () => {
    setLoading(true)
    try {
      await Promise.all(selectedUserObjects.map((user) => toggleUserStatus(user.id, false)))
      toast({
        title: "Users deactivated",
        description: `${selectedUsers.length} users have been deactivated.`,
      })
      onUsersUpdated()
      onSelectionChange([])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to deactivate some users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setConfirmDialog({ ...confirmDialog, open: false })
    }
  }

  const handleBulkDelete = async () => {
    setLoading(true)
    try {
      await Promise.all(selectedUserObjects.map((user) => deleteUser(user.id)))
      toast({
        title: "Users deleted",
        description: `${selectedUsers.length} users have been permanently deleted.`,
      })
      onUsersUpdated()
      onSelectionChange([])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete some users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
      setConfirmDialog({ ...confirmDialog, open: false })
    }
  }

  if (users.length === 0) return null

  return (
    <>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = someSelected
            }}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-muted-foreground">
            {selectedUsers.length > 0 ? `${selectedUsers.length} selected` : "Select all"}
          </span>
        </div>

        {selectedUsers.length > 0 && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Bulk Actions
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>User Status</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  setConfirmDialog({
                    open: true,
                    title: "Activate Users",
                    description: `Are you sure you want to activate ${selectedUsers.length} users?`,
                    action: handleBulkActivate,
                  })
                }
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Activate Selected
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  setConfirmDialog({
                    open: true,
                    title: "Deactivate Users",
                    description: `Are you sure you want to deactivate ${selectedUsers.length} users?`,
                    action: handleBulkDeactivate,
                  })
                }
              >
                <UserX className="mr-2 h-4 w-4" />
                Deactivate Selected
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Suspension</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  setConfirmDialog({
                    open: true,
                    title: "Suspend Users",
                    description: `Are you sure you want to suspend ${selectedUsers.length} users? They will lose access until unsuspended.`,
                    action: handleBulkSuspend,
                  })
                }
              >
                <UserX className="mr-2 h-4 w-4" />
                Suspend Selected
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  setConfirmDialog({
                    open: true,
                    title: "Unsuspend Users",
                    description: `Are you sure you want to unsuspend ${selectedUsers.length} users?`,
                    action: handleBulkUnsuspend,
                  })
                }
              >
                <UserCheck className="mr-2 h-4 w-4" />
                Unsuspend Selected
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  setConfirmDialog({
                    open: true,
                    title: "Delete Users",
                    description: `Are you sure you want to permanently delete ${selectedUsers.length} users? This action cannot be undone.`,
                    action: handleBulkDelete,
                    destructive: true,
                  })
                }
                className="text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Selected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <AlertDialog open={confirmDialog.open} onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmDialog.title}</AlertDialogTitle>
            <AlertDialogDescription>{confirmDialog.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDialog.action}
              disabled={loading}
              className={
                confirmDialog.destructive ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""
              }
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
