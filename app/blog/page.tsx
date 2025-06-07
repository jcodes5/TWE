import BlogHero from "@/components/sections/BlogHero"
import BlogGrid from "@/components/sections/BlogGrid"
import BlogCategories from "@/components/sections/BlogCategories"

export default function BlogPage() {
  return (
    <main className="min-h-screen">
      <BlogHero />
      <BlogCategories />
      <BlogGrid />
    </main>
  )
}
