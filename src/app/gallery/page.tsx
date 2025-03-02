import GalleryGrid from "@/components/GalleryGrid"
import GalleryFilters from "@/components/gallery/GalleryFilters"

export default function Gallery() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Collection</h1>
      <GalleryFilters />
      <GalleryGrid />
    </div>
  )
}
