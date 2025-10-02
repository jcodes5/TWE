"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("VOLUNTEER")
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

  async function updateUser(id: string, patch: Partial<User>) {
    await fetch(`/api/admin/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    })
    await load()
  }

  async function deleteUser(id: string) {
    await fetch(`/api/admin/users/${id}`, { method: "DELETE" })
    await load()
  }

  const headline = useMemo(() => (roleFilter === "SPONSOR" ? "Manage Sponsors" : roleFilter === "VOLUNTEER" ? "Manage Volunteers" : "Manage Users"), [roleFilter])

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>{headline}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Select value={roleFilter} onValueChange={(v) => setRoleFilter(v as Role | "ALL") }>
            <SelectTrigger><SelectValue placeholder="Filter by role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="VOLUNTEER">Volunteers</SelectItem>
              <SelectItem value="SPONSOR">Sponsors</SelectItem>
              <SelectItem value="ALL">All</SelectItem>
            </SelectContent>
          </Select>

          <div className="h-px bg-border/60 my-2" />

          <p className="text-sm font-medium">Create User</p>
          <Input placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          <Input placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          <Input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as Role })}>
            <SelectTrigger><SelectValue placeholder="Role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="VOLUNTEER">Volunteer</SelectItem>
              <SelectItem value="SPONSOR">Sponsor</SelectItem>
            </SelectContent>
          </Select>
          <Input placeholder="Temporary Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <Button onClick={createUser} disabled={loading || !form.email || !form.firstName || !form.lastName || !form.password}>Create</Button>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? <p>Loading...</p> : null}
          {users.map((u) => (
            <div key={u.id} className="flex items-start justify-between gap-4 border-b py-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{u.firstName} {u.lastName}</h3>
                  <Badge variant="secondary">{u.role}</Badge>
                  <Badge>{u.verified ? "Verified" : "Unverified"}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{u.email} {u.phone ? `• ${u.phone}` : ""}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => updateUser(u.id, { verified: !u.verified })}>{u.verified ? "Unverify" : "Verify"}</Button>
                <Select value={u.role} onValueChange={(v) => updateUser(u.id, { role: v as Role })}>
                  <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VOLUNTEER">Volunteer</SelectItem>
                    <SelectItem value="SPONSOR">Sponsor</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="destructive" size="sm" onClick={() => deleteUser(u.id)}>Delete</Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
