"use client"

import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState } from "react"
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

const faqData = [
  {
    category: "General",
    questions: [
      {
        question: "What is The Weather and Everything (TW&E)?",
        answer: "TW&E is a global environmental organization dedicated to combating climate change through education, advocacy, and community action. We work to bridge the gap between climate science and practical solutions."
      },
      {
        question: "How can I get involved with TW&E?",
        answer: "There are three main ways to join: as a Volunteer (free), Donor (from $10/month), or full Member ($25/month). Each level offers different benefits and opportunities to contribute to our mission."
      },
      {
        question: "Is TW&E a registered nonprofit organization?",
        answer: "Yes, TW&E is a registered 501(c)(3) nonprofit organization. All donations are tax-deductible, and we provide receipts for your records."
      }
    ]
  },
  {
    category: "Volunteering",
    questions: [
      {
        question: "What volunteer opportunities are available?",
        answer: "We offer diverse volunteer opportunities including campaign support, event organization, content creation, research assistance, community outreach, and administrative tasks. Opportunities are available both locally and remotely."
      },
      {
        question: "How much time do I need to commit as a volunteer?",
        answer: "Volunteer commitments are flexible. You can contribute as little as 2 hours per month. We have both one-time opportunities and ongoing roles to fit your schedule."
      },
      {
        question: "Do I need special skills or experience to volunteer?",
        answer: "No special skills are required! We provide training and welcome volunteers from all backgrounds. Whether you're a student, professional, or retiree, there's a way for you to contribute meaningfully."
      },
      {
        question: "Can I volunteer remotely?",
        answer: "Many of our volunteer opportunities can be done remotely, including research, content creation, social media support, and virtual event assistance."
      }
    ]
  },
  {
    category: "Donations",
    questions: [
      {
        question: "How are donations used?",
        answer: "Donations directly fund our campaigns, educational programs, research initiatives, and operational costs. We provide detailed monthly impact reports showing exactly how your contributions are making a difference."
      },
      {
        question: "Can I make a one-time donation instead of monthly?",
        answer: "Yes! While we encourage monthly donations for sustained impact, we gladly accept one-time donations of any amount. You can also set up quarterly or annual giving schedules."
      },
      {
        question: "Are donations tax-deductible?",
        answer: "Yes, all donations to TW&E are tax-deductible. You'll receive a receipt immediately after donating, and an annual summary for tax purposes."
      },
      {
        question: "Can I specify how my donation is used?",
        answer: "Yes, you can designate your donation for specific campaigns or programs. We also have a general fund that allows us to direct resources where they're needed most urgently."
      }
    ]
  },
  {
    category: "Membership",
    questions: [
      {
        question: "What's the difference between being a donor and a member?",
        answer: "Members receive all donor benefits plus voting rights in organizational decisions, access to leadership opportunities, exclusive member events, advanced training programs, and mentorship opportunities."
      },
      {
        question: "How do voting rights work for members?",
        answer: "Members can vote on major organizational decisions, board elections, and strategic initiatives. Voting typically occurs during our annual member meeting and through secure online platforms for specific issues."
      },
      {
        question: "Can I upgrade or downgrade my membership level?",
        answer: "Yes, you can change your involvement level at any time. Contact our member services team, and they'll help you transition smoothly between volunteer, donor, and member status."
      },
      {
        question: "What leadership opportunities are available to members?",
        answer: "Members can lead campaigns, join committees, mentor new volunteers, represent TW&E at events, and apply for board positions. We also offer leadership development programs and training."
      }
    ]
  }
]

export default function JoinFAQ() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })
  const [openItems, setOpenItems] = useState<string[]>([])

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  return (
    <section ref={ref} className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-green-light to-green-dark rounded-full">
              <HelpCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-4xl lg:text-5xl font-hartone font-bold text-black dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Find answers to common questions about joining TW&E and getting involved in our environmental mission.
          </p>
        </motion.div>

        <div className="space-y-8">
          {faqData.map((category, categoryIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: categoryIndex * 0.2 }}
            >
              <h3 className="text-2xl font-semibold text-black dark:text-white mb-6 flex items-center">
                <div className="w-2 h-8 bg-gradient-to-b from-green-light to-green-dark rounded-full mr-4"></div>
                {category.category}
              </h3>
              
              <div className="space-y-4">
                {category.questions.map((faq, questionIndex) => {
                  const itemId = `${category.category}-${questionIndex}`
                  const isOpen = openItems.includes(itemId)
                  
                  return (
                    <Card 
                      key={questionIndex}
                      className="overflow-hidden hover:shadow-lg transition-shadow duration-300"
                    >
                      <button
                        onClick={() => toggleItem(itemId)}
                        className="w-full text-left focus:outline-none focus:ring-2 focus:ring-green-light focus:ring-opacity-50"
                      >
                        <CardContent className="p-6">
                          <div className="flex justify-between items-center">
                            <h4 className="text-lg font-semibold text-black dark:text-white pr-4">
                              {faq.question}
                            </h4>
                            <div className="flex-shrink-0">
                              {isOpen ? (
                                <ChevronUp className="h-5 w-5 text-green-dark dark:text-green-light" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-green-dark dark:text-green-light" />
                              )}
                            </div>
                          </div>
                          
                          <motion.div
                            initial={false}
                            animate={{
                              height: isOpen ? "auto" : 0,
                              opacity: isOpen ? 1 : 0
                            }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-4">
                              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        </CardContent>
                      </button>
                    </Card>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Contact for More Questions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Card className="bg-gradient-to-r from-green-light/10 to-green-dark/10 border-green-light/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold text-black dark:text-white mb-4">
                Still Have Questions?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Our team is here to help! Reach out to us for personalized assistance with joining TW&E.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-green-dark hover:bg-green-light text-white hover:text-green-dark transition-all duration-300 rounded-lg font-semibold"
                >
                  Contact Support
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 border-2 border-green-dark text-green-dark hover:bg-green-dark hover:text-white dark:border-green-light dark:text-green-light dark:hover:bg-green-light dark:hover:text-green-dark transition-all duration-300 rounded-lg font-semibold"
                >
                  Schedule a Call
                </motion.button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}
