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
  const userRole = getUserRole()
  if (!userRole || !auth.currentUser) return false

  try {
    // Verify role in Firestore
    const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid))
    const userData = userDoc.data()
    
    if (!userData || userData.role !== userRole) {
      // Role mismatch, clear local storage
      localStorage.removeItem('userRole')
      localStorage.removeItem('isAuthenticated')
      return false
    }

    return allowedRoles.includes(userRole)
  } catch (error) {
    console.error('Authorization check failed:', error)
    return false
  }
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
