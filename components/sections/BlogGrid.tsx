"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowRight, Clock, User, Calendar, Heart, MessageCircle, Share2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import Image from "next/image"

const blogPosts = [
  {
    id: 1,
    title: "The Future of Renewable Energy: Solar Power Revolution",
    excerpt: "Exploring how solar technology is transforming the global energy landscape and what it means for climate action.",
    image: "/placeholder.svg?height=300&width=500",
    author: "Dr. Sarah Chen",
    readTime: "8 min read",
    date: "Dec 15, 2024",
    category: "Renewable Energy",
    likes: 124,
    comments: 18,
    featured: true,
  },
  {
    id: 2,
    title: "Ocean Conservation: Protecting Marine Biodiversity",
    excerpt: "Understanding the critical role of ocean ecosystems and how we can protect marine life from climate change.",
    image: "/placeholder.svg?height=300&width=500",
    author: "Marcus Rodriguez",
    readTime: "6 min read",
    date: "Dec 12, 2024",
    category: "Conservation",
    likes: 89,
    comments: 12,
    featured: false,
  },
  {
    id: 3,
    title: "Sustainable Cities: Urban Planning for Climate Resilience",
    excerpt: "How cities around the world are adapting their infrastructure to combat climate change and create sustainable communities.",
    image: "/placeholder.svg?height=300&width=500",
    author: "Emma Thompson",
    readTime: "10 min read",
    date: "Dec 10, 2024",
    category: "Sustainability",
    likes: 156,
    comments: 24,
    featured: false,
  },
  {
    id: 4,
    title: "Climate Science Explained: Understanding Global Warming",
    excerpt: "Breaking down complex climate science into accessible insights for everyone to understand the urgency of climate action.",
    image: "/placeholder.svg?height=300&width=500",
    author: "Dr. James Park",
    readTime: "12 min read",
    date: "Dec 8, 2024",
    category: "Climate Science",
    likes: 203,
    comments: 31,
    featured: true,
  },
  {
    id: 5,
    title: "Water Conservation: Innovative Solutions for Drought",
    excerpt: "Discovering cutting-edge technologies and community initiatives that are addressing water scarcity worldwide.",
    image: "/placeholder.svg?height=300&width=500",
    author: "Aisha Patel",
    readTime: "7 min read",
    date: "Dec 5, 2024",
    category: "Water Resources",
    likes: 78,
    comments: 9,
    featured: false,
  },
  {
    id: 6,
    title: "Green Technology: Innovations Changing the World",
    excerpt: "Exploring breakthrough technologies that are revolutionizing how we approach environmental challenges.",
    image: "/placeholder.svg?height=300&width=500",
    author: "Carlos Silva",
    readTime: "9 min read",
    date: "Dec 3, 2024",
    category: "Renewable Energy",
    likes: 142,
    comments: 16,
    featured: false,
  },
]

export default function BlogGrid() {
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
          <h2 className="text-4xl lg:text-5xl font-hartone font-bold text-black dark:text-black mb-6">
            Latest Articles
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Stay updated with our latest insights, research, and stories from the frontlines of environmental action.
          </p>
        </motion.div>

        {/* Featured Article */}
        {blogPosts.filter(post => post.featured)[0] && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <Card className="overflow-hidden hover:shadow-2xl transition-shadow duration-500 group">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative overflow-hidden">
                  <Image
                    src={blogPosts.filter(post => post.featured)[0].image || "/placeholder.svg"}
                    alt={blogPosts.filter(post => post.featured)[0].title}
                    width={500}
                    height={300}
                    className="w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-green-light text-green-dark px-3 py-1 rounded-full text-sm font-semibold">
                    Featured
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <div className="mb-4">
                    <span className="text-green-dark dark:text-green-light text-sm font-medium">
                      {blogPosts.filter(post => post.featured)[0].category}
                    </span>
                  </div>
                  <h3 className="text-3xl font-hartone font-bold text-black dark:text-white mb-4 group-hover:text-green-dark dark:group-hover:text-green-light transition-colors duration-300">
                    {blogPosts.filter(post => post.featured)[0].title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {blogPosts.filter(post => post.featured)[0].excerpt}
                  </p>

                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {blogPosts.filter(post => post.featured)[0].author}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {blogPosts.filter(post => post.featured)[0].readTime}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {blogPosts.filter(post => post.featured)[0].date}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {blogPosts.filter(post => post.featured)[0].likes}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {blogPosts.filter(post => post.featured)[0].comments}
                      </div>
                    </div>
                    <Button className="bg-green-dark hover:bg-green-light text-white hover:text-green-dark transition-all duration-300">
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Regular Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {blogPosts.filter(post => !post.featured).map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 + index * 0.1 }}
            >
              <Card className="h-full hover:shadow-xl transition-shadow duration-300 group cursor-pointer">
                <CardHeader className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      width={500}
                      height={300}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4 bg-green-light text-green-dark px-3 py-1 rounded-full text-xs font-semibold">
                      {post.category}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-3 group-hover:text-green-dark dark:group-hover:text-green-light transition-colors duration-300 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">{post.excerpt}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 mr-1" />
                        {post.likes}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {post.comments}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-green-dark dark:text-green-light hover:bg-green-light/10">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>

                <CardFooter className="p-6 pt-0">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-sm text-gray-500 dark:text-gray-400">{post.date}</span>
                    <Button variant="ghost" size="sm" className="text-green-dark dark:text-green-light hover:bg-green-light/10 p-2">
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
            Load More Articles
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
