import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';  // Use useNavigate instead of useHistory
import axios from 'axios';

const DeleteProduct = () => {
    const { id } = useParams();  // Retrieve the product ID from URL params
    const navigate = useNavigate();  // Use useNavigate for redirection
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch product details to display before deleting
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`https://e-commerce-server-alpha.vercel.app/products/clothings/`);

                setProduct(response?.data?.products);
            } catch (err) {
                setError('Error fetching product details');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    // Handle the deletion of the product
    const handleDelete = async (id) => {
        const confirmation = window.confirm("Are you sure you want to delete this product?");

        if (!confirmation) {
            return;
        }

        try {
            await axios.delete(`https://e-commerce-server-alpha.vercel.app/products/clothings/${id}`);
            alert('Product deleted successfully!');
            navigate('/products');
        } catch (err) {
            setError('Error deleting product');
        }
    };

    if (loading) return <div>Loading product details...</div>;
    if (error) return <div>{error}</div>;
    console.log(product);

    return (
        <div>
            <h2>Delete Product</h2>
            {product?.map(item => <div>
                <h3>Are you sure you want to delete the following product?</h3>
                <div className="product-details">
                    <img src={item?.thumbnailImage} alt={item?.name} className="h-20" />
                    <p><strong>Name:</strong> {item?.name}</p>
                    <p><strong>Category:</strong> {item?.category}</p>
                    <p><strong>Price:</strong> ${item?.price}</p>
                    <p><strong>Description:</strong>
                        <div
                            className="product-description"
                            dangerouslySetInnerHTML={{ __html: item.description }}
                        />
                    </p>
                </div>

                <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                >
                    Delete Product
                </button>
            </div>)
            };
        </div>)
}
export default DeleteProduct;
