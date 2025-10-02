import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { withAuth } from '@/lib/middleware/auth'
import { UserRole, CampaignStatus } from '@prisma/client'

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

async function handler(request: NextRequest & { user: { userId: string } }) {
  const userId = request.user.userId

  const [activeCampaigns, recentActiveCampaigns, userDonations, donationRows] = await Promise.all([
    prisma.campaign.count({ where: { status: CampaignStatus.ACTIVE } }),
    prisma.campaign.findMany({ where: { status: CampaignStatus.ACTIVE }, orderBy: { createdAt: 'desc' }, take: 6, select: { id: true, title: true, location: true, goal: true, raised: true } }),
    prisma.donation.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 6 }),
    prisma.donation.findMany({ where: { userId }, select: { amount: true, createdAt: true } }),
  ])

  const totalDonated = userDonations.reduce((sum, d) => sum + d.amount, 0)

  const now = new Date()
  const months: string[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(monthKey(d))
  }
  const byMonth: Record<string, number> = Object.fromEntries(months.map((m) => [m, 0]))
  for (const row of donationRows) {
    const key = monthKey(row.createdAt)
    if (key in byMonth) byMonth[key] += row.amount
  }
  const donationsSeries = months.map((m) => ({ month: m, amount: Number(byMonth[m].toFixed(2)) }))

  return NextResponse.json({
    stats: {
      activeCampaigns,
      donations: { total: Number(totalDonated.toFixed(2)), count: userDonations.length },
    },
    series: { donationsByMonth: donationsSeries },
    lists: { campaigns: recentActiveCampaigns, donations: userDonations },
  })
}

export const GET = withAuth(handler, [UserRole.VOLUNTEER, UserRole.ADMIN])
