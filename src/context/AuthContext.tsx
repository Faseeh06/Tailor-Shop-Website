"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

interface AuthContextType {
  isAuthenticated: boolean
  userRole: string | null
  loading: boolean
  updateAuthState: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  userRole: null,
  loading: true,
  updateAuthState: async () => {}
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const updateAuthState = async () => {
    const user = auth.currentUser
    if (user) {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      const role = userDoc.data()?.role || null
      setUserRole(role)
      setIsAuthenticated(true)
      localStorage.setItem('userRole', role)
      localStorage.setItem('isAuthenticated', 'true')
    } else {
      setUserRole(null)
      setIsAuthenticated(false)
      localStorage.removeItem('userRole')
      localStorage.removeItem('isAuthenticated')
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      await updateAuthState()
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, userRole, loading, updateAuthState }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
