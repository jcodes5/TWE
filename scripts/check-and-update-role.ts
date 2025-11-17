part of the signup optioimport { PrismaClient, UserRole } from '@prisma/client'
import * as dotenv from 'dotenv'

dotenv.config()

const prisma = new PrismaClient()

async function checkAndUpdateRole() {
  const email = process.argv[2] || 'overcomer395@gmail.com'
  const targetRole = process.argv[3] || 'ADMIN'

  try {
    console.log(`Checking user with email: ${email}`)
    
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      console.log(`No user found with email: ${email}`)
      return
    }

    console.log('Current user:', user)

    let role: UserRole
    switch (targetRole.toUpperCase()) {
      case 'ADMIN':
        role = UserRole.ADMIN
        break
      case 'SPONSOR':
        role = UserRole.SPONSOR
        break
      case 'VOLUNTEER':
        role = UserRole.VOLUNTEER
        break
      default:
        console.log('Invalid role. Use ADMIN, SPONSOR, or VOLUNTEER')
        return
    }

    if (user.role === role) {
      console.log(`User already has role ${role}`)
      return
    }

    // If setting as admin, check if there's already an admin
    if (role === UserRole.ADMIN) {
      const adminCount = await prisma.user.count({
        where: { role: UserRole.ADMIN }
      })

      if (adminCount > 0) {
        console.log('Warning: There is already an admin user')
        const adminUser = await prisma.user.findFirst({
          where: { role: UserRole.ADMIN }
        })
        console.log('Existing admin:', adminUser)
      }
    }

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role },
      select: { id: true, email: true, role: true, firstName: true, lastName: true }
    })

    console.log('Successfully updated user role:', updatedUser)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAndUpdateRole()