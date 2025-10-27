import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { AiOutlineCheckCircle } from 'react-icons/ai'
import { runConfetti } from '../lib/utils'

const OrderSuccess = () => {
  const router = useRouter()

  useEffect(() => {
    runConfetti()
  }, [])

  return (
    <div className="">
      <div className="success text-center">
        <div className="icon mb-6">
          <AiOutlineCheckCircle size={120} color="green" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Order Placed Successfully!</h1>
        <p className="description text-lg text-gray-600 mb-6">
          Thank you for your order. We have received your order and will begin processing it right away.
        </p>
        <p className="text-gray-500 mb-8">
          You will receive an email confirmation shortly with your order details and tracking information.
        </p>
        <div className="flex gap-4 flex-col lg:flex-row justify-center">
          <button 
            onClick={() => router.push('/products')}
            className="btn"
          >
            Continue Shopping
          </button>
          <button 
            onClick={() => router.push('/')}
            className="btn"
            style={{ backgroundColor: '#666', color: 'white' }}
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderSuccess

