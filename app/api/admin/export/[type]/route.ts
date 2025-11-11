import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { withAuth } from '@/lib/middleware/auth'
import { UserRole } from '@prisma/client'

const prisma = new PrismaClient()

async function exportHandler(request: NextRequest & { user: any }, { params }: { params: { type: string } }) {
  try {

    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv'
    const type = params.type

    let data: any[] = []
    let filename = `${type}_${new Date().toISOString().split('T')[0]}`

    switch (type) {
      case 'users':
        data = await prisma.user.findMany({
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
            verified: true,
            createdAt: true,
            updatedAt: true,
          },
        })
        break

      case 'campaigns':
        data = await prisma.campaign.findMany({
          select: {
            id: true,
            title: true,
            description: true,
            goal: true,
            raised: true,
            category: true,
            location: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            endDate: true,
            startDate: true,
            impactLevel: true,
            urgency: true,
            latitude: true,
            longitude: true,
            createdBy: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        })
        break

      case 'donations':
        data = await prisma.donation.findMany({
          select: {
            id: true,
            amount: true,
            createdAt: true,
            campaign: {
              select: {
                title: true,
              },
            },
            user: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        })
        break

      case 'blog-posts':
        data = await prisma.blogPost.findMany({
          select: {
            id: true,
            title: true,
            excerpt: true,
            category: true,
            status: true,
            createdAt: true,
            updatedAt: true,
            author: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        })
        break

      case 'contacts':
        data = await prisma.contact.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            organization: true,
            subject: true,
            message: true,
            inquiryType: true,
            status: true,
            createdAt: true,
            assignedTo: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        })
        break

      default:
        return NextResponse.json({ error: 'Invalid export type' }, { status: 400 })
    }

    if (format === 'json') {
      return new NextResponse(JSON.stringify(data, null, 2), {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="${filename}.json"`,
        },
      })
    } else if (format === 'csv') {
      const csvContent = convertToCSV(data)
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}.csv"`,
        },
      })
    } else {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
    }
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function convertToCSV(data: any[]): string {
  if (data.length === 0) return ''

  const flattenObject = (obj: any, prefix = ''): any => {
    let flattened: any = {}

    for (const key in obj) {
      if (obj[key] === null || obj[key] === undefined) {
        flattened[prefix + key] = ''
      } else if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        Object.assign(flattened, flattenObject(obj[key], prefix + key + '.'))
      } else if (Array.isArray(obj[key])) {
        flattened[prefix + key] = JSON.stringify(obj[key])
      } else {
        flattened[prefix + key] = obj[key]
      }
    }

    return flattened
  }

  const flattenedData = data.map(item => flattenObject(item))
  const headers = Array.from(new Set(flattenedData.flatMap(item => Object.keys(item))))

  const csvRows = [
    headers.join(','),
    ...flattenedData.map(row =>
      headers.map(header => {
        const value = row[header] || ''
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    )
  ]

  return csvRows.join('\n')
}

export const GET = withAuth(exportHandler, [UserRole.ADMIN])