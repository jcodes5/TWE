"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"
import { Mail, Phone, MapPin, Clock, Globe, MessageCircle } from 'lucide-react'
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";
import { Card, CardContent } from "@/components/ui/card"

const contactMethods = [
  {
    icon: <Mail className="h-8 w-8" />,
    title: "Email Us",
    description: "Send us an email and we'll respond within 24 hours",
    contact: "theweatherandeverything@gmail.com",
    action: "mailto:theweatherandeverything@gmail.com",
    color: "from-blue-400 to-blue-600"
  },
  {
    icon: <Phone className="h-8 w-8" />,
    title: "Call Us",
    description: "Speak directly with our team during business hours",
    contact: "+234 908 058 4032",
    action: "tel:+234 908 058 4032",
    color: "from-green-400 to-green-600"
  },
  {
    icon: <MapPin className="h-8 w-8" />,
    title: "Visit Us",
    description: "Come to our headquarters for in-person meetings",
    contact: "Lekki, Lagos state, Nigeria.",
    action: "https://maps.app.goo.gl/gZbFwyHdi8Rs3xCHA",
    color: "from-purple-400 to-purple-600"
  },
  {
    icon: <MessageCircle className="h-8 w-8" />,
    title: "Live Chat",
    description: "Chat with our support team in real-time",
    contact: "Available 9 AM - 6 PM WAT",
    action: "#",
    color: "from-orange-400 to-red-500"
  }
]

const officeHours = [
  { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM WAT" },
  { day: "Saturday", hours: "Closed" },
  { day: "Sunday", hours: "Closed" }
]

const socialLinks = [
  { name: "Twitter", url: "#", icon: <FaTwitter className="h-8 w-8" /> },
  { name: "LinkedIn", url: "#", icon: <FaLinkedin className="h-8 w-8" /> },
  { name: "Facebook", url: "#", icon: <FaFacebook className="h-8 w-8" /> },
  { name: "Instagram", url: "#", icon: <FaInstagram className="h-8 w-8" /> }
]

export default function ContactInfo() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  return (
    <section ref={ref} className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Contact Methods */}
          <div className="space-y-6">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-3xl font-hartone font-bold text-black dark:text-white text-center mb-8"
            >
              Other Ways to Reach Us
            </motion.h2>

            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, x: 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow duration-300 group cursor-pointer">
                  <CardContent className="p-6">
                    <a href={method.action} className="flex items-start space-x-4">
                      <div className={`p-3 bg-gradient-to-r ${method.color} rounded-xl text-white group-hover:scale-110 transition-transform duration-300`}>
                        {method.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-1 group-hover:text-green-dark dark:group-hover:text-green-light transition-colors duration-300">
                          {method.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                          {method.description}
                        </p>
                        <p className="text-green-dark dark:text-green-light font-medium">
                          {method.contact}
                        </p>
                      </div>
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Office Hours */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Card className="bg-gradient-to-br from-green-light/10 to-green-dark/10 border-green-light/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Clock className="h-6 w-6 text-green-dark dark:text-green-light mr-3" />
                  <h3 className="text-xl font-semibold text-black dark:text-white">Office Hours</h3>
                </div>
                <div className="space-y-2">
                  {officeHours.map((schedule, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">{schedule.day}</span>
                      <span className="text-black dark:text-white font-medium">{schedule.hours}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Emergency Contact */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Card className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
                  Environmental Emergency?
                </h3>
                <p className="text-red-600 dark:text-red-300 text-sm mb-3">
                  For urgent environmental incidents or emergencies
                </p>
                <a
                  href="tel: +234 908 058 4032"
                  className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Emergency Hotline: +234 908 058 4032
                </a>
              </CardContent>
            </Card>
          </motion.div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-green-dark dark:text-green-light mr-3" />
                  <h3 className="text-xl font-semibold text-black dark:text-white">Follow Us</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
                  Stay updated with our latest news and campaigns
                </p>
                <div className="flex justify-center space-x-4">
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.url}
                      className="w-12 h-12 bg-gray-100 dark:bg-gray-700 hover:bg-green-light dark:hover:bg-green-dark rounded-full flex items-center justify-center text-2xl transition-colors duration-200"
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* FAQ Link */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center"
          >
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Looking for quick answers?{" "}
              <a href="/faq" className="text-green-dark dark:text-green-light hover:underline font-medium">
                Check our FAQ section
              </a>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
