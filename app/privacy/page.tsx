import { Metadata } from 'next'
import { prisma } from "@/lib/database"

export const metadata: Metadata = {
  title: 'Privacy Policy | The Weather & Everything',
  description: 'Learn how we collect, use, and protect your personal information.',
}

async function getPrivacyPolicy() {
  try {
    // @ts-ignore: Ignore TypeScript error for setting model
    const setting = await prisma.setting.findUnique({
      where: { key: "privacy_policy" }
    })
    return setting?.value || getDefaultPrivacyPolicy()
  } catch (error) {
    console.error("Error fetching privacy policy:", error)
    return getDefaultPrivacyPolicy()
  }
}

function getDefaultPrivacyPolicy() {
  return `
    <p class="text-sm text-muted-foreground">Last updated: ${new Date().toLocaleDateString()}</p>

    <h2>Information We Collect</h2>
    <p>We collect information you provide directly to us, such as when you create an account, make a donation, volunteer, or contact us for support.</p>

    <h3>Personal Information</h3>
    <ul>
      <li>Name and contact information</li>
      <li>Email address and phone number</li>
      <li>Payment information for donations</li>
      <li>Volunteer application details</li>
    </ul>

    <h3>Automatically Collected Information</h3>
    <ul>
      <li>IP address and location data</li>
      <li>Browser type and version</li>
      <li>Pages visited and time spent</li>
      <li>Device information</li>
    </ul>

    <h2>How We Use Your Information</h2>
    <ul>
      <li>To provide and improve our services</li>
      <li>To communicate with you about our campaigns</li>
      <li>To process donations and volunteer applications</li>
      <li>To send newsletters and updates (with your consent)</li>
      <li>To comply with legal obligations</li>
    </ul>

    <h2>Information Sharing</h2>
    <p>We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
    <ul>
      <li>With your explicit consent</li>
      <li>To comply with legal requirements</li>
      <li>To protect our rights and safety</li>
      <li>With trusted service providers who assist our operations</li>
    </ul>

    <h2>Data Security</h2>
    <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

    <h2>Your Rights</h2>
    <p>You have the right to:</p>
    <ul>
      <li>Access your personal information</li>
      <li>Correct inaccurate information</li>
      <li>Request deletion of your data</li>
      <li>Opt out of marketing communications</li>
      <li>Data portability</li>
    </ul>

    <h2>Contact Us</h2>
    <p>If you have questions about this Privacy Policy, please contact us at privacy@twe.org or through our contact form.</p>
  `
}

export default async function PrivacyPolicyPage() {
  const content = await getPrivacyPolicy()

  return (
    <main className="min-h-screen">
      <section className="relative min-h-[80vh] flex items-center overflow-hidden pt-20 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-hartone font-bold text-foreground">Privacy Policy</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">Your privacy is important to us. Learn how we collect, use, and protect your personal information.</p>
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