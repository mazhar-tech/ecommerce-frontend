import React from 'react'
import Link from 'next/link'
import apiClient from '../lib/apiClient'

const Allproducts = ({ allproducts }) => {
  // Support both Sanity and backend data structures
  const image = allproducts.images || (allproducts.image ? [allproducts.image] : [])
  const name = allproducts.name
  const slug = allproducts._id || allproducts.slug?.current || allproducts.slug
  const tags = allproducts.tags || (allproducts.category ? allproducts.category.name : '')
  const price = allproducts.price
  const stock = allproducts.stock || 0
  const description = allproducts.description || ''

  const imageUrl = apiClient.getImageUrl(image)

  return (
    <div className='product-card-container'>
      <Link href={`/product/${slug}`}>
        <div className='product-card-simple'>
          {/* Image Area with Gray Background */}
          <div className='product-image-area'>
            <img 
              src={imageUrl} 
              alt={name}
              className='product-image-simple'
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjI3MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg=='
              }}
            />
          </div>
          
          {/* Product Details Area - White Background */}
          <div className='product-details-area'>
            <p className='product-name-simple'>{name}</p>
            <p className='product-price-simple'>{parseFloat(price).toFixed(3)} د.ك</p>
            {stock === 0 && (
              <span className='out-of-stock-badge'>Out of Stock</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default Allproducts