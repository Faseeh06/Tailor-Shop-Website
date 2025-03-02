"use client"

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, query, onSnapshot, doc, updateDoc } from 'firebase/firestore'
import { Reservation } from '@/types/reservation'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function TailorReservations() {
  const router = useRouter()
  const { userRole } = useAuth()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Protect the route
    if (userRole !== 'tailor') {
      router.push('/login')
      return
    }

    const unsubscribe = onSnapshot(
      query(collection(db, 'reservations')),
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Reservation))
        setReservations(data.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ))
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [userRole, router])

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateDoc(doc(db, 'reservations', id), { status })
      alert(`Reservation ${status} successfully`)
    } catch (error) {
      console.error('Error updating reservation:', error)
      alert('Failed to update reservation')
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Reservations Management</h1>

      <div className="bg-white rounded-lg shadow-sm">
        <div className="grid gap-6 p-6">
          {reservations.length === 0 ? (
            <p className="text-center text-gray-500">No reservations found</p>
          ) : (
            reservations.map((reservation) => (
              <div key={reservation.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{reservation.customerName}</h3>
                    <p className="text-gray-600">{reservation.customerEmail}</p>
                    <p className="mt-2"><span className="font-medium">Date:</span> {reservation.date}</p>
                    <p><span className="font-medium">Time:</span> {reservation.time}</p>
                    <p className="mt-4 text-gray-700">{reservation.reason}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      reservation.status === 'approved' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {reservation.status}
                    </span>
                    {reservation.status === 'pending' && (
                      <div className="mt-4 space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(reservation.id!, 'approved')}
                          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(reservation.id!, 'rejected')}
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
