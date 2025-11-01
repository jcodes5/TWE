// Location to coordinate mapping for global impact map
// This provides default coordinates for common location names

export interface LocationCoordinates {
  latitude: number
  longitude: number
  region?: string
}

// Common location mappings for environmental campaigns
export const locationCoordinates: Record<string, LocationCoordinates> = {
  // Global/International
  "Global": { latitude: 20, longitude: 0, region: "Global" },
  "Worldwide": { latitude: 20, longitude: 0, region: "Global" },
  "International": { latitude: 20, longitude: 0, region: "Global" },

  // North America
  "United States": { latitude: 39.8283, longitude: -98.5795, region: "North America" },
  "USA": { latitude: 39.8283, longitude: -98.5795, region: "North America" },
  "Canada": { latitude: 56.1304, longitude: -106.3468, region: "North America" },
  "Mexico": { latitude: 23.6345, longitude: -102.5528, region: "North America" },
  "North America": { latitude: 41.0, longitude: -100.0, region: "North America" },

  // Pacific Coast
  "Pacific Coast": { latitude: 36.0, longitude: -120.0, region: "North America" },
  "California": { latitude: 36.7783, longitude: -119.4179, region: "North America" },
  "Oregon": { latitude: 43.8041, longitude: -120.5542, region: "North America" },
  "Washington": { latitude: 47.7511, longitude: -120.7401, region: "North America" },

  // South America
  "Brazil": { latitude: -14.2350, longitude: -51.9253, region: "South America" },
  "Amazon": { latitude: -3.4653, longitude: -62.2159, region: "South America" },
  "Argentina": { latitude: -38.4161, longitude: -63.6167, region: "South America" },
  "Chile": { latitude: -35.6751, longitude: -71.5430, region: "South America" },
  "South America": { latitude: -15.0, longitude: -60.0, region: "South America" },

  // Europe
  "United Kingdom": { latitude: 55.3781, longitude: -3.4360, region: "Europe" },
  "UK": { latitude: 55.3781, longitude: -3.4360, region: "Europe" },
  "Germany": { latitude: 51.1657, longitude: 10.4515, region: "Europe" },
  "France": { latitude: 46.2276, longitude: 2.2137, region: "Europe" },
  "Netherlands": { latitude: 52.1326, longitude: 5.2913, region: "Europe" },
  "Spain": { latitude: 40.4637, longitude: -3.7492, region: "Europe" },
  "Italy": { latitude: 41.8719, longitude: 12.5674, region: "Europe" },
  "Europe": { latitude: 54.0, longitude: 15.0, region: "Europe" },

  // Africa
  "Kenya": { latitude: -0.0236, longitude: 37.9062, region: "Africa" },
  "Nigeria": { latitude: 9.0820, longitude: 8.6753, region: "Africa" },
  "South Africa": { latitude: -30.5595, longitude: 22.9375, region: "Africa" },
  "Egypt": { latitude: 26.0975, longitude: 30.0444, region: "Africa" },
  "Morocco": { latitude: 31.7917, longitude: -7.0926, region: "Africa" },
  "Africa": { latitude: 7.0, longitude: 20.0, region: "Africa" },

  // Asia
  "China": { latitude: 35.8617, longitude: 104.1954, region: "Asia" },
  "India": { latitude: 20.5937, longitude: 78.9629, region: "Asia" },
  "Japan": { latitude: 36.2048, longitude: 138.2529, region: "Asia" },
  "Indonesia": { latitude: -0.7893, longitude: 113.9213, region: "Asia" },
  "Asia": { latitude: 34.0, longitude: 100.0, region: "Asia" },

  // Middle East
  "Israel": { latitude: 31.0461, longitude: 34.8516, region: "Middle East" },
  "Jordan": { latitude: 30.5852, longitude: 36.2384, region: "Middle East" },
  "Saudi Arabia": { latitude: 23.8859, longitude: 45.0792, region: "Middle East" },
  "UAE": { latitude: 23.4241, longitude: 53.8478, region: "Middle East" },

  // Oceania
  "Australia": { latitude: -25.2744, longitude: 133.7751, region: "Oceania" },
  "New Zealand": { latitude: -40.9006, longitude: 174.8860, region: "Oceania" },
  "Oceania": { latitude: -25.0, longitude: 140.0, region: "Oceania" },

  // Specific regions
  "Urban Areas": { latitude: 40.0, longitude: -74.0, region: "Urban" },
  "Rural Communities": { latitude: 39.0, longitude: -95.0, region: "Rural" },
  "Major Cities": { latitude: 40.7128, longitude: -74.0060, region: "Urban" },
  "Southwest USA": { latitude: 35.0, longitude: -110.0, region: "North America" },
  "Arctic": { latitude: 80.0, longitude: 0.0, region: "Polar" },
  "Antarctica": { latitude: -82.8628, longitude: 135.0, region: "Polar" },

  // Conservation areas
  "Rainforest": { latitude: -3.0, longitude: -60.0, region: "Conservation" },
  "Ocean": { latitude: 0.0, longitude: -160.0, region: "Marine" },
  "Coral Reefs": { latitude: -16.0, longitude: 145.0, region: "Marine" },
  "Mountains": { latitude: 46.0, longitude: 15.0, region: "Mountain" },
  "Desert": { latitude: 25.0, longitude: 45.0, region: "Desert" }
}

// Function to get coordinates for a location
export function getCoordinatesForLocation(location: string): LocationCoordinates | null {
  if (!location) return null

  // First try exact match
  const exactMatch = locationCoordinates[location]
  if (exactMatch) return exactMatch

  // Try case-insensitive match
  const caseInsensitiveMatch = Object.entries(locationCoordinates).find(
    ([key]) => key.toLowerCase() === location.toLowerCase()
  )
  if (caseInsensitiveMatch) return caseInsensitiveMatch[1]

  // Try partial match
  const partialMatch = Object.entries(locationCoordinates).find(
    ([key]) => location.toLowerCase().includes(key.toLowerCase()) ||
                key.toLowerCase().includes(location.toLowerCase())
  )
  if (partialMatch) return partialMatch[1]

  // Default fallback for unknown locations
  return {
    latitude: 20 + Math.random() * 60 - 30, // Random latitude between -10 and 80
    longitude: Math.random() * 360 - 180,   // Random longitude between -180 and 180
    region: "Unknown"
  }
}

// Function to get coordinates for campaign locations in the database
export function getCampaignMapData(campaigns: Array<{
  id: string
  title: string
  location: string
  category: string
  status: string
  description?: string
  raised?: number
  goal?: number
  latitude?: number | null
  longitude?: number | null
}>): Array<{
  id: string
  name: string
  location: string
  coordinates: { x: number; y: number }
  participants: number
  category: string
  status: string
  description: string
}> {
  return campaigns
    .filter((campaign) => campaign.status === 'ACTIVE')
    .map((campaign) => {
      // Use stored coordinates if available, otherwise derive from location
      let coords: LocationCoordinates
      if (campaign.latitude !== null && campaign.longitude !== null && 
          typeof campaign.latitude === 'number' && typeof campaign.longitude === 'number') {
        coords = { latitude: campaign.latitude, longitude: campaign.longitude }
      } else {
        coords = getCoordinatesForLocation(campaign.location) || { latitude: 20, longitude: 0 }
      }

      // Convert lat/lng to map coordinates (0-100 range for SVG viewBox)
      const x = Math.max(5, Math.min(95, ((coords.longitude + 180) / 360) * 100))
      const y = Math.max(5, Math.min(95, ((90 - coords.latitude) / 180) * 100))

      return {
        id: campaign.id,
        name: campaign.title,
        location: campaign.location,
        coordinates: { x, y },
        participants: Math.floor(Math.random() * 2000) + 100, // Mock participant data for now
        category: campaign.category,
        status: campaign.status,
        description: campaign.description || 'Environmental campaign'
      }
    })
}