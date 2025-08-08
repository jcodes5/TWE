// app/dashboard/admin/page.tsx
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { AuthService } from '@/lib/auth'
import AdminDashboard from './AdminDashboard'

export default function AdminDashboardPage() {
  const cookieStore = cookies()
  const token = cookieStore.get('accessToken')?.value

  if (!token) {
    return redirect('/auth/login')
  }

  const payload = AuthService.verifyAccessToken(token)

  if (!payload || payload.role !== 'ADMIN') {
    return redirect('/dashboard')
  }

  return <AdminDashboard user={payload} />
}
