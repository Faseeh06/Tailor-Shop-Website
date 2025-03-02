"use client"

import { useState, useEffect } from 'react'
import { db, auth } from '@/lib/firebase'
import { collection, query, onSnapshot, deleteDoc, doc, addDoc } from 'firebase/firestore'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { GalleryItem } from '@/types/gallery'
import { getUserRole } from '@/utils/auth'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import AddArticleModal from './gallery/AddArticleModal'
import { useRouter } from 'next/navigation'
import { useSearchStore } from '@/store/searchStore'

const storage = getStorage()

const GalleryGrid = () => {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [addingArticle, setAddingArticle] = useState(false)

  const { searchQuery, sortBy, priceRange } = useSearchStore()

  const router = useRouter()

  useEffect(() => {
    setIsAdmin(getUserRole() === 'admin')
    
    // Subscribe to gallery items
    const unsubscribe = onSnapshot(
      query(collection(db, "gallery")),
      (snapshot) => {
        const galleryItems = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as GalleryItem))
        setItems(galleryItems)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching gallery items:", error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const handleDelete = async (itemId: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return
    
    try {
      await deleteDoc(doc(db, "gallery", itemId))
    } catch (error) {
      console.error("Error deleting item:", error)
      alert("Failed to delete item")
    }
  }

  const handleAddArticle = async (formData: any) => {
    try {
      setAddingArticle(true)

      const galleryItem = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        imageUrl: formData.imageUrl || '/images/no-image.png', // Use provided URL or default
        createdAt: new Date().toISOString()
      }

      await addDoc(collection(db, "gallery"), galleryItem)
      setShowAddModal(false)
    } catch (error) {
      console.error("Error adding article:", error)
      alert("Failed to add article. Please try again.")
    } finally {
      setAddingArticle(false)
    }
  }

  const handleOrderThis = (item: GalleryItem) => {
    // Store item details in localStorage to pass to custom order page
    localStorage.setItem('prefilledOrder', JSON.stringify({
      imageUrl: item.imageUrl,
      garmentType: item.category,
      estimatedBudget: item.price.toString(), // Ensure price is included
      price: item.price,  // Include both price and estimatedBudget
      description: item.description,
      title: item.title
    }))
    router.push('/custom-order')
  }

  // Filter and sort items
  const getFilteredAndSortedItems = () => {
    let filtered = items.filter(item => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase()
        if (!item.title.toLowerCase().includes(searchLower) &&
            !item.description.toLowerCase().includes(searchLower) &&
            !item.price.toString().includes(searchLower)) {
          return false
        }
      }

      // Price range filter
      if (priceRange) {
        const price = Number(item.price)
        const [min, max] = priceRange.split('-').map(Number)
        if (max) {
          if (price < min || price > max) return false
        } else {
          // For "5000+" case
          if (price < min) return false
        }
      }

      return true
    })

    // Sort items
    if (sortBy) {
      filtered.sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return Number(a.price) - Number(b.price)
          case 'price-high':
            return Number(b.price) - Number(a.price)
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          default:
            return 0
        }
      })
    }

    return filtered
  }

  const filteredItems = getFilteredAndSortedItems()

  if (loading) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      {/* Only show top button when there are items */}
      {isAdmin && items.length > 0 && (
        <div className="flex justify-end mb-6">
          <button
            onClick={() => setShowAddModal(true)}
            type="button"
            className="bg-[#B17457] text-white px-4 py-2 rounded-md hover:bg-[#9A6349]"
          >
            Add New Article
          </button>
        </div>
      )}

      {filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <p className="text-gray-500">
            {searchQuery ? 'No items match your search' : 'No items available'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="relative bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative h-64">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                {isAdmin && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-gray-600 mt-1">{item.description}</p>
                <p className="text-[#B17457] font-semibold mt-2">₹{item.price}</p>
                
                {/* Add Order Button */}
                <button
                  onClick={() => handleOrderThis(item)}
                  className="mt-4 w-full bg-[#B17457] text-white px-4 py-2 rounded-md hover:bg-[#9A6349] transition-colors"
                >
                  Order This Design
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAddModal && (
        <AddArticleModal
          onSubmit={handleAddArticle}
          onClose={() => setShowAddModal(false)}
          loading={addingArticle}
        />
      )}
    </div>
  )
}

export default GalleryGrid
