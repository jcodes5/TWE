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

export async function GET() {
  try {
    const token = cookies().get("accessToken")?.value
    const payload = token ? AuthService.verifyAccessToken(token) : null
    if (!payload) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const roleCheck = ensureRole(payload.role, [UserRole.ADMIN])
    if (roleCheck) return roleCheck

    // Using raw query instead of prisma.setting.findMany due to Prisma client not being regenerated
    const settings: any = await prisma.$queryRaw`SELECT * FROM settings ORDER BY category ASC`;

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

    // Using raw query instead of prisma.setting.upsert due to Prisma client not being regenerated
    const existingSettings: any = await prisma.$queryRaw`SELECT * FROM settings WHERE \`key\` = ${key}`;
    const existingSetting = Array.isArray(existingSettings) ? existingSettings[0] : existingSettings;
    
    let setting: any;
    if (existingSetting) {
      // Update existing setting
      await prisma.$executeRaw`
        UPDATE settings 
        SET value = ${value}, 
            description = ${description || null}, 
            category = ${category || "general"}, 
            updatedAt = NOW() 
        WHERE \`key\` = ${key}
      `;
      
      const updatedSettings: any = await prisma.$queryRaw`SELECT * FROM settings WHERE \`key\` = ${key}`;
      setting = Array.isArray(updatedSettings) ? updatedSettings[0] : updatedSettings;
    } else {
      // Create new setting
      await prisma.$executeRaw`
        INSERT INTO settings (\`key\`, value, description, category, createdAt, updatedAt)
        VALUES (${key}, ${value}, ${description || null}, ${category || "general"}, NOW(), NOW())
      `;
      
      const newSettings: any = await prisma.$queryRaw`SELECT * FROM settings WHERE \`key\` = ${key}`;
      setting = Array.isArray(newSettings) ? newSettings[0] : newSettings;
    }

    await logAudit({
      entityType: "SETTING" as any,
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