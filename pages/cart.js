import React, { useRef } from 'react';
import { useRouter } from 'next/router';
import { AiOutlineMinus, AiOutlinePlus, AiOutlineShopping } from 'react-icons/ai';
import {HiOutlineTrash} from 'react-icons/hi'
import toast from 'react-hot-toast';
import { useStateContext } from '../context/StateContext';
import apiClient from '../lib/apiClient';
import { formatCurrencyCompact } from '../lib/currency';

const Cart = () => {
  const cartRef = useRef();
  const router = useRouter();
  const {cartItems, totalPrice, totalQty, onRemove, toggleCartItemQuantity} = useStateContext();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty!')
      return
    }
    
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem('isAuthenticated')
    
    if (!isAuthenticated) {
      // Redirect to auth page with return path
      router.push('/auth')
    } else {
      router.push('/checkout')
    }
  }

  return (
    <div className='cart-wrapper' ref={cartRef}>
      <h2>Shopping Cart</h2>
      <div className='cart-container'>
        <div className='cart-items'>
          {cartItems.length < 1 && (
            <div className='empty-cart'>
              <AiOutlineShopping size={150} />
              <h1>Your shopping bag is empty</h1>
            </div>
          )}

          {cartItems.length >= 1 && cartItems.map((item) => {
            // Handle both old and new image structures
            const images = item.images || (item.image ? [item.image] : [])
            const imageUrl = apiClient.getImageUrl(images)
            
            return (
              <div key={item._id} className='item-card'>
                <div className='item-image bg-gray-100 '>
                  <img src={imageUrl} alt={item.name} />
                </div>
                <div className='item-details'>
                  <div className='name-and-remove'>
                    <h3>{item.name}</h3>  
                    <button type='button' onClick={() => onRemove(item)} className='remove-item'>
                      <HiOutlineTrash size={28} />  
                    </button>
                  </div>
                  {/* Show selected size and color if available */}
                  {(item.selectedSize || item.selectedColor) && (
                    <div className='item-variants mt-2 flex gap-2'>
                      {item.selectedSize && (
                        <span className='variant-badge px-2 py-1 bg-gray-200 rounded text-sm'>
                          Size: {item.selectedSize}
                        </span>
                      )}
                      {item.selectedColor && (
                        <span className='variant-badge px-2 py-1 bg-gray-200 rounded text-sm'>
                          Color: {item.selectedColor}
                        </span>
                      )}
                    </div>
                  )}
                  {/* <p className='item-tag'>{item.category?.name || item.tags || 'Product'}</p> */}
                  <p className='delivery-est'>Delivery Estimation</p>
                  <p className='delivery-days'>5 Working Days</p>
                  <div className='price-and-qty'>
                    <span className='price'>{formatCurrencyCompact(item.price * item.quantity)}</span>  
                    <div className='flex gap-2'>
                      <span className='plus' onClick={() => toggleCartItemQuantity(item._id, 'inc')}><AiOutlinePlus /></span>
                      <span className='num'>{item.quantity}</span>
                      <span className='plus' onClick={() => toggleCartItemQuantity(item._id, 'dec')}><AiOutlineMinus /></span>
                    </div>   
                  </div>
                </div>
              </div>
            )
          })}    
        </div>

        {cartItems.length >= 1 && (
        <div className='order-summary'>
          <h3>Order Summary</h3>
          <div className='qty'>
            <p>Quantity</p>
            <span>{totalQty} Product</span>
          </div>
          <div className='subtotal'>
            <p>Sub Total</p>
            <span>{formatCurrencyCompact(totalPrice)}</span>
          </div>
          {/* <div className='total'>
            <p>Total</p>
            <span>${totalPrice}</span>
          </div>  */}
          <div>
            <button className='btn' type='button' onClick={handleCheckout}>Process to Checkout</button>
          </div>         
        </div>
        )}  

      </div>
    </div>
  )
}

export default Cart