import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AuthService } from "@/lib/auth"
import { UserRole } from "@prisma/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

function ensureRole(role: UserRole, allowed: UserRole[]) {
  if (!allowed.includes(role)) redirect("/auth/login")
}

export default async function AdminSettingsPage() {
  const token = cookies().get("accessToken")?.value
  const payload = token ? AuthService.verifyAccessToken(token) : null
  if (!payload) redirect("/auth/login")
  ensureRole(payload.role, [UserRole.ADMIN])

  return (
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
  )
}
