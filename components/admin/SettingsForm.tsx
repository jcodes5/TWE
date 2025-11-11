"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface Setting {
  id: string
  key: string
  value: string
  description?: string
  category: string
}

export default function SettingsForm() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings")
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      } else {
        toast({
          title: "Error",
          description: "Failed to load settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = async (key: string, value: string, description?: string, category: string = "general") => {
    setSaving(true)
    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key, value, description, category }),
      })

      if (response.ok) {
        const updatedSetting = await response.json()
        setSettings(prev =>
          prev.map(setting =>
            setting.key === key ? updatedSetting : setting
          )
        )
        toast({
          title: "Success",
          description: "Setting updated successfully",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update setting",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update setting",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePrivacyPolicySave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const content = formData.get("privacyPolicy") as string
    await updateSetting("privacy_policy", content, "Privacy Policy content", "legal")
  }

  const handleTermsOfServiceSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const content = formData.get("termsOfService") as string
    await updateSetting("terms_of_service", content, "Terms of Service content", "legal")
  }

  const getSettingValue = (key: string) => {
    const setting = settings.find(s => s.key === key)
    return setting?.value || ""
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="organization" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="organization">Organization</TabsTrigger>
          <TabsTrigger value="legal">Legal Content</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="organization" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Organization Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="orgName">Name</Label>
                  <Input id="orgName" name="orgName" placeholder="The Weather & Everything" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="orgEmail">Contact Email</Label>
                  <Input id="orgEmail" name="orgEmail" type="email" placeholder="contact@twe.org" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="orgSite">Website</Label>
                  <Input id="orgSite" name="orgSite" type="url" placeholder="https://twe.org" />
                </div>
                <Button type="submit">Save</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="legal" className="space-y-6">
          <div className="grid gap-6 grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePrivacyPolicySave} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="privacyPolicy">Content</Label>
                    <Textarea
                      id="privacyPolicy"
                      name="privacyPolicy"
                      placeholder="Enter your privacy policy content here..."
                      rows={20}
                      className="min-h-[400px]"
                      defaultValue={getSettingValue("privacy_policy")}
                    />
                  </div>
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Privacy Policy
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Terms of Service</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleTermsOfServiceSave} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="termsOfService">Content</Label>
                    <Textarea
                      id="termsOfService"
                      name="termsOfService"
                      placeholder="Enter your terms of service content here..."
                      rows={20}
                      className="min-h-[400px]"
                      defaultValue={getSettingValue("terms_of_service")}
                    />
                  </div>
                  <Button type="submit" disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Terms of Service
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="adminEmail">Admin Email</Label>
                  <Input id="adminEmail" name="adminEmail" type="email" placeholder="admin@twe.org" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="adminPassword">Change Password</Label>
                  <Input id="adminPassword" name="adminPassword" type="password" placeholder="••••••••" />
                </div>
                <Button type="submit" variant="outline">Update</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}