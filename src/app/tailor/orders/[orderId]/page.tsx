"use client"

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import Image from 'next/image'
import { Order } from '@/types/order'
import { ArrowLeft } from 'lucide-react'

interface OrderDetailsProps {
  params: Promise<{ orderId: string }>
}

export default function OrderDetails({ params }: OrderDetailsProps) {
  const router = useRouter()
  const { orderId } = use(params)
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderDoc = await getDoc(doc(db, "orders", orderId))
        if (!orderDoc.exists()) {
          throw new Error("Order not found")
        }
        setOrder({ id: orderDoc.id, ...orderDoc.data() } as Order)
      } catch (error: any) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [orderId])

  const handleStatusUpdate = async (newStatus: "pending" | "in-progress" | "completed") => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      })
      setOrder(prev => prev ? { ...prev, status: newStatus } : null)
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Failed to update status")
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div className="text-red-500">{error}</div>
  if (!order) return <div>Order not found</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button 
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Dashboard
      </button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
            <p className="text-gray-600">{order.orderNumber}</p>
          </div>
          <select
            value={order.status}
            onChange={(e) => handleStatusUpdate(e.target.value as "pending" | "in-progress" | "completed")}
            className={`px-4 py-2 rounded-md border text-sm ${
              order.status === 'completed' ? 'bg-green-50 text-green-700' :
              order.status === 'in-progress' ? 'bg-blue-50 text-blue-700' :
              'bg-yellow-50 text-yellow-700'
            }`}
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="font-semibold text-lg mb-4">Customer Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {order.customerName}</p>
              <p><span className="font-medium">Email:</span> {order.customerEmail}</p>
              <p><span className="font-medium">Order Date:</span> {new Date(order.orderDate).toLocaleDateString()}</p>
              <p><span className="font-medium">Expected Delivery:</span> {new Date(order.preferredDeliveryDate).toLocaleDateString()}</p>
              <p><span className="font-medium">Budget:</span> ₹{order.estimatedBudget}</p>
            </div>

            <h2 className="font-semibold text-lg mt-6 mb-4">Garment Details</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Type:</span> {order.garmentType}</p>
              <p><span className="font-medium">Fabric:</span> {order.fabricType}</p>
              <p><span className="font-medium">Color:</span> {order.color}</p>
            </div>

            <h2 className="font-semibold text-lg mt-6 mb-4">Measurements</h2>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(order.measurements).map(([key, value]) => (
                <p key={key}>
                  <span className="font-medium capitalize">{key}:</span> {value} inches
                </p>
              ))}
            </div>
          </div>

          <div>
            {order.imageUrl && (
              <div>
                <h2 className="font-semibold text-lg mb-4">Reference Image</h2>
                <div className="relative h-96 w-full">
                  <Image
                    src={order.imageUrl}
                    alt="Reference"
                    fill
                    className="object-contain rounded-lg"
                  />
                </div>
              </div>
            )}

            {order.specialInstructions && (
              <div className="mt-6">
                <h2 className="font-semibold text-lg mb-4">Special Instructions</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{order.specialInstructions}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
