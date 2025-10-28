import React from 'react'
import { FaWhatsapp } from 'react-icons/fa'

const WhatsAppButton = ({ phoneNumber = '1234567890' }) => {
  return (
    <a
      href={`https://wa.me/${phoneNumber}`}
      target='_blank'
      rel='noopener noreferrer'
      className='fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-2xl group'
      aria-label='Chat with us on WhatsApp'
    >
      <FaWhatsapp size={32} />
      <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1 animate-pulse opacity-0 group-hover:opacity-100 transition-opacity'>
        1
      </span>
    </a>
  )
}

export default WhatsAppButton

