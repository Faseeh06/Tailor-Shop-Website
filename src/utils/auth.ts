import { auth, db } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import type { UserRole } from "@/types/auth"

export const getUserRole = () => {
  if (typeof window === 'undefined') return null
  const role = localStorage.getItem('userRole') as UserRole | null
  return role
}

export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('isAuthenticated') === 'true'
}

export const checkAuthorization = async (allowedRoles: UserRole[]) => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        resolve(false)
        return
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (!userDoc.exists()) {
          resolve(false)
          return
        }

        const userRole = userDoc.data().role
        resolve(allowedRoles.includes(userRole))
      } catch (error) {
        console.error('Error checking authorization:', error)
        resolve(false)
      }
    })

    // Cleanup subscription
    return () => unsubscribe()
  })
}

export const logout = async () => {
  try {
    await signOut(auth)
    localStorage.removeItem('userRole')
    localStorage.removeItem('isAuthenticated')
  } catch (error) {
    console.error('Error signing out:', error)
  }
}
