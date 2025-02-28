"use client"

import { useState } from "react"
import GalleryItem from "./GalleryItem"

// Mock data - replace with actual API call
const GALLERY_ITEMS = [
  {
    id: 1,
    title: "Classic Suit",
    image: "/images/2.png", // Add actual images to public folder
    category: "suits",
    price: "₹15,000",
    description: "Classic black formal suit with premium fabric"
  },
  {
    id: 2,
    title: "Wedding Sherwani",
    image: "/images/1.png",
    category: "traditional",
    price: "₹25,000",
    description: "Elegant wedding sherwani with detailed embroidery"
  },
  // Add more items as needed
]

const GalleryGrid = () => {
  const [items] = useState(GALLERY_ITEMS)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <GalleryItem key={item.id} item={item} />
      ))}
    </div>
  )
}

export default GalleryGrid
