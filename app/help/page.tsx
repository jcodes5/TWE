import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HelpCircle, MessageCircle, FileText, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Help Center | The Weather & Everything',
  description: 'Get help and support for all your questions about our environmental initiatives.',
}

const helpCategories = [
  {
    icon: HelpCircle,
    title: "Getting Started",
    description: "Learn how to join our community and get involved in environmental action.",
    links: [
      { name: "How to volunteer", href: "/join" },
      { name: "Understanding our campaigns", href: "/campaigns" },
      { name: "Donation process", href: "/donate" }
    ]
  },
  {
    icon: MessageCircle,
    title: "Contact Support",
    description: "Get in touch with our team for personalized assistance.",
    links: [
      { name: "Contact form", href: "/contact" },
      { name: "Email support", href: "mailto:hello@twe.org" },
      { name: "Live chat", href: "#" }
    ]
  },
  {
    icon: FileText,
    title: "Resources",
    description: "Access guides, documentation, and educational materials.",
    links: [
      { name: "FAQ", href: "/faq" },
      { name: "Research papers", href: "/research" },
      { name: "Blog articles", href: "/blog" }
    ]
  },
  {
    icon: Users,
    title: "Community",
    description: "Connect with other environmental advocates and share experiences.",
    links: [
      { name: "Join our community", href: "/join" },
      { name: "Partner with us", href: "/partner" },
      { name: "Events calendar", href: "/events" }
    ]
  }
]

export default function HelpCenterPage() {
  return (
    <main className="min-h-screen">
      <section className="relative min-h-[80vh] flex items-center overflow-hidden pt-20 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-hartone font-bold text-foreground">Help Center</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">Find answers, get support, and learn how to make the biggest impact in environmental conservation.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/faq">
                <Button size="lg" className="bg-green-dark hover:bg-green-dark/90 text-green-light">
                  Browse FAQ
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" size="lg" className="border-green-dark/20 dark:border-green-light/20 text-green-dark dark:text-green-light">
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {helpCategories.map((category, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-light/10 dark:bg-green-dark/20 rounded-lg flex items-center justify-center mb-4">
                    <category.icon className="h-6 w-6 text-green-dark dark:text-green-light" />
                  </div>
                  <CardTitle className="text-xl">{category.title}</CardTitle>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          href={link.href}
                          className="text-sm text-muted-foreground hover:text-green-dark dark:hover:text-green-light transition-colors"
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}