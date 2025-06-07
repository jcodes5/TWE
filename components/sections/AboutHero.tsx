"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import Tilt from "react-parallax-tilt"
import { Heart, Globe, Users, Leaf, ChevronDown } from "lucide-react"
import Particles from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"

const heroTitle = "About Us"
const stats = [
  { label: "Volunteers", value: "1,200+" },
  { label: "Campaigns", value: "85" },
  { label: "Countries Impacted", value: "16" },
]

export default function AboutHero() {
  const nextSectionRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    nextSectionRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24 pb-32">
      {/* Particle Background */}
      <Particles
        id="tsparticles"
        options={{
          fullScreen: { enable: false },
          background: { color: { value: "transparent" } },
          particles: {
            number: { value: 45 },
            color: { value: "#a3e494" },
            shape: { type: "circle" },
            opacity: { value: 0.1 },
            size: { value: 3 },
            move: { enable: true, speed: 0.3 },
          },
        }}
        className="absolute inset-0 z-0"
      />

      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-dark via-teal to-black dark:from-black dark:via-green-dark dark:to-teal" />

      {/* Floating Icons */}
      <div className="absolute inset-0 z-10">
        {[Heart, Globe, Users, Leaf].map((Icon, index) => (
          <motion.div
            key={index}
            className="absolute"
            animate={{ y: [0, -25, 0], rotate: [0, 5, -5, 0] }}
            transition={{
              duration: 5 + index * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: index * 0.3,
            }}
            style={{
              left: `${10 + index * 20}%`,
              top: `${30 + (index % 2 === 0 ? 5 : 10)}%`,
            }}
          >
            <div className="p-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-md">
              <Icon className="h-7 w-7 text-green-light/60" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-20 max-w-6xl px-6 text-center space-y-8">
        <motion.h1
          className="text-white text-5xl md:text-7xl font-hartone font-bold leading-tight tracking-tight flex justify-center flex-wrap gap-1"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.05 } },
          }}
        >
          {heroTitle.split("").map((char, i) => (
            <motion.span
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className={char === " " ? "w-2" : ""}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-2xl text-white max-w-3xl mx-auto leading-relaxed"
        >
          Learn about our mission, our passionate team, and how we're driving meaningful environmental change for a more resilient world.
        </motion.p>
      </div>

      {/* Tilt Stats Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="relative z-20 mt-12 px-6 w-full max-w-3xl"
      >
        <Tilt glareEnable={true} glareMaxOpacity={0.15} glareColor="#a3e494" tiltMaxAngleX={8} tiltMaxAngleY={8}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 md:p-8 text-white shadow-xl">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl font-bold text-green-light">{stat.value}</div>
                <div className="text-sm text-gray-300 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </Tilt>
      </motion.div>

      {/* Scroll Chevron */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        className="absolute bottom-8 z-30 cursor-pointer"
        onClick={handleScroll}
      >
        <ChevronDown className="h-8 w-8 text-green-light/60 animate-pulse" />
      </motion.div>

      {/* Scroll Target */}
      <div ref={nextSectionRef} className="absolute bottom-0 translate-y-full h-1 w-full" />
    </section>
  )
}
