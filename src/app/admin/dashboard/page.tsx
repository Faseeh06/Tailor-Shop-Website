"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { checkAuthorization } from '@/utils/auth'

export default function AdminDashboard() {
  const router = useRouter()

  useEffect(() => {
    if (!checkAuthorization(['admin'])) {
      router.push('/login')
    }
  }, [router])

  return <div>Admin Dashboard</div>
}
