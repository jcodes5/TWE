"use client"

import { motion } from "framer-motion"
import { ArrowRight, Play, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import WeatherWidget from "@/components/features/WeatherWidget"

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-teal via-green-dark to-black" />

      {/* Animated Light Pulses */}
      <motion.div
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgba(163, 228, 148, 0.12) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 30%, rgba(163, 228, 148, 0.12) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 90%, rgba(163, 228, 148, 0.12) 0%, transparent 50%)",
          ],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 z-0"
      />

      {/* Floating Particles */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {[...Array(25)].map((_, i) => {
          const size = Math.random() * 4 + 2
          const blur = Math.random() * 4
          return (
            <motion.div
              key={i}
              className="absolute bg-green-light/20 rounded-full"
              animate={{
                y: [0, -150, 0],
                x: [0, Math.random() * 60 - 30, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                filter: `blur(${blur}px)`,
              }}
            />
          )
        })}
      </div>

      {/* Weather Widget */}
      <div className="absolute top-24 right-4 lg:right-8 sm: z-20">
        <WeatherWidget />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-10"
        >
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex justify-center"
          >
            <div className="p-4 bg-white/10 backdrop-blur-md rounded-full border border-white/20">
              <Sparkles className="h-8 w-8 text-green-light" />
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-hartone font-bold text-white leading-tight tracking-tight"
          >
            The Weather and{" "}
            <span className="bg-gradient-to-r from-green-light to-green-dark bg-clip-text text-transparent">
              Everything
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl lg:text-2xl text-white max-w-4xl mx-auto leading-relaxed"
          >
            Empowering communities to act on climate change through education, advocacy, and solutions for a{" "}
            <span className="text-green-light font-semibold">brighter tomorrow</span>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-light to-green-dark hover:from-green-dark hover:to-teal text-black hover:text-white transition-all duration-500 px-10 py-6 text-lg font-semibold group rounded-full shadow-lg hover:shadow-green-light/30"
            >
              Join Our Mission
              <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border border-white/20 text-white hover:bg-white/10 backdrop-blur-md transition-all duration-500 px-10 py-6 text-lg font-semibold group rounded-full"
            >
              <Play className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              Watch Our Story
            </Button>
          </motion.div>

          {/* Scroll Indicator */}
          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-8 h-12 border-2 border-white/30 rounded-full flex justify-center items-start"
            >
              <motion.div
                animate={{ y: [0, 18, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="w-1.5 h-4 bg-gradient-to-b from-green-light to-transparent rounded-full mt-2"
              />
            </motion.div>
          </motion.div> */}
        </motion.div>
      </div>
    </section>
  )
}
