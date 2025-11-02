// Shared category metadata utility for blog categories
import { Leaf, Droplets, Sun, Recycle, Globe, Zap } from 'lucide-react'

export interface CategoryMetadata {
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  count?: number
}

export const getCategoryMetadata = (categoryName: string): Omit<CategoryMetadata, 'count'> => {
  const name = categoryName.toLowerCase()
  
  if (name.includes('climate')) {
    return {
      name: categoryName,
      icon: Sun,
      color: 'from-yellow-400 to-orange-500'
    }
  }
  
  if (name.includes('renewable') || name.includes('energy')) {
    return {
      name: categoryName,
      icon: Zap,
      color: 'from-blue-400 to-cyan-500'
    }
  }
  
  if (name.includes('conservation') || name.includes('nature')) {
    return {
      name: categoryName,
      icon: Leaf,
      color: 'from-green-400 to-green-600'
    }
  }
  
  if (name.includes('water')) {
    return {
      name: categoryName,
      icon: Droplets,
      color: 'from-blue-500 to-teal-500'
    }
  }
  
  if (name.includes('sustain')) {
    return {
      name: categoryName,
      icon: Recycle,
      color: 'from-purple-400 to-purple-600'
    }
  }
  
  // Default fallback
  return {
    name: categoryName,
    icon: Globe,
    color: 'from-gray-400 to-gray-600'
  }
}

export const getCategoryIconName = (categoryName: string): string => {
  const name = categoryName.toLowerCase()
  
  if (name.includes('climate')) return 'Sun'
  if (name.includes('renewable') || name.includes('energy')) return 'Zap'
  if (name.includes('conservation') || name.includes('nature')) return 'Leaf'
  if (name.includes('water')) return 'Droplets'
  if (name.includes('sustain')) return 'Recycle'
  
  return 'Globe'
}

// Available categories for admin form
export const AVAILABLE_CATEGORIES = [
  'Climate Science',
  'Renewable Energy',
  'Conservation',
  'Water Resources',
  'Sustainability',
  'Environmental Policy',
  'Biodiversity',
  'Pollution',
  'Green Technology',
  'Community Action'
]

// Fallback categories when API is not available
export const FALLBACK_CATEGORIES: CategoryMetadata[] = [
  { name: "All", icon: Globe, count: 124, color: "from-gray-400 to-gray-600" },
  { name: "Climate Science", icon: Sun, count: 32, color: "from-yellow-400 to-orange-500" },
  { name: "Renewable Energy", icon: Zap, count: 28, color: "from-blue-400 to-cyan-500" },
  { name: "Conservation", icon: Leaf, count: 24, color: "from-green-400 to-green-600" },
  { name: "Water Resources", icon: Droplets, count: 18, color: "from-blue-500 to-teal-500" },
  { name: "Sustainability", icon: Recycle, count: 22, color: "from-purple-400 to-purple-600" }
]