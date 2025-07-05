
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { withAuth } from '@/lib/middleware/auth'
import { UserRole, PostStatus } from '@prisma/client'

async function getBlogPostsHandler(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    const where = status ? { status: status as PostStatus } : {}

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
          _count: {
            select: {
              comments: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.blogPost.count({ where }),
    ])

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
}

async function createBlogPostHandler(request: NextRequest & { user: any }) {
  try {
    const body = await request.json()
    const { title, content, excerpt, image, category, status } = body

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const post = await prisma.blogPost.create({
      data: {
        title,
        content,
        excerpt,
        image,
        category,
        status: status || PostStatus.DRAFT,
        authorId: request.user.userId,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({ post })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create blog post' },
      { status: 500 }
    )
  }
}

export const GET = withAuth(getBlogPostsHandler, [UserRole.ADMIN])
export const POST = withAuth(createBlogPostHandler, [UserRole.ADMIN])
export const dynamic = 'force-dynamic' // Ensure this route is always fresh