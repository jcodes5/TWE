import { prisma } from "@/lib/database"
import { AuditAction, EntityType } from "@prisma/client"

export async function logAudit(params: {
  entityType: EntityType
  entityId: string
  action: AuditAction
  performedById: string
  changedData?: unknown
}) {
  try {
    await prisma.auditLog.create({
      data: {
        entityType: params.entityType,
        entityId: params.entityId,
        action: params.action,
        performedById: params.performedById,
        changedData: params.changedData as any,
      },
    })
  } catch (e) {
    console.error("Audit log failed", e)
  }
}
