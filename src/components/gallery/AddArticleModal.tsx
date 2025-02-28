"use client"

import { useState } from 'react'
import Image from 'next/image'

interface AddArticleModalProps {
  onSubmit: (data: any) => Promise<void>
  onClose: () => void
  loading: boolean
}

const AddArticleModal = ({ onSubmit, onClose, loading }: AddArticleModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    imageUrl: ""
  })

  const [isValidImage, setIsValidImage] = useState(true)

  const validateImageUrl = (url: string) => {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null
  }

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setFormData(prev => ({ ...prev, imageUrl: url }))
    setIsValidImage(url === "" || validateImageUrl(url))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (!formData.title.trim() || !formData.price.trim() || !formData.category) {
        alert('Please fill in all required fields')
        return
      }

      if (formData.imageUrl && !validateImageUrl(formData.imageUrl)) {
        alert('Please enter a valid image URL (must end with .jpg, .jpeg, .png, or .gif)')
        return
      }

      await onSubmit(formData)
      onClose()
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Failed to add article. Please try again.')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          type="button"
        >
          ✕
        </button>
        <h2 className="text-xl font-bold mb-4">Add New Article</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full border rounded-md p-2"
              required
            >
              <option value="">Select category</option>
              <option value="suits">Suits</option>
              <option value="traditional">Traditional</option>
              <option value="casual">Casual</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border rounded-md p-2"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price (₹)</label>
            <input
              type="text"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className="w-full border rounded-md p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Image URL (Optional)
            </label>
            <input
              type="text"
              value={formData.imageUrl}
              onChange={handleImageUrlChange}
              placeholder="https://example.com/image.jpg"
              className={`w-full border rounded-md p-2 ${!isValidImage ? 'border-red-500' : ''}`}
            />
            {!isValidImage && (
              <p className="text-red-500 text-sm mt-1">
                Please enter a valid image URL (must end with .jpg, .jpeg, .png, or .gif)
              </p>
            )}
            {formData.imageUrl && isValidImage && (
              <div className="mt-2 relative h-48 bg-gray-100 rounded-md">
                <Image
                  src={formData.imageUrl}
                  alt="Preview"
                  fill
                  className="object-contain rounded-md"
                  onError={() => setIsValidImage(false)}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#B17457] text-white rounded-md hover:bg-[#9A6349] disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Article'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddArticleModal
