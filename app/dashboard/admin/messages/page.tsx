import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AuthService } from "@/lib/auth"
import { UserRole } from "@prisma/client"
import NotificationsPanel from "@/components/admin/NotificationsPanel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function ensureRole(role: UserRole, allowed: UserRole[]) {
  if (!allowed.includes(role)) redirect("/auth/login")
}

export default async function AdminMessagesPage() {
  const token = cookies().get("accessToken")?.value
  const payload = token ? AuthService.verifyAccessToken(token) : null
  if (!payload) redirect("/auth/login")
  ensureRole(payload.role, [UserRole.ADMIN])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <NotificationsPanel />
        </CardContent>
      </Card>
    </div>
  )
}
