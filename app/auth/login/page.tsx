"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import AuthLayout from "@/components/layout/AuthLayout"


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
        body: JSON.stringify(formData),
        credentials: 'include',
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
    <AuthLayout
      title="Welcome Back"
      description="Sign in to your TW&E account and continue making a difference for our planet."
      image="/login.jpg"
      imageAlt="Nature conservation illustration"
    >
      <div className="space-y-8">
        {/* Form Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Sign in to your account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access your account
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="bg-background"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="bg-background pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-md">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end">
            <Link 
              href="/auth/forgot-password" 
              className="text-sm text-muted-foreground hover:text-foreground hover:underline"
            >
              Forgot your password?
            </Link>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link 
              href="/auth/register" 
              className="text-primary hover:text-primary/90 hover:underline"
            >
              Create one now
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}
