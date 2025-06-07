"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Quote, Star } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Volunteer Coordinator",
    location: "Seattle, WA",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    quote: "Joining TW&E as a volunteer has been incredibly rewarding. The training programs are excellent, and I've learned so much about environmental science while making a real impact in my community.",
    joinType: "Volunteer",
    duration: "2 years"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Monthly Donor",
    location: "San Francisco, CA",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    quote: "As a donor, I love receiving the monthly impact reports. It's amazing to see exactly how my contributions are being used and the tangible results our campaigns are achieving worldwide.",
    joinType: "Donor",
    duration: "3 years"
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    role: "Full Member & Campaign Leader",
    location: "Austin, TX",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    quote: "Being a full member has given me the opportunity to lead campaigns and influence our organization's direction. The leadership development programs are world-class.",
    joinType: "Member",
    duration: "4 years"
  },
  {
    id: 4,
    name: "James Wilson",
    role: "Corporate Volunteer",
    location: "New York, NY",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    quote: "Our company partners with TW&E for employee volunteer programs. The coordination is seamless, and our team always comes back energized and more environmentally conscious.",
    joinType: "Volunteer",
    duration: "1 year"
  },
  {
    id: 5,
    name: "Lisa Park",
    role: "Student Member",
    location: "Boston, MA",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    quote: "The student membership program is fantastic. I've gained valuable experience, built my network, and contributed to meaningful environmental projects while still in college.",
    joinType: "Member",
    duration: "1.5 years"
  },
  {
    id: 6,
    name: "Robert Thompson",
    role: "Legacy Donor",
    location: "Denver, CO",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    quote: "I've been supporting TW&E for over 5 years. The transparency in how funds are used and the consistent results make me confident in continuing my support for years to come.",
    joinType: "Donor",
    duration: "5 years"
  }
]

export default function JoinTestimonials() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-hartone font-bold text-black dark:text-white mb-6">
            What Our Community Says
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Hear from volunteers, donors, and members who are making a difference with TW&E.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow duration-300 group">
                <CardContent className="p-6">
                  {/* Quote Icon */}
                  <div className="flex justify-between items-start mb-4">
                    <Quote className="h-8 w-8 text-green-light" />
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed italic">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Author Info */}
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Image
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="rounded-full object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-light rounded-full flex items-center justify-center">
                        <span className="text-green-dark text-xs font-bold">
                          {testimonial.joinType.charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-black dark:text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{testimonial.location}</p>
                    </div>
                  </div>

                  {/* Membership Info */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-green-dark dark:text-green-light font-medium">
                        {testimonial.joinType}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {testimonial.duration}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-green-light/10 to-green-dark/10 border-green-light/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-black dark:text-white mb-4">
                Ready to Add Your Voice?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Join our community and become part of the solution. Your story could be the next one inspiring others to take action.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-green-dark hover:bg-green-light text-white hover:text-green-dark transition-all duration-300 rounded-lg font-semibold"
                >
                  Share Your Story
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 border-2 border-green-dark text-green-dark hover:bg-green-dark hover:text-white dark:border-green-light dark:text-green-light dark:hover:bg-green-light dark:hover:text-green-dark transition-all duration-300 rounded-lg font-semibold"
                >
                  Read More Stories
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
