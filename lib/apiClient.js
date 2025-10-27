// API client for connecting to the NestJS backend
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

class ApiClient {
  constructor() {
    this.baseURL = baseURL
  }

  // Fetch all active categories
  async getCategories() {
    try {
      const response = await fetch(`${this.baseURL}/categories?active=true`)
      if (!response.ok) throw new Error('Failed to fetch categories')
      return await response.json()
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  }

  // Fetch all categories (including inactive)
  async getAllCategories() {
    try {
      const response = await fetch(`${this.baseURL}/categories`)
      if (!response.ok) throw new Error('Failed to fetch categories')
      return await response.json()
    } catch (error) {
      console.error('Error fetching all categories:', error)
      return []
    }
  }

  // Fetch products by category
  async getProductsByCategory(categoryId) {
    try {
      const response = await fetch(`${this.baseURL}/products?category=${categoryId}`)
      if (!response.ok) throw new Error('Failed to fetch products')
      return await response.json()
    } catch (error) {
      console.error('Error fetching products:', error)
      return []
    }
  }

  // Fetch all products
  async getAllProducts() {
    try {
      const response = await fetch(`${this.baseURL}/products`)
      if (!response.ok) throw new Error('Failed to fetch products')
      return await response.json()
    } catch (error) {
      console.error('Error fetching products:', error)
      return []
    }
  }

  // Fetch a single product by ID
  async getProductById(productId) {
    try {
      const response = await fetch(`${this.baseURL}/products/${productId}`)
      if (!response.ok) throw new Error('Failed to fetch product')
      return await response.json()
    } catch (error) {
      console.error('Error fetching product:', error)
      return null
    }
  }

  // Fetch a single category by ID
  async getCategoryById(categoryId) {
    try {
      const response = await fetch(`${this.baseURL}/categories/${categoryId}`)
      if (!response.ok) throw new Error('Failed to fetch category')
      return await response.json()
    } catch (error) {
      console.error('Error fetching category:', error)
      return null
    }
  }

  // Helper function to get image URL for products
  getImageUrl(images) {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjI3MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg=='
    }
    
    const imageUrl = images[0]
    
    // If it's a Cloudinary URL or other external URL, use it directly
    if (imageUrl.startsWith('http')) {
      return imageUrl
    }
    
    // If it's a local path, use placeholder
    if (imageUrl.startsWith('/uploads/')) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjI3MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg=='
    }
    
    // If it's already a data URL, use it
    if (imageUrl.startsWith('data:')) {
      return imageUrl
    }
    
    // Default fallback
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjI3MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg=='
  }
}

export default new ApiClient()

