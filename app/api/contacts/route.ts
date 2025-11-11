import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { createAndBroadcastNotification } from '@/lib/websocket'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, organization, subject, message, inquiryType } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const contact = await prisma.contact.create({
      data: { name, email, phone, organization, subject, message, inquiryType: inquiryType || 'general' },
    })

    // Create notification for new contact submission
    await createAndBroadcastNotification(
      "New Contact Inquiry",
      `New contact from ${name}: ${subject}`,
      "INFO"
    )

    return NextResponse.json({ contact }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to submit contact' }, { status: 500 })
  }
}
