import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DeleteProduct = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // Fetch all products from the API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://e-commerce-server-alpha.vercel.app/products/clothings');
                setProducts(response?.products);
                
            } catch (err) {
                setError('Error fetching products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Handle product deletion
    const handleDelete = async (id) => {
        const confirmation = window.confirm("Are you sure you want to delete this product?");
        if (!confirmation) return;

        try {
            await axios.delete(`https://e-commerce-server-alpha.vercel.app/products/clothings/${id}`);
            setProducts(products.filter(product => product._id !== id));  // Remove the deleted product from the state
            alert('Product deleted successfully!');
        } catch (err) {
            setError('Error deleting product');
        }
    };

    // Display loading or error message
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    
    return (
        <div className="product-list">
            <h2>Product List</h2>
            <table className="w-full">
                <thead>
                    <tr className="flex items-center justify-between">
                        <th>Image</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr className="flex items-center justify-between" key={product._id}>
                            {/* Product Image */}
                            <td>
                                <img className="h-20" src={product.thumbnailImage} alt={product.name} />
                            </td>
                            {/* Product Name */}
                            <td>{product.name}</td>
                            {/* Product Category */}
                            <td>{product.category}</td>
                            {/* Product Price */}
                            <td>${product.price}</td>
                            {/* Actions */}
                            <td>
                                {/* Link to Update Product */}
                                <Link to={`/products/update/${product._id}`}>
                                    <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Update</button>
                                </Link>
                                {/* Delete Button */}
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded"
                                    onClick={() => handleDelete(product._id)}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DeleteProduct;
