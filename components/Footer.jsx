import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import logo from '../src/assets/Logo.png'
import {GrFacebookOption, GrTwitter, GrLinkedinOption} from 'react-icons/gr'

const Footer = () => {
  return (
    <footer>
      <div className='footer'>
        <div className='logo'>
          <Image src={logo} width={180} height={30} alt='logo' />
          <p>Small, artisan label that offers a thoughtfully curated collection of high quality everyday essentials made.</p>
          <div className='icon-container'>
            <div><GrTwitter size={20} /></div>
            <div><GrFacebookOption size={20} /></div>
            <div><GrLinkedinOption size={20} /></div>
          </div>
        </div>

        <div className='footer-links'>
          <h3>Company</h3>
          <ul>
            <li><Link href='/about' className='hover:underline cursor-pointer'>About</Link></li>
            <li><Link href='/terms-and-conditions' className='hover:underline cursor-pointer'>Terms of Use</Link></li>
            <li><Link href='/privacy-policy' className='hover:underline cursor-pointer'>Privacy Policy</Link></li>
            <li><Link href='/contact' className='hover:underline cursor-pointer'>Contact Us</Link></li>
          </ul>
        </div>

        <div className='footer-links'>
          <h3>Support</h3>
          <ul>
            <li><a href='https://wa.me/1234567890' target='_blank' rel='noopener noreferrer' className='hover:underline cursor-pointer'>Support Carrer</a></li>
            <li><a href='https://wa.me/1234567890' target='_blank' rel='noopener noreferrer' className='hover:underline cursor-pointer'>24h Service</a></li>
            <li><a href='https://wa.me/1234567890' target='_blank' rel='noopener noreferrer' className='hover:underline cursor-pointer'>Quick Chat (WhatsApp)</a></li>
          </ul>
        </div>

        <div className='footer-links'>
          <h3>Contact</h3>
          <ul>
            <li><a href='https://wa.me/1234567890' target='_blank' rel='noopener noreferrer' className='hover:underline cursor-pointer'>WhatsApp</a></li>
            <li><a href='https://wa.me/1234567890' target='_blank' rel='noopener noreferrer' className='hover:underline cursor-pointer'>Support 24h</a></li>
          </ul>
        </div>
      </div>

      <div className='copyright flex justify-between items-center'>
        <p>Copyright © {new Date().getFullYear()} <span className='font-bold'>  M.A Groups. &nbsp;
          </span>
         All rights reserved.
          </p>
        <div className='flex gap-6'>
          <Link href='/terms-and-conditions' className='text-gray-600 hover:text-gray-900 hover:underline transition-colors duration-200 underline-offset-4'>
            Terms and Conditions
          </Link>
          <Link href='/privacy-policy' className='text-gray-600 hover:text-gray-900 hover:underline transition-colors duration-200 underline-offset-4'>
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}

export default Footer