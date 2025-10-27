import React, { useState, useEffect } from 'react'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import { Eye } from 'lucide-react'
import { formatCurrencyCompact } from '../lib/currency'
import toast from 'react-hot-toast'

const MyOrders = () => {
  const router = useRouter()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Check authentication
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    const userData = JSON.parse(localStorage.getItem('userData') || '{}')

    if (!isAuthenticated) {
      // Store where user wanted to go before redirecting to login
      router.push({
        pathname: '/auth',
        query: { redirect: '/my-orders' }
      })
      return
    }

    // Check if userData has an id
    if (!userData || !userData.id) {
      toast.error('User data not found. Please login again.')
      router.push('/auth')
      return
    }

    fetchOrders()
  }, [router])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      const token = localStorage.getItem('access_token')
      const userDataString = localStorage.getItem('userData')
      
      if (!userDataString) {
        toast.error('User information not available. Please login again.')
        router.push('/auth')
        return
      }
      
      const userData = JSON.parse(userDataString)
      
      // Check if we have valid user ID
      if (!userData || !userData.id) {
        toast.error('User information not available. Please login again.')
        router.push('/auth')
        return
      }

      // Check if we have a valid token
      if (!token) {
        toast.error('Authentication required. Please login again.')
        router.push('/auth')
        return
      }
      
      const response = await fetch(`${baseURL}/orders?userId=${userData.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please login again.')
          localStorage.removeItem('isAuthenticated')
          localStorage.removeItem('userData')
          localStorage.removeItem('access_token')
          router.push('/auth')
          return
        }
        throw new Error('Failed to fetch orders')
      }
      
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 max-w-7xl">
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">My Orders</h1>
        <p className="text-gray-600">View and track your order history</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-xl text-gray-600 mb-4">No orders found</p>
    <div className="flex gap-4 flex-col lg:flex-row justify-center">
          <button 
            onClick={() => router.push('/products')}
            className="btn inline-block !px-3"
          >
            Start Shopping
          </button>
        </div>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold">{order.orderNumber}</h3>
                    <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                  </div>
                  <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {order.items.slice(0, 3).map((item, index) => (
                      <img
                        key={index}
                        src={item.productImage}
                        alt={item.productName}
                        className="w-12 h-12 rounded object-cover border-2 border-white"
                      />
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-12 h-12 rounded bg-gray-100 flex items-center justify-center text-xs border-2 border-white">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-gray-600">{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</p>
                    <p className="text-xl font-bold">{order.total?.toFixed(3) || '0.000'} د.ك</p>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedOrder(order)
                      setShowModal(true)
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 flex items-center gap-2"
                  >
                    <Eye size={16} />
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Order Details</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                ✕
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Order Number</h3>
                  <p className="text-lg font-semibold">{selectedOrder.orderNumber}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Order Status</h3>
                  <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Date</h3>
                  <p className="text-lg">{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Payment Method</h3>
                  <p className="text-lg capitalize">{selectedOrder.paymentMethod?.replace('_', ' ')}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-bold mb-4">Shipping Address</h3>
                <p className="text-lg">
                  {selectedOrder.shippingAddress?.street}<br />
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}<br />
                  {selectedOrder.shippingAddress?.zipCode}<br />
                  {selectedOrder.shippingAddress?.country}
                </p>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-bold mb-4">Order Items</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      <img 
                        src={item.productImage} 
                        alt={item.productName}
                        className="w-20 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{item.productName}</h4>
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-gray-600">Price: {item.price.toFixed(3)} د.ك per item</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{(item.price * item.quantity).toFixed(3)} د.ك</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-bold mb-4">Order Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">{selectedOrder.subtotal?.toFixed(3) || '0.000'} د.ك</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold">{selectedOrder.shippingCost || 0} د.ك</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 text-xl font-bold">
                    <span>Total</span>
                    <span>{selectedOrder.total?.toFixed(3) || '0.000'} د.ك</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-gray-50 px-6 py-4 border-t flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MyOrders

