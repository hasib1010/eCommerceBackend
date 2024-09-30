import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios'; 
import sanitizeHtml from 'sanitize-html';

const UpdateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [newVariant, setNewVariant] = useState({ size: '', color: '', stock: 1 });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`https://e-commerce-server-alpha.vercel.app/products/clothings/${id}`);
        setProduct(response.data);
      } catch (err) {
        setError('Error fetching product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = {
        ...product,
        description: sanitizeHtml(product.description),
      };

      await axios.put(`https://e-commerce-server-alpha.vercel.app/products/clothings/${id}`, updatedProduct);
      navigate('/products'); // Redirect after successful update
    } catch (err) {
         console.log(err);
        
      setError('Error updating product');
    }
  };

  const handleDeleteVariant = async (variantId) => {
    try {
      const response = await axios.delete(`https://e-commerce-server-alpha.vercel.app/products/clothings/${product._id}/variants/${variantId}`);
      setProduct(response.data); 
    } catch (error) { 
      console.log(error);
      setError('Error deleting variant');
    }
  };

  const handleAddVariant = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`https://e-commerce-server-alpha.vercel.app/products/clothings/${product._id}/variants`, newVariant);
      setProduct(response.data); 
      setNewVariant({ size: '', color: '', stock: 1 }); // Reset new variant form
    } catch (error) {
      console.error(error);
      setError('Error adding variant');
    }
  };

  const handleVariantChange = (e) => {
    const { name, value } = e.target;
    setNewVariant((prev) => ({
      ...prev,
      [name]: name === 'stock' ? parseInt(value) : value, // Ensure stock is a number
    }));
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="update-product-form p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Update Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-4">
          <label className="block mb-1">Name:</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </div>
        <div className="form-group mb-4">
          <label className="block mb-1">Description:</label>
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </div>
        <div className="form-group mb-4">
          <label className="block mb-1">Category:</label>
          <input
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </div>
        <div className="form-group mb-4">
          <label className="block mb-1">Price:</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </div>
        <div className="form-group mb-4">
          <label className="block mb-1">Material:</label>
          <input
            type="text"
            name="material"
            value={product.material}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </div>
        <div className="form-group mb-4">
          <label className="block mb-1">Brand:</label>
          <input
            type="text"
            name="brand"
            value={product.brand}
            onChange={handleChange}
            required
            className="border p-2 w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">Update Product</button>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      <h3 className="text-xl font-semibold mt-6">Variants</h3>
      {product.variants.map((variant) => (
        <div key={variant._id} className="flex justify-between items-center border p-2 mt-2">
          <span>{variant.size} - {variant.color} (Stock: {variant.stock})</span>
          <button
            onClick={() => handleDeleteVariant(variant._id)}
            className="bg-red-500 text-white px-2 py-1 rounded"
          >
            Delete
          </button>
        </div>
      ))}

      <h3 className="text-xl font-semibold mt-6">Add New Variant</h3>
      <form onSubmit={handleAddVariant}>
        <div className="form-group mb-4">
          <label className="block mb-1">Size:</label>
          <input
            type="text"
            name="size"
            value={newVariant.size}
            onChange={handleVariantChange}
            required
            className="border p-2 w-full"
          />
        </div>
        <div className="form-group mb-4">
          <label className="block mb-1">Color:</label>
          <input
            type="text"
            name="color"
            value={newVariant.color}
            onChange={handleVariantChange}
            required
            className="border p-2 w-full"
          />
        </div>
        <div className="form-group mb-4">
          <label className="block mb-1">Stock:</label>
          <input
            type="number"
            name="stock"
            value={newVariant.stock}
            onChange={handleVariantChange}
            required
            className="border p-2 w-full"
          />
        </div>
        <button type="submit" className="bg-green-500 text-white p-2 rounded">Add Variant</button>
      </form>
    </div>
  );
};

export default UpdateForm;
