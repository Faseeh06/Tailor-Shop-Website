"use client"

import { useState, useEffect } from 'react'
import Image from 'next/image'

interface CustomOrderFormProps {
  onSubmit: (data: any) => void
  loading: boolean
  initialCustomerName?: string
}

const CustomOrderForm = ({ onSubmit, loading, initialCustomerName = "" }: CustomOrderFormProps) => {
  const [imageUrl, setImageUrl] = useState("")
  const [isValidImage, setIsValidImage] = useState(true)
  const [formData, setFormData] = useState({
    customerName: initialCustomerName,
    measurements: {
      chest: "",
      waist: "",
      hips: "",
      shoulders: "",
      sleeves: "",
      length: "",
      neck: "",
    },
    garmentType: "",
    fabricType: "",
    color: "",
    specialInstructions: "",
    estimatedBudget: "",
    preferredDeliveryDate: "",
  })

  useEffect(() => {
    if (initialCustomerName) {
      setFormData(prev => ({
        ...prev,
        customerName: initialCustomerName
      }))
    }
  }, [initialCustomerName])

  useEffect(() => {
    // Check for pre-filled data from gallery
    const prefilledData = localStorage.getItem('prefilledOrder')
    if (prefilledData) {
      const data = JSON.parse(prefilledData)
      setImageUrl(data.imageUrl)
      setFormData(prev => ({
        ...prev,
        garmentType: data.garmentType || '',
        estimatedBudget: data.price || '', // Use the price directly here
        specialInstructions: `Based on design: ${data.title}\n${data.description}\n\n`,
      }))
      // Clear the stored data after using it
      localStorage.removeItem('prefilledOrder')
    }
  }, [])

  const validateImageUrl = (url: string) => {
    if (!url) return true // Empty URL is valid
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null
  }

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setImageUrl(url)
    setIsValidImage(validateImageUrl(url))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, string>),
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Form validation
    if (!formData.garmentType || !formData.fabricType || !formData.estimatedBudget) {
      alert('Please fill in all required fields')
      return
    }

    if (imageUrl && !validateImageUrl(imageUrl)) {
      alert('Please enter a valid image URL (must end with .jpg, .jpeg, .png, or .gif)')
      return
    }

    // Validate measurements
    const measurementValues = Object.values(formData.measurements)
    if (measurementValues.some(value => !value)) {
      alert('Please provide all measurements')
      return
    }

    // Submit data with image URL
    const submitData = {
      ...formData,
      orderDate: new Date().toISOString(),
      imageUrl: imageUrl || '/images/no-image.png', // Use default if no URL provided
      status: 'pending',
      measurements: Object.entries(formData.measurements).reduce((acc, [key, value]) => ({
        ...acc,
        [key]: String(value)
      }), {})
    }

    try {
      await onSubmit(submitData)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Failed to submit order. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Show image preview only in one place - at the top */}
      {imageUrl && (
        <div className="mb-6">
          <p className="text-sm text-gray-500 mb-2">Selected Design Reference:</p>
          <div className="relative h-64 w-full max-w-md mx-auto">
            <Image
              src={imageUrl}
              alt="Selected design"
              fill
              className="object-contain rounded-md"
            />
          </div>
        </div>
      )}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Custom Order Details</h2>
      
      {/* Customer Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Customer Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        
          <div>
            <label htmlFor="estimatedBudget" className="block text-sm font-medium text-gray-700 mb-1">Estimated Budget</label>
            <input
              type="text"
              id="estimatedBudget"
              name="estimatedBudget"
              value={formData.estimatedBudget}
              onChange={handleChange}
              placeholder="E.g. $100-$150"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="preferredDeliveryDate" className="block text-sm font-medium text-gray-700 mb-1">Preferred Delivery Date</label>
            <input
              type="date"
              id="preferredDeliveryDate"
              name="preferredDeliveryDate"
              value={formData.preferredDeliveryDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      {/* Garment Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Garment Details</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="garmentType" className="block text-sm font-medium text-gray-700 mb-1">Garment Type</label>
            <select
              id="garmentType"
              name="garmentType"
              value={formData.garmentType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select garment type</option>
              <option value="shirt">Shirt</option>
              <option value="dress">Dress</option>
              <option value="pants">Pants</option>
              <option value="skirt">Skirt</option>
              <option value="jacket">Jacket</option>
              <option value="suit">Suit</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="fabricType" className="block text-sm font-medium text-gray-700 mb-1">Fabric Type</label>
            <select
              id="fabricType"
              name="fabricType"
              value={formData.fabricType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select fabric type</option>
              <option value="cotton">Cotton</option>
              <option value="linen">Linen</option>
              <option value="silk">Silk</option>
              <option value="wool">Wool</option>
              <option value="polyester">Polyester</option>
              <option value="blend">Blend</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              placeholder="Specify color"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      {/* Measurements */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Measurements (in inches)</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <div>
            <label htmlFor="chest" className="block text-sm font-medium text-gray-700 mb-1">Chest</label>
            <input
              type="text"
              id="chest"
              name="measurements.chest"
              value={formData.measurements.chest}
              onChange={handleChange}
              placeholder="E.g. 38"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="waist" className="block text-sm font-medium text-gray-700 mb-1">Waist</label>
            <input
              type="text"
              id="waist"
              name="measurements.waist"
              value={formData.measurements.waist}
              onChange={handleChange}
              placeholder="E.g. 32"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="hips" className="block text-sm font-medium text-gray-700 mb-1">Hips</label>
            <input
              type="text"
              id="hips"
              name="measurements.hips"
              value={formData.measurements.hips}
              onChange={handleChange}
              placeholder="E.g. 40"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="shoulders" className="block text-sm font-medium text-gray-700 mb-1">Shoulders</label>
            <input
              type="text"
              id="shoulders"
              name="measurements.shoulders"
              value={formData.measurements.shoulders}
              onChange={handleChange}
              placeholder="E.g. 18"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="sleeves" className="block text-sm font-medium text-gray-700 mb-1">Sleeves</label>
            <input
              type="text"
              id="sleeves"
              name="measurements.sleeves"
              value={formData.measurements.sleeves}
              onChange={handleChange}
              placeholder="E.g. 24"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">Length</label>
            <input
              type="text"
              id="length"
              name="measurements.length"
              value={formData.measurements.length}
              onChange={handleChange}
              placeholder="E.g. 28"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="neck" className="block text-sm font-medium text-gray-700 mb-1">Neck</label>
            <input
              type="text"
              id="neck"
              name="measurements.neck"
              value={formData.measurements.neck}
              onChange={handleChange}
              placeholder="E.g. 16"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      
      {/* Reference Image URL Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Reference Image</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Image URL (Optional)
          </label>
          <input
            type="text"
            value={imageUrl}
            onChange={handleImageUrlChange}
            placeholder="https://example.com/image.jpg"
            className={`w-full px-4 py-2 border rounded-md ${!isValidImage ? 'border-red-500' : 'border-gray-300'}`}
          />
          {!isValidImage && (
            <p className="text-red-500 text-sm mt-1">
              Please enter a valid image URL (must end with .jpg, .jpeg, .png, or .gif)
            </p>
          )}
        </div>
      </div>
      
      {/* Special Instructions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Special Instructions</h3>
        <div>
          <textarea
            id="specialInstructions"
            name="specialInstructions"
            value={formData.specialInstructions}
            onChange={handleChange}
            rows={4}
            placeholder="Please provide any special requirements, design details, or additional information that will help us create your custom order exactly as you envision it."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
      </div>
      
      {/* Submit Button */}
      <div className="pt-4">
        <button 
          type="submit" 
          disabled={loading}
          className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : 'Submit Custom Order'}
        </button>
      </div>
    </form>
  )
}

export default CustomOrderForm