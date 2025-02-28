"use client"

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import { Order } from '@/types/order'

interface OrderConfirmationProps {
  params: Promise<{ orderId: string }>
}

export default function OrderConfirmation({ params }: OrderConfirmationProps) {
  const router = useRouter()
  const { orderId } = use(params)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("Order ID not found")
        setLoading(false)
        return
      }

      try {
        const orderDoc = await getDoc(doc(db, "orders", orderId))
        if (!orderDoc.exists()) {
          throw new Error("Order not found")
        }
        setOrder({ id: orderDoc.id, ...orderDoc.data() } as Order)
      } catch (error: any) {
        setError(error.message)
        console.error("Error fetching order:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || "Order not found"}</p>
          <Link href="/" className="text-[#B17457] hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Order ID: {order.id}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Order Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Garment Information</h3>
              <div className="space-y-2">
                <p><span className="font-medium">Type:</span> {order.garmentType}</p>
                <p><span className="font-medium">Fabric:</span> {order.fabricType}</p>
                <p><span className="font-medium">Color:</span> {order.color}</p>
                <p><span className="font-medium">Estimated Budget:</span> ₹{order.estimatedBudget}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-700 mb-2">Measurements</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(order.measurements).map(([key, value]) => (
                  <p key={key} className="text-sm">
                    <span className="font-medium capitalize">{key}:</span>{' '}
                    {value} inches
                  </p>
                ))}
              </div>
            </div>
          </div>

          {order.specialInstructions && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-700 mb-2">Special Instructions</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{order.specialInstructions}</p>
            </div>
          )}

          {order.imageUrl && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-700 mb-2">Reference Image</h3>
              <div className="relative h-48 w-48">
                <Image
                  src={order.imageUrl}
                  alt="Reference"
                  fill
                  className="object-cover rounded"
                />
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-medium text-gray-700 mb-2">Delivery Information</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Expected Delivery Date:</span>{' '}
                {formatDate(order.preferredDeliveryDate)}
              </p>
              <p><span className="font-medium">Order Date:</span>{' '}
                {formatDate(order.orderDate)}
              </p>
              <p><span className="font-medium">Status:</span>{' '}
                <span className="capitalize px-2 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                  {order.status}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <Link
            href="/custom-order"
            className="inline-block bg-[#B17457] text-white px-6 py-2 rounded-md hover:bg-[#9A6349]"
          >
            Place Another Order
          </Link>
          <Link
            href="/"
            className="inline-block border border-[#B17457] text-[#B17457] px-6 py-2 rounded-md hover:bg-[#FFF8F5]"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}
