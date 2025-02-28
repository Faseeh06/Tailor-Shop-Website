import { Order } from '@/types/order'
import Image from 'next/image'

interface CustomOrderDisplayProps {
  order: Order
}

const CustomOrderDisplay = ({ order }: CustomOrderDisplayProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium text-gray-700 mb-4">Garment Details</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Type:</span> {order.garmentType}</p>
            <p><span className="font-medium">Fabric:</span> {order.fabricType}</p>
            <p><span className="font-medium">Color:</span> {order.color}</p>
            <p><span className="font-medium">Budget:</span> ₹{order.estimatedBudget}</p>
            <p><span className="font-medium">Delivery By:</span> {new Date(order.preferredDeliveryDate).toLocaleDateString()}</p>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-gray-700 mb-4">Measurements</h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(order.measurements).map(([key, value]) => (
              <p key={key}>
                <span className="font-medium capitalize">{key}:</span> {value}"
              </p>
            ))}
          </div>
        </div>
      </div>

      {order.specialInstructions && (
        <div className="mt-6">
          <h3 className="font-medium text-gray-700 mb-2">Special Instructions</h3>
          <p className="text-gray-600 whitespace-pre-wrap">{order.specialInstructions}</p>
        </div>
      )}

      {order.imageUrl && (
        <div className="mt-6">
          <h3 className="font-medium text-gray-700 mb-2">Reference Image</h3>
          <div className="relative h-48 w-48">
            <Image
              src={order.imageUrl}
              alt="Reference"
              fill
              className="object-cover rounded"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomOrderDisplay
