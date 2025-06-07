import CampaignsHero from "@/components/sections/CampaignsHero"
import CampaignsFilter from "@/components/sections/CampaignsFilter"
import CampaignsGrid from "@/components/sections/CampaignsGrid"
import CampaignsMap from "@/components/sections/CampaignsMap"

export default function CampaignsPage() {
  return (
    <main className="min-h-screen">
      <CampaignsHero />
      <CampaignsFilter />
      <CampaignsGrid />
      <CampaignsMap />
    </main>
  )
}
