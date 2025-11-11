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

export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: params.key }
    })

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

    const setting = await prisma.setting.update({
      where: { key: params.key },
      data: {
        value,
        description,
        category: category || "general",
        updatedAt: new Date()
      }
    })

    await audit({
      entityType: "SETTING",
      entityId: setting.id,
      action: "UPDATE",
      changedData: { key: params.key, value, description, category },
      performedById: payload.userId
    })

    return NextResponse.json(setting)
  } catch (error) {
    console.error("Error updating setting:", error)
    if (error instanceof Error && error.message.includes("Record to update not found")) {
      return NextResponse.json({ error: "Setting not found" }, { status: 404 })
    }
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

    const setting = await prisma.setting.findUnique({
      where: { key: params.key }
    })

    if (!setting) {
      return NextResponse.json({ error: "Setting not found" }, { status: 404 })
    }

    await prisma.setting.delete({
      where: { key: params.key }
    })

    await audit({
      entityType: "SETTING",
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