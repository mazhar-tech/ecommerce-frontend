import React, { useState } from 'react'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'
import { useStateContext } from '../context/StateContext'
import apiClient from '../lib/apiClient'
import { formatCurrencyCompact } from '../lib/currency'
import { HiOutlineChevronLeft } from 'react-icons/hi'

const Checkout = () => {
  const { cartItems, totalPrice, totalQty, setCartItems, setTotalPrice, setTotalQty } = useStateContext()
  const router = useRouter()
  
  const [userData, setUserData] = useState(null)
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: ''
  })
  
  // Check authentication and load user data on mount (client-side only)
  React.useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return
    
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    if (!isAuthenticated) {
      router.push({
        pathname: '/auth',
        query: { redirect: '/checkout' }
      })
      return
    }
    
    // Get user data from localStorage
    try {
      const data = localStorage.getItem('userData')
      if (data) {
        const parsedData = JSON.parse(data)
        setUserData(parsedData)
        
        // Initialize shipping info with user data
        const nameParts = parsedData?.name?.split(' ') || []
        setShippingInfo({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: parsedData?.email || '',
          phone: '',
          address: '',
          city: '',
          country: '',
          postalCode: ''
        })
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    }
  }, [router])
  
  const [paymentMethod, setPaymentMethod] = useState('cashOnDelivery')
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setShippingInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!')
      return
    }

    // Validate form
    if (!shippingInfo.firstName || !shippingInfo.lastName || !shippingInfo.email || 
        !shippingInfo.phone || !shippingInfo.address || !shippingInfo.city) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)

    try {
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
      
      // Create order data according to backend DTO
      const orderData = {
        userId: userData?.id || userData?._id || 'guest-user',
        customerName: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
        customerEmail: shippingInfo.email,
        customerPhone: shippingInfo.phone,
        items: cartItems.map(item => {
          const images = item.images || (item.image ? [item.image] : [])
          const imageUrl = apiClient.getImageUrl(images)
          
          return {
            productId: item._id,
            productName: item.name,
            productImage: imageUrl,
            quantity: item.quantity,
            price: item.price
          }
        }),
        subtotal: totalPrice,
        shippingCost: 0,
        tax: 0,
        total: totalPrice,
        paymentMethod: paymentMethod === 'card' ? 'credit_card' : 'cash_on_delivery',
        shippingAddress: {
          street: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.country || 'N/A',
          zipCode: shippingInfo.postalCode || 'N/A',
          country: shippingInfo.country || 'N/A'
        }
      }

      // Save order to backend (public endpoint, no auth required)
      const response = await fetch(`${baseURL}/orders`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        throw new Error('Failed to create order')
      }

      const savedOrder = await response.json()
      
      toast.success('Order placed successfully!')
      
      // Clear cart
      setCartItems([])
      setTotalPrice(0)
      setTotalQty(0)
      
      // Clear localStorage
      localStorage.removeItem('cartItems')
      localStorage.removeItem('totalPrice')
      localStorage.removeItem('totalQty')
      
      // Redirect to success page after a delay
      setTimeout(() => {
        router.push('/order-success')
      }, 1000)
      
    } catch (error) {
      toast.error('Failed to place order. Please try again.')
      console.error('Order error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-8 max-w-7xl px-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Add some products to your cart before checkout</p>
          <button 
            onClick={() => router.push('/products')}
            className="btn !px-3"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 max-w-7xl px-4">
      <button 
        onClick={() => router.back()}
        className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <HiOutlineChevronLeft size={20} />
        <span>Back to Cart</span>
      </button>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Shipping Information */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={shippingInfo.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={shippingInfo.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={shippingInfo.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={shippingInfo.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Address *</label>
                <input
                  type="text"
                  name="address"
                  value={shippingInfo.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Postal Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    value={shippingInfo.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              
              <div className="space-y-3">
                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cashOnDelivery"
                    checked={paymentMethod === 'cashOnDelivery'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">Cash on Delivery</div>
                    <div className="text-sm text-gray-600">Pay when your order arrives</div>
                  </div>
                </label>

                <label className="flex items-center p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-medium">Credit/Debit Card</div>
                    <div className="text-sm text-gray-600">Secure payment with card</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn py-4 text-lg"
            >
              {loading ? 'Processing...' : `Place Order - ${formatCurrencyCompact(totalPrice)}`}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => {
                const images = item.images || (item.image ? [item.image] : [])
                const imageUrl = apiClient.getImageUrl(images)
                
                return (
                  <div key={item._id} className="flex gap-3">
                    <img 
                      src={imageUrl} 
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-sm font-semibold">{formatCurrencyCompact(item.price * item.quantity)}</p>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({totalQty} items)</span>
                <span>{formatCurrencyCompact(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span>{formatCurrencyCompact(totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout

