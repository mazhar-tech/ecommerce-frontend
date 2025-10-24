// File upload service for admin panel
class FileUploadService {
  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
  }

  // Upload single file
  async uploadFile(file, type = 'product') {
    console.log('FileUploadService: Starting upload', { fileName: file.name, fileSize: file.size, fileType: file.type, uploadType: type });
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    // Get auth token from localStorage
    const token = localStorage.getItem('adminToken')
    console.log('FileUploadService: Auth token available:', !!token);

    try {
      console.log('FileUploadService: Making request to:', `${this.baseURL}/upload`);
      const response = await fetch(`${this.baseURL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      })

      console.log('FileUploadService: Response status:', response.status);
      console.log('FileUploadService: Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('FileUploadService: Error response:', errorText);
        
        if (response.status === 401) {
          throw new Error('Authentication required. Please login again.')
        }
        throw new Error(`Upload failed: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      console.log('FileUploadService: Upload successful:', result);
      return result
    } catch (error) {
      console.error('FileUploadService: Upload error:', error)
      throw error
    }
  }

  // Upload multiple files
  async uploadMultipleFiles(files, type = 'product') {
    const uploadPromises = Array.from(files).map(file => 
      this.uploadFile(file, type)
    )
    
    try {
      const results = await Promise.all(uploadPromises)
      return results
    } catch (error) {
      console.error('Multiple file upload error:', error)
      throw error
    }
  }

  // Preview file before upload
  previewFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Validate file type and size
  validateFile(file, options = {}) {
    const {
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
      maxSize = 5 * 1024 * 1024, // 5MB
    } = options

    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not allowed`)
    }

    if (file.size > maxSize) {
      throw new Error(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds maximum ${(maxSize / 1024 / 1024).toFixed(2)}MB`)
    }

    return true
  }

  // Get file size in human readable format
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

export default new FileUploadService()
