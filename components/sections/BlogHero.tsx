"use client"

import { motion } from "framer-motion"
import { Search, Calendar, User, Tag } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function BlogHero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-dark via-teal to-black dark:from-black dark:via-teal dark:to-green-dark">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 20% 80%, rgba(163, 228, 148, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 20%, rgba(163, 228, 148, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 40% 40%, rgba(163, 228, 148, 0.3) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute inset-0"
        />
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0">
        {[Calendar, User, Tag].map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute"
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 6 + index * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            style={{
              left: `${15 + index * 25}%`,
              top: `${20 + index * 15}%`,
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
            Environmental{" "}
            <span className="bg-gradient-to-r from-green-light to-green-dark bg-clip-text text-transparent">
              Insights
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed"
          >
            Stay informed with the latest research, stories, and actionable insights on climate change, sustainability, and environmental action.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="flex gap-4 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search articles..."
                  className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-gray-300 focus:bg-white/30"
                />
              </div>
              <Button className="bg-green-light hover:bg-green-dark text-black hover:text-white transition-all duration-300">
                Search
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
