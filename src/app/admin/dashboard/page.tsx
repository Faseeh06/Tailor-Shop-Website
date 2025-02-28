"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { checkAuthorization } from '@/utils/auth'
import { db, auth } from '@/lib/firebase'
import { collection, query, onSnapshot, deleteDoc, doc } from 'firebase/firestore'
import { Order } from '@/types/order'
import { formatDate } from '@/utils/date'
import { Trash2, FileSearch } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthorized = await checkAuthorization(['admin'])
      setAuthorized(Boolean(isAuthorized))
      if (!isAuthorized && !auth.currentUser) {
        router.push('/login')
      }
    }
    checkAuth()
  }, [router])

  useEffect(() => {
    if (!authorized) return

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
        console.error("Error fetching orders:", error)
        setError("Failed to load orders")
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [authorized])

  const handleDeleteOrder = async (orderId: string) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await deleteDoc(doc(db, "orders", orderId))
      } catch (error) {
        console.error("Error deleting order:", error)
        alert("Failed to delete order")
      }
    }
  }

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getDashboardStats = () => {
    const totalOrders = orders.length
    const totalEarnings = orders.reduce((sum, order) => {
      const budget = parseFloat(order.estimatedBudget) || 0
      return sum + budget
    }, 0)
    const pendingOrders = orders.filter(o => o.status === 'pending').length
    const completedOrders = orders.filter(o => o.status === 'completed').length

    return { totalOrders, totalEarnings, pendingOrders, completedOrders }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!authorized) {
    return <div className="min-h-screen flex items-center justify-center">Checking authorization...</div>
  }

  const stats = getDashboardStats()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-500">Total Orders</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-500">Total Earnings</h3>
            <p className="text-3xl font-bold text-[#B17457]">₹{stats.totalEarnings.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-500">Pending Orders</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.pendingOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-500">Completed Orders</h3>
            <p className="text-3xl font-bold text-green-600">{stats.completedOrders}</p>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">All Orders</h2>
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Customer: {order.customerName}
                      </p>
                      <p className="text-sm text-gray-500">
                        Email: {order.customerEmail}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <Link 
                        href={`/order-confirmation/${order.id}`}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <FileSearch className="w-5 h-5 text-blue-600" />
                      </Link>
                      <button
                        onClick={() => order.id && handleDeleteOrder(order.id)}
                        className="p-2 hover:bg-red-100 rounded-full transition-colors"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div className="space-y-2">
                      <p><span className="font-medium">Order Date:</span> {formatDate(order.orderDate)}</p>
                      <p><span className="font-medium">Garment:</span> {order.garmentType}</p>
                      <p><span className="font-medium">Fabric:</span> {order.fabricType}</p>
                      <p><span className="font-medium">Budget:</span> ₹{order.estimatedBudget}</p>
                      <p><span className="font-medium">Delivery By:</span> {formatDate(order.preferredDeliveryDate)}</p>
                    </div>

                    {order.imageUrl && (
                      <div className="relative h-48 w-48 ml-auto">
                        <Image
                          src={order.imageUrl}
                          alt="Reference"
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
