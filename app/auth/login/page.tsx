
"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Mail, Lock, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from 'next/navigation';

export default function LoginPage() {

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('Form submitted') // Debug log
    e.preventDefault();
    setIsLoading(true);
    setError(''); // Reset error on new submit

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData), // Use formData instead of separate email/password
        credentials: 'same-origin' // This is needed to handle cookies
      });

      console.log('Response status:', res.status) // Debug log

      const data = await res.json();
      console.log('Response data:', data) // Debug log

      if (!res.ok) {
        setError(data.error || 'An error occurred');
        return;
      }

      // Use the redirect URL from the API response
      if (data.redirectUrl) {
         setTimeout(() => {
  window.location.href = data.redirectUrl;
}, 100);
 // Updated redirection logic
      } else {
        // Fallback to default dashboard if no redirect URL is provided
        router.push('/dashboard/volunteer'); // Updated fallback redirection
      }
    } catch (err) {
      setError('Failed to login. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden pt-20">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 bg-green-light/20 dark:bg-green-light/10 rounded-full"
              >
                <Shield className="h-4 w-4 text-green-dark dark:text-green-light mr-2" />
                <span className="text-green-dark dark:text-green-light font-medium text-sm">Secure Login</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl md:text-5xl font-hartone font-bold text-foreground leading-tight"
              >
                Welcome{' '}
                <span className="bg-gradient-to-r from-green-light to-green-dark bg-clip-text text-transparent">
                  Back
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-lg text-muted-foreground leading-relaxed"
              >
                Sign in to your TW&E account and continue making a difference for our planet.
              </motion.p>
            </motion.div>

            {/* Right Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/placeholder.jpg"
                  alt="Login to TW&E"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Login Form */}
      <section className="relative py-16">
        <div className="max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-2xl bg-card dark:bg-gray-800 border-border">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl font-hartone font-bold text-foreground">
                  Sign In
                </CardTitle>
                <p className="text-muted-foreground">
                  Enter your credentials to access your account
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="pl-10 bg-background dark:bg-gray-700 border-input text-foreground"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-foreground">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="pl-10 pr-10 bg-background dark:bg-gray-700 border-input text-foreground"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                      <span className="block sm:inline">{error}</span>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-green-dark hover:bg-green-light text-white hover:text-green-dark transition-all duration-300"
                  >
                    {isLoading ? 'Signing In...' : 'Sign In'}
                  </Button>
                </form>

                <div className="text-center space-y-4">
                  <Link href="/auth/forgot-password" className="text-sm text-green-dark dark:text-green-light hover:underline">
                    Forgot your password?
                  </Link>
                  
                  <div className="border-t border-border pt-4">
                    <p className="text-sm text-muted-foreground">
                      Don't have an account?{' '}
                      <Link href="/auth/register" className="text-green-dark dark:text-green-light hover:underline font-semibold">
                        Register here
                      </Link>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
