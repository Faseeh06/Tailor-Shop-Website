"use client"

import { useState, useEffect } from 'react'
import { db, auth } from '@/lib/firebase'
import { collection, addDoc, doc, getDoc, updateDoc, runTransaction } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import CustomOrderForm from '@/components/orders/CustomOrderForm'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const storage = getStorage()

export default function CustomOrder() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user)
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const fetchUserName = async () => {
      if (auth.currentUser) {
        const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid))
        if (userDoc.exists()) {
          setUserName(userDoc.data().name)
        }
      }
    }

    fetchUserName()
  }, [])

  const handleSubmit = async (formData: any) => {
    setLoading(true)
    setError("")

    try {
      if (!auth.currentUser) {
        throw new Error("Please login to place an order")
      }

      // Generate order number using transaction
      const orderNumber = await runTransaction(db, async (transaction) => {
        const counterRef = doc(db, 'counters', 'orders')
        const counterDoc = await transaction.get(counterRef)
        
        let newNumber = 1
        if (counterDoc.exists()) {
          newNumber = (counterDoc.data().count || 0) + 1
          transaction.update(counterRef, { count: newNumber })
        } else {
          transaction.set(counterRef, { count: 1 })
        }
        
        return newNumber
      })

      // Handle image upload
      let imageUrl = null
      if (formData.imageFile) {
        const imageRef = ref(storage, `orderImages/${auth.currentUser.uid}/${Date.now()}-${formData.imageFile.name}`)
        await uploadBytes(imageRef, formData.imageFile)
        imageUrl = await getDownloadURL(imageRef)
      }

      // Prepare order data
      const orderData = {
        orderNumber: `Order No ${orderNumber}`,
        customerName: userName || formData.customerName, // Use userName if available, fallback to form data
        customerEmail: auth.currentUser.email,
        customerId: auth.currentUser.uid,
        imageUrl,
        garmentType: formData.garmentType,
        fabricType: formData.fabricType,
        color: formData.color,
        measurements: formData.measurements,
        specialInstructions: formData.specialInstructions || '',
        estimatedBudget: formData.estimatedBudget,
        preferredDeliveryDate: formData.preferredDeliveryDate,
        orderDate: new Date().toISOString(),
        status: 'pending',
        createdAt: new Date().toISOString()
      }

      // Save to Firestore
      const docRef = await addDoc(collection(db, "orders"), orderData)
      console.log("Order added with ID: ", docRef.id)

      // Redirect to confirmation page
      router.push(`/order-confirmation/${docRef.id}`)
    } catch (error: any) {
      console.error("Error adding order:", error)
      setError(error.message || "Failed to place order")
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
        <CustomOrderForm 
          onSubmit={handleSubmit} 
          loading={loading}
          initialCustomerName={userName} // Pass the user's name to the form
        />
      </div>
    </div>
  )
}
