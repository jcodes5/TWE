"use client"

import { useState, useEffect } from "react"
import { Edit2, Save, X, AlertCircle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

type Campaign = {
  id: string
  title: string
  description: string
  content: string
  image?: string | null
  goal: number
  raised: number
  category: string
  location: string
  status: "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED"
  startDate?: string | null
  endDate?: string | null
  urgency: "HIGH" | "MEDIUM" | "LOW"
  impactLevel: "INTERNATIONAL" | "NATIONAL" | "REGIONAL" | "LOCAL"
  createdAt: string
  _count?: { donations: number }
}

type CampaignFormData = Omit<Campaign, 'id' | 'raised' | 'createdAt' | '_count'>

interface InlineEditProps {
  campaign: Campaign
  onSave: (data: CampaignFormData) => Promise<void>
  onCancel: () => void
  isSaving?: boolean
}

export function CampaignInlineEditor({ campaign, onSave, onCancel, isSaving = false }: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<CampaignFormData>({
    title: campaign.title,
    description: campaign.description,
    content: campaign.content,
    image: campaign.image || "",
    goal: campaign.goal,
    category: campaign.category,
    location: campaign.location,
    status: campaign.status,
    startDate: campaign.startDate || null,
    endDate: campaign.endDate || null,
    urgency: campaign.urgency,
    impactLevel: campaign.impactLevel,
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Validation rules
  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'title':
        if (!value || value.trim() === '') return 'Title is required'
        if (value.length > 100) return 'Title must be less than 100 characters'
        return ''
      case 'description':
        if (!value || value.trim() === '') return 'Description is required'
        if (value.length > 500) return 'Description must be less than 500 characters'
        return ''
      case 'content':
        if (!value || value.trim() === '') return 'Content is required'
        if (value.length < 50) return 'Content must be at least 50 characters'
        return ''
      case 'goal':
        if (!value || value <= 0) return 'Goal must be greater than 0'
        if (value > 10000000) return 'Goal cannot exceed $10,000,000'
        return ''
      case 'category':
        if (!value || value.trim() === '') return 'Category is required'
        return ''
      case 'location':
        if (!value || value.trim() === '') return 'Location is required'
        return ''
      case 'startDate':
        if (formData.endDate && value && new Date(value) > new Date(formData.endDate)) {
          return 'Start date must be before end date'
        }
        return ''
      case 'endDate':
        if (formData.startDate && value && new Date(value) < new Date(formData.startDate)) {
          return 'End date must be after start date'
        }
        return ''
      default:
        return ''
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof CampaignFormData])
      if (error) {
        newErrors[key] = error
        isValid = false
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    
    // Validate on blur if field has been touched
    if (touched[field]) {
      const error = validateField(field, formData[field as keyof CampaignFormData])
      setErrors(prev => ({ ...prev, [field]: error }))
    }
  }

  const handleSave = async () => {
    if (!validateForm()) {
      // Mark all fields as touched to show validation errors
      const allTouched: Record<string, boolean> = {}
      Object.keys(formData).forEach(key => {
        allTouched[key] = true
      })
      setTouched(allTouched)
      return
    }

    try {
      await onSave(formData)
      setIsEditing(false)
    } catch (error) {
      console.error('Failed to save campaign:', error)
      // You could add a toast notification here
    }
  }

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      title: campaign.title,
      description: campaign.description,
      content: campaign.content,
      image: campaign.image || "",
      goal: campaign.goal,
      category: campaign.category,
      location: campaign.location,
      status: campaign.status,
      startDate: campaign.startDate || null,
      endDate: campaign.endDate || null,
      urgency: campaign.urgency,
      impactLevel: campaign.impactLevel,
    })
    setErrors({})
    setTouched({})
    setIsEditing(false)
    onCancel()
  }

  const getFieldError = (field: string) => {
    return touched[field] && errors[field] ? errors[field] : ''
  }

  if (!isEditing) {
    return (
      <div className="flex items-start justify-between gap-4 border-b py-3 group hover:bg-gray-50 dark:hover:bg-gray-800 px-2 rounded">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-lg">{campaign.title}</h3>
            <Badge variant="secondary">{campaign.category}</Badge>
            <Badge>{campaign.status}</Badge>
            <Badge variant="outline" className={`${getUrgencyColor(campaign.urgency)} border-none`}>
              {campaign.urgency}
            </Badge>
            <Badge variant="outline" className={`${getImpactColor(campaign.impactLevel)} border-none`}>
              {campaign.impactLevel}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {campaign.location} • Goal ${campaign.goal.toLocaleString()} • Raised ${campaign.raised.toLocaleString()}
            {campaign.startDate && ` • Starts ${format(new Date(campaign.startDate), 'MMM dd, yyyy')}`}
            {campaign.endDate && ` • Ends ${format(new Date(campaign.endDate), 'MMM dd, yyyy')}`}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{campaign.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-xs text-muted-foreground text-right">
            <div>{campaign._count?.donations || 0} donations</div>
            <div>{format(new Date(campaign.createdAt), 'MMM dd, yyyy')}</div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="border-b py-4 bg-blue-50 dark:bg-blue-900/20 px-4 rounded">
      <div className="space-y-4">
        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-1 block">Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              onBlur={() => handleBlur('title')}
              placeholder="Campaign title"
              className={getFieldError('title') ? 'border-red-500' : ''}
            />
            {getFieldError('title') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError('title')}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium mb-1 block">Category *</label>
            <Input
              value={formData.category}
              onChange={(e) => handleFieldChange('category', e.target.value)}
              onBlur={() => handleBlur('category')}
              placeholder="e.g., Climate Action"
              className={getFieldError('category') ? 'border-red-500' : ''}
            />
            {getFieldError('category') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError('category')}</p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium mb-1 block">Location *</label>
            <Input
              value={formData.location}
              onChange={(e) => handleFieldChange('location', e.target.value)}
              onBlur={() => handleBlur('location')}
              placeholder="e.g., Global, North America"
              className={getFieldError('location') ? 'border-red-500' : ''}
            />
            {getFieldError('location') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError('location')}</p>
            )}
          </div>

          {/* Goal */}
          <div>
            <label className="text-sm font-medium mb-1 block">Goal (USD) *</label>
            <Input
              type="number"
              value={formData.goal}
              onChange={(e) => handleFieldChange('goal', Number(e.target.value))}
              onBlur={() => handleBlur('goal')}
              placeholder="100000"
              min="1"
              max="10000000"
              className={getFieldError('goal') ? 'border-red-500' : ''}
            />
            {getFieldError('goal') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError('goal')}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="text-sm font-medium mb-1 block">Status</label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleFieldChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Urgency */}
          <div>
            <label className="text-sm font-medium mb-1 block">Urgency</label>
            <Select
              value={formData.urgency}
              onValueChange={(value) => handleFieldChange('urgency', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="HIGH">High</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Impact Level */}
          <div>
            <label className="text-sm font-medium mb-1 block">Impact Level</label>
            <Select
              value={formData.impactLevel}
              onValueChange={(value) => handleFieldChange('impactLevel', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select impact level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INTERNATIONAL">International</SelectItem>
                <SelectItem value="NATIONAL">National</SelectItem>
                <SelectItem value="REGIONAL">Regional</SelectItem>
                <SelectItem value="LOCAL">Local</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-sm font-medium mb-1 block">Short Description *</label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleFieldChange('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            placeholder="Brief campaign description"
            className={`min-h-20 ${getFieldError('description') ? 'border-red-500' : ''}`}
          />
          {getFieldError('description') && (
            <p className="text-red-500 text-xs mt-1">{getFieldError('description')}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="text-sm font-medium mb-1 block">Content *</label>
          <Textarea
            value={formData.content}
            onChange={(e) => handleFieldChange('content', e.target.value)}
            onBlur={() => handleBlur('content')}
            placeholder="Detailed campaign content"
            className={`min-h-32 ${getFieldError('content') ? 'border-red-500' : ''}`}
          />
          {getFieldError('content') && (
            <p className="text-red-500 text-xs mt-1">{getFieldError('content')}</p>
          )}
        </div>

        {/* Image URL */}
        <div>
          <label className="text-sm font-medium mb-1 block">Image URL</label>
          <Input
            value={formData.image || ''}
            onChange={(e) => handleFieldChange('image', e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.startDate ? format(new Date(formData.startDate), 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.startDate ? new Date(formData.startDate) : undefined}
                  onSelect={(date) => handleFieldChange('startDate', date ? date.toISOString() : null)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {getFieldError('startDate') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError('startDate')}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.endDate ? format(new Date(formData.endDate), 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.endDate ? new Date(formData.endDate) : undefined}
                  onSelect={(date) => handleFieldChange('endDate', date ? date.toISOString() : null)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {getFieldError('endDate') && (
              <p className="text-red-500 text-xs mt-1">{getFieldError('endDate')}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <AlertCircle className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

// Helper functions for badge colors
function getUrgencyColor(urgency: string): string {
  switch (urgency) {
    case 'HIGH':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    case 'LOW':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

function getImpactColor(impact: string): string {
  switch (impact) {
    case 'INTERNATIONAL':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
    case 'NATIONAL':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'REGIONAL':
      return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200'
    case 'LOCAL':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}