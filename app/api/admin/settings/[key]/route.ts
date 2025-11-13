import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { AuthService } from "@/lib/auth"
import { UserRole, EntityType } from "@prisma/client"
import { prisma } from "@/lib/database"
import { logAudit } from "@/lib/audit"

function ensureRole(role: UserRole, allowed: UserRole[]) {
  if (!allowed.includes(role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    // Using raw query instead of prisma.setting.findUnique due to Prisma client not being regenerated
    const settings = await prisma.$queryRaw`SELECT * FROM settings WHERE \`key\` = ${params.key}`;
    const setting = Array.isArray(settings) ? settings[0] : settings;

    if (!setting) {
      return NextResponse.json({ error: "Setting not found" }, { status: 404 })
    }

    return NextResponse.json(setting)
  } catch (error) {
    console.error("Error fetching setting:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const token = cookies().get("accessToken")?.value
    const payload = token ? AuthService.verifyAccessToken(token) : null
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const roleCheck = ensureRole(payload.role, [UserRole.ADMIN])
    if (roleCheck) return roleCheck

    const body = await request.json()
    const { value, description, category } = body

    if (!value) {
      return NextResponse.json({ error: "Value is required" }, { status: 400 })
    }

    // Using raw query instead of prisma.setting.update due to Prisma client not being regenerated
    const updatedSettings: any = await prisma.$executeRaw`
      UPDATE settings 
      SET value = ${value}, 
          description = ${description || null}, 
          category = ${category || "general"}, 
          updatedAt = NOW() 
      WHERE \`key\` = ${params.key}
    `;

    if (updatedSettings === 0) {
      return NextResponse.json({ error: "Setting not found" }, { status: 404 })
    }

    // Fetch the updated setting to return it and get its ID for audit log
    const settings: any = await prisma.$queryRaw`SELECT * FROM settings WHERE \`key\` = ${params.key}`;
    const setting = Array.isArray(settings) ? settings[0] : settings;

    await logAudit({
      entityType: "SETTING" as any,
      entityId: setting.id,
      action: "UPDATE",
      changedData: { key: params.key, value, description, category },
      performedById: payload.userId
    })

    return NextResponse.json(setting)
  } catch (error) {
    console.error("Error updating setting:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const token = cookies().get("accessToken")?.value
    const payload = token ? AuthService.verifyAccessToken(token) : null
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const roleCheck = ensureRole(payload.role, [UserRole.ADMIN])
    if (roleCheck) return roleCheck

    // Fetch the setting to get its ID for audit log
    const settings: any = await prisma.$queryRaw`SELECT * FROM settings WHERE \`key\` = ${params.key}`;
    const setting = Array.isArray(settings) ? settings[0] : settings;

    if (!setting) {
      return NextResponse.json({ error: "Setting not found" }, { status: 404 })
    }

    // Using raw query instead of prisma.setting.delete due to Prisma client not being regenerated
    await prisma.$executeRaw`DELETE FROM settings WHERE \`key\` = ${params.key}`;

    await logAudit({
      entityType: "SETTING" as any,
      entityId: setting.id,
      action: "DELETE",
      changedData: { key: params.key },
      performedById: payload.userId
    })

    return NextResponse.json({ message: "Setting deleted successfully" })
  } catch (error) {
    console.error("Error deleting setting:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}