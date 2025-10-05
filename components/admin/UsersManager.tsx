"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter } from "lucide-react"

export type Role = "VOLUNTEER" | "SPONSOR" | "ADMIN"

type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string | null
  role: Role
  verified: boolean
  createdAt: string
}

export default function UsersManager() {
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL")
  const [searchQuery, setSearchQuery] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: "", firstName: "", lastName: "", phone: "", role: "VOLUNTEER" as Role, password: "" })

  async function load() {
    setLoading(true)
    const qs = roleFilter === "ALL" ? "" : `?role=${roleFilter}`
    const res = await fetch(`/api/admin/users${qs}`)
    const data = await res.json()
    setUsers(data.users || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [roleFilter])

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = 
        user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesRole = roleFilter === "ALL" || user.role === roleFilter
      
      return matchesSearch && matchesRole
    })
  }, [users, searchQuery, roleFilter])

  async function createUser() {
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ email: "", firstName: "", lastName: "", phone: "", role: "VOLUNTEER", password: "" })
      await load()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users Management</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Select value={roleFilter} onValueChange={(value: Role | "ALL") => setRoleFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Filter by role" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="VOLUNTEER">Volunteers</SelectItem>
                <SelectItem value="SPONSOR">Sponsors</SelectItem>
                <SelectItem value="ADMIN">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredUsers.map(user => (
              <Card key={user.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{user.firstName} {user.lastName}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Badge variant={user.role === "ADMIN" ? "default" : user.role === "SPONSOR" ? "secondary" : "outline"}>
                      {user.role}
                    </Badge>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                    <Badge variant={user.verified ? "default" : "destructive"} className="text-xs">
                      {user.verified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {filteredUsers.length === 0 && (
            <div className="text-center py-10 text-muted-foreground">
              No users found
            </div>
          )}
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium mb-4">Add New User</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="First Name"
              value={form.firstName}
              onChange={e => setForm({...form, firstName: e.target.value})}
            />
            <Input
              placeholder="Last Name"
              value={form.lastName}
              onChange={e => setForm({...form, lastName: e.target.value})}
            />
            <Input
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
            />
            <Input
              placeholder="Phone"
              value={form.phone}
              onChange={e => setForm({...form, phone: e.target.value})}
            />
            <Select value={form.role} onValueChange={value => setForm({...form, role: value as Role})}>
              <SelectTrigger>
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="VOLUNTEER">Volunteer</SelectItem>
                <SelectItem value="SPONSOR">Sponsor</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Input
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
            />
          </div>
          <Button className="mt-4" onClick={createUser}>Create User</Button>
        </div>
      </CardContent>
    </Card>
  )
}