interface Order {
  id: string  // Changed from number to string
  status: string
  price: string
}

interface DashboardStatsProps {
  orders: Order[]
}

const DashboardStats = ({ orders }: DashboardStatsProps) => {
  const getStats = () => {
    const stats = {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      inProgress: orders.filter(o => o.status === 'in-progress').length,
      completed: orders.filter(o => o.status === 'completed').length,
      totalEarnings: orders
        .filter(o => o.status === 'completed')
        .reduce((sum, order) => sum + parseInt(order.price.replace(/[^0-9]/g, '')), 0)
    }
    return stats
  }

  const stats = getStats()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-sm font-medium text-gray-500">Total Orders</div>
        <div className="mt-2 text-3xl font-bold text-gray-900">{stats.total}</div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-sm font-medium text-gray-500">Pending</div>
        <div className="mt-2 text-3xl font-bold text-yellow-600">{stats.pending}</div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-sm font-medium text-gray-500">In Progress</div>
        <div className="mt-2 text-3xl font-bold text-[#B17457]">{stats.inProgress}</div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-sm font-medium text-gray-500">Completed</div>
        <div className="mt-2 text-3xl font-bold text-green-600">{stats.completed}</div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-sm font-medium text-gray-500">Total Earnings</div>
        <div className="mt-2 text-3xl font-bold text-[#B17457]">
          ₹{stats.totalEarnings.toLocaleString()}
        </div>
      </div>
    </div>
  )
}

export default DashboardStats
