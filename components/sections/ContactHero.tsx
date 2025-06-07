"use client"

import { motion } from "framer-motion"
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react'

export default function ContactHero() {
  const contactIcons = [Mail, Phone, MapPin, MessageCircle]

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-dark via-teal to-black dark:from-black dark:via-teal dark:to-green-dark">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 30% 70%, rgba(163, 228, 148, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 70% 30%, rgba(163, 228, 148, 0.3) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute inset-0"
        />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0">
        {contactIcons.map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute"
            animate={{
              y: [0, -25, 0],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 5 + index * 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            style={{
              left: `${20 + index * 20}%`,
              top: `${25 + index * 15}%`,
            }}
          >
            <div className="p-4 bg-white/5 backdrop-blur-sm rounded-full border border-white/10">
              <Icon className="h-8 w-8 text-green-light/60" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl font-hartone font-bold text-white leading-tight"
          >
            Get in{" "}
            <span className="bg-gradient-to-r from-green-light to-green-dark bg-clip-text text-transparent">
              Touch
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed"
          >
            Have questions about our campaigns? Want to collaborate? Or simply need more information? We'd love to hear from you.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
