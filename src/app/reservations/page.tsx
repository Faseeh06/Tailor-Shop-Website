"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { addDoc, collection } from 'firebase/firestore'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'

export default function ReservationsPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    reason: '',
    date: '',
    time: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auth.currentUser) {
      setError('Please login to make a reservation')
      return
    }

    setLoading(true)
    try {
      const reservationData = {
        userId: auth.currentUser.uid,
        customerName: auth.currentUser.displayName || 'Unknown',
        customerEmail: auth.currentUser.email,
        reason: formData.reason,
        date: formData.date,
        time: formData.time,
        status: 'pending',
        createdAt: new Date().toISOString()
      }

      await addDoc(collection(db, 'reservations'), reservationData)
      alert('Reservation submitted successfully!')
      router.push('/')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="mb-4">Please login to make a reservation</p>
          <Link href="/login" className="text-blue-600 hover:underline">
            Login here
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6">Make a Reservation</h1>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Reason for Visit</label>
          <textarea
            value={formData.reason}
            onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
            className="w-full p-2 border rounded"
            required
            rows={4}
          />
        </div>

        <div>
          <label className="block mb-1">Preferred Date</label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            className="w-full p-2 border rounded"
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div>
          <label className="block mb-1">Preferred Time</label>
          <select
            value={formData.time}
            onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select a time</option>
            <option value="10:00">10:00 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="12:00">12:00 PM</option>
            <option value="14:00">2:00 PM</option>
            <option value="15:00">3:00 PM</option>
            <option value="16:00">4:00 PM</option>
            <option value="17:00">5:00 PM</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#B17457] text-white py-2 px-4 rounded hover:bg-[#9A6349] disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  )
}
