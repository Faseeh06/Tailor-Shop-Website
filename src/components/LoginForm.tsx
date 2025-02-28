"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { auth, db } from "@/lib/firebase"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"

const LoginForm = () => {
  const router = useRouter()
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Sign in with Firebase Auth
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )

      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid))
      const userData = userDoc.data()

      if (!userData) {
        throw new Error("User data not found")
      }

      // Store role in localStorage (you might want to use a more secure method in production)
      localStorage.setItem('userRole', userData.role)
      localStorage.setItem('isAuthenticated', 'true')

      // Redirect based on role
      switch(userData.role) {
        case 'admin':
          router.push('/admin/dashboard')
          break
        case 'tailor':
          router.push('/tailor/dashboard')
          break
        default:
          router.push('/login')
          setError("Invalid user role")
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#B17457] focus:border-[#B17457] block w-full p-2.5"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#B17457] focus:border-[#B17457] block w-full p-2.5"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full text-white bg-[#B17457] hover:bg-[#9A6349] focus:ring-4 focus:outline-none focus:ring-[#F5E6E0] font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  )
}

export default LoginForm

