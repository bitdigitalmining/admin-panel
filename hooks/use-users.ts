"use client"

import { useState, useEffect } from "react"
import { getUsers, type User, type PaginationOptions } from "@/lib/firestore-admin"
import type { QueryDocumentSnapshot, DocumentData } from "firebase/firestore"

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | undefined>()

  const loadUsers = async (options: PaginationOptions = {}) => {
    try {
      setLoading(true)
      setError(null)

      const result = await getUsers(options)

      if (options.lastDoc) {
        // Pagination - append to existing users
        setUsers((prev) => [...prev, ...result.users])
      } else {
        // Initial load or refresh
        setUsers(result.users)
      }

      setLastDoc(result.lastDoc)
      setHasMore(result.hasMore)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    if (hasMore && !loading && lastDoc) {
      loadUsers({ lastDoc })
    }
  }

  const refresh = () => {
    setUsers([])
    setLastDoc(undefined)
    loadUsers()
  }

  useEffect(() => {
    loadUsers()
  }, [])

  return {
    users,
    loading,
    error,
    hasMore,
    loadMore,
    refresh,
  }
}
