"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowRight, Heart, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

const actions = [
  {
    icon: <Users className="h-8 w-8" />,
    title: "Volunteer",
    description: "Join our community of environmental advocates",
  },
  {
    icon: <Heart className="h-8 w-8" />,
    title: "Donate",
    description: "Support our mission with a contribution",
  },
  {
    icon: <Zap className="h-8 w-8" />,
    title: "Take Action",
    description: "Start making a difference in your community",
  },
]

export default function CallToAction() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section
      ref={ref}
      className="py-20 lg:py-32 bg-gradient-to-br from-green-dark via-teal to-green-dark dark:from-teal dark:via-green-dark dark:to-teal"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-hartone font-bold text-white mb-6">Ready to Make a Difference?</h2>
          <p className="text-xl text-green-light max-w-3xl mx-auto mb-12">
            Join thousands of environmental advocates working together to create a sustainable future. Every action
            counts, and your contribution can help change the world.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="text-center group"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
                <div className="text-green-light mb-4 flex justify-center">{action.icon}</div>
                <h3 className="text-2xl font-semibold text-white mb-3">{action.title}</h3>
                <p className="text-green-light/80 leading-relaxed">{action.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center space-y-6"
        >
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-green-light hover:bg-white text-green-dark hover:text-green-dark transition-all duration-300 px-8 py-4 text-lg font-semibold group"
            >
              Join TW&E Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-green-light text-green-light hover:bg-green-light hover:text-green-dark transition-all duration-300 px-8 py-4 text-lg font-semibold"
            >
              Learn More About Us
            </Button>
          </div>

          <p className="text-green-light/60 text-sm">
            Join our newsletter for weekly updates on environmental action and climate solutions
          </p>
        </motion.div>
      </div>
    </section>
  )
}
