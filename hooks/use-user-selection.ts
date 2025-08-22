"use client"

import { useState, useCallback } from "react"

export function useUserSelection() {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  const toggleUser = useCallback((userId: string) => {
    setSelectedUsers((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]))
  }, [])

  const selectAll = useCallback((userIds: string[]) => {
    setSelectedUsers(userIds)
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedUsers([])
  }, [])

  const isSelected = useCallback(
    (userId: string) => {
      return selectedUsers.includes(userId)
    },
    [selectedUsers],
  )

  return {
    selectedUsers,
    toggleUser,
    selectAll,
    clearSelection,
    isSelected,
    setSelectedUsers,
  }
}
