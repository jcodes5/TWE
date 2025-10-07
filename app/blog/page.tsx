import BlogHero from "@/components/sections/BlogHero"
import BlogCategories from "@/components/sections/BlogCategories"
import BlogGridClient, { BlogPostItem } from "@/components/sections/BlogGridClient"
import { prisma } from "@/lib/database"
import { PostStatus } from "@prisma/client"

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { status: PostStatus.PUBLISHED },
    orderBy: { createdAt: "desc" },
    take: 10,
    include: { author: { select: { firstName: true, lastName: true } } },
  })

  const mapped: BlogPostItem[] = posts.map(p => ({
    id: p.id,
    title: p.title,
    excerpt: p.excerpt ?? null,
    image: p.image ?? null,
    category: p.category,
    createdAt: p.createdAt.toISOString(),
    author: p.author,
  }))

  return (
    <main className="min-h-screen">
      <BlogHero />
      <BlogCategories />
      <BlogGridClient posts={mapped} />
    </main>
  )
}
