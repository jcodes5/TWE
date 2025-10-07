import { NextRequest, NextResponse } from 'next/server'
import { ensureCloudinaryConfigured, cloudinary } from '@/lib/cloudinary'
import { withAuth } from '@/lib/middleware/auth'
import { UserRole } from '@prisma/client'

async function uploadHandler(request: NextRequest) {
  try {
    ensureCloudinaryConfigured()

    const contentType = request.headers.get('content-type') || ''
    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData()
      const file = form.get('file') as File | null
      if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const res: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: process.env.CLOUDINARY_UPLOAD_FOLDER || 'twe' }, (err, result) => {
          if (err) reject(err)
          else resolve(result)
        })
        stream.end(buffer)
      })

      return NextResponse.json({ url: res.secure_url, publicId: res.public_id })
    } else {
      const body = await request.json()
      const { dataUrl } = body
      if (!dataUrl) return NextResponse.json({ error: 'Missing dataUrl' }, { status: 400 })
      const res = await cloudinary.uploader.upload(dataUrl, { folder: process.env.CLOUDINARY_UPLOAD_FOLDER || 'twe' })
      return NextResponse.json({ url: res.secure_url, publicId: res.public_id })
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 })
  }
}

export const POST = withAuth(uploadHandler, [UserRole.ADMIN])
