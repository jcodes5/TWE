import { prisma } from "@/lib/database";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AuthService } from "@/lib/auth";
import { StatCard } from "@/components/dashboard/StatCard";
import { BarChart, DonutChart, LineChart } from "@/components/dashboard/Charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import BlogManager from "@/components/admin/BlogManager";
import CampaignManager from "@/components/admin/CampaignManager";
import UsersManager from "@/components/admin/UsersManager";
import ContactsManager from "@/components/admin/ContactsManager";
import NotificationsPanel from "@/components/admin/NotificationsPanel";
import ExportData from "@/components/admin/ExportData";
import { UserRole, CampaignStatus, PostStatus } from "@prisma/client";
import {
  Plus,
  Pen,
  UserPlus,
  Settings,
  TrendingUp,
  Target,
  Users as UsersIcon,
  DollarSign,
} from "lucide-react";

export const dynamic = "force-dynamic";

function ensureRole(role: UserRole, allowed: UserRole[]) {
  if (!allowed.includes(role)) redirect("/auth/login");
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
}

export default async function AdminDashboardPage() {
  const token = cookies().get("accessToken")?.value;
  const payload = token ? await AuthService.verifyAccessToken(token) : null;
  if (!payload) redirect("/auth/login");
  ensureRole((payload as any).role, [UserRole.ADMIN]);

  const [
    totalUsers,
    volunteers,
    sponsors,
    admins,
    totalCampaigns,
    activeCampaigns,
    draftCampaigns,
    completedCampaigns,
    publishedPosts,
    draftPosts,
    totalDonationsAgg,
    recentDonations,
    recentUsers,
    donationRows,
    donationsByCampaign,
  ] = await Promise.all([
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
    prisma.donation.findMany({
      include: { user: true, campaign: true },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
    }),
    prisma.donation.findMany({ select: { amount: true, createdAt: true } }),
    prisma.donation.groupBy({ by: ["campaignId"], _sum: { amount: true } }),
  ]);

  // Build donations by month for the last 6 months
  const now = new Date();
  const months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push(monthKey(d));
  }

  const donationsByMonth = months.map((month) => {
    const amount = donationRows
      .filter((d) => monthKey(new Date(d.createdAt)) === month)
      .reduce((sum, d) => sum + d.amount, 0);
    return { month, amount };
  });

  // Build campaign donation data
  const campaignDonations = donationsByCampaign.map((c) => ({
    name: `Campaign ${c.campaignId}`,
    value: c._sum.amount || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/15 transition-colors">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Plus className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium">Create New Campaign</h3>
              <p className="text-xs text-muted-foreground truncate">
                Manage fundraising and activities
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/15 transition-colors">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Pen className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium">Write Blog Post</h3>
              <p className="text-xs text-muted-foreground truncate">
                Share updates and stories
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/15 transition-colors">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium">Add New User</h3>
              <p className="text-xs text-muted-foreground truncate">
                Manage volunteers and sponsors
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/15 transition-colors">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
              <Settings className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium">Site Settings</h3>
              <p className="text-xs text-muted-foreground truncate">
                Manage general settings
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Export Section */}
      <ExportData />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={totalUsers}
          subtitle={`+${volunteers} volunteers, +${sponsors} sponsors`}
          icon={<UsersIcon className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Active Campaigns"
          value={activeCampaigns}
          subtitle={`${((activeCampaigns / totalCampaigns) * 100).toFixed(
            1
          )}% of total`}
          icon={<Target className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Published Posts"
          value={publishedPosts}
          subtitle={`${(
            (publishedPosts / (publishedPosts + draftPosts)) *
            100
          ).toFixed(1)}% of total`}
          icon={<Pen className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Total Donations"
          value={`$${totalDonationsAgg._sum.amount?.toLocaleString() || "0"}`}
          subtitle="Across all campaigns"
          icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Charts */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Donations Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LineChart
                data={donationsByMonth}
                xKey="month"
                yKey="amount"
                label="Donations"
              />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart
                  data={campaignDonations}
                  xKey="name"
                  yKey="value"
                  label="Donations"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Campaign Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <DonutChart
                  data={[
                    { name: "Active", value: activeCampaigns },
                    { name: "Draft", value: draftCampaigns },
                    { name: "Completed", value: completedCampaigns },
                  ]}
                  nameKey="name"
                  valueKey="value"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column - Recent Activity and Notifications */}
        <div className="space-y-6">
          <NotificationsPanel />

          <Card>
            <CardHeader>
              <CardTitle>Recent Donations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentDonations.map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {donation.user.firstName} {donation.user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {donation.campaign.title}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      ${donation.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {user.role.toLowerCase()}
                      </p>
                    </div>
                    <Badge
                      variant={
                        user.role === "ADMIN"
                          ? "default"
                          : user.role === "SPONSOR"
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {user.role}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs for Management Sections */}
      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <CampaignManager />
        </TabsContent>

        <TabsContent value="blog" className="space-y-4">
          <BlogManager />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <UsersManager />
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <ContactsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
