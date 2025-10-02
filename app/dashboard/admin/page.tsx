import { prisma } from "@/lib/database"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AuthService } from "@/lib/auth"
import { StatCard } from "@/components/dashboard/StatCard"
import { BarChart, DonutChart, LineChart } from "@/components/dashboard/Charts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BlogManager from "@/components/admin/BlogManager"
import CampaignManager from "@/components/admin/CampaignManager"
import UsersManager from "@/components/admin/UsersManager"
import ContactsManager from "@/components/admin/ContactsManager"
import { UserRole, CampaignStatus, PostStatus } from "@prisma/client"

function ensureRole(role: UserRole, allowed: UserRole[]) {
  if (!allowed.includes(role)) redirect("/auth/login")
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
}

export default async function AdminDashboardPage() {
  const token = cookies().get("accessToken")?.value
  const payload = token ? AuthService.verifyAccessToken(token) : null
  if (!payload) redirect("/auth/login")
  ensureRole(payload.role, [UserRole.ADMIN])

  const [totalUsers, volunteers, sponsors, admins, totalCampaigns, activeCampaigns, draftCampaigns, completedCampaigns, publishedPosts, draftPosts, totalDonationsAgg, recentDonations, recentUsers, donationRows, donationsByCampaign] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "VOLUNTEER" } }),
    prisma.user.count({ where: { role: "SPONSOR" } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
    prisma.campaign.count(),
    prisma.campaign.count({ where: { status: CampaignStatus.ACTIVE } }),
    prisma.campaign.count({ where: { status: CampaignStatus.DRAFT } }),
    prisma.campaign.count({ where: { status: CampaignStatus.COMPLETED } }),
    prisma.blogPost.count({ where: { status: PostStatus.PUBLISHED } }),
    prisma.blogPost.count({ where: { status: PostStatus.DRAFT } }),
    prisma.donation.aggregate({ _sum: { amount: true } }),
    prisma.donation.findMany({ include: { user: true, campaign: true }, orderBy: { createdAt: "desc" }, take: 8 }),
    prisma.user.findMany({ orderBy: { createdAt: "desc" }, take: 6, select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true } }),
    prisma.donation.findMany({ select: { amount: true, createdAt: true } }),
    prisma.donation.groupBy({ by: ["campaignId"], _sum: { amount: true } }),
  ])

  // Build donations by month for the last 6 months
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

  // Map top campaigns by raised amount
  const campaignMap = new Map<string, { title: string | null }>()
  const campaignIds = donationsByCampaign.map((d) => d.campaignId)
  const campaigns = await prisma.campaign.findMany({ where: { id: { in: campaignIds } }, select: { id: true, title: true } })
  campaigns.forEach((c) => campaignMap.set(c.id, { title: c.title }))
  const topCampaigns = donationsByCampaign
    .map((d) => ({ name: campaignMap.get(d.campaignId)?.title || d.campaignId, value: Number((d._sum.amount || 0).toFixed(2)) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  const totalDonations = Number((totalDonationsAgg._sum.amount || 0).toFixed(2))

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back, {payload.email}</p>
        </div>
        <form action="/api/auth/logout" method="post">
          <Button type="submit" variant="outline">Logout</Button>
        </form>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="blogs">Blogs</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Users" value={totalUsers} subtitle={`${admins} Admin • ${volunteers} Volunteers • ${sponsors} Sponsors`} />
            <StatCard title="Campaigns" value={totalCampaigns} subtitle={`${activeCampaigns} Active • ${completedCampaigns} Completed • ${draftCampaigns} Draft`} />
            <StatCard title="Published Posts" value={publishedPosts} subtitle={`${draftPosts} Draft`} />
            <StatCard title="Total Donations" value={`$${totalDonations.toLocaleString()}`} subtitle="All-time" />
          </div>

          <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Donations (last 6 months)</CardTitle>
              </CardHeader>
              <CardContent>
                <LineChart data={donationsSeries} xKey="month" yKey="amount" label="Donations" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Campaigns by Funds</CardTitle>
              </CardHeader>
              <CardContent>
                <DonutChart data={topCampaigns} nameKey="name" valueKey="value" />
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
                  {recentDonations.map((d) => (
                    <div key={d.id} className="flex items-center justify-between border-b last:border-b-0 py-2">
                      <div>
                        <p className="text-sm font-medium">${"$"}{d.amount.toFixed(2)} to {d.campaign.title}</p>
                        <p className="text-xs text-muted-foreground">{d.user.firstName} {d.user.lastName} • {d.createdAt.toDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>New Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentUsers.map((u) => (
                    <div key={u.id} className="flex items-center justify-between border-b last:border-b-0 py-2">
                      <div>
                        <p className="text-sm font-medium">{u.firstName} {u.lastName}</p>
                        <p className="text-xs text-muted-foreground">{u.email} • {u.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blogs">
          <BlogManager />
        </TabsContent>

        <TabsContent value="campaigns">
          <CampaignManager />
        </TabsContent>

        <TabsContent value="users">
          <UsersManager />
        </TabsContent>

        <TabsContent value="contacts">
          <ContactsManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
