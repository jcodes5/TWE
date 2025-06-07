"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Users, Heart, Crown, ArrowRight, Check, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const joinOptions = [
  {
    id: "volunteer",
    icon: <Users className="h-12 w-12" />,
    title: "Volunteer",
    subtitle: "Make a Hands-On Difference",
    description: "Join our community of passionate volunteers and contribute your time and skills to environmental causes.",
    price: "Free",
    popular: false,
    color: "from-blue-400 to-blue-600",
    benefits: [
      "Access to volunteer opportunities",
      "Training and skill development",
      "Community events and meetups",
      "Volunteer recognition program",
      "Monthly newsletter",
      "Digital volunteer certificate"
    ],
    commitment: "Flexible - as little as 2 hours/month"
  },
  {
    id: "donor",
    icon: <Heart className="h-12 w-12" />,
    title: "Donor",
    subtitle: "Support Our Mission",
    description: "Provide financial support to fund our campaigns and expand our environmental impact worldwide.",
    price: "From $10/month",
    popular: true,
    color: "from-green-400 to-green-600",
    benefits: [
      "Monthly impact reports",
      "Donor-exclusive updates",
      "Tax-deductible receipts",
      "Recognition in annual report",
      "Access to donor events",
      "Direct campaign funding",
      "Priority customer support"
    ],
    commitment: "Monthly or one-time donations"
  },
  {
    id: "member",
    icon: <Crown className="h-12 w-12" />,
    title: "Member",
    subtitle: "Full Community Access",
    description: "Become a full member with voting rights, exclusive access, and leadership opportunities in our organization.",
    price: "$25/month",
    popular: false,
    color: "from-purple-400 to-purple-600",
    benefits: [
      "All volunteer benefits",
      "All donor benefits",
      "Voting rights in decisions",
      "Leadership opportunities",
      "Exclusive member events",
      "Advanced training programs",
      "Mentorship opportunities",
      "Annual member retreat"
    ],
    commitment: "Annual membership with renewal"
  }
]

export default function JoinOptions() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [selectedOption, setSelectedOption] = useState("donor")

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-hartone font-bold text-black dark:text-white mb-6">
            Choose Your Impact Level
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Every form of support makes a difference. Choose the option that best fits your passion and availability.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {joinOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="relative"
            >
              {option.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <Badge className="bg-gradient-to-r from-green-light to-green-dark text-green-dark px-4 py-1">
                    <Star className="h-4 w-4 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <Card className={`h-full transition-all duration-300 hover:shadow-2xl group cursor-pointer ${
                selectedOption === option.id 
                  ? 'ring-2 ring-green-light shadow-xl scale-105' 
                  : 'hover:scale-105'
              } ${option.popular ? 'border-green-light' : ''}`}
              onClick={() => setSelectedOption(option.id)}
              >
                <CardHeader className="text-center pb-4">
                  <div className={`w-20 h-20 mx-auto mb-4 bg-gradient-to-r ${option.color} rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                    {option.icon}
                  </div>
                  <CardTitle className="text-2xl font-hartone font-bold text-black dark:text-white mb-2">
                    {option.title}
                  </CardTitle>
                  <p className="text-green-dark dark:text-green-light font-semibold">
                    {option.subtitle}
                  </p>
                  <div className="text-3xl font-bold text-black dark:text-white mt-4">
                    {option.price}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {option.commitment}
                  </p>
                </CardHeader>

                <CardContent className="px-6 pb-6">
                  <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                    {option.description}
                  </p>

                  <div className="space-y-3 mb-8">
                    {option.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-light mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600 dark:text-gray-300 text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className={`w-full transition-all duration-300 ${
                      selectedOption === option.id
                        ? 'bg-green-dark hover:bg-green-light text-white hover:text-green-dark'
                        : 'bg-gray-100 hover:bg-green-light text-gray-700 hover:text-green-dark dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-green-light dark:hover:text-green-dark'
                    }`}
                    size="lg"
                  >
                    {selectedOption === option.id ? 'Selected' : `Become a ${option.title}`}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Selected Option Details */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-green-light/10 to-green-dark/10 border-green-light/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-black dark:text-white mb-4">
                Ready to get started as a {joinOptions.find(opt => opt.id === selectedOption)?.title}?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Join thousands of environmental advocates making a real difference in the world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  className="bg-green-dark hover:bg-green-light text-white hover:text-green-dark transition-all duration-300 px-8"
                >
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  className="border-green-dark text-green-dark hover:bg-green-dark hover:text-white dark:border-green-light dark:text-green-light dark:hover:bg-green-light dark:hover:text-green-dark transition-all duration-300 px-8"
                >
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
