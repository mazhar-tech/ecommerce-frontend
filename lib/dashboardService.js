const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

class DashboardService {
  constructor() {
    this.baseURL = baseURL
    this.wsService = null
    this.isWebSocketEnabled = false
  }

  // Get authentication token
  getAuthToken() {
    return localStorage.getItem('adminToken')
  }

  // Initialize WebSocket service
  initWebSocket() {
    if (typeof window !== 'undefined') {
      import('./websocketService').then(module => {
        this.wsService = module.default
        this.isWebSocketEnabled = true
        this.setupWebSocketListeners()
      }).catch(error => {
        console.warn('WebSocket service not available:', error)
        this.isWebSocketEnabled = false
      })
    }
  }

  // Setup WebSocket event listeners
  setupWebSocketListeners() {
    if (!this.wsService) return

    this.wsService.subscribe('message', (data) => {
      if (data.type === 'dashboard_update') {
        this.handleDashboardUpdate(data.payload)
      }
    })

    this.wsService.subscribe('connected', () => {
      console.log('Dashboard WebSocket connected')
      // Request initial dashboard data
      this.wsService.send({ type: 'subscribe', channel: 'dashboard' })
    })

    this.wsService.subscribe('disconnected', () => {
      console.log('Dashboard WebSocket disconnected')
    })
  }

  // Handle real-time dashboard updates
  handleDashboardUpdate(payload) {
    // Emit custom event for dashboard components to listen to
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('dashboardUpdate', { 
        detail: payload 
      }))
    }
  }

  // Fetch dashboard statistics
  async getDashboardStats() {
    try {
      const token = this.getAuthToken()
      const response = await fetch(`${this.baseURL}/orders/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const orderStats = await response.json()
      
      // Fetch additional data
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch(`${this.baseURL}/products`),
        fetch(`${this.baseURL}/categories?active=true`)
      ])

      const products = await productsResponse.json()
      const categories = await categoriesResponse.json()

      // Calculate additional statistics
      const totalProducts = products.length
      const totalCategories = categories.length
      
      // Calculate sales data for charts (last 7 days)
      const salesData = await this.getSalesChartData()
      
      // Calculate category performance
      const categoryPerformance = await this.getCategoryPerformance(products)

      return {
        // Order statistics
        totalOrders: orderStats.totalOrders || 0,
        pendingOrders: orderStats.pendingOrders || 0,
        completedOrders: orderStats.completedOrders || 0,
        totalRevenue: orderStats.totalRevenue || 0,
        recentOrders: orderStats.recentOrders || [],
        
        // Product statistics
        totalProducts,
        totalCategories,
        
        // Chart data
        salesData,
        categoryPerformance,
        
        // Metadata
        lastUpdated: new Date().toISOString(),
        isRealTime: true
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
      throw error
    }
  }

  // Get sales chart data (mock implementation - replace with real API)
  async getSalesChartData() {
    // This would ideally come from a dedicated analytics endpoint
    // For now, we'll generate mock data based on recent orders
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    return days.map(day => ({
      day,
      sales: Math.floor(Math.random() * 30) + 20 // Mock data in KWD (smaller amounts)
    }))
  }

  // Get category performance data
  async getCategoryPerformance(products) {
    const categoryMap = {}
    
    products.forEach(product => {
      const categoryName = product.category?.name || 'Uncategorized'
      if (!categoryMap[categoryName]) {
        categoryMap[categoryName] = {
          name: categoryName,
          count: 0,
          totalValue: 0
        }
      }
      categoryMap[categoryName].count++
      categoryMap[categoryName].totalValue += product.price * product.stock
    })

    return Object.values(categoryMap).map(category => ({
      name: category.name,
      sales: category.totalValue,
      percentage: Math.round((category.count / products.length) * 100)
    }))
  }

  // Get recent orders with pagination
  async getRecentOrders(limit = 5) {
    try {
      const token = this.getAuthToken()
      const response = await fetch(`${this.baseURL}/orders?limit=${limit}&sort=createdAt:desc`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching recent orders:', error)
      throw error
    }
  }

  // Subscribe to real-time updates (WebSocket implementation)
  subscribeToUpdates(callback) {
    if (this.isWebSocketEnabled && this.wsService) {
      // Use WebSocket for real-time updates
      this.wsService.subscribe('message', (data) => {
        if (data.type === 'dashboard_update') {
          callback(data.payload)
        }
      })
      
      // Connect if not already connected
      if (!this.wsService.isConnected) {
        this.wsService.connect()
      }
      
      return () => {
        this.wsService.unsubscribe('message', callback)
      }
    } else {
      // Fallback to polling
      const interval = setInterval(async () => {
        try {
          const stats = await this.getDashboardStats()
          callback(stats)
        } catch (error) {
          console.error('Error in real-time update:', error)
        }
      }, 30000) // Update every 30 seconds

      return () => clearInterval(interval)
    }
  }

  // Get dashboard metrics with caching
  async getDashboardMetrics(useCache = true) {
    const cacheKey = 'dashboard-metrics'
    const cacheExpiry = 5 * 60 * 1000 // 5 minutes

    if (useCache) {
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < cacheExpiry) {
          return data
        }
      }
    }

    const data = await this.getDashboardStats()
    
    // Cache the data
    localStorage.setItem(cacheKey, JSON.stringify({
      data,
      timestamp: Date.now()
    }))

    return data
  }
}

export default new DashboardService()