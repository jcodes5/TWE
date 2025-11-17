import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function checkAdminRole() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL

    if (!adminEmail) {
      throw new Error('ADMIN_EMAIL environment variable is required')
    }

    console.log('Checking admin user role for email:', adminEmail)

    const user = await prisma.user.findUnique({
      where: { email: adminEmail },
      select: { id: true, email: true, role: true, firstName: true, lastName: true }
    })

    if (!user) {
      console.log('Admin user not found')
      return
    }

    console.log('Admin user found:', user)
  } catch (error) {
    console.error('Error checking admin user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAdminRole()