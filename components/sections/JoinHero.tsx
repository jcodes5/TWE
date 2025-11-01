
"use client"

import { motion } from "framer-motion"
import { Users, Heart, Zap, Globe } from 'lucide-react'
import Image from "next/image"

export default function JoinHero() {
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
              <Users className="h-4 w-4 text-green-dark dark:text-green-light mr-2" />
              <span className="text-green-dark dark:text-green-light font-medium text-sm">Join 50,000+ Environmental Advocates</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-6xl font-hartone font-bold text-foreground leading-tight"
            >
              Join{" "}
              <span className="bg-gradient-to-r from-green-light to-green-dark bg -clip-text text-transparent">
                TW&E
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed"
            >
              Be part of a global community working together to create lasting environmental change. Whether you want to volunteer, donate, or become a member, there's a place for you in our movement.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { number: "50K+", label: "Active Members" },
                { number: "150+", label: "Active Campaigns" },
                { number: "25+", label: "Countries" },
                { number: "1M+", label: "Trees Planted" }
              ].map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                    className="text-2xl md:text-3xl font-hartone font-bold text-green-dark dark:text-green-light mb-1"
                  >
                    {stat.number}
                  </motion.div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </div>
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
                src="/join_img.jpg"
                alt="Join Our Community"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating Icons */}
            <div className="absolute inset-0">
              {[Users, Heart, Zap, Globe].map((Icon, index) => (
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
