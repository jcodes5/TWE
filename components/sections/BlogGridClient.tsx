"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { ArrowRight, Calendar, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import Image from "next/image"

export type BlogPostItem = {
  id: string
  title: string
  excerpt: string | null
  image: string | null
  category: string
  createdAt: string
  author?: { firstName: string; lastName: string } | null
}

export default function BlogGridClient({ posts }: { posts: BlogPostItem[] }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <section ref={ref} className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-black dark:text-white mb-6">
            Latest Articles
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Updates, research, and stories from the frontlines of environmental action.
          </p>
        </motion.div>

        {featured && (
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
                    src={featured.image || "/placeholder.svg"}
                    alt={featured.title}
                    width={500}
                    height={300}
                    className="w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-green-light text-green-dark px-3 py-1 rounded-full text-sm font-semibold">
                    {featured.category}
                  </div>
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <h3 className="text-3xl font-bold text-black dark:text-white mb-3">
                    {featured.title}
                  </h3>
                  {featured.excerpt && (
                    <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                      {featured.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-1" />
                        {featured.author ? `${featured.author.firstName} ${featured.author.lastName}` : "TW&E"}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(featured.createdAt).toDateString()}
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {rest.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
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
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed line-clamp-3">{post.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {post.author ? `${post.author.firstName} ${post.author.lastName}` : "TW&E"}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(post.createdAt).toDateString()}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0 flex justify-end">
                  <Button variant="ghost" size="sm">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
