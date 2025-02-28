interface Order {
  id: string;
  status: string;
  estimatedBudget: string;
}

interface DashboardStatsProps {
  orders: Order[];
}

const DashboardStats = ({ orders }: DashboardStatsProps) => {
  const getStats = () => {
    const stats = {
      total: orders?.length || 0,
      pending: orders?.filter(o => o.status === 'pending').length || 0,
      inProgress: orders?.filter(o => o.status === 'in-progress').length || 0,
      completed: orders?.filter(o => o.status === 'completed').length || 0,
      totalEarnings: orders
        ?.filter(o => o.status === 'completed')
        .reduce((sum, order) => {
          // Safely parse the budget value
          const budget = order.estimatedBudget || '0'
          const numericValue = parseFloat(budget.replace(/[^0-9.]/g, '')) || 0
          return sum + numericValue
        }, 0) || 0
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
