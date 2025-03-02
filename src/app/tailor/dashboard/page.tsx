"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkAuthorization } from '@/utils/auth'
import { db } from '@/lib/firebase'
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { Order } from '@/types/order'
import Image from 'next/image'
import Link from 'next/link'
import { FileSearch } from 'lucide-react'

export default function TailorDashboard() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthorized = await checkAuthorization(['tailor'])
      if (!isAuthorized) {
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
          } as Order))
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
    }

    checkAuth()
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

  const getOrderStats = () => {
    const totalOrders = orders.length
    const pendingOrders = orders.filter(o => o.status === 'pending').length
    const inProgressOrders = orders.filter(o => o.status === 'in-progress').length
    const completedOrders = orders.filter(o => o.status === 'completed').length

    return { totalOrders, pendingOrders, inProgressOrders, completedOrders }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>
  }

  const stats = getOrderStats()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Tailor Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-500">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-500">Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-500">In Progress</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.inProgressOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-500">Completed</h3>
            <p className="text-3xl font-bold text-green-600">{stats.completedOrders}</p>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-md p-6">
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

          <div className="space-y-4">
            {orders
              .filter(order => filterStatus === 'all' ? true : order.status === filterStatus)
              .map(order => (
                <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    {/* Image */}
                    {order.imageUrl && (
                      <div className="relative h-32 w-32 flex-shrink-0">
                        <Image
                          src={order.imageUrl}
                          alt="Reference"
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    )}

                    {/* Order Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{order.customerName}</h3>
                          <p className="text-sm text-gray-600 mb-2">{order.orderNumber}</p>
                          <p className="text-sm"><span className="font-medium">Expected:</span> {new Date(order.preferredDeliveryDate).toLocaleDateString()}</p>
                          <p className="text-[#B17457] font-semibold mt-1">₹{order.estimatedBudget}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id!, e.target.value)}
                            className={`px-3 py-1 rounded-md border text-sm ${
                              order.status === 'completed' ? 'bg-green-50 text-green-700' :
                              order.status === 'in-progress' ? 'bg-blue-50 text-blue-700' :
                              'bg-yellow-50 text-yellow-700'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>

                          <Link 
                            href={`/tailor/orders/${order.id}`}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm"
                          >
                            <FileSearch className="w-4 h-4" />
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
