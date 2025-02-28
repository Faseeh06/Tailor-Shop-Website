import Image from "next/image"
import Link from "next/link"

interface GalleryItemProps {
  item: {
    id: number
    title: string
    image: string
    category: string
    price: string
    description: string
  }
}

const GalleryItem = ({ item }: GalleryItemProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <div className="relative h-64">
        <Image
          src={item.image}
          alt={item.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{item.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-[#B17457] font-bold">{item.price}</span>
          <Link
            href={`/custom-order?item=${item.id}`}
            className="bg-[#B17457] text-white px-4 py-2 rounded-md hover:bg-[#9A6349] transition-colors"
          >
            Order Custom
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GalleryItem
