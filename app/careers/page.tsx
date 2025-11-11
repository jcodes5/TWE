import { Metadata } from 'next'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Clock, Users, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Careers | The Weather & Everything',
  description: 'Join our team and help create a sustainable future. Explore career opportunities in environmental conservation.',
}

const jobOpenings = [
  {
    title: "Environmental Scientist",
    location: "Remote",
    type: "Full-time",
    description: "Conduct research and analysis on climate change impacts and develop sustainable solutions."
  },
  {
    title: "Community Outreach Coordinator",
    location: "Lagos, Nigeria",
    type: "Full-time",
    description: "Lead community engagement initiatives and coordinate volunteer programs."
  },
  {
    title: "Digital Marketing Specialist",
    location: "Remote",
    type: "Full-time",
    description: "Develop and execute digital marketing strategies to raise awareness about environmental issues."
  },
  {
    title: "Project Manager",
    location: "Remote",
    type: "Full-time",
    description: "Oversee environmental projects from planning to implementation and evaluation."
  }
]

const benefits = [
  {
    icon: Heart,
    title: "Purpose-Driven Work",
    description: "Make a real difference in the fight against climate change"
  },
  {
    icon: Users,
    title: "Collaborative Environment",
    description: "Work with passionate individuals from diverse backgrounds"
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    description: "Remote work options and flexible scheduling available"
  },
  {
    icon: MapPin,
    title: "Global Impact",
    description: "Contribute to projects that span across multiple countries"
  }
]

export default function CareersPage() {
  return (
    <main className="min-h-screen">
      <section className="relative min-h-[80vh] flex items-center overflow-hidden pt-20 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-hartone font-bold text-foreground">Join Our Team</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">Be part of a global movement working to create a sustainable future. We're looking for passionate individuals ready to make an impact.</p>
            <Link href="#openings">
              <Button size="lg" className="bg-green-dark hover:bg-green-dark/90 text-green-light">
                View Open Positions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-hartone font-bold text-foreground mb-4">Why Work With Us?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Join a team that's dedicated to environmental conservation and making a positive impact on our planet.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-16 h-16 bg-green-light/10 dark:bg-green-dark/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-green-dark dark:text-green-light" />
                  </div>
                  <CardTitle className="text-xl">{benefit.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="openings" className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-hartone font-bold text-foreground mb-4">Open Positions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Explore current opportunities and find your role in environmental conservation.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {jobOpenings.map((job, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{job.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{job.type}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{job.description}</CardDescription>
                  <Link href="/contact">
                    <Button variant="outline" size="sm" className="border-green-dark/20 dark:border-green-light/20 text-green-dark dark:text-green-light">
                      Apply Now
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">Don't see a position that matches your skills?</p>
            <Link href="/contact">
              <Button variant="outline" className="border-green-dark/20 dark:border-green-light/20 text-green-dark dark:text-green-light">
                Send Us Your Resume
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}