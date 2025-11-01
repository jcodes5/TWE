"use client"

import CampaignsHero from "@/components/sections/CampaignsHero"
import CampaignsFilter from "@/components/sections/CampaignsFilter"
import CampaignsMap from "@/components/sections/CampaignsMap"
import CampaignSearchClient from "@/components/sections/CampaignSearchClient"

export default function CampaignsPage() {
  return (
    <main className="min-h-screen">
      <CampaignsHero />
      {/* <CampaignsFilter />b */}
      <CampaignSearchClient />
      <CampaignsMap />
    </main>
  )
}
