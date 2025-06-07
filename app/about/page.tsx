import AboutHero from "@/components/sections/AboutHero"
import AboutStory from "@/components/sections/AboutStory"
import TeamSection from "@/components/sections/TeamSection"
import ValuesSection from "@/components/sections/ValuesSection"
import TimelineSection from "@/components/sections/TimelineSection"

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <AboutHero />
      <AboutStory />
      <ValuesSection />
      <TimelineSection />
      <TeamSection />
    </main>
  )
}
