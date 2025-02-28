"use client"

import { useState, useEffect } from 'react'
import { db, auth } from '@/lib/firebase'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import Link from 'next/link'
import Image from 'next/image'
import { Order } from '@/types/order'
import { formatDate } from '@/utils/date'

export default function OrderStatus() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user)
      if (user) {
        // Subscribe to user's orders
        const q = query(
          collection(db, "orders"),
          where("customerId", "==", user.uid)
        )

        const ordersUnsubscribe = onSnapshot(q, (snapshot) => {
          const ordersList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          } as Order))
          setOrders(ordersList)
          setLoading(false)
        }, (error) => {
          console.error("Error fetching orders:", error)
          setError("Failed to load orders")
          setLoading(false)
        })

        return () => ordersUnsubscribe()
      } else {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const getStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    }
    return `px-3 py-1 rounded-full text-sm font-medium ${colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}`
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Login Required
          </h1>
          <p className="text-gray-600 mb-8">
            Please login to view your order status.
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders Status</h1>
        
        {orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <Link
              href="/custom-order"
              className="inline-block bg-[#B17457] text-white px-6 py-2 rounded-md hover:bg-[#9A6349]"
            >
              Place Your First Order
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {order.orderNumber}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Ordered on {formatDate(order.orderDate)}
                    </p>
                  </div>
                  <span className={getStatusBadge(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Garment Details</h3>
                      <p className="mt-1">
                        <span className="font-medium">Type:</span> {order.garmentType}
                      </p>
                      <p>
                        <span className="font-medium">Fabric:</span> {order.fabricType}
                      </p>
                      <p>
                        <span className="font-medium">Color:</span> {order.color}
                      </p>
                      <p>
                        <span className="font-medium">Budget:</span> ₹{order.estimatedBudget}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Delivery Information</h3>
                      <p className="mt-1">
                        Expected by: {formatDate(order.preferredDeliveryDate)}
                      </p>
                    </div>
                  </div>

                  <div>
                    {order.imageUrl && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500 mb-2">Reference Image</h3>
                        <div className="relative h-48 w-48">
                          <Image
                            src={order.imageUrl}
                            alt="Reference"
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Link
                    href={`/order-confirmation/${order.id}`}
                    className="text-[#B17457] hover:text-[#9A6349] font-medium"
                  >
                    View Full Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
