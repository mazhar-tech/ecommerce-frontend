import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai'
import {CgShoppingCart} from 'react-icons/cg'
import toast from 'react-hot-toast'
import { useStateContext } from '../../context/StateContext';
import apiClient from '../../lib/apiClient';
import { formatCurrencyCompact } from '../../lib/currency';

const ProductDetails = () => {
    const router = useRouter()
    const { slug } = router.query
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [index, setIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const {decQty, incQty, qty, onAdd} = useStateContext();

    useEffect(() => {
        const fetchProduct = async () => {
            if (!slug) return
            
            try {
                const data = await apiClient.getProductById(slug)
                if (data) {
                    setProduct(data)
                }
            } catch (error) {
                console.error('Error fetching product:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchProduct()
    }, [slug])

    if (loading) {
        return (
            <div className="container mx-auto py-8 max-w-7xl ">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="container mx-auto py-8 max-w-7xl ">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Product not found</h2>
                    <Link href="/products" className="text-blue-600 hover:underline">
                        View all products
                    </Link>
                </div>
            </div>
        )
    }

    const images = product.images || []
    const name = product.name
    const description = product.description || ''
    const price = product.price
    const tags = product.category?.name || ''
    const details = product.details || {}
    const care = details.care || []
    const sizes = details.size || ['XS', 'S', 'M', 'L', 'XL']
    const colors = details.color || []
    
    // Helper function to get color value from color name
    const getColorValue = (colorName) => {
        const colorMap = {
            'red': '#FF0000',
            'blue': '#0000FF',
            'green': '#008000',
            'yellow': '#FFFF00',
            'orange': '#FFA500',
            'purple': '#800080',
            'pink': '#FFC0CB',
            'black': '#000000',
            'white': '#FFFFFF',
            'gray': '#808080',
            'grey': '#808080',
            'brown': '#A52A2A',
            'navy': '#000080',
            'maroon': '#800000',
            'teal': '#008080',
            'cyan': '#00FFFF',
            'lime': '#00FF00',
            'magenta': '#FF00FF',
            'silver': '#C0C0C0',
            'gold': '#FFD700',
            'beige': '#F5F5DC',
            'tan': '#D2B48C'
        };
        
        // Normalize color name
        const normalized = colorName.toLowerCase().trim();
        return colorMap[normalized] || colorName;
    };

    // Helper function similar to urlFor but for backend images
    const getImageUrl = (img) => {
        if (!img) return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg=='
        if (typeof img === 'string' && img.startsWith('http')) return img
        if (typeof img === 'string') return img
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg=='
    }

    // Handle care list - support both array of strings and complex objects
    const careList = care.map(item => {
        if (typeof item === 'string') return item
        if (item?.children?.[0]?.text) return item.children[0].text
        return item
    }).filter(Boolean)

    return (
        <div className='products'>
            <div className='product-detail-container'>
                <div className='product-images'>
                    <div className='small-images-container bg-gray-100 h-[100px] w-[100px]'>
                        {images.map((img, ind) => (
                            <img 
                                key={ind}
                                src={getImageUrl(img)} 
                                className='small-image h-[100px] w-[100px]' 
                                onMouseEnter={() => setIndex(ind)}
                                alt={`${name} view ${ind + 1}`}
                            />
                        ))}
                        {images.length === 0 && (
                            <div className='small-image flex items-center justify-center bg-gray-100'>
                                <span className='text-gray-400 text-xs'>No Image</span>
                            </div>
                        )}
                    </div>
                    <div className='big-image-container bg-gray-100'>
                        <img src={getImageUrl(images[index] || images[0])} alt={name} />
                    </div>
                </div>
                <div className='product-details'>
                    <div className='name-and-category'>
                        <h3>{name}</h3>
                        <span>{tags}</span>   
                    </div>
                    <div className='size'>
                        <p>SELECT SIZE</p>
                        <ul>
                            {sizes.map((size, i) => (
                                <li 
                                    key={i}
                                    onClick={() => setSelectedSize(size)}
                                    className={selectedSize === size ? 'selected' : ''}
                                >
                                    {size}
                                </li>
                            ))}
                        </ul>
                    </div>
                    {selectedSize && (
                        <div className='selected-size-info mt-4 p-2 bg-gray-100 rounded'>
                            <span className='text-sm text-gray-700'>Selected: <strong>{selectedSize}</strong></span>
                        </div>
                    )}
                    {colors.length > 0 && (
                        <div className='size'>
                            <p>SELECT COLOR</p>
                            <ul>
                                {colors.map((color, i) => {
                                    const colorValue = getColorValue(color);
                                    const isSelected = selectedColor === color;
                                    return (
                                        <li 
                                            key={i}
                                            onClick={() => setSelectedColor(color)}
                                            className={`color-swatch ${isSelected ? 'selected' : ''}`}
                                            style={{
                                                backgroundColor: colorValue,
                                                border: isSelected ? '3px solid #212121' : '3px solid #F1F1F1',
                                                position: 'relative'
                                            }}
                                            title={color}
                                        >
                                            {isSelected && <span className="checkmark">✓</span>}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                    {selectedColor && (
                        <div className='selected-color-info mt-2 p-2 bg-gray-100 rounded'>
                            <span className='text-sm text-gray-700'>Selected Color: <strong>{selectedColor}</strong></span>
                        </div>
                    )}
                    <div className='quantity-desc '>
                        <h4>Quantity:</h4>
                        <div className='quantity-control flex gap-2'>
                            <span className='plus' onClick={incQty}><AiOutlinePlus /></span>
                            <span className='num'>{qty}</span>
                            <span className='plus' onClick={decQty}><AiOutlineMinus /></span>
                        </div>
                    </div>
                    <div className='add-to-cart'>
                        <button 
                            className='btn' 
                            type='button' 
                            onClick={() => {
                                if (!selectedSize && sizes.length > 0) {
                                    toast.error('Please select a size');
                                    return;
                                }
                                if (!selectedColor && colors.length > 0) {
                                    toast.error('Please select a color');
                                    return;
                                }
                                // Add size and color to product before adding to cart
                                const productWithVariants = {
                                    ...product,
                                    selectedSize: selectedSize,
                                    selectedColor: selectedColor
                                };
                                onAdd(productWithVariants, qty);
                            }}
                            disabled={product.stock === 0}
                        >
                            <CgShoppingCart size={20} />Add to Cart
                        </button>
                        <p className='price'>{formatCurrencyCompact(price * qty)}</p>  
                    </div>
                </div>
            </div>

            <div className='product-desc-container'>
                <div className='desc-title'>
                    <div className="desc-background">
                        Overview
                    </div>
                    <h2>Product Information</h2>  
                </div>
                <div className='desc-details'>
                    <h4>PRODUCT DETAILS</h4>
                    <p>{description}</p>  
                </div>
                {careList.length > 0 && (
                    <div className='desc-care'>
                        <h4>PRODUCT CARE</h4>
                        <ul>
                            {careList.map((item, i) => (
                                <li key={i}>{item}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ProductDetails
