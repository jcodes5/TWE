import { PrismaClient, UserRole } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function makeAdmin() {
  const adminEmail = process.argv[2]
  
  if (!adminEmail) {
    console.error('Please provide an email address as an argument')
    console.log('Usage: npm run make-admin your-admin-email@example.com')
    process.exit(1)
  }

  try {
    console.log(`Updating user with email ${adminEmail} to ADMIN role`)

    // First check if user exists
    const user = await prisma.user.findUnique({
      where: { email: adminEmail }
    })

    if (!user) {
      console.error(`No user found with email ${adminEmail}`)
      process.exit(1)
    }

    console.log('Found user:', user)

    // Check if there's already an admin
    const adminCount = await prisma.user.count({
      where: { role: UserRole.ADMIN }
    })

    if (adminCount > 0) {
      console.log('There is already an admin user in the system')
      const adminUser = await prisma.user.findFirst({
        where: { role: UserRole.ADMIN }
      })
      console.log('Existing admin user:', adminUser)
      
      // Ask for confirmation to proceed
      const readline = require('readline')
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      })

      rl.question(`Do you want to change the admin user from ${adminUser?.email} to ${adminEmail}? (yes/no): `, async (answer: string) => {
        if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
          // Remove admin role from existing admin
          await prisma.user.update({
            where: { id: adminUser?.id },
            data: { role: UserRole.VOLUNTEER }
          })
          
          // Make new user admin
          const updatedUser = await prisma.user.update({
            where: { email: adminEmail },
            data: { role: UserRole.ADMIN },
            select: { id: true, email: true, role: true, firstName: true, lastName: true }
          })
          
          console.log('Successfully updated admin user:', updatedUser)
        } else {
          console.log('Operation cancelled')
        }
        await prisma.$disconnect()
        rl.close()
      })
    } else {
      // Make user admin
      const updatedUser = await prisma.user.update({
        where: { email: adminEmail },
        data: { role: UserRole.ADMIN },
        select: { id: true, email: true, role: true, firstName: true, lastName: true }
      })
      
      console.log('Successfully updated user to admin:', updatedUser)
      await prisma.$disconnect()
    }
  } catch (error) {
    console.error('Error updating user:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

makeAdmin()