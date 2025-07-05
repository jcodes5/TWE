"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Users, Heart, Briefcase, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const joinOptions = [
  {
    id: "volunteer",
    title: "Volunteer",
    description: "Join our community of passionate volunteers and make a direct impact on environmental conservation efforts.",
    icon: Users,
    features: [
      "Participate in cleanup drives",
      "Help with tree planting",
      "Support community education",
      "Join conservation workshops"
    ],
    buttonText: "Join as Volunteer",
    color: "green"
  },
  {
    id: "sponsor",
    title: "Sponsor/Donor",
    description: "Support our mission financially and help fund critical environmental projects and initiatives.",
    icon: Heart,
    features: [
      "Fund conservation projects",
      "Support research initiatives",
      "Sponsor community events",
      "Get impact reports"
    ],
    buttonText: "Become a Sponsor",
    color: "blue"
  }
]

export default function JoinOptions() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const accessToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1]

      if (accessToken) {
        setIsLoggedIn(true)
      }
    } catch (error) {
      console.error('Auth check error:', error)
    }
  }

  const handleJoinClick = (role: string) => {
    if (isLoggedIn) {
      // Redirect to dashboard
      router.push('/dashboard')
    } else {
      // Redirect to register with role parameter
      router.push(`/auth/register?role=${role.toUpperCase()}`)
    }
  }

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-hartone font-bold text-foreground mb-6">
            Choose Your Impact
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Whether you want to volunteer your time or support us financially, there's a perfect way for you to contribute to our environmental mission.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {joinOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-2 hover:border-green-light dark:hover:border-green-dark transition-colors duration-300 bg-card">
                <CardHeader className="text-center pb-6">
                  <div className="mx-auto mb-4 p-4 bg-green-light/10 dark:bg-green-dark/10 rounded-full w-fit">
                    <option.icon className="h-8 w-8 text-green-dark dark:text-green-light" />
                  </div>
                  <CardTitle className="text-2xl font-hartone font-bold text-foreground">
                    {option.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {option.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-dark dark:bg-green-light rounded-full" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleJoinClick(option.id)}
                    className="w-full bg-green-dark hover:bg-green-dark/90 text-white dark:bg-green-light dark:text-green-dark dark:hover:bg-green-light/90 group"
                    size="lg"
                  >
                    {option.buttonText}
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}