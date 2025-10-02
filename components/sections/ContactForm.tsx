"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { Send, User, Mail, MessageSquare, Building } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

export default function ContactForm() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    subject: "",
    message: "",
    inquiryType: "general"
  })

  const inquiryTypes = [
    { value: "general", label: "General Inquiry" },
    { value: "volunteer", label: "Volunteer Opportunities" },
    { value: "partnership", label: "Partnership" },
    { value: "media", label: "Media & Press" },
    { value: "donation", label: "Donations" },
    { value: "support", label: "Technical Support" }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const [submitState, setSubmitState] = useState<'idle'|'submitting'|'success'|'error'>('idle')
  const [submitMsg, setSubmitMsg] = useState<string>("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSubmitState('submitting')
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('Failed to submit')
      setSubmitState('success')
      setSubmitMsg('Thanks! Your message has been received.')
      setFormData({ name: '', email: '', organization: '', subject: '', message: '', inquiryType: 'general' })
    } catch (err) {
      setSubmitState('error')
      setSubmitMsg('Something went wrong. Please try again.')
    }
  }

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <Card className="shadow-2xl border-0 bg-white dark:bg-gray-800">
            <CardHeader className="text-center pb-8">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="w-16 h-16 bg-gradient-to-r from-green-light to-green-dark rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <MessageSquare className="h-8 w-8 text-white" />
              </motion.div>
              <CardTitle className="text-3xl font-hartone font-bold text-black dark:text-white">
                Send us a Message
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                We typically respond within 24 hours
              </p>
            </CardHeader>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  >
                    <Label htmlFor="name" className="text-black dark:text-white font-medium mb-2 block">
                      Full Name *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-gray-300 dark:border-gray-600 focus:border-green-light focus:ring-green-light"
                        placeholder="Your full name"
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <Label htmlFor="email" className="text-black dark:text-white font-medium mb-2 block">
                      Email Address *
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10 h-12 border-gray-300 dark:border-gray-600 focus:border-green-light focus:ring-green-light"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </motion.div>
                </div>

                {/* Organization */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  <Label htmlFor="organization" className="text-black dark:text-white font-medium mb-2 block">
                    Organization (Optional)
                  </Label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="organization"
                      name="organization"
                      type="text"
                      value={formData.organization}
                      onChange={handleInputChange}
                      className="pl-10 h-12 border-gray-300 dark:border-gray-600 focus:border-green-light focus:ring-green-light"
                      placeholder="Your organization or company"
                    />
                  </div>
                </motion.div>

                {/* Inquiry Type */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.6 }}
                >
                  <Label htmlFor="inquiryType" className="text-black dark:text-white font-medium mb-2 block">
                    Inquiry Type
                  </Label>
                  <select
                    id="inquiryType"
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                    className="w-full h-12 px-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white focus:border-green-light focus:ring-green-light"
                  >
                    {inquiryTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </motion.div>

                {/* Subject */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  <Label htmlFor="subject" className="text-black dark:text-white font-medium mb-2 block">
                    Subject *
                  </Label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="h-12 border-gray-300 dark:border-gray-600 focus:border-green-light focus:ring-green-light"
                    placeholder="Brief description of your inquiry"
                  />
                </motion.div>

                {/* Message */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <Label htmlFor="message" className="text-black dark:text-white font-medium mb-2 block">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className="border-gray-300 dark:border-gray-600 focus:border-green-light focus:ring-green-light resize-none"
                    placeholder="Please provide details about your inquiry..."
                  />
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.9 }}
                  className="pt-4"
                >
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-to-r from-green-light to-green-dark hover:from-green-dark hover:to-teal text-black hover:text-white transition-all duration-500 h-14 text-lg font-semibold group"
                  >
                    Send Message
                    <Send className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </motion.div>

                {submitState !== 'idle' && (
                  <p className={`text-center text-sm ${submitState === 'success' ? 'text-green-600' : 'text-red-600'}`}>{submitMsg}</p>
                )}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  By submitting this form, you agree to our privacy policy and terms of service.
                </motion.p>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
