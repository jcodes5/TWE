import ContactHero from "@/components/sections/ContactHero"
import ContactForm from "@/components/sections/ContactForm"
import ContactInfo from "@/components/sections/ContactInfo"

export default function ContactPage() {
  return (
    <main className="min-h-screen">
      <ContactHero />
      <div className="grid lg:grid-cols-2 gap-0">
        <ContactForm />
        <ContactInfo />
      </div>
    </main>
  )
}
