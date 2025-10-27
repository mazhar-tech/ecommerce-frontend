import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import event1 from '../src/assets/event1.png' 

const EventsBanner = () => {
  const [banners, setBanners] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/banners?active=true`)
        const data = await response.json()
        
        // Separate banners from featured products
        const regularBanners = data.filter(b => b.type === 'banner').sort((a, b) => (a.order || 0) - (b.order || 0))
        const featured = data.filter(b => b.type === 'featured').sort((a, b) => (a.order || 0) - (b.order || 0))
        
        console.log('Fetched banners:', regularBanners)
        console.log('Fetched featured products:', featured)
        
        setBanners(regularBanners)
        setFeaturedProducts(featured)
      } catch (error) {
        console.error('Error fetching banners:', error)
        // Fallback to default data
        setBanners([])
        setFeaturedProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [])

  const totalBanners = banners.length + featuredProducts.length

  // Don't render the section if there are no banners
  if (!loading && totalBanners === 0) {
    return null
  }

  return (
    <section className='event-container'>
      <div className='subtitle'>
        <span>PROMOTIONS</span>
        <h2>Our Promotions Events</h2>
      </div>

      <div className={`event-banner event-banner-${totalBanners || 4}`}>
        <div className='event-banner-left'>
          {banners[0] && (
                <div 
                  className={`event-card ${!banners[0].imageUrl ? 'no-image' : ''}`}
                  style={{
                    backgroundColor: banners[0].backgroundColor || '#D6D6D8',
                    color: banners[0].textColor || '#212121'
                  }}
                >
                  {banners[0].imageUrl ? (
                    <>
                      <div className='content'>
                        <h3 style={{ color: banners[0].textColor || '#212121' }}>{banners[0].title}</h3>
                        {banners[0].subtitle && <p style={{ color: banners[0].textColor || '#212121' }}>{banners[0].subtitle}</p>}
                      </div>
                      <img src={banners[0].imageUrl} alt={banners[0].title} className='event-banner-image' />
                    </>
                  ) : (
                    <div className='content'>
                      <h3 style={{ color: banners[0].textColor || '#212121' }}>{banners[0].title}</h3>
                      {banners[0].subtitle && <p style={{ color: banners[0].textColor || '#212121' }}>{banners[0].subtitle}</p>}
                    </div>
                  )}
                </div>
              )}
              {banners.length > 1 && banners[1] && (
                <div 
                  className={`event-card ${!banners[1].imageUrl ? 'no-image' : ''}`}
                  style={{
                    backgroundColor: banners[1].backgroundColor || '#212121',
                    color: banners[1].textColor || '#ffffff'
                  }}
                >
                  {banners[1].imageUrl && (
                    <>
                      <div className='content'>
                        <h3 style={{ color: banners[1].textColor || '#ffffff' }}>{banners[1].title}</h3>
                        {banners[1].subtitle && <p style={{ color: banners[1].textColor || '#ffffff' }}>{banners[1].subtitle || 'USE PROMO CODE'}</p>}
                        {banners[1].promoCode && (
                          <button style={{ 
                            backgroundColor: '#474747',
                            color: '#ffffff'
                          }}>{banners[1].promoCode}</button>
                        )}
                      </div>
                      <img src={banners[1].imageUrl} alt={banners[1].title} className='event-banner-image' />
                    </>
                  )}
                  {!banners[1].imageUrl && (
                    <>
                      <h3 style={{ color: banners[1].textColor || '#ffffff' }}>{banners[1].title}</h3>
                      <p style={{ color: banners[1].textColor || '#ffffff' }}>{banners[1].subtitle || 'USE PROMO CODE'}</p>
                      {banners[1].promoCode && (
                        <button style={{ 
                          backgroundColor: '#474747',
                          color: '#ffffff'
                        }}>{banners[1].promoCode}</button>
                      )}
                    </>
                  )}
                </div>
              )}
        </div>

        {totalBanners > 1 && (
          <div className='event-banner-right'>
              {featuredProducts[0] && (
                <div 
                  className={`event-banner-right-1 layout-${featuredProducts[0].layout || 'default'}`}
                  style={{
                    backgroundColor: featuredProducts[0].backgroundColor || '#EFE1C7'
                  }}
                >
                  <div className='details'>
                    <p style={{ color: featuredProducts[0].textColor || '#212121' }}>{featuredProducts[0].productName}</p>
                    <div className='price' style={{ color: featuredProducts[0].textColor || '#212121' }}>
                      {featuredProducts[0].originalPrice && (
                        <span>${featuredProducts[0].originalPrice}</span>
                      )}
                      {featuredProducts[0].salePrice && (
                        <span>${featuredProducts[0].salePrice}</span>
                      )}
                    </div>
                  </div>
                  {featuredProducts[0].imageUrl && (
                    <img src={featuredProducts[0].imageUrl} alt={featuredProducts[0].productName} className='event-banner-image' />
                  )}
                </div>
              )}
              {featuredProducts[1] && (
                <div 
                  className={`event-banner-right-2  layout-${featuredProducts[1].layout || 'default'}`}
                  style={{
                    backgroundColor: featuredProducts[1].backgroundColor || '#D7D7D9'
                  }}
                >
                  <div className='details '>
                    <p style={{ color: featuredProducts[1].textColor || '#212121' }}>{featuredProducts[1].productName}</p>
                    <div className='price' style={{ color: featuredProducts[1].textColor || '#212121' }}>
                      {featuredProducts[1].originalPrice && (
                        <span>${featuredProducts[1].originalPrice}</span>
                      )}
                      {featuredProducts[1].salePrice && (
                        <span>${featuredProducts[1].salePrice}</span>
                      )}
                    </div>
                  </div>
                  {featuredProducts[1].imageUrl && (
                    <img src={featuredProducts[1].imageUrl} alt={featuredProducts[1].productName} className='event-banner-image' />
                  )}
                </div>
              )}
          </div>
        )}
      </div>
    </section>
  )
}

export default EventsBanner