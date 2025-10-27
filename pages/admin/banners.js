import React, { useState, useEffect } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { withAdminAuth } from '../../context/AdminAuthContext'
import { Plus, Edit, Trash2, Upload, X, Image as ImageIcon } from 'lucide-react'
import fileUploadService from '../../lib/fileUploadService'
import toast from 'react-hot-toast'

const AdminBanners = () => {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    imageUrl: '',
    imageFile: null,
    promoCode: '',
      active: true,
      type: 'banner',
      order: 0,
      buttonText: '',
      buttonLink: '',
      discountPercent: 0,
      productName: '',
      originalPrice: '',
      salePrice: '',
      productId: '',
      layout: 'default',
      backgroundColor: '#D6D6D8',
      textColor: '#212121',
      imagePosition: 'right'
    })
  const [imagePreview, setImagePreview] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

  useEffect(() => {
    fetchBanners()
  }, [])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      console.log('Fetching banners from:', `${baseURL}/banners`)
      const response = await fetch(`${baseURL}/banners`)
      console.log('Response status:', response.status)
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error(`Failed to fetch banners: ${response.status}`)
      }
      const data = await response.json()
      console.log('Fetched banners:', data)
      setBanners(data)
    } catch (error) {
      console.error('Error fetching banners:', error)
      toast.error('Failed to load banners: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    try {
      fileUploadService.validateFile(file)
      setFormData({ ...formData, imageFile: file })
      const preview = await fileUploadService.previewFile(file)
      setImagePreview(preview)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsUploading(true)
    const token = localStorage.getItem('adminToken')

    try {
      let imageUrl = formData.imageUrl

      // Validate required fields for new banners
      if (!editingBanner) {
        if (!formData.title) {
          toast.error('Title is required')
          setIsUploading(false)
          return
        }
      }

      // Upload image if provided
      if (formData.imageFile) {
        const uploadResult = await fileUploadService.uploadFile(formData.imageFile, 'banner')
        imageUrl = uploadResult.url
      }

      // Image is optional, so no validation needed here

      const bannerData = {
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        imageUrl,
        promoCode: formData.promoCode,
        active: formData.active,
        type: formData.type,
        order: parseInt(formData.order) || 0,
        buttonText: formData.buttonText,
        buttonLink: formData.buttonLink,
        discountPercent: parseFloat(formData.discountPercent) || 0,
        productName: formData.productName,
        originalPrice: parseFloat(formData.originalPrice) || 0,
        salePrice: parseFloat(formData.salePrice) || 0,
        productId: formData.productId,
        layout: formData.layout || 'default',
        backgroundColor: formData.backgroundColor || '#D6D6D8',
        textColor: formData.textColor || '#212121',
        imagePosition: formData.imagePosition || 'right'
      }

      console.log('Submitting banner data:', bannerData)

      let response
      if (editingBanner) {
        response = await fetch(`${baseURL}/banners/${editingBanner._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(bannerData)
        })
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('Failed to update banner:', errorData)
          const errorMessage = errorData.message || errorData.error || 'Failed to update banner'
          throw new Error(errorMessage)
        }
        toast.success('Banner updated successfully!')
      } else {
        response = await fetch(`${baseURL}/banners`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(bannerData)
        })
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          console.error('Failed to create banner:', errorData)
          
          // Extract detailed error message
          let errorMessage = 'Failed to create banner'
          if (errorData.message) {
            errorMessage = errorData.message
          } else if (errorData.error) {
            errorMessage = errorData.error
          } else if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage = errorData.errors.map(e => e.message || e).join(', ')
          }
          
          throw new Error(errorMessage)
        }
        const createdBanner = await response.json()
        console.log('Created banner:', createdBanner)
        toast.success('Banner created successfully!')
      }

      setShowModal(false)
      setEditingBanner(null)
      resetForm()
      // Refresh the banners list
      await fetchBanners()
    } catch (error) {
      console.error('Banner submission error:', error)
      toast.error(error.message || 'An error occurred while saving the banner')
    } finally {
      setIsUploading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      description: '',
      imageUrl: '',
      imageFile: null,
      promoCode: '',
      active: true,
      type: 'banner',
      order: 0,
      buttonText: '',
      buttonLink: '',
      discountPercent: 0,
      productName: '',
      originalPrice: '',
      salePrice: '',
      productId: '',
      layout: 'default',
      backgroundColor: '',
      textColor: '',
      imagePosition: 'right'
    })
    setImagePreview(null)
  }

  const handleEdit = (banner) => {
    setEditingBanner(banner)
    setFormData({
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      imageUrl: banner.imageUrl || '',
      imageFile: null,
      promoCode: banner.promoCode || '',
      active: banner.active !== undefined ? banner.active : true,
      type: banner.type || 'banner',
      order: banner.order || 0,
      buttonText: banner.buttonText || '',
      buttonLink: banner.buttonLink || '',
      discountPercent: banner.discountPercent || 0,
        productName: banner.productName || '',
        originalPrice: banner.originalPrice || '',
        salePrice: banner.salePrice || '',
        productId: banner.productId || '',
        layout: banner.layout || 'default',
        backgroundColor: banner.backgroundColor || '',
        textColor: banner.textColor || '',
        imagePosition: banner.imagePosition || 'right'
      })
    setImagePreview(banner.imageUrl)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this banner?')) return

    try {
      const token = localStorage.getItem('adminToken')
      await fetch(`${baseURL}/banners/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      toast.success('Banner deleted successfully!')
      await fetchBanners()
    } catch (error) {
      toast.error('Error deleting banner')
    }
  }

  const openAddModal = () => {
    setEditingBanner(null)
    resetForm()
    setShowModal(true)
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Banners Management</h1>
            <p className="text-gray-600 mt-2">Manage promotional banners and featured products</p>
          </div>
          <button
            onClick={openAddModal}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={20} /> Add Banner
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading banners...</p>
            </div>
          ) : banners.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
              <p className="text-gray-500 mb-4">No banners found. Create your first banner!</p>
              <button
                onClick={openAddModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                <Plus className="inline mr-2" size={16} /> Add Banner
              </button>
            </div>
          ) : (
            banners.map((banner) => (
              <div key={banner._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={banner.imageUrl}
                    alt={banner.title}
                    className="w-full h-full object-cover"
                  />
                  {!banner.active && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                      Inactive
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {banner.type}
                    </span>
                    <span className="text-xs text-gray-500">Order: {banner.order}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{banner.title}</h3>
                  {banner.subtitle && <p className="text-sm text-gray-600">{banner.subtitle}</p>}
                  {banner.promoCode && (
                    <p className="text-xs text-gray-500 mt-2">Code: {banner.promoCode}</p>
                  )}
                </div>
                <div className="px-4 pb-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(banner)}
                    className="flex-1 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded text-sm"
                  >
                    <Edit className="inline mr-1" size={14} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded text-sm"
                  >
                    <Trash2 className="inline mr-1" size={14} /> Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">
                  {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                </h2>
                <button onClick={() => setShowModal(false)}>
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label>Type</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="banner">Banner</option>
                      <option value="featured">Featured Product</option>
                    </select>
                  </div>

                  <div>
                    <label>Order</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label>Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label>Subtitle</label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label>Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                      rows="3"
                    />
                  </div>

                  {formData.type === 'banner' && (
                    <>
                      <div className="md:col-span-2">
                        <label>Promo Code</label>
                        <input
                          type="text"
                          value={formData.promoCode}
                          onChange={(e) => setFormData({ ...formData, promoCode: e.target.value })}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>

                      <div>
                        <label>Button Text</label>
                        <input
                          type="text"
                          value={formData.buttonText}
                          onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>

                      <div>
                        <label>Button Link</label>
                        <input
                          type="text"
                          value={formData.buttonLink}
                          onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>

                      <div>
                        <label>Discount %</label>
                        <input
                          type="number"
                          value={formData.discountPercent}
                          onChange={(e) => setFormData({ ...formData, discountPercent: e.target.value })}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                    </>
                  )}

                  {formData.type === 'featured' && (
                    <>
                      <div>
                        <label>Product Name</label>
                        <input
                          type="text"
                          value={formData.productName}
                          onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>

                      <div>
                        <label>Product ID</label>
                        <input
                          type="text"
                          value={formData.productId}
                          onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>

                      <div>
                        <label>Original Price</label>
                        <input
                          type="number"
                          step="0.001"
                          value={formData.originalPrice}
                          onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>

                      <div>
                        <label>Sale Price</label>
                        <input
                          type="number"
                          step="0.001"
                          value={formData.salePrice}
                          onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                          className="w-full border rounded px-3 py-2"
                        />
                      </div>
                    </>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Banner Image</label>
                    
                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mb-4">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-48 h-48 object-cover rounded-lg border border-gray-300"
                        />
                      </div>
                    )}

                    {/* File Upload */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors duration-200">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                      />
                      <label 
                        htmlFor="image-upload" 
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          {imagePreview ? 'Change Image' : 'Click to upload image'}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          PNG, JPG, GIF up to 5MB
                        </span>
                      </label>
                    </div>

                    {/* Fallback URL input */}
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Or enter image URL</label>
                      <input
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => {
                          setFormData({ ...formData, imageUrl: e.target.value })
                          setImagePreview(e.target.value)
                        }}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>

                  {imagePreview && (
                    <div className="md:col-span-2">
                      <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded" />
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label>Layout Style</label>
                    <select
                      value={formData.layout}
                      onChange={(e) => setFormData({ ...formData, layout: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="default">Default</option>
                      <option value="compact">Compact</option>
                      <option value="split">Split (Text + Image)</option>
                      <option value="full-width">Full Width</option>
                      <option value="centered">Centered</option>
                    </select>
                  </div>

                  <div>
                    <label>Background Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={formData.backgroundColor || '#D6D6D8'}
                        onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                        className="w-16 h-10 rounded border"
                      />
                      <input
                        type="text"
                        value={formData.backgroundColor}
                        onChange={(e) => setFormData({ ...formData, backgroundColor: e.target.value })}
                        placeholder="#D6D6D8 or dark"
                        className="flex-1 border rounded px-3 py-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label>Text Color</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={formData.textColor || '#212121'}
                        onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                        className="w-16 h-10 rounded border"
                      />
                      <input
                        type="text"
                        value={formData.textColor}
                        onChange={(e) => setFormData({ ...formData, textColor: e.target.value })}
                        placeholder="#212121 or white"
                        className="flex-1 border rounded px-3 py-2"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label>Image Position</label>
                    <select
                      value={formData.imagePosition}
                      onChange={(e) => setFormData({ ...formData, imagePosition: e.target.value })}
                      className="w-full border rounded px-3 py-2"
                    >
                      <option value="left">Left</option>
                      <option value="right">Right</option>
                      <option value="top">Top</option>
                      <option value="bottom">Bottom</option>
                      <option value="center">Center</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                        className="mr-2"
                      />
                      Active
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
                  >
                    {isUploading ? 'Saving...' : editingBanner ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default withAdminAuth(AdminBanners)

