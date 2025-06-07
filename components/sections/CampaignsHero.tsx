"use client"

import { motion } from "framer-motion"
import { Search, Filter, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CampaignsHero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-20">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-dark via-teal to-black dark:from-black dark:via-teal dark:to-green-dark">
        <motion.div
          animate={{
            background: [
              "radial-gradient(circle at 25% 25%, rgba(163, 228, 148, 0.3) 0%, transparent 50%)",
              "radial-gradient(circle at 75% 75%, rgba(163, 228, 148, 0.3) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="absolute inset-0"
        />
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
            Our{" "}
            <span className="bg-gradient-to-r from-green-light to-green-dark bg-clip-text text-transparent">
              Campaigns
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed"
          >
            Discover active environmental initiatives around the world and join the movement for positive change in your
            community.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="max-w-2xl mx-auto"
          >
            <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search campaigns..."
                  className="pl-10 bg-white/40 border-white/30 text-white placeholder:text-gray-300 focus:bg-white/60"
                />
              </div>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/20 backdrop-blur-sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-green-light hover:bg-green-dark text-black hover:text-white">
                <MapPin className="h-4 w-4 mr-2" />
                Map View
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
