"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkAuthorization } from '@/utils/auth'
import OrderList from '@/components/dashboard/OrderList'
import DashboardStats from '@/components/dashboard/DashboardStats'
import { db } from '@/lib/firebase'
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore'

export default function TailorDashboard() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!checkAuthorization(['tailor'])) {
      router.push('/login')
      return
    }

    // Subscribe to orders collection
    const unsubscribe = onSnapshot(
      query(collection(db, "orders")),
      (snapshot) => {
        const ordersData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setOrders(ordersData)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching orders: ", error)
        setError("Failed to load orders")
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [router])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, "orders", orderId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      })
    } catch (error) {
      console.error("Error updating order status: ", error)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Tailor Dashboard</h1>
        
        <DashboardStats orders={orders} />

        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-700">Customer Orders</h2>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-md px-3 py-2 text-gray-700"
            >
              <option value="all">All Orders</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <OrderList 
            orders={orders.filter(order => 
              filterStatus === 'all' ? true : order.status === filterStatus
            )}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>
    </div>
  )
}
