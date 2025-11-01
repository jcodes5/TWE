import { NextRequest, NextResponse } from 'next/server'
import { ensureCloudinaryConfigured, cloudinary } from '@/lib/cloudinary'
import { withAuth } from '@/lib/middleware/auth'
import { UserRole } from '@prisma/client'

// Helper function to extract image dimensions
function getImageDimensions(file: Buffer): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    // This is a simplified version - in a real implementation, 
    // you'd use a proper image processing library like Sharp
    // For now, we'll set default dimensions
    resolve({ width: 1920, height: 1080 })
  })
}

// Helper function to generate thumbnail URL
function generateThumbnailUrl(originalUrl: string, publicId: string, size: number = 300): string {
  // Assuming Cloudinary transformation
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  if (!cloudName) return originalUrl
  
  const parts = originalUrl.split('/')
  const uploadIndex = parts.findIndex(part => part === 'upload')
  
  if (uploadIndex !== -1) {
    // Insert transformation parameters
    parts.splice(uploadIndex + 1, 0, `c_fill,w_${size},h_${size},q_auto,f_auto`)
    return parts.join('/')
  }
  
  return originalUrl
}

async function uploadHandler(request: NextRequest & { user: any }) {
  try {
    ensureCloudinaryConfigured()

    const contentType = request.headers.get('content-type') || ''
    
    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData()
      const file = form.get('file') as File | null
      const folder = form.get('folder') as string || process.env.CLOUDINARY_UPLOAD_FOLDER || 'twe'
      
      if (!file) {
        return NextResponse.json({ error: 'No file provided' }, { status: 400 })
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        return NextResponse.json({ 
          error: 'File size exceeds 10MB limit' 
        }, { status: 400 })
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ 
          error: 'Unsupported file type. Please use JPEG, PNG, GIF, or WebP' 
        }, { status: 400 })
      }

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Get image dimensions
      const dimensions = await getImageDimensions(buffer)

      // Upload to Cloudinary with optimization
      const uploadOptions = {
        folder: folder,
        resource_type: 'image' as const,
        quality: 'auto',
        fetch_format: 'auto',
        flags: 'progressive',
        overwrite: true,
        unique_filename: true,
        use_filename: true,
        // Enable automatic format and quality
        transformation: {
          quality: 'auto',
          fetch_format: 'auto'
        }
      }

      const uploadResult: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(uploadOptions, (err, result) => {
          if (err) {
            console.error('Cloudinary upload error:', err)
            reject(err)
          } else {
            resolve(result)
          }
        })
        stream.end(buffer)
      })

      // Generate thumbnail URL
      const thumbnailUrl = generateThumbnailUrl(
        uploadResult.secure_url, 
        uploadResult.public_id, 
        300
      )

      // Generate additional sizes if needed
      const smallThumbnail = generateThumbnailUrl(
        uploadResult.secure_url, 
        uploadResult.public_id, 
        150
      )

      const mediumThumbnail = generateThumbnailUrl(
        uploadResult.secure_url, 
        uploadResult.public_id, 
        600
      )

      const largeThumbnail = generateThumbnailUrl(
        uploadResult.secure_url, 
        uploadResult.public_id, 
        1200
      )

      return NextResponse.json({ 
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        width: uploadResult.width || dimensions.width,
        height: uploadResult.height || dimensions.height,
        fileSize: uploadResult.bytes || file.size,
        format: uploadResult.format?.toUpperCase() || file.type.split('/')[1].toUpperCase(),
        thumbnailUrl: thumbnailUrl,
        thumbnails: {
          small: smallThumbnail,
          medium: mediumThumbnail,
          large: largeThumbnail
        },
        optimized: true,
        cloudinaryData: {
          version: uploadResult.version,
          resourceType: uploadResult.resource_type,
          created: uploadResult.created_at,
          bytes: uploadResult.bytes,
          type: uploadResult.type,
          etag: uploadResult.etag,
          placeholder: uploadResult.placeholder,
          url: uploadResult.url,
          secureUrl: uploadResult.secure_url,
          folder: uploadResult.folder,
          originalFilename: uploadResult.original_filename
        }
      })
    } else {
      // Handle base64 data URL upload
      const body = await request.json()
      const { dataUrl, folder } = body
      
      if (!dataUrl) {
        return NextResponse.json({ error: 'Missing dataUrl' }, { status: 400 })
      }

      const uploadFolder = folder || process.env.CLOUDINARY_UPLOAD_FOLDER || 'twe'
      
      const uploadResult = await cloudinary.uploader.upload(dataUrl, {
        folder: uploadFolder,
        resource_type: 'image',
        quality: 'auto',
        fetch_format: 'auto',
        flags: 'progressive'
      })

      const thumbnailUrl = generateThumbnailUrl(
        uploadResult.secure_url, 
        uploadResult.public_id, 
        300
      )

      return NextResponse.json({
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
        fileSize: uploadResult.bytes,
        format: uploadResult.format?.toUpperCase(),
        thumbnailUrl: thumbnailUrl,
        optimized: true
      })
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    
    // Provide specific error messages based on error type
    let errorMessage = 'Upload failed'
    let statusCode = 500

    if (error.name === 'MulterError') {
      if (error.code === 'LIMIT_FILE_SIZE') {
        errorMessage = 'File size exceeds limit'
        statusCode = 413
      } else if (error.code === 'LIMIT_FILE_COUNT') {
        errorMessage = 'Too many files'
        statusCode = 400
      }
    } else if (error.message?.includes('Invalid file type')) {
      errorMessage = 'Invalid file type'
      statusCode = 400
    } else if (error.message?.includes('Cloudinary')) {
      errorMessage = 'Cloudinary upload failed'
      statusCode = 500
    }

    return NextResponse.json({ 
      error: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, { status: statusCode })
  }
}

export const POST = withAuth(uploadHandler, [UserRole.ADMIN])
