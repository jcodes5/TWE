import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { AuthService } from "@/lib/auth"
import { UserRole } from "@prisma/client"
import { prisma } from "@/lib/database"
import { audit } from "@/lib/audit"

function ensureRole(role: UserRole, allowed: UserRole[]) {
  if (!allowed.includes(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }
}

export async function GET() {
  try {
    const token = cookies().get("accessToken")?.value
    const payload = token ? AuthService.verifyAccessToken(token) : null
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const roleCheck = ensureRole(payload.role, [UserRole.ADMIN])
    if (roleCheck) return roleCheck

    const settings = await prisma.setting.findMany({
      orderBy: { category: "asc" }
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = cookies().get("accessToken")?.value
    const payload = token ? AuthService.verifyAccessToken(token) : null
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const roleCheck = ensureRole(payload.role, [UserRole.ADMIN])
    if (roleCheck) return roleCheck

    const body = await request.json()
    const { key, value, description, category } = body

    if (!key || !value) {
      return NextResponse.json({ error: "Key and value are required" }, { status: 400 })
    }

    const setting = await prisma.setting.upsert({
      where: { key },
      update: {
        value,
        description,
        category: category || "general",
        updatedAt: new Date()
      },
      create: {
        key,
        value,
        description,
        category: category || "general"
      }
    })

    await audit({
      entityType: "SETTING",
      entityId: setting.id,
      action: "UPDATE",
      changedData: { key, value, description, category },
      performedById: payload.userId
    })

    return NextResponse.json(setting)
  } catch (error) {
    console.error("Error updating setting:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}