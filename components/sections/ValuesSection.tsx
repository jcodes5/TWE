"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Shield, Users, Lightbulb, Heart, Globe, Zap } from "lucide-react"

const values = [
  {
    icon: <Shield className="h-10 w-10" />,
    title: "Integrity",
    description: "We base our actions on scientific evidence and transparent communication.",
    color: "from-blue-400 to-blue-600",
  },
  {
    icon: <Users className="h-10 w-10" />,
    title: "Inclusivity",
    description: "Environmental action should be accessible to all communities, regardless of background.",
    color: "from-purple-400 to-purple-600",
  },
  {
    icon: <Lightbulb className="h-10 w-10" />,
    title: "Innovation",
    description: "We embrace creative solutions and cutting-edge approaches to environmental issues.",
    color: "from-yellow-400 to-orange-500",
  },
  {
    icon: <Heart className="h-10 w-10" />,
    title: "Compassion",
    description: "We care deeply about people, animals, and ecosystems affected by climate change.",
    color: "from-pink-400 to-red-500",
  },
  {
    icon: <Globe className="h-10 w-10" />,
    title: "Global Thinking",
    description: "Environmental challenges require coordinated global action and local implementation.",
    color: "from-green-400 to-teal-500",
  },
  {
    icon: <Zap className="h-10 w-10" />,
    title: "Action-Oriented",
    description: "We turn knowledge into action, creating tangible positive change in communities.",
    color: "from-indigo-400 to-purple-500",
  },
]

export default function ValuesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-32 bg-gray-50 dark:bg-[#0c2b2d] relative overflow-hidden">
      {/* Background pattern */}

      {/* <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" fill="#a3e494" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div> */}


      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl lg:text-6xl font-hartone font-bold text-black dark:text-white mb-8">
            Our Values
          </h2>
          <p className="text-xl text-gray-700 dark:text-white max-w-3xl mx-auto">
            These core principles guide everything we do and shape our approach to environmental advocacy.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="group"
            >
              <div className="bg-white dark:bg-[#0c2b2d] rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-2 border border-gray-200 dark:border-[#13714c]/30">
                {/* Icon */}
                <div className="relative mb-6">
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    {value.icon}
                  </div>
                  <div
                    className={`absolute inset-0 w-16 h-16 bg-gradient-to-r ${value.color} rounded-xl opacity-20 group-hover:scale-125 transition-transform duration-300 blur-xl`}
                  />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-semibold text-black dark:text-white mb-4 group-hover:text-green-dark dark:group-hover:text-[#a3e494] transition-colors duration-300">
                  {value.title}
                </h3>

                {/* Description */}
                <p className="text-gray-700 dark:text-white leading-relaxed">
                  {value.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
