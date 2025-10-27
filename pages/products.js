import React, { useState, useEffect } from 'react'
import { AllProducts } from '../components'
import apiClient from '../lib/apiClient'

const products = () => {
    const [allproducts, setAllproducts] = useState([])
    const [filteredProducts, setFilteredProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedCategory, setSelectedCategory] = useState('All')
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
    const [inStockOnly, setInStockOnly] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsData, categoriesData] = await Promise.all([
                    apiClient.getAllProducts(),
                    apiClient.getAllCategories()
                ])
                setAllproducts(productsData)
                setFilteredProducts(productsData)
                setCategories(categoriesData)
            } catch (error) {
                console.error('Error fetching data:', error)
                setAllproducts([])
                setFilteredProducts([])
                setCategories([])
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    // Apply filters whenever any filter changes
    useEffect(() => {
        let filtered = [...allproducts]

        // Filter by category
        if (selectedCategory !== 'All') {
            filtered = filtered.filter(product => 
                product.category?._id === selectedCategory || 
                product.category === selectedCategory
            )
        }

        // Filter by price range
        filtered = filtered.filter(product => 
            product.price >= priceRange.min && product.price <= priceRange.max
        )

        // Filter by stock
        if (inStockOnly) {
            filtered = filtered.filter(product => product.stock > 0)
        }

        setFilteredProducts(filtered)
    }, [allproducts, selectedCategory, priceRange, inStockOnly])

    // Calculate max price from products
    const maxPrice = allproducts.length > 0 ? Math.max(...allproducts.map(p => p.price)) : 10000

    if (loading) {
        return (
            <div className="container mx-auto py-8 max-w-7xl">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 max-w-7xl">
            <h1 className="text-3xl font-bold mb-6">All Products</h1>
            
            <div className="flex gap-8">
                {/* Sidebar Filters */}
                <aside className="w-64 flex-shrink-0">
                    <div className="bg-white p-6 rounded-lg shadow-md sticky top-20">
                        <h2 className="text-lg font-semibold mb-4">Filters</h2>
                        
                        {/* Price Range */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium mb-3 text-gray-700">Price Range</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">
                                        Min Price: {priceRange.min} د.ك
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max={maxPrice}
                                        step="0.1"
                                        value={priceRange.min}
                                        onChange={(e) => setPriceRange({ ...priceRange, min: parseFloat(e.target.value) })}
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">
                                        Max Price: {priceRange.max} د.ك
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max={maxPrice}
                                        step="0.1"
                                        value={priceRange.max}
                                        onChange={(e) => setPriceRange({ ...priceRange, max: parseFloat(e.target.value) })}
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Category Filter */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium mb-3 text-gray-700">Category</h3>
                            <div className="space-y-2">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="category"
                                        value="All"
                                        checked={selectedCategory === 'All'}
                                        onChange={(e) => setSelectedCategory('All')}
                                        className="mr-2"
                                    />
                                    <span className="text-sm">All Categories</span>
                                </label>
                                {categories.map((category) => (
                                    <label key={category._id} className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="category"
                                            value={category._id}
                                            checked={selectedCategory === category._id}
                                            onChange={(e) => setSelectedCategory(category._id)}
                                            className="mr-2"
                                        />
                                        <span className="text-sm">{category.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Stock Filter */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium mb-3 text-gray-700">Availability</h3>
                            <label className="flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={inStockOnly}
                                    onChange={(e) => setInStockOnly(e.target.checked)}
                                    className="mr-2"
                                />
                                <span className="text-sm">In Stock Only</span>
                            </label>
                        </div>

                        {/* Reset Filters */}
                        <button
                            onClick={() => {
                                setSelectedCategory('All')
                                setPriceRange({ min: 0, max: maxPrice })
                                setInStockOnly(false)
                            }}
                            className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                        >
                            Reset Filters
                        </button>

                        {/* Results Count */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                            <p className="text-xs text-gray-600">
                                Showing {filteredProducts.length} of {allproducts.length} products
                            </p>
                        </div>
                    </div>
                </aside>

                {/* Products Grid */}
                <div className="flex-1">
                    {/* Category Quick Filters */}
                    {categories.length > 0 && (
                        <div className="mb-6 flex flex-wrap gap-2">
                            <button 
                                className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                                    selectedCategory === 'All' 
                                        ? 'bg-blue-600 text-white' 
                                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                }`}
                                onClick={() => setSelectedCategory('All')}
                            >
                                All
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category._id}
                                    className={`px-4 py-2 rounded-lg transition-colors text-sm ${
                                        selectedCategory === category._id
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                                    }`}
                                    onClick={() => setSelectedCategory(category._id)}
                                >
                                    {category.name}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {filteredProducts?.length > 0 ? (
                            filteredProducts.map(prod => (
                                <AllProducts key={prod._id} allproducts={prod} />
                            ))
                        ) : (
                            <div className="col-span-full flex items-center justify-center min-h-[400px]">
                                <div className="text-center border border-gray-200 rounded-lg p-12 bg-gray-50 max-w-md w-full">
                                    <div className="mb-4">
                                        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                    </div>
                                    <p className="text-xl font-semibold text-gray-900 mb-2">No products found</p>
                                    <p className="text-sm text-gray-500">Try adjusting your filters to find what you're looking for</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default products
