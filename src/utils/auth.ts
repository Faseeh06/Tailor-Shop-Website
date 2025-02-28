import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"

export const getUserRole = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('userRole')
}

export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('isAuthenticated') === 'true'
}

export const checkAuthorization = (allowedRoles: string[]) => {
  const userRole = getUserRole()
  return userRole && allowedRoles.includes(userRole)
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
