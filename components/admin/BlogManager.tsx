"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

type Post = {
  id: string
  title: string
  content: string
  excerpt?: string | null
  image?: string | null
  category: string
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED"
  createdAt: string
  author: { id: string; firstName: string; lastName: string; email: string }
  _count?: { comments: number }
}

export default function BlogManager() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ title: "", content: "", excerpt: "", image: "", category: "General", status: "DRAFT" as Post["status"] })

  async function load() {
    setLoading(true)
    const res = await fetch("/api/admin/blogs")
    const data = await res.json()
    setPosts(data.posts || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function createPost() {
    const res = await fetch("/api/admin/blogs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      setForm({ title: "", content: "", excerpt: "", image: "", category: "General", status: "DRAFT" })
      await load()
    }
  }

  return (
    <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle>Create Blog Post</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Input placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          <Textarea placeholder="Excerpt" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} />
          <Textarea placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="min-h-32" />
          <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v as Post["status"] })}>
            <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="DRAFT">Draft</SelectItem>
              <SelectItem value="PUBLISHED">Published</SelectItem>
              <SelectItem value="ARCHIVED">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={createPost} disabled={loading || !form.title || !form.content}>Publish</Button>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {loading ? <p>Loading...</p> : null}
          {posts.map((p) => (
            <div key={p.id} className="flex items-start justify-between gap-4 border-b py-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{p.title}</h3>
                  <Badge variant="secondary">{p.category}</Badge>
                  <Badge>{p.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">by {p.author.firstName} {p.author.lastName} • {new Date(p.createdAt).toDateString()}</p>
                {p.excerpt ? <p className="text-sm mt-1 line-clamp-2">{p.excerpt}</p> : null}
              </div>
              <div className="text-xs text-muted-foreground">{p._count?.comments || 0} comments</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
