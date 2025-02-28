"use client"

import { useState, useEffect } from 'react'
import { db, auth } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import CustomOrderForm from '@/components/orders/CustomOrderForm'  // Changed from named import to default import
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const storage = getStorage();

export default function CustomOrder() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user)
    })

    return () => unsubscribe()
  }, [])

  const handleSubmit = async (formData: any) => {
    setLoading(true)
    setError("")

    try {
      if (!auth.currentUser) {
        throw new Error("Please login to place an order")
      }

      let imageUrl = null
      
      // Upload image if exists
      if (formData.imageFile) {
        const imageRef = ref(storage, `orderImages/${auth.currentUser.uid}/${Date.now()}-${formData.imageFile.name}`)
        const uploadResult = await uploadBytes(imageRef, formData.imageFile)
        imageUrl = await getDownloadURL(uploadResult.ref)
      }

      // Add order to Firestore
      const orderData = {
        ...formData,
        imageUrl,
        createdAt: new Date().toISOString(),
        status: 'pending',
        customerId: auth.currentUser.uid,
        customerEmail: auth.currentUser.email,
      }

      // Remove the file object before storing in Firestore
      delete orderData.imageFile

      const docRef = await addDoc(collection(db, "orders"), orderData)
      
      router.push(`/order-confirmation/${docRef.id}`)
    } catch (error: any) {
      setError(error.message)
      console.error("Error adding order: ", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Login Required
          </h1>
          <p className="text-gray-600 mb-8">
            Please login or create an account to place a custom order.
          </p>
          <div className="space-x-4">
            <Link
              href="/login"
              className="inline-block bg-[#B17457] text-white px-6 py-2 rounded-md hover:bg-[#9A6349]"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-block border border-[#B17457] text-[#B17457] px-6 py-2 rounded-md hover:bg-[#FFF8F5]"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Custom Order
        </h1>
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-md mb-6">
            {error}
          </div>
        )}
        <CustomOrderForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  )
}
