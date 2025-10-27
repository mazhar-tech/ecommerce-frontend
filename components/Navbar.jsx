import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import {CiSearch} from 'react-icons/ci'
import {CgShoppingCart, CgProfile} from 'react-icons/cg'
import logo from '../src/assets/Logo.png'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import { useStateContext } from '../context/StateContext';
import apiClient from '../lib/apiClient';
import toast from 'react-hot-toast';

const Navbar = ({Searchproducts}) => {
  const {totalQty} = useStateContext();
  const router = useRouter()
  const [toggleMenu, setToggleMenu] = useState(false);
  const [categories, setCategories] = useState([]);
  const [userData, setUserData] = useState(null)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  // const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const data = localStorage.getItem('userData')
    if (data) {
      setUserData(JSON.parse(data))
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (!e.target.closest('.user-menu-container')) {
        setShowUserDropdown(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const handleCartClick = () => {
    router.push('/cart')
  }

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated')
    localStorage.removeItem('userData')
    localStorage.removeItem('access_token')
    toast.success('Logged out successfully')
    setUserData(null)
    router.push('/')
  }

  useEffect(() => {
    const fetchCategories = async () => {
      // Fetch all categories to find specific ones
      const data = await apiClient.getAllCategories();
      
      // Filter to show only Men, Women, and Children in navbar
      const mainCategories = data.filter(cat => {
        const name = cat.name.toLowerCase();
        return name === 'men' || name === 'women' || name === 'children' ||
               name === 'female' || name === 'male' || name === 'kids';
      });
      
      setCategories(mainCategories);
    };
    fetchCategories();
  }, []);

  return (
    <nav>
      <Link href='/'>
        <Image src={logo} width={140} height={25} alt='logo' />
      </Link>
      <ul className='nav-links'>
        <Link href='/'><li>Home</li></Link>
        {/* {categories.map((category) => (
          <Link key={category._id} href={`/category/${category.slug || category._id}`}>
            <li>{category.name}</li>
          </Link>
        ))} */}
        <Link href='/products'><li>All Products</li></Link>
        <Link href='/about'><li>About</li></Link>
        <Link href='/contact'><li>Contact Us</li></Link>
      </ul>

        <div className='search-bar'>
          <CiSearch />
          <input 
            type='text' 
            placeholder='What you looking for'/>
        </div>
        {/* onChange={(event) => {
              setSearchTerm(event.target.value);
          }} */}

      <div className="flex items-center gap-4">
        {userData ? (
          <div className="relative user-menu-container">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="cart hover:opacity-80 transition-opacity"
              style={{ position: 'relative' }}
            >
              <CgProfile size={22} />
            </button>
            
            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="text-sm font-semibold text-gray-900">{userData.name}</p>
                  <p className="text-xs text-gray-500">{userData.email}</p>
                </div>
                <Link href="/my-orders" onClick={() => setShowUserDropdown(false)}>
                  <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors">
                    <span style={{ fontWeight: 400, fontSize: '0.875rem', color: '#666666' }}>My Orders</span>
                  </div>
                </Link>
                <button
                  onClick={() => {
                    setShowUserDropdown(false)
                    handleLogout()
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  <span style={{ fontWeight: 400, fontSize: '0.875rem', color: '#666666' }}>Logout</span>
                </button>
              </div>
            )}
          </div>
        ) : null}
        <button className='cart' onClick={handleCartClick}> 
          <CgShoppingCart size={22} />
          <span className='cart-item-qty'>{totalQty}</span>
        </button>
      </div>

      <div className='navbar-smallscreen'>
        <RiMenu3Line color='black' fontSize={27} onClick={() => setToggleMenu(true)} />
        {toggleMenu && (
          <div className='navbar-smallscreen_overlay'>
            <Link href='/'>
              <Image className='logo-small' src={logo} width={140} height={25} alt='logo' />
            </Link>
            <RiCloseLine  color='black' fontSize={27} className='close_icon' onClick={() => setToggleMenu(false)} />
            <ul className='navbar-smallscreen_links'>
              <button className='cart-small-screen' onClick={handleCartClick}>   
                <CgShoppingCart size={22} />
                <span className='cart-item-qty'>{totalQty}</span> 
              </button> 
              <Link href='/'><li>Home</li></Link>
              {categories.map((category) => (
                <Link key={category._id} href={`/category/${category.slug || category._id}`}>
                  <li>{category.name}</li>
                </Link>
              ))}
              <Link href='/products'><li>All Products</li></Link>
              <Link href='/about'><li>About</li></Link>
              <Link href='/contact'><li>Contact Us</li></Link>
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar