import React from 'react'
import { useRouter } from 'next/router'
import { Toaster } from 'react-hot-toast'
import '../styles/globals.css'
import { Layout } from '../components'
import { StateContext } from '../context/StateContext'
import { AdminAuthProvider } from '../context/AdminAuthContext'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const isAdminPage = router.pathname.startsWith('/admin')

  return (
    <StateContext>
      <AdminAuthProvider>
        {isAdminPage ? (
          <>
            <Toaster />
            <Component {...pageProps} />
          </>
        ) : (
          <Layout>
            <Toaster />
            <Component {...pageProps} />
          </Layout>
        )}
      </AdminAuthProvider>
    </StateContext>
  )
}
