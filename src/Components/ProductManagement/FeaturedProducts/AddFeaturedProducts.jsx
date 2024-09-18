import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const AddFeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(''); 
    const [categories, setCategories] = useState([]);

    // Fetch categories when the component mounts
    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:3000/products/clothings/categories');
            if (!response.ok) {
                throw new Error('Failed to fetch categories');
            }
            const result = await response.json();
            setCategories(result.categories || []);
            if (result.categories.length > 0) {
                setSelectedCategory(result.categories[0]); // Set default category to the first one
                fetchProducts(result.categories[0]); // Fetch products for the default category
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchProducts = async (category) => {
        const url = `http://localhost:3000/products/clothings?category=${category}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const result = await response.json();
            setProducts(result.products || []);
        } catch (error) {
            setError(error.message);
        }
    };

    const addToFeatured = async (productId) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/products/clothings/${productId}/featured`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isFeatured: true }),
            });

            if (!response.ok) {
                throw new Error('Failed to add product to featured');
            }

            const result = await response.json();
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: `Successfully added ${result.name} to featured products!`,
            });
            fetchProducts(selectedCategory);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const removeFromFeatured = async (productId) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:3000/products/clothings/${productId}/featured`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isFeatured: false }),
            });

            if (!response.ok) {
                throw new Error('Failed to remove product from featured');
            }

            const result = await response.json();
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: `Successfully removed ${result.name} from featured products!`,
            });
            fetchProducts(selectedCategory);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        fetchProducts(category);
    };

    useEffect(() => {
        fetchCategories(); // Fetch categories on mount
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="loader"></div>
            </div>
        );
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className='p-5'>
            <h2 className='text-2xl mb-4'>Manage Featured Products</h2>
            <div className="mb-4">
                {categories.map((category) => (
                    <button 
                        key={category} 
                        onClick={() => handleCategoryChange(category)} 
                        className='mr-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'>
                        {category}
                    </button>
                ))}
            </div>
            <div className='grid grid-cols-3 gap-4'>
                {products.map((product) => (
                    <div key={product._id} className='border border-gray-300 rounded p-4'>
                        <h3 className='font-bold'>{product.name}</h3>
                        <img src={product.thumbnailImage} alt={product.name} className='w-full mb-2' />

                        {product.isFeatured ? (
                            <button
                                onClick={() => removeFromFeatured(product._id)}
                                className='mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600'
                            >
                                Remove from Featured
                            </button>
                        ) : (
                            <button
                                onClick={() => addToFeatured(product._id)}
                                className='mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
                            >
                                Add to Featured
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AddFeaturedProducts;
