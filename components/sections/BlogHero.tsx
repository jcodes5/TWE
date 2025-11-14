
"use client"

import { motion } from "framer-motion"
import { Search, Calendar, User, Tag } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export default function BlogHero() {
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
              <Calendar className="h-4 w-4 text-green-dark mr-2" />
              <span className="text-green-dark dark:text-green-light font-medium text-sm">Latest Environmental Insights</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-4xl md:text-6xl font-hartone font-bold text-foreground leading-tight"
            >
              Environmental{" "}
              <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                Insights
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg md:text-xl text-muted-foreground leading-relaxed"
            >
              Stay informed with the latest research, stories, and actionable insights on climate change, sustainability, and environmental action.
            </motion.p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="max-w-md"
            >
              <div className="flex gap-2 p-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search articles..."
                    className="pl-10 bg-transparent border-none text-foreground placeholder:text-muted-foreground focus:ring-0"
                  />
                </div>
                <Button className="bg-green-dark hover:bg-green-light text-white hover:text-green-dark transition-all duration-300">
                  Search
                </Button>
              </div>
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
                src="/blog_img.jpg"
                alt="Environmental Blog"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
            
            {/* Floating Icons */}
            <div className="absolute inset-0">
              {[User, Tag, Calendar].map((Icon, index) => (
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
                    left: `${15 + index * 25}%`,
                    top: `${20 + index * 15}%`,
                  }}
                >
                  <div className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg">
                    <Icon className="h-6 w-6 text-green-dark" />
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
