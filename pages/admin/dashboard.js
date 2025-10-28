import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AdminLayout from '../../components/admin/AdminLayout'
import { withAdminAuth } from '../../context/AdminAuthContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { TrendingUp, Package, ShoppingCart, Users, DollarSign, RefreshCw, Wifi, WifiOff } from 'lucide-react'
import dashboardService from '../../lib/dashboardService'
import toast from 'react-hot-toast'
import { formatCurrencyCompact } from '../../lib/currency'

const AdminDashboard = () => {
  const router = useRouter()
  
  // State management
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [isOnline, setIsOnline] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [wsConnected, setWsConnected] = useState(false)

  // Fetch dashboard data
  const fetchDashboardData = async (showToast = false) => {
    try {
      setRefreshing(true)
      setError(null)
      
      const data = await dashboardService.getDashboardMetrics()
      setDashboardData(data)
      setLastUpdated(new Date())
      setIsOnline(true)
      
      if (showToast) {
        toast.success('Dashboard updated successfully!')
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err.message)
      setIsOnline(false)
      
      if (showToast) {
        toast.error('Failed to update dashboard data')
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Manual refresh
  const handleRefresh = () => {
    fetchDashboardData(true)
  }

  // Auto-refresh setup with WebSocket support
  useEffect(() => {
    fetchDashboardData()
    
    // Initialize WebSocket service
    dashboardService.initWebSocket()
    
    if (autoRefresh) {
      // Try WebSocket first, fallback to polling
      const unsubscribe = dashboardService.subscribeToUpdates((data) => {
        setDashboardData(data)
        setLastUpdated(new Date())
        setIsOnline(true)
      })
      
      return unsubscribe
    }
  }, [autoRefresh])

  // Listen for WebSocket dashboard updates
  useEffect(() => {
    const handleDashboardUpdate = (event) => {
      const data = event.detail
      setDashboardData(data)
      setLastUpdated(new Date())
      setIsOnline(true)
    }

    const handleWsConnected = () => {
      setWsConnected(true)
      setIsOnline(true)
    }

    const handleWsDisconnected = () => {
      setWsConnected(false)
    }

    window.addEventListener('dashboardUpdate', handleDashboardUpdate)
    window.addEventListener('wsConnected', handleWsConnected)
    window.addEventListener('wsDisconnected', handleWsDisconnected)
    
    return () => {
      window.removeEventListener('dashboardUpdate', handleDashboardUpdate)
      window.removeEventListener('wsConnected', handleWsConnected)
      window.removeEventListener('wsDisconnected', handleWsDisconnected)
    }
  }, [])

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      fetchDashboardData()
    }
    
    const handleOffline = () => {
      setIsOnline(false)
    }
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Generate stats array from real data
  const getStats = () => {
    if (!dashboardData) return []
    
    return [
      {
        title: 'Total Revenue',
        value: formatCurrencyCompact(dashboardData.totalRevenue),
        change: '+12.5%',
        changeType: 'positive',
        icon: DollarSign,
        color: 'text-green-600',
        bgColor: 'bg-green-50'
      },
      {
        title: 'Total Orders',
        value: dashboardData.totalOrders.toLocaleString(),
        change: '+8.3%',
        changeType: 'positive',
        icon: ShoppingCart,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50'
      },
      {
        title: 'Total Products',
        value: dashboardData.totalProducts.toLocaleString(),
        change: '+5.2%',
        changeType: 'positive',
        icon: Package,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50'
      },
      {
        title: 'Pending Orders',
        value: dashboardData.pendingOrders.toLocaleString(),
        change: dashboardData.pendingOrders > 0 ? 'Needs attention' : 'All clear',
        changeType: dashboardData.pendingOrders > 0 ? 'warning' : 'positive',
        icon: Users,
        color: dashboardData.pendingOrders > 0 ? 'text-orange-600' : 'text-green-600',
        bgColor: dashboardData.pendingOrders > 0 ? 'bg-orange-50' : 'bg-green-50'
      }
    ]
  }

  // Loading state
  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  // Error state
  if (error && !dashboardData) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <WifiOff className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Connection Error</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header with real-time controls */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-600 mt-2">Welcome back! Here&apos;s what&apos;s happening with your store today.</p>
            </div>
            
            {/* Real-time controls */}
            <div className="flex items-center space-x-4">
              {/* Connection status */}
              <div className="flex items-center space-x-2">
                {isOnline ? (
                  <div className="flex items-center text-green-600">
                    {wsConnected ? (
                      <>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                        <span className="text-sm font-medium">Real-time</span>
                      </>
                    ) : (
                      <>
                        <Wifi className="h-4 w-4" />
                        <span className="text-sm font-medium">Online</span>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center text-red-600">
                    <WifiOff className="h-4 w-4" />
                    <span className="text-sm font-medium">Offline</span>
                  </div>
                )}
              </div>
              
              {/* Last updated */}
              {lastUpdated && (
                <div className="text-sm text-gray-500">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </div>
              )}
              
              {/* Auto-refresh toggle */}
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={autoRefresh}
                  onChange={(e) => setAutoRefresh(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Auto-refresh</span>
              </label>
              
              {/* Manual refresh button */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="text-sm">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {getStats().map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                    <div className="flex items-center">
                      <TrendingUp className={`h-4 w-4 mr-1 ${
                        stat.changeType === 'positive' ? 'text-green-500' : 
                        stat.changeType === 'warning' ? 'text-orange-500' : 'text-red-500'
                      }`} />
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 
                        stat.changeType === 'warning' ? 'text-orange-600' : 'text-red-600'
                      }`}>{stat.change}</span>
                      {stat.changeType === 'positive' && (
                        <span className="text-xs text-gray-500 ml-1">vs last month</span>
                      )}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Weekly Sales</h3>
                <p className="text-sm text-gray-600">Daily sales performance</p>
              </div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp className="h-4 w-4 mr-1" />
                +12.5% from last week
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dashboardData?.salesData || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="sales" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Categories */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Categories</h3>
            <div className="space-y-4">
              {(dashboardData?.categoryPerformance || []).map((category, index) => {
                const colors = ['bg-blue-500', 'bg-pink-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500']
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]} mr-3`}></div>
                      <span className="text-sm font-medium text-gray-900">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">{formatCurrencyCompact(category.sales)}</div>
                      <div className="text-xs text-gray-500">{category.percentage}%</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(dashboardData?.recentOrders || []).length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                      No recent orders found
                    </td>
                  </tr>
                ) : (
                  (dashboardData?.recentOrders || []).map((order) => (
                    <tr key={order._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.userId?.name || order.userId?.email || 'Guest'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrencyCompact(order.total || 0)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          order.status === 'completed' ? 'bg-green-100 text-green-800' :
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default withAdminAuth(AdminDashboard)
