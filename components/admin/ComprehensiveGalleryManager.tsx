"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { useDropzone } from "react-dropzone"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Image from "next/image"
import { 
  Upload, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Trash2, 
  Edit, 
  Eye, 
  Download, 
  Copy, 
  MoreHorizontal,
  SortAsc,
  SortDesc,
  Calendar,
  Tag,
  MapPin,
  Image as ImageIcon,
  RotateCw,
  Crop,
  Palette,
  Settings,
  CheckSquare,
  Square,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw
} from "lucide-react"
import { HexColorPicker } from "react-colorful"

interface GalleryImage {
  id: string
  title: string
  url: string
  publicId: string
  category?: string | null
  description?: string | null
  altText?: string | null
  tags?: string[] | null
  sortOrder: number
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED' | 'PENDING_REVIEW'
  width?: number | null
  height?: number | null
  fileSize?: number | null
  format?: string | null
  thumbnailUrl?: string | null
  takenAt?: string | null
  location?: string | null
  createdAt: string
  updatedAt: string
}

interface FilterOptions {
  search: string
  category: string
  status: string
  tags: string[]
  dateFrom: string
  dateTo: string
}

interface BatchOperation {
  type: 'delete' | 'status_change' | 'category_change' | 'tag_operations'
  targetIds: string[]
  value?: any
}

const CATEGORIES = [
  'Events', 'Campaigns', 'Team', 'Community', 'Projects', 'Documentation', 'Other'
]

const STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Active', color: 'bg-green-500' },
  { value: 'INACTIVE', label: 'Inactive', color: 'bg-yellow-500' },
  { value: 'ARCHIVED', label: 'Archived', color: 'bg-gray-500' },
  { value: 'PENDING_REVIEW', label: 'Pending Review', color: 'bg-blue-500' }
]

const IMAGE_FORMATS = ['JPEG', 'PNG', 'GIF', 'WebP']
const THUMBNAIL_SIZES = [
  { label: 'Small (150x150)', value: 150 },
  { label: 'Medium (300x300)', value: 300 },
  { label: 'Large (600x600)', value: 600 }
]

// Sortable Image Component
function SortableImage({ image, isSelected, onSelect, onEdit, onDelete, onPreview }: {
  image: GalleryImage
  isSelected: boolean
  onSelect: (id: string) => void
  onEdit: (image: GalleryImage) => void
  onDelete: (id: string) => void
  onPreview: (image: GalleryImage) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const statusColor = STATUS_OPTIONS.find(s => s.value === image.status)?.color || 'bg-gray-500'

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border rounded-lg overflow-hidden bg-white shadow-sm transition-all ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      } ${isDragging ? 'shadow-lg' : ''}`}
    >
      <div className="relative group">
        <div className="absolute top-2 left-2 z-10">
          <button
            onClick={() => onSelect(image.id)}
            className="bg-white rounded-full p-1 shadow-md hover:bg-gray-50"
          >
            {isSelected ? (
              <CheckSquare className="w-4 h-4 text-blue-500" />
            ) : (
              <Square className="w-4 h-4 text-gray-400" />
            )}
          </button>
        </div>
        
        <div className="absolute top-2 right-2 z-10">
          <Badge className={`${statusColor} text-white`}>
            {image.status}
          </Badge>
        </div>

        <div className="relative w-full h-48 cursor-grab active:cursor-grabbing" {...attributes} {...listeners}>
          <Image 
            src={image.thumbnailUrl || image.url} 
            alt={image.title} 
            fill 
            className="object-cover" 
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            <Button
              size="icon"
              variant="secondary"
              onClick={() => onPreview(image)}
              className="bg-white text-gray-700 hover:bg-gray-100"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              onClick={() => onEdit(image)}
              className="bg-white text-gray-700 hover:bg-gray-100"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="destructive"
              onClick={() => onDelete(image.id)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-sm truncate flex-1">{image.title}</h3>
          <span className="text-xs text-gray-400">#{image.sortOrder}</span>
        </div>
        
        <div className="flex items-center text-xs text-gray-500 space-x-2">
          {image.category && (
            <Badge variant="secondary" className="text-xs">
              {image.category}
            </Badge>
          )}
          {image.format && (
            <span>{image.format}</span>
          )}
        </div>

        {image.tags && image.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {image.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {image.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{image.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {image.location && (
          <div className="flex items-center text-xs text-gray-500 mt-1">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="truncate">{image.location}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// Image Editor Modal
function ImageEditor({ image, onSave, onClose }: {
  image: GalleryImage | null
  onSave: (updatedImage: Partial<GalleryImage>) => void
  onClose: () => void
}) {
  const [editedImage, setEditedImage] = useState<Partial<GalleryImage>>(image || {})
  const [isProcessing, setIsProcessing] = useState(false)
  const [filterValues, setFilterValues] = useState({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0
  })
  const [rotation, setRotation] = useState(0)
  const [cropArea, setCropArea] = useState({ x: 0, y: 0, width: 100, height: 100 })

  useEffect(() => {
    if (image) {
      setEditedImage(image)
    }
  }, [image])

  const handleSave = async () => {
    if (!image) return
    
    setIsProcessing(true)
    try {
      // Simulate image processing
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updatedImage = {
        ...editedImage,
        // Apply filters and transformations
        filters: filterValues,
        rotation,
        cropArea
      }
      
      onSave(updatedImage)
    } catch (error) {
      console.error('Failed to process image:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  if (!image) return null

  return (
    <Dialog open={!!image} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Edit Image: {image.title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Preview */}
          <div className="space-y-4">
            <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={image.url}
                alt={image.title}
                fill
                className="object-contain"
                style={{
                  transform: `rotate(${rotation}deg)`,
                  filter: `brightness(${filterValues.brightness}%) contrast(${filterValues.contrast}%) saturate(${filterValues.saturation}%) blur(${filterValues.blur}px)`,
                }}
              />
            </div>
            
            {/* Quick Actions */}
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRotation(prev => prev + 90)}
              >
                <RotateCw className="w-4 h-4 mr-2" />
                Rotate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCropArea({ x: 0, y: 0, width: 100, height: 100 })}
              >
                <Crop className="w-4 h-4 mr-2" />
                Reset Crop
              </Button>
            </div>
          </div>

          {/* Edit Controls */}
          <div className="space-y-6">
            <Tabs defaultValue="metadata" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
                <TabsTrigger value="filters">Filters</TabsTrigger>
                <TabsTrigger value="organization">Organization</TabsTrigger>
              </TabsList>

              <TabsContent value="metadata" className="space-y-4">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={editedImage.title || ''}
                    onChange={(e) => setEditedImage(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={editedImage.description || ''}
                    onChange={(e) => setEditedImage(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Alt Text</Label>
                  <Input
                    value={editedImage.altText || ''}
                    onChange={(e) => setEditedImage(prev => ({ ...prev, altText: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Taken At</Label>
                    <Input
                      type="date"
                      value={editedImage.takenAt?.split('T')[0] || ''}
                      onChange={(e) => setEditedImage(prev => ({ ...prev, takenAt: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input
                      value={editedImage.location || ''}
                      onChange={(e) => setEditedImage(prev => ({ ...prev, location: e.target.value }))}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="filters" className="space-y-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Brightness: {filterValues.brightness}%</Label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={filterValues.brightness}
                      onChange={(e) => setFilterValues(prev => ({ ...prev, brightness: Number(e.target.value) }))}
                      className="w-full"
                      aria-label={`Brightness: ${filterValues.brightness}%`}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Contrast: {filterValues.contrast}%</Label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={filterValues.contrast}
                      onChange={(e) => setFilterValues(prev => ({ ...prev, contrast: Number(e.target.value) }))}
                      className="w-full"
                      aria-label={`Contrast: ${filterValues.contrast}%`}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Saturation: {filterValues.saturation}%</Label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={filterValues.saturation}
                      onChange={(e) => setFilterValues(prev => ({ ...prev, saturation: Number(e.target.value) }))}
                      className="w-full"
                      aria-label={`Saturation: ${filterValues.saturation}%`}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Blur: {filterValues.blur}px</Label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={filterValues.blur}
                      onChange={(e) => setFilterValues(prev => ({ ...prev, blur: Number(e.target.value) }))}
                      className="w-full"
                      aria-label={`Blur: ${filterValues.blur}px`}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="organization" className="space-y-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select
                    value={editedImage.category || ''}
                    onValueChange={(value) => setEditedImage(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={editedImage.status || 'ACTIVE'}
                    onValueChange={(value) => setEditedImage(prev => ({ ...prev, status: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map(status => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <Input
                    placeholder="Enter tags separated by commas"
                    value={(editedImage.tags || []).join(', ')}
                    onChange={(e) => setEditedImage(prev => ({ 
                      ...prev, 
                      tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
                    }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Sort Order</Label>
                  <Input
                    type="number"
                    value={editedImage.sortOrder || 0}
                    onChange={(e) => setEditedImage(prev => ({ ...prev, sortOrder: Number(e.target.value) }))}
                  />
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Batch Operations Modal
function BatchOperationsModal({ selectedIds, onExecute, onClose }: {
  selectedIds: string[]
  onExecute: (operation: BatchOperation) => void
  onClose: () => void
}) {
  const [operation, setOperation] = useState<BatchOperation>({
    type: 'status_change',
    targetIds: selectedIds,
    value: 'ACTIVE'
  })

  const handleExecute = () => {
    if (selectedIds.length === 0) return
    
    onExecute({
      ...operation,
      targetIds: selectedIds
    })
  }

  return (
    <Dialog open onOpenChange={() => onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Batch Operations</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            Selected {selectedIds.length} image{selectedIds.length !== 1 ? 's' : ''}
          </div>

          <div className="space-y-2">
            <Label>Operation</Label>
            <Select
              value={operation.type}
              onValueChange={(value) => setOperation(prev => ({ ...prev, type: value as any }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delete">
                  <div className="flex items-center">
                    <Trash2 className="w-4 h-4 mr-2 text-red-500" />
                    Delete Images
                  </div>
                </SelectItem>
                <SelectItem value="status_change">
                  <div className="flex items-center">
                    <Settings className="w-4 h-4 mr-2" />
                    Change Status
                  </div>
                </SelectItem>
                <SelectItem value="category_change">
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-2" />
                    Change Category
                  </div>
                </SelectItem>
                <SelectItem value="tag_operations">
                  <div className="flex items-center">
                    <Tag className="w-4 h-4 mr-2" />
                    Manage Tags
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {operation.type === 'status_change' && (
            <div className="space-y-2">
              <Label>New Status</Label>
              <Select
                value={operation.value}
                onValueChange={(value) => setOperation(prev => ({ ...prev, value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {operation.type === 'category_change' && (
            <div className="space-y-2">
              <Label>New Category</Label>
              <Select
                value={operation.value}
                onValueChange={(value) => setOperation(prev => ({ ...prev, value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {operation.type === 'tag_operations' && (
            <div className="space-y-2">
              <Label>Tags to Add</Label>
              <Input
                placeholder="Enter tags separated by commas"
                onChange={(e) => setOperation(prev => ({ ...prev, value: e.target.value }))}
              />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleExecute}
              variant={operation.type === 'delete' ? 'destructive' : 'default'}
              disabled={!operation.value && operation.type !== 'delete'}
            >
              Execute Operation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Filter Panel Component
function FilterPanel({ filters, onFiltersChange }: {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by title, description..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {isExpanded && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => onFiltersChange({ ...filters, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All categories</SelectItem>
                    {CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All statuses</SelectItem>
                    {STATUS_OPTIONS.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date From</Label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => onFiltersChange({ ...filters, dateFrom: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Date To</Label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => onFiltersChange({ ...filters, dateTo: e.target.value })}
                />
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => onFiltersChange({
                search: '',
                category: '',
                status: '',
                tags: [],
                dateFrom: '',
                dateTo: ''
              })}
              className="w-full"
            >
              Clear Filters
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export default function ComprehensiveGalleryManager() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'title' | 'createdAt' | 'sortOrder'>('sortOrder')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [showFilters, setShowFilters] = useState(false)
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null)
  const [previewImage, setPreviewImage] = useState<GalleryImage | null>(null)
  const [showBatchOps, setShowBatchOps] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: '',
    status: '',
    tags: [],
    dateFrom: '',
    dateTo: ''
  })

  const { toast } = useToast()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Load images
  const loadImages = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/gallery')
      const data = await response.json()
      setImages(data.images || [])
      setFilteredImages(data.images || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load gallery images",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    loadImages()
  }, [loadImages])

  // Filter and sort images
  useEffect(() => {
    let filtered = [...images]

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(img => 
        img.title.toLowerCase().includes(searchLower) ||
        (img.description && img.description.toLowerCase().includes(searchLower)) ||
        (img.altText && img.altText.toLowerCase().includes(searchLower))
      )
    }

    if (filters.category) {
      filtered = filtered.filter(img => img.category === filters.category)
    }

    if (filters.status) {
      filtered = filtered.filter(img => img.status === filters.status)
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(img => new Date(img.createdAt) >= new Date(filters.dateFrom))
    }

    if (filters.dateTo) {
      filtered = filtered.filter(img => new Date(img.createdAt) <= new Date(filters.dateTo))
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy]
      let bValue: any = b[sortBy]

      if (sortBy === 'createdAt') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    setFilteredImages(filtered)
  }, [images, filters, sortBy, sortOrder])

  // Drag and drop for reordering
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (active.id !== over?.id) {
      setImages((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over?.id)

        const newItems = arrayMove(items, oldIndex, newIndex)
        
        // Update sort order
        const reorderedItems = newItems.map((item, index) => ({
          ...item,
          sortOrder: index
        }))

        // Save to server
        updateSortOrder(reorderedItems)

        return reorderedItems
      })
    }
  }

  const updateSortOrder = async (items: GalleryImage[]) => {
    try {
      await fetch('/api/admin/gallery/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: items.map((item, index) => ({ id: item.id, sortOrder: index }))
        })
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save sort order",
        variant: "destructive",
      })
    }
  }

  // File upload with drag and drop
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true)
    const totalFiles = acceptedFiles.length
    
    try {
      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i]
        setUploadProgress(((i + 1) / totalFiles) * 100)

        // Upload file
        const formData = new FormData()
        formData.append('file', file)

        const uploadResponse = await fetch('/api/admin/gallery/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload ${file.name}`)
        }

        const { url, publicId } = await uploadResponse.json()

        // Create gallery entry
        const createResponse = await fetch('/api/admin/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: file.name.replace(/\.[^/.]+$/, ""),
            url,
            publicId,
            format: file.type.split('/')[1].toUpperCase(),
            fileSize: file.size,
            status: 'PENDING_REVIEW'
          }),
        })

        if (!createResponse.ok) {
          throw new Error(`Failed to create entry for ${file.name}`)
        }
      }

      toast({
        title: "Success",
        description: `Successfully uploaded ${totalFiles} image${totalFiles !== 1 ? 's' : ''}`,
      })

      await loadImages()
    } catch (error) {
      toast({
        title: "Upload Error",
        description: error instanceof Error ? error.message : "Failed to upload files",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [loadImages, toast])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': IMAGE_FORMATS.map(format => `.${format.toLowerCase()}`)
    },
    multiple: true,
    disabled: isUploading
  })

  // Image operations
  const handleEdit = (image: GalleryImage) => {
    setEditingImage(image)
  }

  const handleSaveImage = async (updatedImage: Partial<GalleryImage>) => {
    if (!editingImage) return

    try {
      const response = await fetch(`/api/admin/gallery/${editingImage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedImage),
      })

      if (!response.ok) {
        throw new Error('Failed to update image')
      }

      toast({
        title: "Success",
        description: "Image updated successfully",
      })

      setEditingImage(null)
      await loadImages()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update image",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete image')
      }

      toast({
        title: "Success",
        description: "Image deleted successfully",
      })

      await loadImages()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete image",
        variant: "destructive",
      })
    }
  }

  const handleBatchOperation = async (operation: BatchOperation) => {
    try {
      const response = await fetch('/api/admin/gallery/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(operation),
      })

      if (!response.ok) {
        throw new Error('Failed to execute batch operation')
      }

      toast({
        title: "Success",
        description: `Batch operation completed successfully`,
      })

      setSelectedIds([])
      setShowBatchOps(false)
      await loadImages()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to execute batch operation",
        variant: "destructive",
      })
    }
  }

  const handleSelectAll = () => {
    if (selectedIds.length === filteredImages.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(filteredImages.map(img => img.id))
    }
  }

  const handleSelectImage = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gallery Manager</h2>
          <p className="text-muted-foreground">
            Manage your gallery images with advanced features
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {selectedIds.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setShowBatchOps(true)}
              className="flex items-center"
            >
              <CheckSquare className="w-4 h-4 mr-2" />
              Batch Ops ({selectedIds.length})
            </Button>
          )}
        </div>
      </div>

      {/* Upload Area */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            } ${isUploading ? 'pointer-events-none opacity-50' : ''}`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            
            {isUploading ? (
              <div className="space-y-2">
                <p className="text-lg font-medium">Uploading...</p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500">{Math.round(uploadProgress)}%</p>
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">
                  {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  or click to browse files
                </p>
                <p className="text-xs text-gray-400">
                  Supports: {IMAGE_FORMATS.join(', ')} up to 10MB each
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Button
            variant={showFilters ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
          >
            {selectedIds.length === filteredImages.length ? (
              <CheckSquare className="w-4 h-4 mr-2" />
            ) : (
              <Square className="w-4 h-4 mr-2" />
            )}
            Select All
          </Button>

          <Select value={sortBy} onValueChange={(value) => setSortBy(value as any)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sortOrder">Sort Order</SelectItem>
              <SelectItem value="title">Title</SelectItem>
              <SelectItem value="createdAt">Date Created</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? (
              <SortAsc className="w-4 h-4" />
            ) : (
              <SortDesc className="w-4 h-4" />
            )}
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
        />
      )}

      {/* Images Grid */}
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900">No images found</p>
              <p className="text-gray-500">
                {images.length === 0 
                  ? "Upload your first image to get started"
                  : "Try adjusting your filters"
                }
              </p>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={filteredImages.map(img => img.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }>
                  {filteredImages.map((image) => (
                    <SortableImage
                      key={image.id}
                      image={image}
                      isSelected={selectedIds.includes(image.id)}
                      onSelect={handleSelectImage}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onPreview={setPreviewImage}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {editingImage && (
        <ImageEditor
          image={editingImage}
          onSave={handleSaveImage}
          onClose={() => setEditingImage(null)}
        />
      )}

      {showBatchOps && selectedIds.length > 0 && (
        <BatchOperationsModal
          selectedIds={selectedIds}
          onExecute={handleBatchOperation}
          onClose={() => setShowBatchOps(false)}
        />
      )}
    </div>
  )
}