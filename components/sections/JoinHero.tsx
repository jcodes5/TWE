"use client"

import { motion } from "framer-motion"
import { Users, Heart, Zap, Globe } from 'lucide-react'

export default function JoinHero() {
  const actionIcons = [Users, Heart, Zap, Globe]

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-dark via-teal to-black dark:from-black dark:via-teal dark:to-green-dark">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 25% 75%, rgba(163, 228, 148, 0.4) 0%, transparent 50%)",
              "radial-gradient(circle at 75% 25%, rgba(163, 228, 148, 0.4) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 50%, rgba(163, 228, 148, 0.4) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute inset-0"
        />
      </div>

      {/* Floating Action Icons */}
      <div className="absolute inset-0">
        {actionIcons.map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute"
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 6 + index * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            style={{
              left: `${15 + index * 22}%`,
              top: `${20 + index * 12}%`,
            }}
          >
            <div className="p-4 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
              <Icon className="h-10 w-10 text-green-light/70" />
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
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full border border-white/20"
          >
            <Users className="h-5 w-5 text-green-light mr-2" />
            <span className="text-white font-medium">Join 50,000+ Environmental Advocates</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl font-hartone font-bold text-white leading-tight"
          >
            Join{" "}
            <span className="bg-gradient-to-r from-green-light to-green-dark bg-clip-text text-transparent">
              TW&E
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed"
          >
            Be part of a global community working together to create lasting environmental change. Whether you want to volunteer, donate, or become a member, there's a place for you in our movement.
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            {[
              { number: "50K+", label: "Active Members" },
              { number: "150+", label: "Campaigns" },
              { number: "25+", label: "Countries" },
              { number: "1M+", label: "Trees Planted" }
            ].map((stat, index) => (
              <div key={stat.label} className="text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                  className="text-3xl md:text-4xl font-hartone font-bold text-green-light mb-2"
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-300 text-sm">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
