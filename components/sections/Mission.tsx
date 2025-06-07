"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Leaf, Globe, Users } from "lucide-react"

export default function Mission() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const features = [
    {
      icon: <Leaf className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Environmental Protection",
      description:
        "Safeguarding our planet's ecosystems through direct action and community engagement.",
    },
    {
      icon: <Globe className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Climate Advocacy",
      description:
        "Raising awareness about climate change and promoting sustainable practices worldwide.",
    },
    {
      icon: <Users className="h-6 w-6 md:h-8 md:w-8" />,
      title: "Community Empowerment",
      description:
        "Building resilient communities equipped to face environmental challenges together.",
    },
  ]

  return (
    <section
      ref={ref}
      className="relative py-20 lg:py-32 bg-white dark:bg-[#0c2b2d] transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl lg:text-5xl font-hartone font-bold text-black dark:text-white mb-6"
            >
              Our Mission
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg text-gray-700 dark:text-white leading-relaxed"
            >
              At The Weather and Everything, we believe that environmental action starts with understanding. We’re
              dedicated to bridging the gap between climate science and community action, empowering individuals and
              organizations to make meaningful changes for our planet's future.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="text-lg text-gray-700 dark:text-white leading-relaxed"
            >
              Through education, advocacy, and direct action, we're building a global network of environmental
              stewards committed to protecting our planet for future generations.
            </motion.p>
          </motion.div>

          {/* Right Column - Features */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="space-y-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.2 }}
                className="bg-white/70 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-lg p-6 rounded-2xl transition-all hover:shadow-xl dark:hover:shadow-green-light/10 hover:translate-y-[-2px]"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 p-3 bg-green-light/30  rounded-xl">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-black dark:text-white mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-700 dark:text-white leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
