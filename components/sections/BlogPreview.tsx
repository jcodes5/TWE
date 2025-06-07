"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowRight, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import Image from "next/image"

const blogPosts = [
  {
    id: 1,
    title: "The Future of Renewable Energy: What You Need to Know",
    excerpt:
      "Exploring the latest developments in solar, wind, and hydroelectric power and their impact on our planet's future.",
    image: "/placeholder.svg?height=250&width=400",
    author: "Dr. Sarah Chen",
    readTime: "5 min read",
    date: "Dec 15, 2024",
  },
  {
    id: 2,
    title: "Community Gardens: Growing Change One Seed at a Time",
    excerpt:
      "How local communities are transforming urban spaces into thriving green oases that benefit both people and planet.",
    image: "/placeholder.svg?height=250&width=400",
    author: "Marcus Rodriguez",
    readTime: "3 min read",
    date: "Dec 12, 2024",
  },
  {
    id: 3,
    title: "Climate Action in Your Daily Life: Simple Steps, Big Impact",
    excerpt: "Practical tips and strategies for reducing your carbon footprint without compromising your lifestyle.",
    image: "/placeholder.svg?height=250&width=400",
    author: "Emma Thompson",
    readTime: "4 min read",
    date: "Dec 10, 2024",
  },
]

export default function BlogPreview() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 lg:py-32 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-hartone font-bold text-black dark:text-white mb-6">
            Latest Insights
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Stay informed with our latest articles on environmental science, sustainability, and climate action
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow duration-300 group cursor-pointer">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-3 group-hover:text-green-dark dark:group-hover:text-green-light transition-colors duration-300">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{post.excerpt}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{post.date}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-green-dark dark:text-green-light hover:bg-green-light/10 p-2"
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center"
        >
          <Button
            size="lg"
            variant="outline"
            className="border-green-dark text-green-dark hover:bg-green-dark hover:text-white dark:border-green-light dark:text-green-light dark:hover:bg-green-light dark:hover:text-green-dark transition-all duration-300 px-8 py-4"
          >
            Read All Articles
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
