"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { Calendar, Award, Users, Globe } from "lucide-react"

const timelineEvents = [
  {
    year: "2020",
    title: "Foundation",
    description: "TW&E was founded by a group of passionate climate scientists and educators.",
    icon: <Calendar className="h-6 w-6" />,
    color: "from-blue-400 to-blue-600",
  },
  {
    year: "2021",
    title: "First Campaign",
    description: "Launched our first major campaign focusing on urban air quality improvement.",
    icon: <Users className="h-6 w-6" />,
    color: "from-green-400 to-green-600",
  },
  {
    year: "2022",
    title: "Global Expansion",
    description: "Expanded operations to 15 countries, building a global network of advocates.",
    icon: <Globe className="h-6 w-6" />,
    color: "from-purple-400 to-purple-600",
  },
  {
    year: "2023",
    title: "Recognition",
    description: "Received the Global Environmental Leadership Award for community impact.",
    icon: <Award className="h-6 w-6" />,
    color: "from-yellow-400 to-orange-500",
  },
  {
    year: "2024",
    title: "50K Members",
    description: "Reached 50,000 active community members across all our platforms.",
    icon: <Users className="h-6 w-6" />,
    color: "from-pink-400 to-red-500",
  },
  {
    year: "2025",
    title: "Future Vision",
    description: "Launching new initiatives focused on renewable energy and sustainable communities.",
    icon: <Globe className="h-6 w-6" />,
    color: "from-teal-400 to-cyan-500",
  },
]

export default function TimelineSection() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <section ref={containerRef} className="py-28 bg-gray-50 dark:bg-[#0f172a] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(163,228,148,0.3),transparent_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(163,228,148,0.1),transparent_80%)]" />
      </div>

      {/* Background pattern */}

            <div className="absolute inset-0 opacity-5 dark:opacity-10 pointer-events-none z-0">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="dots" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="2" fill="#a3e494" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dots)" />
              </svg>
            </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl lg:text-6xl font-hartone font-bold text-black dark:text-white mb-6">
            Our Journey
          </h2>
          <p className="text-xl text-gray-600 dark:text-white max-w-2xl mx-auto">
            From humble beginnings to global impact—here's how we've grown over the years.
          </p>
        </motion.div>

        {/* Timeline Line */}
        <div className="relative">
          <div className="hidden sm:block absolute left-1/2 -translate-x-1/2 h-full w-1 bg-gradient-to-b from-green-light to-green-dark dark:from-green-dark dark:to-green-light rounded-full" />

          <div className="flex flex-col gap-20">
            {timelineEvents.map((event, index) => {
              const itemRef = useRef(null)
              const isItemInView = useInView(itemRef, { once: true, margin: "-100px" })

              return (
                <motion.div
                  key={event.year}
                  ref={itemRef}
                  initial={{ opacity: 0, y: 50 }}
                  animate={isItemInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex flex-col sm:flex-row items-center gap-6 ${
                    index % 2 !== 0 ? "sm:flex-row-reverse" : ""
                  }`}
                >
                  {/* Card */}
                  <div
                    className={`w-full sm:w-1/2 px-4 ${
                      index % 2 === 0 ? "text-right sm:pr-10" : "text-left sm:pl-10"
                    }`}
                  >
                    <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition duration-300">
                      <div
                        className={`flex items-center mb-4 ${
                          index % 2 === 0 ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`w-12 h-12 bg-gradient-to-r ${event.color} rounded-xl flex items-center justify-center text-white shadow-lg`}
                        >
                          {event.icon}
                        </div>
                        <span className="ml-4 text-2xl font-hartone font-bold text-green-dark dark:text-green-dark">
                          {event.year}
                        </span>
                      </div>
                      <h3 className="text-2xl font-semibold text-black dark:text-white mb-2">{event.title}</h3>
                      <p className="text-gray-600 dark:text-gray-500">{event.description}</p>
                    </div>
                  </div>

                  {/* Timeline dot */}
                  <div className="hidden sm:flex items-center justify-center w-1/12">
                    <div className="w-5 h-5 bg-white dark:bg-gray-900 border-4 border-green-light dark:border-green-dark rounded-full shadow-md" />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
