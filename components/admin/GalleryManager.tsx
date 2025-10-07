"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { Trash2 } from "lucide-react"

type ImageItem = {
  id: string
  title: string
  url: string
  publicId: string
  category?: string | null
  description?: string | null
  takenAt?: string | null
  location?: string | null
  createdAt: string
}

export default function GalleryManager() {
  const [images, setImages] = useState<ImageItem[]>([])
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [form, setForm] = useState({ title: "", category: "", description: "", takenAt: "", location: "" })

  async function load() {
    setLoading(true)
    const res = await fetch("/api/admin/gallery")
    const data = await res.json()
    setImages(data.images || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function onUpload() {
    if (!file || !form.title) return
    const fd = new FormData()
    fd.append("file", file)
    const up = await fetch("/api/admin/gallery/upload", { method: "POST", body: fd })
    if (!up.ok) return
    const { url, publicId } = await up.json()

    const res = await fetch("/api/admin/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        category: form.category || undefined,
        description: form.description || undefined,
        takenAt: form.takenAt || undefined,
        location: form.location || undefined,
        url,
        publicId,
      }),
    })
    if (res.ok) {
      setForm({ title: "", category: "", description: "", takenAt: "", location: "" })
      setFile(null)
      await load()
    }
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this image?")) return
    const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" })
    if (res.ok) await load()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gallery</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          </div>
          <div className="md:col-span-2 space-y-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Taken At</Label>
            <Input type="date" value={form.takenAt} onChange={e => setForm({ ...form, takenAt: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Location</Label>
            <Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label>Image File</Label>
            <Input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} />
          </div>
          <div className="flex items-end">
            <Button onClick={onUpload} disabled={loading || !file || !form.title}>Upload</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map(img => (
            <div key={img.id} className="border rounded-lg overflow-hidden">
              <div className="relative w-full h-48">
                <Image src={img.url} alt={img.title} fill className="object-cover" />
              </div>
              <div className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{img.title}</div>
                  <div className="text-xs text-muted-foreground">{img.category}</div>
                </div>
                <Button variant="destructive" size="icon" onClick={() => onDelete(img.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
