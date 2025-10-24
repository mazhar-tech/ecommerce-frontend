import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAdminAuth } from '../../context/AdminAuthContext'

const AdminIndex = () => {
  const router = useRouter()
  const { user, isLoading } = useAdminAuth()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.replace('/admin/dashboard')
      } else {
        router.replace('/admin/login')
      }
    }
  }, [user, isLoading, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirecting...</p>
      </div>
    </div>
  )
}

export default AdminIndex
