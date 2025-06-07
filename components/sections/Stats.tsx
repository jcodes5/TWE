"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useEffect, useState } from "react"

const stats = [
  { number: 50000, label: "Community Members", suffix: "+" },
  { number: 150, label: "Active Campaigns", suffix: "+" },
  { number: 25, label: "Countries Reached", suffix: "" },
  { number: 1000000, label: "Trees Planted", suffix: "+" },
]

function AnimatedNumber({ number, suffix }: { number: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (isInView) {
      const duration = 2000
      const steps = 60
      const increment = number / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= number) {
          setCount(number)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }
  }, [isInView, number])

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export default function Stats() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 bg-teal dark:bg-dark-green">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-hartone font-bold text-white mb-4">Our Impact</h2>
          <p className="text-xl text-green-light max-w-3xl mx-auto">
            Together, we're making a difference across the globe
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="text-center"
            >
              <div className="text-4xl lg:text-5xl font-hartone font-bold text-green-light mb-2">
                <AnimatedNumber number={stat.number} suffix={stat.suffix} />
              </div>
              <div className="text-white text-lg font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
