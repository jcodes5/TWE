import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Research | The Weather & Everything',
  description: 'Explore our latest research on climate change and environmental solutions.',
}

export default function ResearchPage() {
  return (
    <main className="min-h-screen">
      <section className="relative min-h-[80vh] flex items-center overflow-hidden pt-20 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-hartone font-bold text-foreground">Our Research</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">Discover our cutting-edge research initiatives focused on climate science, environmental impact assessment, and sustainable solutions for a better future.</p>
          </div>
        </div>
      </section>
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg dark:prose-invert mx-auto">
            <h2>Climate Change Research</h2>
            <p>Our research team is dedicated to understanding the complex dynamics of climate change and developing actionable insights for communities worldwide.</p>
            <h3>Key Areas</h3>
            <ul>
              <li>Climate modeling and prediction</li>
              <li>Environmental impact assessment</li>
              <li>Sustainable technology development</li>
              <li>Community-based solutions</li>
            </ul>
            <h2>Publications</h2>
            <p>Access our latest publications and research papers.</p>
          </div>
        </div>
      </section>
    </main>
  )
}