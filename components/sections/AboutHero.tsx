
"use client"

import { motion } from "framer-motion"
import { ArrowRight, Users, Target, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

export default function AboutHero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-emerald-900 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-96 h-96 bg-gradient-to-r from-green-light/20 to-blue-400/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ top: "10%", left: "10%" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 bg-green-light/10 dark:bg-green-dark/20 rounded-full border border-green-light/20 dark:border-green-dark/30"
              >
                <span className="text-green-dark dark:text-green-light font-medium text-sm">
                  🌱 Our Story
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-hartone font-bold text-foreground leading-tight"
              >
                Building a{" "}
                <span className="text-green-dark dark:text-green-light">
                  Sustainable
                </span>{" "}
                Future
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-lg sm:text-xl text-muted-foreground max-w-2xl leading-relaxed"
              >
                We're a global community of environmental advocates, scientists, and changemakers dedicated to creating meaningful impact through technology and collective action.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link href="/join">
                <Button
                  size="lg"
                  className="bg-green-dark hover:bg-green-dark/90 text-green-light hover:text-green-light/90 border-green-light/20 hover:border-green-light/90 dark:bg-green-light dark:hover:bg-green-light/90 dark:text-green-dark dark:hover:text-green-dark/90 dark:border-green-light/90"
                >
                  Join Our Mission
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-green-dark/20 dark:border-green-light/20 text-green-dark dark:text-green-light hover:bg-green-light/10 dark:hover:bg-green-dark/10 px-8 py-6 text-lg font-semibold"
                >
                  Get in Touch
                </Button>
              </Link>
            </motion.div>

            {/* Key Values */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-light/10 dark:bg-green-dark/20 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-green-dark dark:text-green-light" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Community</div>
                  <div className="text-sm text-muted-foreground">Driven</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-light/10 dark:bg-green-dark/20 rounded-full flex items-center justify-center">
                  <Target className="h-5 w-5 text-green-dark dark:text-green-light" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Impact</div>
                  <div className="text-sm text-muted-foreground">Focused</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-light/10 dark:bg-green-dark/20 rounded-full flex items-center justify-center">
                  <Heart className="h-5 w-5 text-green-dark dark:text-green-light" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Purpose</div>
                  <div className="text-sm text-muted-foreground">Driven</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Content - Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="/about_img.jpg"
                  alt="Team working on environmental projects"
                  className="w-full h-[500px] lg:h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* Floating Achievement Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="absolute -bottom-6 -left-6 z-10"
              >
                <Card className="p-6 bg-background/95 backdrop-blur-sm border-border shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-light rounded-full animate-pulse" />
                    <div className="text-sm font-medium text-foreground">
                      Since 2020
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-bold text-green-dark dark:text-green-light">
                    50+
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Countries Reached
                  </div>
                </Card>
              </motion.div>

              {/* Floating Impact Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.4 }}
                className="absolute -top-6 -right-6 z-10"
              >
                <Card className="p-6 bg-background/95 backdrop-blur-sm border-border shadow-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                    <div className="text-sm font-medium text-foreground">
                      Active Projects
                    </div>
                  </div>
                  <div className="mt-2 text-2xl font-bold text-green-dark dark:text-green-light">
                    127
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Ongoing Initiatives
                  </div>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
