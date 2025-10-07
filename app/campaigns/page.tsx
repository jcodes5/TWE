import CampaignsHero from "@/components/sections/CampaignsHero"
import CampaignsFilter from "@/components/sections/CampaignsFilter"
import CampaignsMap from "@/components/sections/CampaignsMap"
import CampaignsGridClient, { CampaignItem } from "@/components/sections/CampaignsGridClient"
import { prisma } from "@/lib/database"
import { CampaignStatus } from "@prisma/client"

export default async function CampaignsPage() {
  const campaigns = await prisma.campaign.findMany({
    where: { status: CampaignStatus.ACTIVE },
    orderBy: { createdAt: "desc" },
    take: 12,
  })

  const mapped: CampaignItem[] = campaigns.map(c => ({
    id: c.id,
    title: c.title,
    description: c.description,
    image: c.image ?? null,
    location: c.location,
    category: c.category,
    goal: c.goal,
    raised: c.raised,
    status: c.status,
  }))

  return (
    <main className="min-h-screen">
      <CampaignsHero />
      <CampaignsFilter />
      <CampaignsGridClient campaigns={mapped} />
      <CampaignsMap />
    </main>
  )
}
