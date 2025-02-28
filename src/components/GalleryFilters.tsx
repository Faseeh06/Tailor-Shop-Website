"use client"

const GalleryFilters = () => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4">Filters</h2>
      
      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Category</h3>
        <div className="space-y-2">
          {['All', 'Suits', 'Traditional', 'Casual', 'Formal'].map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-gray-700">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="font-medium mb-2">Price Range</h3>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="50000"
            step="1000"
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-600">
            <span>₹0</span>
            <span>₹50,000</span>
          </div>
        </div>
      </div>

      {/* Sort By */}
      <div>
        <h3 className="font-medium mb-2">Sort By</h3>
        <select className="w-full border-gray-300 rounded-md">
          <option>Newest First</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Most Popular</option>
        </select>
      </div>
    </div>
  )
}

export default GalleryFilters
