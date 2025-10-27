import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Menu, 
  X, 
  LogOut,
  User,
  Tag,
  Shield,
  ImageIcon
} from 'lucide-react'

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const { user, logout } = useAdminAuth()

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'Banners', href: '/admin/banners', icon: ImageIcon },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  ]

  const isActive = (href) => {
    return router.pathname === href
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-slate-900">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
              <div className="flex-shrink-0 flex items-center px-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="ml-3 text-xl font-bold text-white">Admin Panel</h1>
                </div>
              </div>
              <nav className="mt-8 px-3 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link 
                      key={item.name} 
                      href={item.href}
                      className={`${
                        isActive(item.href)
                          ? 'bg-slate-700 text-white'
                          : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                      } group flex items-center px-3 py-3 text-sm font-medium rounded-md transition-all duration-200 w-full`}
                    >
                      <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      <span className="truncate">{item.name}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>
            <div className="flex-shrink-0 flex border-t border-slate-700 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 bg-gray-400 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">{user?.name || 'Admin User'}</p>
                  <button 
                    onClick={logout}
                    className="text-xs text-gray-400 hover:text-gray-300 flex items-center transition-colors duration-200"
                  >
                    <LogOut className="h-3 w-3 mr-1" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 bg-slate-900">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex border-b mb-5 py-4 items-center flex-shrink-0 px-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <h1 className="ml-3 text-xl font-bold text-white">Admin Panel</h1>
              </div>
            </div>
            <nav className="flex flex-col gap-2 mt-5 m-0 mx-2">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    className={`${
                      isActive(item.href)
                        ? 'bg-slate-700 text-white w-full py-4 '
                        : 'text-gray-300 w-full hover:bg-slate-700 hover:text-white py-4'
                    } group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200`}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-slate-700 p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-8 w-8 bg-gray-400 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{user?.name || 'Admin User'}</p>
                <button 
                  onClick={logout}
                  className="text-xs text-gray-400 hover:text-gray-300 flex items-center transition-colors duration-200"
                >
                  <LogOut className="h-3 w-3 mr-1" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        {/* Top bar */}
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Desktop top bar */}
        <div className="hidden md:block bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {isActive('/admin/dashboard') && 'Welcome back! Here\'s what\'s happening with your store today.'}
                {isActive('/admin/products') && 'Manage your product inventory and catalog'}
                {isActive('/admin/categories') && 'Organize your products into categories'}
                {isActive('/admin/orders') && 'View and manage customer orders'}
                {isActive('/admin/reports') && 'Track your business performance and analytics'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-gray-400 rounded-full flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name || 'Admin User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'admin@example.com'}</p>
                </div>
              </div>
              <button 
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center px-3 py-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign out
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
