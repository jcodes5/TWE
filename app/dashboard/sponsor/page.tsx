import { prisma } from "@/lib/database"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AuthService } from "@/lib/auth"
import { StatCard } from "@/components/dashboard/StatCard"
import { DonutChart, LineChart } from "@/components/dashboard/Charts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserRole } from "@prisma/client"

function ensureRole(role: UserRole, allowed: UserRole[]) {
  if (!allowed.includes(role)) redirect("/auth/login")
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

export default async function SponsorDashboardPage() {
  const token = cookies().get("accessToken")?.value
  const payload = token ? AuthService.verifyAccessToken(token) : null
  if (!payload) redirect("/auth/login")
  ensureRole(payload.role, [UserRole.SPONSOR, UserRole.ADMIN])

  const userId = payload.userId

  const [donations, donationRows, byCampaignRaw, suggestedCampaigns] = await Promise.all([
    prisma.donation.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, include: { campaign: true }, take: 8 }),
    prisma.donation.findMany({ where: { userId }, select: { amount: true, createdAt: true } }),
    prisma.donation.groupBy({ by: ["campaignId"], where: { userId }, _sum: { amount: true } }),
    prisma.campaign.findMany({ where: { status: "ACTIVE" }, orderBy: { createdAt: "desc" }, take: 6, select: { id: true, title: true, location: true, goal: true, raised: true } }),
  ])

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0)

  // Donations by month
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

  // Donations by campaign (for donut)
  const campaignIds = byCampaignRaw.map((r) => r.campaignId)
  const campaignMap = new Map<string, string>()
  const campaigns = await prisma.campaign.findMany({ where: { id: { in: campaignIds } }, select: { id: true, title: true } })
  campaigns.forEach((c) => campaignMap.set(c.id, c.title))
  const byCampaign = byCampaignRaw.map((r) => ({ name: campaignMap.get(r.campaignId) || r.campaignId, value: Number((r._sum.amount || 0).toFixed(2)) }))

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Sponsor Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {payload.email}</p>
        </div>
        <form action="/api/auth/logout" method="post">
          <Button type="submit" variant="outline">Logout</Button>
        </form>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
        <StatCard title="Total Donated" value={`$${totalDonated.toFixed(2)}`} subtitle={`${donations.length} donations`} />
        <StatCard title="Supported Campaigns" value={byCampaign.length} />
        <StatCard title="Last Donation" value={donations[0] ? `$${donations[0].amount.toFixed(2)}` : "N/A"} subtitle={donations[0] ? donations[0].createdAt.toDateString() : "No donations yet"} />
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Your Donations (last 6 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart data={donationsSeries} xKey="month" yKey="amount" label="Amount" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Donations by Campaign</CardTitle>
          </CardHeader>
          <CardContent>
            <DonutChart data={byCampaign} nameKey="name" valueKey="value" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {donations.map((d) => (
                <div key={d.id} className="flex items-center justify-between border-b last:border-b-0 py-2">
                  <div>
                    <p className="text-sm font-medium">${"$"}{d.amount.toFixed(2)} • {d.campaign.title}</p>
                    <p className="text-xs text-muted-foreground">{d.createdAt.toDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Suggested Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {suggestedCampaigns.map((c) => (
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
    </div>
  )
}
