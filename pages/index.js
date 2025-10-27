import React, { useState, useEffect } from 'react'
import { HeroBanner, EventsBanner, Newsletter, FeaturesBanner } from '../components'
import { Navigation, A11y } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import apiClient from '../lib/apiClient'
import AllProducts from '../components/AllProducts'

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

const Home = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiClient.getAllProducts()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

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
    <>
      <HeroBanner />
      <EventsBanner />

      <div className='products-outer-container'>
        <div className='subtitle'>
          <span>PRODUCTS</span>
          <h2>Check What We Have</h2>
        </div>
        <Swiper
          breakpoints={{
              // width >= 300
              300: {
                slidesPerView: 1,
                spaceBetween: 20
              },
              // width >= 1000
              1000: {
                slidesPerView: 2,
                spaceBetween: 20
              },
              // width >= 1260
              1260: {
                slidesPerView: 3,
                spaceBetween: 20
              }
          }}
          modules={[Navigation, A11y]}
          spaceBetween={20}
          slidesPerView={3}
          navigation
        >
          {products?.map(product => (
            <SwiperSlide key={product._id}>
              <AllProducts allproducts={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <FeaturesBanner />
      <Newsletter />
    </>
  )
}

export default Home