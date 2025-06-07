import Hero from "@/components/sections/Hero"
import Mission from "@/components/sections/Mission"
// import Stats from "@/components/sections/Stats"
import Campaigns from "@/components/sections/Campaigns"
import BlogPreview from "@/components/sections/BlogPreview"
import CallToAction from "@/components/sections/CallToAction"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Mission />
      {/* <Stats /> */}
      <Campaigns />
      <BlogPreview />
      <CallToAction />
    </main>
  )
}
