
"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react'
import Image from "next/image"

export default function ContactHero() {
  return (
    <section className="relative min-h-[80vh] flex items-center overflow-hidden pt-20 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center px-4 py-2 bg-green-light/20 dark:bg-green-light/10 rounded-full"
            >
              <MessageCircle className="h-4 w-4 text-green-dark dark:text-green-light mr-2" />
              <span className="text-green-dark dark:text-green-light font-medium text-sm">We'd Love to Hear From You</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-6xl font-hartone font-bold text-foreground leading-tight"
            >
              Get in{" "}
              <span className="bg-gradient-to-r from-green-light to-green-dark bg-clip-text text-transparent">
                Touch
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed"
            >
              Have questions about our campaigns? Want to collaborate? Or simply need more information? We'd love to hear from you and discuss how we can work together for environmental change.
            </motion.p>

            {/* Contact Options */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {[
                { icon: Mail, label: "Email Us", value: "hello@twe.org" },
                { icon: Phone, label: "Call Us", value: "+1 (555) 123-4567" },
                { icon: MapPin, label: "Visit Us", value: "123 Green Street, Eco City" },
                { icon: MessageCircle, label: "Chat", value: "Live Support Available" }
              ].map((contact, index) => (
                <motion.div
                  key={contact.label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                  className="flex items-center space-x-3 p-3 bg-white/80 dark:bg-gray-800/80 rounded-lg backdrop-blur-sm"
                >
                  <contact.icon className="h-5 w-5 text-green-dark dark:text-green-light" />
                  <div>
                    <div className="font-medium text-foreground text-sm">{contact.label}</div>
                    <div className="text-muted-foreground text-xs">{contact.value}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/contact_img.jpg"
                alt="Contact Us"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating Icons */}
            <div className="absolute inset-0">
              {[Mail, Phone, MapPin, MessageCircle].map((Icon, index) => (
                <motion.div
                  key={index}
                  className="absolute"
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 4 + index * 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  style={{
                    left: `${15 + index * 20}%`,
                    top: `${20 + index * 15}%`,
                  }}
                >
                  <div className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg">
                    <Icon className="h-6 w-6 text-green-dark dark:text-green-light" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
