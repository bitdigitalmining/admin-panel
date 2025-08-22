"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
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
import { toggleUserSuspension, toggleUserStatus, type User } from "@/lib/firestore-admin"
import { useToast } from "@/hooks/use-toast"
import { UserX, UserCheck, Loader2 } from "lucide-react"

interface UserActionsProps {
  user: User
  onUserUpdated: () => void
}

export function UserActions({ user, onUserUpdated }: UserActionsProps) {
  const { toast } = useToast()
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleToggleSuspension = async () => {
    setLoading(true)
    try {
      await toggleUserSuspension(user.id, !user.isSuspended)
      toast({
        title: user.isSuspended ? "User unsuspended" : "User suspended",
        description: `${user.email} has been ${user.isSuspended ? "unsuspended" : "suspended"}.`,
      })
      onUserUpdated()
      setSuspendDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleStatus = async () => {
    setLoading(true)
    try {
      await toggleUserStatus(user.id, !user.isActive)
      toast({
        title: user.isActive ? "User deactivated" : "User activated",
        description: `${user.email} has been ${user.isActive ? "deactivated" : "activated"}.`,
      })
      onUserUpdated()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleToggleStatus}
          disabled={loading}
          className="flex items-center space-x-1 bg-transparent"
        >
          {loading ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : user.isActive ? (
            <UserX className="h-3 w-3" />
          ) : (
            <UserCheck className="h-3 w-3" />
          )}
          <span>{user.isActive ? "Deactivate" : "Activate"}</span>
        </Button>

        <Button
          variant={user.isSuspended ? "default" : "destructive"}
          size="sm"
          onClick={() => setSuspendDialogOpen(true)}
          disabled={loading}
          className="flex items-center space-x-1"
        >
          {user.isSuspended ? <UserCheck className="h-3 w-3" /> : <UserX className="h-3 w-3" />}
          <span>{user.isSuspended ? "Unsuspend" : "Suspend"}</span>
        </Button>
      </div>

      <AlertDialog open={suspendDialogOpen} onOpenChange={setSuspendDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{user.isSuspended ? "Unsuspend User" : "Suspend User"}</AlertDialogTitle>
            <AlertDialogDescription>
              {user.isSuspended
                ? `Are you sure you want to unsuspend ${user.email}? They will regain access to their account.`
                : `Are you sure you want to suspend ${user.email}? They will lose access to their account until unsuspended.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleSuspension}
              disabled={loading}
              className={user.isSuspended ? "" : "bg-destructive text-destructive-foreground hover:bg-destructive/90"}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {user.isSuspended ? "Unsuspend" : "Suspend"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
