
"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer, MapPin, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import axios from "axios"

interface WeatherData {
  temperature: number
  condition: string
  humidity: number
  location: string
  description: string
  windSpeed: number
  feelsLike: number
}

interface LocationData {
  lat: number
  lon: number
  city: string
  country: string
}

export default function WeatherWidget() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [location, setLocation] = useState<LocationData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get weather icon based on condition
  const getWeatherIcon = (condition: string, description: string) => {
    const iconClass = "h-6 w-6"
    
    if (condition === "Clear") {
      return <Sun className={`${iconClass} text-yellow-500`} />
    } else if (condition === "Clouds") {
      return <Cloud className={`${iconClass} text-gray-500`} />
    } else if (condition === "Rain" || condition === "Drizzle") {
      return <CloudRain className={`${iconClass} text-blue-500`} />
    } else if (condition === "Snow") {
      return <CloudSnow className={`${iconClass} text-blue-200`} />
    } else if (condition === "Mist" || condition === "Fog" || condition === "Haze") {
      return <Wind className={`${iconClass} text-gray-400`} />
    } else {
      return <Cloud className={`${iconClass} text-gray-500`} />
    }
  }

  // Get user's location
  const getUserLocation = () => {
    return new Promise<LocationData>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          
          try {
            // Get city name from coordinates using reverse geocoding
            const geoResponse = await axios.get(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}`
            )
            
            const cityData = geoResponse.data[0]
            resolve({
              lat: latitude,
              lon: longitude,
              city: cityData?.name || "Unknown",
              country: cityData?.country || ""
            })
          } catch (error) {
            resolve({
              lat: latitude,
              lon: longitude,
              city: "Unknown Location",
              country: ""
            })
          }
        },
        (error) => {
          reject(new Error("Unable to retrieve location"))
        },
        {
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
          enableHighAccuracy: true
        }
      )
    })
  }

  // Fetch weather data
  const fetchWeatherData = async (locationData: LocationData) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${locationData.lat}&lon=${locationData.lon}&appid=${process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY}&units=metric`
      )
      
      const data = response.data
      
      const weatherData: WeatherData = {
        temperature: Math.round(data.main.temp),
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        location: `${locationData.city}${locationData.country ? ', ' + locationData.country : ''}`,
        description: data.weather[0].description,
        windSpeed: data.wind.speed,
        feelsLike: Math.round(data.main.feels_like)
      }
      
      setWeather(weatherData)
    } catch (error) {
      throw new Error("Failed to fetch weather data")
    }
  }

  // Initialize weather data
  useEffect(() => {
    const initializeWeather = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Check if API key is available
        if (!process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY) {
          throw new Error("Weather API key not configured")
        }
        
        const locationData = await getUserLocation()
        setLocation(locationData)
        
        await fetchWeatherData(locationData)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load weather data")
      } finally {
        setIsLoading(false)
      }
    }

    initializeWeather()
  }, [])

  // Update weather data every 10 minutes
  useEffect(() => {
    if (!location) return

    const interval = setInterval(async () => {
      try {
        await fetchWeatherData(location)
      } catch (error) {
        console.error("Failed to update weather data:", error)
      }
    }, 600000) // 10 minutes

    return () => clearInterval(interval)
  }, [location])

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

  if (error) {
    return (
      <Card className="w-48 bg-white/10 backdrop-blur-md border-white/20">
        <CardContent className="p-4">
          <div className="flex items-center text-red-300">
            <AlertCircle className="h-4 w-4 mr-2" />
            <span className="text-xs">{error}</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weather) {
    return null
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ duration: 0.5 }}
    >
      <Card className="w-48 bg-white/10 backdrop-blur-md border-white/20 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <MapPin className="h-3 w-3 mr-1 text-green-light" />
              <span className="text-xs font-medium truncate">{weather.location}</span>
            </div>
            {getWeatherIcon(weather.condition, weather.description)}
          </div>

          <div className="flex items-center mb-2">
            <Thermometer className="h-4 w-4 mr-2 text-green-light" />
            <span className="text-2xl font-bold">{weather.temperature}°C</span>
          </div>

          <div className="text-xs text-gray-200 space-y-1">
            <div className="flex justify-between">
              <span>Feels like</span>
              <span>{weather.feelsLike}°C</span>
            </div>
            <div className="flex justify-between">
              <span>Humidity</span>
              <span>{weather.humidity}%</span>
            </div>
            <div className="flex justify-between">
              <span>Wind</span>
              <span>{weather.windSpeed} m/s</span>
            </div>
            <div className="flex justify-between">
              <span>Condition</span>
              <span className="capitalize">{weather.description}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
