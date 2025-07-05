"use client"

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react"

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
]

const footerLinks = {
  "About": [
    { name: "Our Mission", href: "/about" },
    { name: "Team", href: "/about#team" },
    { name: "Impact", href: "/about#impact" },
    { name: "Careers", href: "/careers" },
  ],
  "Get Involved": [
    { name: "Volunteer", href: "/join" },
    { name: "Donate", href: "/donate" },
    { name: "Partner", href: "/partner" },
    { name: "Campaigns", href: "/campaigns" },
  ],
  "Resources": [
    { name: "Blog", href: "/blog" },
    { name: "News", href: "/news" },
    { name: "Research", href: "/research" },
    { name: "FAQ", href: "/faq" },
  ],
  "Support": [
    { name: "Contact", href: "/contact" },
    { name: "Help Center", href: "/help" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-muted/50 dark:bg-muted/20 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="font-hartone text-2xl font-bold text-foreground">
                TW&E
              </div>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              The Weather & Everything is a global environmental NGO dedicated to combating climate change and creating
              a sustainable future through community action and advocacy.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>123 Green Street, Eco City, EC 12345</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>hello@tweather.org</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold text-foreground mb-4">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-green-dark dark:hover:text-green-light transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-border mt-12 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-sm text-muted-foreground">
              © 2024 The Weather & Everything. All rights reserved.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="text-muted-foreground hover:text-green-dark dark:hover:text-green-light transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}