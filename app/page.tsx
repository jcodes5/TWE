
import Hero from "@/components/sections/Hero"
import Mission from "@/components/sections/Mission"
import Stats from "@/components/sections/Stats"
import Campaigns from "@/components/sections/Campaigns"
import CallToAction from "@/components/sections/CallToAction"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <Mission />
      <Stats />
      <Campaigns />
      <CallToAction />
    </div>
  )
}
