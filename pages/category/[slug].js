import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useMemo } from 'react'
import apiClient from '../../lib/apiClient'

const CategoryPage = () => {
  const router = useRouter()
  const { slug } = router.query
  const [products, setProducts] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return
      
      setLoading(true)
      try {
        // First, get all categories to find the one matching the slug
        const categories = await apiClient.getAllCategories()
        const matchedCategory = categories.find(cat => 
          cat.slug === slug || cat._id === slug
        )
        
        if (matchedCategory) {
          setCategory(matchedCategory)
          
          // Then fetch products for this category
          const categoryProducts = await apiClient.getProductsByCategory(matchedCategory._id)
          setProducts(categoryProducts)
        } else {
          // Category not found
          setCategory(null)
          setProducts([])
        }
      } catch (error) {
        console.error('Error fetching category data:', error)
        setCategory(null)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [slug])

  const imageUrl = useMemo(() => {
    return category?.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjI3MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg=='
  }, [category])

  const getProductImage = (productImages) => {
    return apiClient.getImageUrl(productImages)
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

  if (!category) {
    return (
      <div className="container mx-auto py-8 max-w-7xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Category not found</h2>
          <Link href="/products" className="text-blue-600 hover:underline">
            View all products
          </Link>
        </div>
      </div>
    )
  }

  return (
      <div className="container mx-auto py-8 max-w-7xl">
        {/* Category Header */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 md:p-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-3">{category.name}</h1>
              {category.description && (
                <p className="text-gray-600 text-lg mb-4">{category.description}</p>
              )}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {products.length} {products.length === 1 ? 'product' : 'products'}
                </span>
                {category.productCount > 0 && (
                  <span className="text-sm text-gray-500">
                    Total: {category.productCount}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600 mb-4">No products found in this category</p>
            <Link href="/products" className="text-blue-600 hover:underline">
              View all products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link 
                key={product._id} 
                href={`/product/${product._id}`}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200">
                  <div className="relative h-64 bg-gray-100">
                    <img
                      src={getProductImage(product.images)}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjI3MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg=='
                      }}
                    />
                    {product.stock === 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                        Out of Stock
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold text-blue-600">
                        {product.price.toFixed(3)} د.ك
                      </p>
                      {product.stock > 0 && (
                        <span className="text-xs text-gray-500">
                          Stock: {product.stock}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
  )
}

export default CategoryPage

