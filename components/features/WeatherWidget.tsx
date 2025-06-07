"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Cloud, Sun, CloudRain, Thermometer } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  location: string
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData>({
    temperature: 22,
    condition: "sunny",
    humidity: 65,
    location: "Global Average",
  })

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate weather data loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case "sunny":
        return <Sun className="h-6 w-6 text-yellow-500" />
      case "cloudy":
        return <Cloud className="h-6 w-6 text-gray-500" />
      case "rainy":
        return <CloudRain className="h-6 w-6 text-blue-500" />
      default:
        return <Sun className="h-6 w-6 text-yellow-500" />
    }
  }

  if (isLoading) {
    return (
      <Card className="w-48 bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="p-4">
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-white/20 rounded w-3/4"></div>
            <div className="h-6 bg-white/20 rounded w-1/2"></div>
            <div className="h-3 bg-white/20 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
      <Card className="w-48 bg-white/10 backdrop-blur-md border-white/20 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">{weather.location}</span>
            {getWeatherIcon(weather.condition)}
          </div>

          <div className="flex items-center mb-2">
            <Thermometer className="h-4 w-4 mr-2 text-green-light" />
            <span className="text-2xl font-bold">{weather.temperature}°C</span>
          </div>

          <div className="text-xs text-gray-200">
            <div className="flex justify-between">
              <span>Humidity</span>
              <span>{weather.humidity}%</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Condition</span>
              <span className="capitalize">{weather.condition}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
