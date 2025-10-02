import { prisma } from "@/lib/database"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AuthService } from "@/lib/auth"
import { StatCard } from "@/components/dashboard/StatCard"
import { BarChart, LineChart } from "@/components/dashboard/Charts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserRole, CampaignStatus } from "@prisma/client"

function ensureRole(role: UserRole, allowed: UserRole[]) {
  if (!allowed.includes(role)) redirect("/auth/login")
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

export default async function VolunteerDashboardPage() {
  const token = cookies().get("accessToken")?.value
  const payload = token ? AuthService.verifyAccessToken(token) : null
  if (!payload) redirect("/auth/login")
  ensureRole(payload.role, [UserRole.VOLUNTEER, UserRole.ADMIN])

  const userId = payload.userId

  const [activeCampaigns, recentActiveCampaigns, userDonations, donationRows] = await Promise.all([
    prisma.campaign.count({ where: { status: CampaignStatus.ACTIVE } }),
    prisma.campaign.findMany({ where: { status: CampaignStatus.ACTIVE }, orderBy: { createdAt: "desc" }, take: 6, select: { id: true, title: true, location: true, goal: true, raised: true } }),
    prisma.donation.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 6 }),
    prisma.donation.findMany({ where: { userId }, select: { amount: true, createdAt: true } }),
  ])

  const totalDonated = userDonations.reduce((sum, d) => sum + d.amount, 0)

  // Build donations by month (last 6 months)
  const now = new Date()
  const months: string[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(monthKey(d))
  }
  const byMonth: Record<string, number> = Object.fromEntries(months.map((m) => [m, 0]))
  for (const row of donationRows) {
    const key = monthKey(row.createdAt)
    if (key in byMonth) byMonth[key] += row.amount
  }
  const donationsSeries = months.map((m) => ({ month: m, amount: Number(byMonth[m].toFixed(2)) }))

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Volunteer Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {payload.email}</p>
        </div>
        <form action="/api/auth/logout" method="post">
          <Button type="submit" variant="outline">Logout</Button>
        </form>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <StatCard title="Active Campaigns" value={activeCampaigns} />
        <StatCard title="Your Donations" value={`$${totalDonated.toFixed(2)}`} subtitle={`${userDonations.length} donations`} />
        <StatCard title="Recent Activity" value={userDonations.length > 0 ? userDonations[0].createdAt.toDateString() : "No recent"} />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Donations (last 6 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart data={donationsSeries} xKey="month" yKey="amount" label="Amount" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Explore Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActiveCampaigns.map((c) => (
                <div key={c.id} className="flex items-center justify-between border-b last:border-b-0 py-2">
                  <div>
                    <p className="text-sm font-medium">{c.title}</p>
                    <p className="text-xs text-muted-foreground">{c.location} • Raised ${c.raised.toLocaleString()} of ${c.goal.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Donations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {userDonations.map((d) => (
              <div key={d.id} className="flex items-center justify-between border-b last:border-b-0 py-2">
                <div>
                  <p className="text-sm font-medium">${"$"}{d.amount.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{d.createdAt.toDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
