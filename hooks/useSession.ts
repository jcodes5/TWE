"use client"

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export function useSession(sessionTimeout: number = 3600000) { // 1 hour default
  const router = useRouter()

  const extendSession = useCallback(() => {
    // Update last activity timestamp
    localStorage.setItem('lastActivity', Date.now().toString())

    // Reset auto-logout timer
    const timer = localStorage.getItem('logoutTimer')
    if (timer) {
      clearTimeout(parseInt(timer))
    }

    const newTimer = setTimeout(() => {
      handleLogout()
    }, sessionTimeout)

    localStorage.setItem('logoutTimer', newTimer.toString())
  }, [sessionTimeout])

  const handleLogout = useCallback(() => {
    // Clear session data
    localStorage.removeItem('lastActivity')
    localStorage.removeItem('logoutTimer')

    // Clear cookies
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'

    // Redirect to login
    router.push('/auth/login')
  }, [router])

  const checkSession = useCallback(() => {
    const lastActivity = localStorage.getItem('lastActivity')
    if (!lastActivity) {
      extendSession()
      return
    }

    const timeSinceActivity = Date.now() - parseInt(lastActivity)
    if (timeSinceActivity > sessionTimeout) {
      handleLogout()
    } else {
      extendSession()
    }
  }, [sessionTimeout, extendSession, handleLogout])

  useEffect(() => {
    // Set up activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']

    const handleActivity = () => {
      extendSession()
    }

    events.forEach(event => {
      document.addEventListener(event, handleActivity, true)
    })

    // Initial session check
    checkSession()

    // Set up periodic session check
    const interval = setInterval(checkSession, 60000) // Check every minute

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true)
      })
      clearInterval(interval)

      // Clear logout timer
      const timer = localStorage.getItem('logoutTimer')
      if (timer) {
        clearTimeout(parseInt(timer))
      }
    }
  }, [checkSession, extendSession])

  return {
    extendSession,
    handleLogout,
    checkSession
  }
}