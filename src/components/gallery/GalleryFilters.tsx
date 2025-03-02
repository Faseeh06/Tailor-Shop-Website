"use client"

import { Search } from 'lucide-react'
import { useSearchStore } from '@/store/searchStore'

const GalleryFilters = () => {
  const { searchQuery, setSearchQuery, sortBy, setSortBy, priceRange, setPriceRange } = useSearchStore()

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md"
            placeholder="Search designs..."
          />
        </div>

        {/* Sort By */}
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="block w-full py-2 px-3 text-sm border border-gray-300 rounded-md"
          >
            <option value="">Sort By</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>

        {/* Price Range */}
        <div>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="block w-full py-2 px-3 text-sm border border-gray-300 rounded-md"
          >
            <option value="">Price Range</option>
            <option value="0-1000">Under ₹1,000</option>
            <option value="1000-3000">₹1,000 - ₹3,000</option>
            <option value="3000-5000">₹3,000 - ₹5,000</option>
            <option value="5000+">Above ₹5,000</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default GalleryFilters
