// Utility functions for handling different image sources

/**
 * Get the appropriate image URL based on the image data type
 * @param {string|object} img - Image data (string URL or Sanity image object)
 * @param {string} fallback - Fallback placeholder URL
 * @returns {string} - Resolved image URL
 */
export const getImageUrl = (img, fallback = null) => {
  const defaultFallback = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg=='
  
  if (!img) return fallback || defaultFallback
  
  // If it's a string (uploaded image URL), return as is
  if (typeof img === 'string') {
    // Check if it's already a full URL (Cloudinary or other external URLs)
    if (img.startsWith('http')) {
      return img
    }
    // If it's a local path, prepend the API URL
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    return `${baseURL}${img}`
  }
  
  // If it's a Sanity image object, use urlFor
  if (img._type === 'image' || img.asset) {
    const { urlFor } = require('./client')
    return urlFor(img).url()
  }
  
  return fallback || defaultFallback
}

/**
 * Get image URL for product cards
 * @param {string|object} img - Image data
 * @returns {string} - Resolved image URL
 */
export const getProductImageUrl = (img) => {
  return getImageUrl(img, '/api/placeholder/380/400')
}

/**
 * Get image URL for all products page
 * @param {string|object} img - Image data
 * @returns {string} - Resolved image URL
 */
export const getAllProductImageUrl = (img) => {
  return getImageUrl(img, '/api/placeholder/250/270')
}

/**
 * Get image URL for product detail page
 * @param {string|object} img - Image data
 * @returns {string} - Resolved image URL
 */
export const getProductDetailImageUrl = (img) => {
  return getImageUrl(img, '/api/placeholder/400/400')
}
