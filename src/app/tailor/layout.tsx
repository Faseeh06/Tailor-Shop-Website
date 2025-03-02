"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function TailorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { userRole } = useAuth()

  useEffect(() => {
    if (userRole !== 'tailor') {
      router.push('/login')
    }
  }, [userRole, router])

  if (userRole !== 'tailor') {
    return <div className="min-h-screen flex items-center justify-center">Checking authorization...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}
