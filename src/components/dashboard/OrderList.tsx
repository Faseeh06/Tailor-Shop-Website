interface Order {
  id: string  // Changed from number to string to match Firestore document ID
  customerName: string
  orderDate: string
  status: string
  measurements: {
    chest: string
    waist: string
    hips: string
    shoulders: string
    sleeves: string
    length: string
    neck: string
  }
  itemType: string
  specifications: string
  price: string

  garmentType: string
  fabricChoice: string
  customInstructions: string
  preferredDeliveryDate: string
  estimatedBudget: string
  imageUrl?: string
  orderNumber: string
}

interface OrderListProps {
  orders: Order[]
  onStatusChange: (orderId: string, newStatus: string) => void  // Changed from number to string
}

const OrderList = ({ orders, onStatusChange }: OrderListProps) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order Details
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Measurements
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Details
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                <div className="text-sm text-gray-500">Order Date: {order.orderDate}</div>
                <p className="text-sm text-gray-500">Delivery by: {order.preferredDeliveryDate}</p>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{order.itemType}</div>
                <div className="text-sm text-gray-500">{order.specifications}</div>
                <div className="text-sm font-medium text-[#B17457]">{order.price}</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  <div>Chest: {order.measurements.chest}"</div>
                  <div>Waist: {order.measurements.waist}"</div>
                  <div>Hips: {order.measurements.hips}"</div>
                  <div>Shoulders: {order.measurements.shoulders}"</div>
                  <div>Sleeves: {order.measurements.sleeves}"</div>
                  <div>Length: {order.measurements.length}"</div>
                  <div>Neck: {order.measurements.neck}"</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <select
                  value={order.status}
                  onChange={(e) => onStatusChange(order.id, e.target.value)}
                  className="border rounded-md px-2 py-1 text-sm text-gray-700"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">
                  <p>Garment: {order.garmentType}</p>
                  <p>Fabric: {order.fabricChoice}</p>
                  {order.imageUrl && (
                    <img 
                      src={order.imageUrl} 
                      alt="Reference" 
                      className="w-20 h-20 object-cover rounded mt-2"
                    />
                  )}
                  
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrderList
