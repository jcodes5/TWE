"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Campaign = {
  id: string
  title: string
  description: string
  content: string
  image?: string | null
  goal: number
  raised: number
  category: string
  location: string
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED"
  createdAt: string
  createdBy: { id: string; firstName: string; lastName: string; email: string }
  _count?: { donations: number }
}

export default function CampaignManager() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: "", description: "", content: "", image: "", goal: 0, category: "General", location: "", status: "DRAFT" as Campaign["status"] })

  async function load() {
    setLoading(true)
    const res = await fetch("/api/admin/campaigns")
    const data = await res.json()
    setCampaigns(data.campaigns || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function createCampaign() {
    const res = await fetch("/api/admin/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, goal: Number(form.goal) }),
    })
    if (res.ok) {
      setForm({ title: "", description: "", content: "", image: "", goal: 0, category: "General", location: "", status: "DRAFT" })
      await load()
    }
  }

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Create Campaign</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <Input type="number" placeholder="Goal (USD)" value={form.goal} onChange={(e) => setForm({ ...form, goal: Number(e.target.value) })} />
          <Input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          <Textarea placeholder="Short description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Textarea placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="min-h-32" />
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Campaign["status"] })}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={createCampaign} disabled={loading || !form.title || !form.description || !form.content || !form.location || !form.goal}>Create</Button>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? <p>Loading...</p> : null}
          {campaigns.map((c) => (
            <div key={c.id} className="flex items-start justify-between gap-4 border-b py-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{c.title}</h3>
                  <Badge variant="secondary">{c.category}</Badge>
                  <Badge>{c.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{c.location} • Goal ${c.goal.toLocaleString()} • Raised ${c.raised.toLocaleString()}</p>
                <p className="text-sm mt-1 line-clamp-2">{c.description}</p>
              </div>
              <div className="text-xs text-muted-foreground">{c._count?.donations || 0} donations</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
