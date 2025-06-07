"use client"

import { useRef } from "react"
import { motion, useInView, useScroll } from "framer-motion"
import { Lightbulb, Target, Rocket } from "lucide-react"

export default function AboutStory() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const { scrollYProgress } = useScroll({ target: ref })

  const milestones = [
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "The Idea",
      description: "Born from a simple belief that everyone deserves to understand and act on climate science.",
    },
    {
      icon: <Target className="h-8 w-8" />,
      title: "The Mission",
      description: "Bridging the gap between complex environmental data and actionable community solutions.",
    },
    {
      icon: <Rocket className="h-8 w-8" />,
      title: "The Impact",
      description: "Growing into a global movement with thousands of active environmental advocates.",
    },
  ]

  return (
    <section ref={ref} className="relative overflow-hidden py-32 bg-white dark:bg-[#0c2b2d]">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-green-light z-[60]"
        style={{ scaleX: scrollYProgress, transformOrigin: "0%" }}
      />

      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="currentColor" className="text-green-light" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl lg:text-6xl font-hartone font-bold text-black dark:text-white mb-8">
            Our Story
          </h2>
          <p className="text-xl text-gray-700 dark:text-white max-w-4xl mx-auto leading-relaxed">
            The Weather and Everything began as a grassroots intiative in 2018, founded by a group of climate
            scientists, educators, and community organizers who shared a common vision: making environmental action
            accessible to everyone.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative grid lg:grid-cols-3 grid-cols-1 gap-16 lg:gap-12">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="group relative flex flex-col items-center text-center"
            >
              {/* Icon */}
              <div className="z-10 relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-green-light to-green-dark rounded-full flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition" >
                  {milestone.icon}
                </div>
              </div>

              {/* Content */}
              <h3 className="text-2xl font-semibold text-black dark:text-white mb-2">{milestone.title}</h3>
              <p className="text-gray-700 dark:text-white max-w-sm">{milestone.description}</p>

              {/* Connector Line */}
              {index < milestones.length - 1 && (
                <motion.div
                  initial={{ scaleY: 0 }}
                  animate={isInView ? { scaleY: 1 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.3 + 0.2 }}
                  className="absolute left-1/2 transform -translate-x-1/2 lg:block hidden w-px bg-green-light/40"
                  style={{ top: "100%", height: "60px" }}
                />
              )}
              {/* Mobile Vertical Line */}
              {index < milestones.length - 1 && (
                <div className="lg:hidden w-1 h-16 bg-green-light/40 mt-4" />
              )}
            </motion.div>
          ))}
        </div>

        {/* Final Card */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-28 bg-gradient-to-r from-green-light/10 to-green-dark/10 rounded-3xl p-12 backdrop-blur-sm border border-green-light/20"
        >
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-3xl font-semibold text-black dark:text-white mb-6">
              Why "The Weather and Everything"?
            </h3>
            <p className="text-lg text-gray-700 dark:text-white leading-relaxed">
              Weather isn't just about daily forecasts—it's the heartbeat of our planet's climate system. It affects
              agriculture, energy, health, economics, and social justice. We chose this name because weather truly is
              connected to everything, and understanding these connections empowers us to make informed decisions for a
              sustainable future.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
