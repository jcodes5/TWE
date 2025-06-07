import JoinHero from "@/components/sections/JoinHero"
import JoinOptions from "@/components/sections/JoinOptions"
import JoinFAQ from "@/components/sections/JoinFAQ"
import JoinTestimonials from "@/components/sections/JoinTestimonials"

export default function JoinPage() {
  return (
    <main className="min-h-screen">
      <JoinHero />
      <JoinOptions />
      <JoinTestimonials />
      <JoinFAQ />
    </main>
  )
}
