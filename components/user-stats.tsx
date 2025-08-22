"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserX, Shield, DollarSign, Globe } from "lucide-react"
import type { User } from "@/lib/firestore-admin"

interface UserStatsProps {
  users: User[]
}

export function UserStats({ users }: UserStatsProps) {
  const totalUsers = users.length
  const activeUsers = users.filter((user) => user.isActive).length
  const suspendedUsers = users.filter((user) => user.isSuspended).length
  const adminUsers = users.filter((user) => user.role === "admin").length

  const totalBalance = users.reduce((sum, user) => sum + (user.balance || 0), 0)
  const uniqueCountries = new Set(users.filter((user) => user.country).map((user) => user.country)).size

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      description: "All registered users",
    },
    {
      title: "Active Users",
      value: activeUsers,
      icon: UserCheck,
      description: "Currently active accounts",
    },
    {
      title: "Total Balance",
      value: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(totalBalance),
      icon: DollarSign,
      description: "Combined user balances",
    },
    {
      title: "Countries",
      value: uniqueCountries,
      icon: Globe,
      description: "Unique countries represented",
    },
    {
      title: "Suspended",
      value: suspendedUsers,
      icon: UserX,
      description: "Suspended accounts",
    },
    {
      title: "Admins",
      value: adminUsers,
      icon: Shield,
      description: "Admin users",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
