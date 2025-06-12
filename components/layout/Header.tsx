"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import  Image from "next/image"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/providers/ThemeProvider"

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Campaigns", href: "/campaigns" },
  { name: "Blog", href: "/blog" },
  { name: "Contact", href: "/contact" },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto"
  }, [isOpen])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-gradient-to-r from-green-dark/90 via-green-light/90 to-teal/90 backdrop-blur-xl shadow-md border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group" aria-label="TW&E Homepage">
  <div className="relative w-32 h-32 md:w-26 md:h-26">
    <Image
      src="/logo.png"
      alt="TW&E Logo"
      fill
      className="object-contain"
      priority
    />
  </div>
  {/* <div className="hidden md:block leading-tight">
    <div className="text-sm font-medium text-white dark:text-gray-300">The Weather &</div>
    <div className="text-sm font-medium text-white dark:text-gray-300">Everything</div>
  </div> */}
</Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center space-x-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name} className="relative">
                  <Link
                    href={item.href}
                    className={`relative text-lg px-4 py-2 font-semibold transition-all duration-300 ${
                      isActive
                        ? "text-white dark:text-green-light"
                        : "text-white dark:text-gray-300 hover:text-green-light"
                    }`}
                  >
                    <span className="relative z-10">{item.name}</span>
                    {isActive && (
                      <motion.span
                        layoutId="navbar-underline"
                        className="absolute bottom-0 left-0 w-full h-[2px] bg-green-light dark:bg-green-dark"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>

          {/* Right Controls */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <motion.div animate={{ rotate: theme === "dark" ? 180 : 0 }} transition={{ duration: 0.3 }}>
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-yellow-400" />
                ) : (
                  <Moon className="h-5 w-5 text-white" />
                )}
              </motion.div>
            </Button>

            {/* CTA */}
            <div className="hidden lg:block">
              <Button
                asChild
                className="bg-gradient-to-r from-green-light to-green-dark hover:from-green-dark hover:to-teal text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                <Link href="/join">Join Us</Link>
              </Button>
            </div>

            {/* Mobile Toggle */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                  {isOpen ? (
                    <X className="h-6 w-6 text-white dark:text-gray-300" />
                  ) : (
                    <Menu className="h-6 w-6 text-white dark:text-gray-300" />
                  )}
                </motion.div>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="mobile-menu-bg"
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                key="mobile-menu"
                className="absolute right-0 top-0 h-full w-3/4 sm:w-2/5 bg-gray-900 text-white p-6 shadow-xl"
                onClick={(e) => e.stopPropagation()}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <div className="flex justify-between items-center mb-4">
                  {/* <h2 className="text-xl font-bold">Menu</h2> */}
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="w-6 h-6 text-white" />
                  </Button>
                </div>
                <nav className="space-y-3">
  {navigation.map((item) => (
    <Link
      key={item.name}
      href={item.href}
      className={`block text-xl font-bold px-4 py-3 rounded-md transition-all duration-300 ${
        pathname === item.href
          ? "bg-green-light/10 text-green-light"
          : "text-white hover:text-green-light hover:bg-green-dark/20"
      }`}
    >
      {item.name}
    </Link>
  ))}
</nav>

                <div className="pt-6 border-t border-white/10 mt-6">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-green-light to-green-dark hover:from-green-dark hover:to-teal text-white font-semibold rounded-xl shadow-lg transition"
                  >
                    <Link href="/join">Join Us</Link>
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.header>
  )
}
