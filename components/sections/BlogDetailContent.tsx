"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Calendar, User, ArrowLeft, Heart, MessageCircle, Share2, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { BlogPost, User as PrismaUser, Comment } from "@prisma/client"

interface BlogPostWithAuthor extends BlogPost {
  author: Pick<PrismaUser, "firstName" | "lastName">
  comments: (Comment & {
    user: Pick<PrismaUser, "firstName" | "lastName">
  })[]
}

interface BlogDetailContentProps {
  post: BlogPostWithAuthor
}

export default function BlogDetailContent({ post }: BlogDetailContentProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const readingTime = Math.ceil(post.content.split(' ').length / 200) // Assuming 200 words per minute

  return (
    <>
      {/* Hero Section */}
      <section ref={ref} className="relative py-20 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <Link href="/blog">
              <Button variant="ghost" className="text-green-dark dark:text-green-light hover:bg-green-light/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </motion.div>

          {/* Category Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6"
          >
            <span className="inline-block bg-green-light text-green-dark px-4 py-2 rounded-full text-sm font-semibold">
              {post.category}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-4xl lg:text-5xl font-bold text-black dark:text-white mb-6 leading-tight"
          >
            {post.title}
          </motion.h1>

          {/* Excerpt */}
          {post.excerpt && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed"
            >
              {post.excerpt}
            </motion.p>
          )}

          {/* Meta Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-400 mb-8"
          >
            <div className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              <span className="font-medium">
                {post.author.firstName} {post.author.lastName}
              </span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              <span>{new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              <span>{readingTime} min read</span>
            </div>
            <div className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              <span>{post.comments.length} comments</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      {post.image && (
        <section className="py-8">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl"
            >
              <Image
                src={post.image}
                alt={post.title}
                width={1200}
                height={600}
                className="w-full h-64 lg:h-96 object-cover"
                priority
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="prose prose-lg dark:prose-invert max-w-none"
          >
            <div 
              className="text-gray-700 dark:text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }}
            />
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="border-green-dark text-green-dark hover:bg-green-dark hover:text-white">
                <Heart className="h-4 w-4 mr-2" />
                Like
              </Button>
              <Button variant="outline" size="sm" className="border-green-dark text-green-dark hover:bg-green-dark hover:text-white">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Comments Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <h3 className="text-2xl font-bold text-black dark:text-white mb-8">
              Comments ({post.comments.length})
            </h3>

            {post.comments.length > 0 ? (
              <div className="space-y-6">
                {post.comments.map((comment) => (
                  <Card key={comment.id} className="bg-white dark:bg-gray-900">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-light rounded-full flex items-center justify-center text-green-dark font-semibold mr-3">
                            {comment.user.firstName.charAt(0)}{comment.user.lastName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-black dark:text-white">
                              {comment.user.firstName} {comment.user.lastName}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {comment.content}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-white dark:bg-gray-900">
                <CardContent className="p-8 text-center">
                  <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </section>
    </>
 )
}