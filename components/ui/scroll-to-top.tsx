"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Button
            onClick={scrollToTop}
            size="lg"
            className="rounded-full w-14 h-14 bg-gradient-to-r from-green-dark to-teal hover:from-green-light hover:to-green-dark text-black hover:text-green-dark shadow-lg hover:shadow-xl transition-all duration-300 group"
            aria-label="Scroll to top"
          >
            <ArrowUp className="h-6 w-6 group-hover:scale-110 text-white transition-transform" />
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
