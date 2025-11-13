import { Metadata } from 'next'
import { prisma } from "@/lib/database"

export const metadata: Metadata = {
  title: 'Terms of Service | The Weather & Everything',
  description: 'Read our terms of service and usage guidelines.',
}

async function getTermsOfService() {
  try {
    // @ts-ignore: Ignore TypeScript error for setting model
    const setting = await prisma.setting.findUnique({
      where: { key: "terms_of_service" }
    })
    return setting?.value || getDefaultTermsOfService()
  } catch (error) {
    console.error("Error fetching terms of service:", error)
    return getDefaultTermsOfService()
  }
}

function getDefaultTermsOfService() {
  return `
    <p class="text-sm text-muted-foreground">Last updated: ${new Date().toLocaleDateString()}</p>

    <h2>Acceptance of Terms</h2>
    <p>By accessing and using The Weather & Everything website and services, you accept and agree to be bound by the terms and provision of this agreement.</p>

    <h2>Use License</h2>
    <p>Permission is granted to temporarily access the materials on our website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>

    <h3>Restrictions</h3>
    <ul>
      <li>Modify or copy the materials</li>
      <li>Use the materials for any commercial purpose</li>
      <li>Attempt to decompile or reverse engineer any software</li>
      <li>Remove any copyright or other proprietary notations</li>
    </ul>

    <h2>User Responsibilities</h2>
    <p>Users are responsible for:</p>
    <ul>
      <li>Providing accurate and complete information</li>
      <li>Maintaining the security of their account</li>
      <li>Complying with applicable laws and regulations</li>
      <li>Respecting the rights of other users</li>
    </ul>

    <h2>Content</h2>
    <p>Our website may contain user-generated content. We do not endorse or guarantee the accuracy of such content. Users are responsible for the content they post.</p>

    <h2>Donations and Payments</h2>
    <p>All donations are processed securely. By making a donation, you agree to our payment terms and acknowledge that donations are typically not tax-deductible unless specified otherwise.</p>

    <h2>Termination</h2>
    <p>We may terminate or suspend access to our service immediately, without prior notice, for any reason whatsoever, including without limitation if you breach the Terms.</p>

    <h2>Disclaimer</h2>
    <p>The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied, and hereby disclaim and negate all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

    <h2>Limitations</h2>
    <p>In no event shall The Weather & Everything or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website.</p>

    <h2>Governing Law</h2>
    <p>These terms and conditions are governed by and construed in accordance with the laws of Nigeria and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.</p>

    <h2>Contact Information</h2>
    <p>If you have any questions about these Terms of Service, please contact us at legal@twe.org.</p>
  `
}

export default async function TermsOfServicePage() {
  const content = await getTermsOfService()

  return (
    <main className="min-h-screen">
      <section className="relative min-h-[80vh] flex items-center overflow-hidden pt-20 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-hartone font-bold text-foreground">Terms of Service</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">Please read these terms carefully before using our website and services.</p>
          </div>
        </div>
      </section>
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg dark:prose-invert mx-auto" dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      </section>
    </main>
  )
}