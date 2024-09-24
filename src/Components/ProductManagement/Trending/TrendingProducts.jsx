import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

const TrendingProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('https://e-commerce-server-alpha.vercel.app/products/clothings');
                if (!response.ok) throw new Error('Failed to fetch products');

                const data = await response.json();
                console.log(data); // Log the data to check its structure

                // Access the products array from the response
                if (!Array.isArray(data.products)) {
                    throw new Error('Fetched data.products is not an array');
                }
                setProducts(data.products);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: error.message,
                });
            }
        };

        fetchProducts();
    }, []);

    const Toast = Swal.mixin({
        toast: true,
        position: 'center',
        iconColor: 'white',
        customClass: {
            popup: 'colored-toast',
        },
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
    });

    const toggleTrending = async (productId, currentIsTrending) => {
        const newIsTrending = !currentIsTrending;

        try {
            const response = await fetch(`https://e-commerce-server-alpha.vercel.app/products/clothings/${productId}/trending`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isTrending: newIsTrending }),
            });

            if (!response.ok) {
                throw new Error('Failed to update trending status');
            }

            const updatedProduct = await response.json();
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product._id === updatedProduct._id ? updatedProduct : product
                )
            );

            await Toast.fire({
                icon: 'success',
                title: `Product is now ${newIsTrending ? 'Trending' : 'Not Trending'}`,
            });
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message,
            });
        }
    };

    const [expandedProductIds, setExpandedProductIds] = useState([]);

    const toggleDescription = (productId) => {
        setExpandedProductIds((prev) =>
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    return (
        <div className='grid grid-cols-4 gap-10 p-10'>
            {products.length === 0 ? (
                <p className='text-gray-500'>No products available.</p>
            ) : (
                products.map((product) => (
                    <div
                        key={product._id}
                        className={`  bg-white shadow-lg rounded-lg flex flex-col items-center p-5 border ${expandedProductIds.includes(product._id) ? "col-span-4" : "col-span-1"}`}
                    >
                        <h3 className='text-lg font-bold mb-4'>{product?.name}</h3>
                        <img src={product?.catalogImages[3] || product.thumbnailImage} alt={product.name} />
                        <button
                            onClick={() => toggleDescription(product?._id)}
                            className='mt-2 px-4 py-1 text-blue-500 hover:underline'
                        >
                            {expandedProductIds.includes(product?._id) ? 'Read Less' : 'Read Descriptions'}
                        </button>
                        {expandedProductIds.includes(product?._id) && (
                            <div className='mt-2' dangerouslySetInnerHTML={{ __html: product.description }} />
                        )}
                        <p className='mt-2'>{product?.isTrending ? 'Trending' : 'Not Trending'}</p>
                        <button
                            onClick={() => toggleTrending(product?._id, product?.isTrending)}
                            className={`mt-5 px-4 py-2 rounded-lg shadow ${
                                product?.isTrending ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
                            } text-white`}
                        >
                            {product?.isTrending ? 'Set as Not Trending' : 'Set as Trending'}
                        </button>
                    </div>
                ))
            )}
        </div>
    );
};

export default TrendingProducts;
