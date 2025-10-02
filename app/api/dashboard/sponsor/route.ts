import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { withAuth } from '@/lib/middleware/auth'
import { UserRole } from '@prisma/client'

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

async function handler(request: NextRequest & { user: { userId: string } }) {
  const userId = request.user.userId

  const [donations, donationRows, byCampaignRaw, suggestedCampaigns] = await Promise.all([
    prisma.donation.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, include: { campaign: true }, take: 8 }),
    prisma.donation.findMany({ where: { userId }, select: { amount: true, createdAt: true } }),
    prisma.donation.groupBy({ by: ['campaignId'], where: { userId }, _sum: { amount: true } }),
    prisma.campaign.findMany({ where: { status: 'ACTIVE' }, orderBy: { createdAt: 'desc' }, take: 6, select: { id: true, title: true, location: true, goal: true, raised: true } }),
  ])

  const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0)

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

  const campaignIds = byCampaignRaw.map((r) => r.campaignId)
  const campaignMap = new Map<string, string>()
  const campaigns = await prisma.campaign.findMany({ where: { id: { in: campaignIds } }, select: { id: true, title: true } })
  campaigns.forEach((c) => campaignMap.set(c.id, c.title))
  const byCampaign = byCampaignRaw.map((r) => ({ name: campaignMap.get(r.campaignId) || r.campaignId, value: Number((r._sum.amount || 0).toFixed(2)) }))

  return NextResponse.json({
    stats: { totalDonated: Number(totalDonated.toFixed(2)), campaignsSupported: byCampaign.length, lastDonation: donations[0] || null },
    series: { donationsByMonth: donationsSeries, donationsByCampaign: byCampaign },
    lists: { donations, suggestedCampaigns },
  })
}

export const GET = withAuth(handler, [UserRole.SPONSOR, UserRole.ADMIN])
