import GalleryGrid from "@/components/GalleryGrid"
import GalleryFilters from "@/components/GalleryFilters"

export default function Gallery() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Our Collection</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64">
          <GalleryFilters />
        </aside>
        <main className="flex-1">
          <GalleryGrid />
        </main>
      </div>
    </div>
  )
}
