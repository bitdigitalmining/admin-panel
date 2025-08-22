"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUsers } from "@/hooks/use-users"
import type { User } from "@/lib/firestore-admin"
import { Search, MoreHorizontal, UserCheck, UserX, Edit, Trash2 } from "lucide-react"

interface UserListProps {
  onEditUser: (user: User) => void
  onDeleteUser: (user: User) => void
  onToggleSuspension: (user: User) => void
}

export function UserList({ onEditUser, onDeleteUser, onToggleSuspension }: UserListProps) {
  const { users, loading, error, hasMore, loadMore, refresh } = useUsers()
  const [searchTerm, setSearchTerm] = useState("")

  const filteredUsers = users.filter(
    (user) =>
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getInitials = (name?: string, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    if (email) {
      return email[0].toUpperCase()
    }
    return "U"
  }

  const formatDate = (date: any) => {
    if (!date) return "Never"
    const dateObj = date.toDate ? date.toDate() : new Date(date)
    return format(dateObj, "MMM dd, yyyy")
  }

  const formatBalance = (balance?: number, currency?: string) => {
    if (balance === undefined || balance === null) return "N/A"

    const currencyMap: Record<string, string> = {
      dollar: "USD",
      dollars: "USD",
      usd: "USD",
      euro: "EUR",
      euros: "EUR",
      eur: "EUR",
      pound: "GBP",
      pounds: "GBP",
      gbp: "GBP",
      yen: "JPY",
      jpy: "JPY",
      cad: "CAD",
      aud: "AUD",
      chf: "CHF",
      cny: "CNY",
      inr: "INR",
    }

    let validCurrency = "USD" // Default fallback

    if (currency) {
      const normalizedCurrency = currency.toLowerCase().trim()
      validCurrency = currencyMap[normalizedCurrency] || currency.toUpperCase()
    }

    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: validCurrency,
      }).format(balance)
    } catch (error) {
      return `${validCurrency} ${balance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-destructive">
            <p>Error loading users: {error}</p>
            <Button onClick={refresh} className="mt-4">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage user accounts and permissions</CardDescription>
          </div>
          <Button onClick={refresh} variant="outline">
            Refresh
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && users.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        ) : (
          <>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Country</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead className="w-[70px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {getInitials(user.fullname, user.email)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.fullname || "No name"}</p>
                            <p className="text-sm text-muted-foreground">ID: {user.id.slice(0, 8)}...</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{user.username || "N/A"}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-mono text-sm">{formatBalance(user.balance, user.currency)}</span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">{user.country || "N/A"}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Badge
                            variant={user.isActive ? "default" : "destructive"}
                            className={user.isActive ? "bg-green-500 hover:bg-green-600" : ""}
                          >
                            {user.isActive ? "Active" : "Inactive"}
                          </Badge>
                          {user.isSuspended && <Badge variant="destructive">Suspended</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role || "User"}</Badge>
                      </TableCell>
                      <TableCell>{formatDate(user.registrationDate)}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => onEditUser(user)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onToggleSuspension(user)}>
                              {user.isSuspended ? (
                                <>
                                  <UserCheck className="mr-2 h-4 w-4" />
                                  Unsuspend
                                </>
                              ) : (
                                <>
                                  <UserX className="mr-2 h-4 w-4" />
                                  Suspend
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onDeleteUser(user)} className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredUsers.length === 0 && !loading && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">
                  {searchTerm ? "No users found matching your search." : "No users found."}
                </p>
              </div>
            )}

            {hasMore && (
              <div className="flex justify-center mt-4">
                <Button onClick={loadMore} variant="outline" disabled={loading}>
                  {loading ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
