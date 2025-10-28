import React from 'react'
import Head from 'next/head'
import { Footer, Navbar, WhatsAppButton } from '../components'

const Layout = ({children}) => {
  return (
    <div className='layout'>
        <Head>
            <title>E-commerce</title>
        </Head>
        <header>
            <Navbar />
        </header>
        <main className='main-container'>
            {children}
        </main>
        <footer>
            <Footer />
        </footer>
        <WhatsAppButton phoneNumber='1234567890' />
    </div>
  )
}

export default Layout