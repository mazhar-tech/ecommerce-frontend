import React from 'react'
import Link from 'next/link'
import { getProductImageUrl } from '../lib/imageUtils'

const Product = ({product: {image, name, slug, price}}) => {
  return (
    <div>
      <Link href={`/product/${slug?.current || slug}`}>
        <div className='product-card'>
          <img 
            src={getProductImageUrl(image && image[0])} 
            width={380} 
            height={400} 
            className='product-image' 
            alt={name}
          />
          <p className='product-name'>{name}</p>
          <p className='product-price'>${price}</p>
        </div>
      </Link>
    </div>
  )
}

export default Product