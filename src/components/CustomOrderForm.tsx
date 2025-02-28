"use client"

import { useState } from 'react'
import Image from 'next/image'

interface CustomOrderFormProps {
  onSubmit: (data: any) => void
  loading: boolean
}

const CustomOrderForm = ({ onSubmit, loading }: CustomOrderFormProps) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    customerName: "",
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
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
    onSubmit({
      ...formData,
      imageFile: selectedImage
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Garment Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Garment Type
        </label>
        <select
          name="garmentType"
          value={formData.garmentType}
          onChange={handleChange}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#B17457] focus:border-[#B17457]"
          required
        >
          <option value="">Select a garment type</option>
          <option value="suit">Suit</option>
          <option value="shirt">Shirt</option>
          <option value="pants">Pants</option>
          <option value="dress">Dress</option>
        </select>
      </div>

      {/* Measurements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(formData.measurements).map(([key, value]) => (
          <div key={key}>
            <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
              {key} (inches)
            </label>
            <input
              type="number"
              name={`measurements.${key}`}
              value={value}
              onChange={handleChange}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#B17457] focus:border-[#B17457]"
              required
              step="0.1"
            />
          </div>
        ))}
      </div>

      {/* Fabric and Color */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fabric Type
          </label>
          <select
            name="fabricType"
            value={formData.fabricType}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#B17457] focus:border-[#B17457]"
            required
          >
            <option value="">Select fabric type</option>
            <option value="cotton">Cotton</option>
            <option value="silk">Silk</option>
            <option value="wool">Wool</option>
            <option value="linen">Linen</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color
          </label>
          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#B17457] focus:border-[#B17457]"
            required
          />
        </div>
      </div>

      {/* Reference Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Reference Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
          required
        />
        {imagePreview && (
          <div className="mt-2 relative h-48 w-48">
            <Image
              src={imagePreview}
              alt="Preview"
              fill
              className="object-cover rounded"
            />
          </div>
        )}
      </div>

      {/* Special Instructions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Special Instructions
        </label>
        <textarea
          name="specialInstructions"
          value={formData.specialInstructions}
          onChange={handleChange}
          rows={4}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#B17457] focus:border-[#B17457]"
          placeholder="Any specific requirements or preferences..."
        />
      </div>

      {/* Budget and Delivery Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Estimated Budget (₹)
          </label>
          <input
            type="number"
            name="estimatedBudget"
            value={formData.estimatedBudget}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#B17457] focus:border-[#B17457]"
            required
            min="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Delivery Date
          </label>
          <input
            type="date"
            name="preferredDeliveryDate"
            value={formData.preferredDeliveryDate}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-[#B17457] focus:border-[#B17457]"
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#B17457] text-white py-2 px-4 rounded-md hover:bg-[#9A6349] disabled:opacity-50 transition-colors"
      >
        {loading ? "Submitting..." : "Place Order"}
      </button>
    </form>
  )
}

export default CustomOrderForm
