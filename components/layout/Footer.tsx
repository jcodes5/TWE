"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react"

const navigation = {
  main: [
    { name: "About", href: "/about" },
    { name: "Campaigns", href: "/campaigns" },
    { name: "Blog", href: "/blog" },
    { name: "Join TW&E", href: "/join" },
    { name: "Contact", href: "/contact" },
  ],
  support: [
    { name: "Help Center", href: "/help" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
  ],
  social: [
    { name: "Facebook", href: "#", icon: Facebook },
    { name: "Twitter", href: "#", icon: Twitter },
    { name: "Instagram", href: "#", icon: Instagram },
    { name: "LinkedIn", href: "#", icon: Linkedin },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-teal dark:bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link href="/" className="text-3xl font-hartone font-bold text-green-light mb-4 block">
                The Weather & Everything
              </Link>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                Empowering communities to take action against climate change through education, advocacy, and
                sustainable solutions for a better tomorrow.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-300">
                  <Mail className="h-5 w-5 mr-3 text-green-light" />
                  <span>info@tweather.org</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Phone className="h-5 w-5 mr-3 text-green-light" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <MapPin className="h-5 w-5 mr-3 text-green-light" />
                  <span>123 Green Street, Eco City, EC 12345</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-green-light mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-green-light transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-green-light mb-4">Support</h3>
            <ul className="space-y-3">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-300 hover:text-green-light transition-colors duration-200"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Social Media & Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="border-t border-gray-700 mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex space-x-6 mb-4 md:mb-0">
              {navigation.social.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-400 hover:text-green-light transition-colors duration-200"
                    aria-label={item.name}
                  >
                    <Icon className="h-6 w-6" />
                  </Link>
                )
              })}
            </div>

            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} The Weather and Everything. All rights reserved.
              </p>
              <p className="text-gray-500 text-xs mt-1">Building a sustainable future, one action at a time.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
