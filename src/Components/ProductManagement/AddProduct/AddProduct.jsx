import React, { useState, useRef } from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const MySwal = withReactContent(Swal);

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        stock: '',
        sizes: [],
        colors: [],
        material: '',
        brand: '',
        tags: '',
        thumbnailImage: null,
        thumbnailHoverImage: null,
        discountAmount: '',
        discountValidUntil: '',
        catalogImages: [],
    });
    const [categories,] = useState(['T-Shirts', 'Jeans', 'Jackets', 'Hats']);
    const [sizes, setSizes] = useState(['S', 'M', 'L', 'XL', "XXL"]);
    const [colors, setColors] = useState(['Red', 'Blue', 'Green', 'Black', 'White', "Purple"]);
    const [brands, setBrands] = useState(['FabYoh', 'Adidas', 'Gucci', "Armani"]);

    const [newCategory, setNewCategory] = useState('');
    const [newSize, setNewSize] = useState('');
    const [newColor, setNewColor] = useState('');
    const [newBrand, setNewBrand] = useState('');

    const [showCategoryInput, setShowCategoryInput] = useState(false);
    const [showSizeInput, setShowSizeInput] = useState(false);
    const [showColorInput, setShowColorInput] = useState(false);
    const [showBrandInput, setShowBrandInput] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const quillRef = useRef();

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file') {
            if (name === 'catalogImages') {
                setFormData(prevData => ({
                    ...prevData,
                    catalogImages: [...files],
                }));
            } else {
                setFormData(prevData => ({
                    ...prevData,
                    [name]: files[0],
                }));
            }
        } else {
            setFormData(prevData => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleEditorChange = (value) => {
        setFormData(prevData => ({
            ...prevData,
            description: value,
        }));
    };

    const handleImageUpload = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch('https://api.imgbb.com/1/upload?key=82ff77cd3e7d27c63fdaf8824d1d2d3e', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Image upload failed');
        }

        const result = await response.json();
        return result.data.url;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const { thumbnailImage, thumbnailHoverImage, catalogImages, ...rest } = formData;

        try {
            MySwal.fire({
                title: 'Uploading...',
                text: 'Please wait while we upload your images.',
                allowOutsideClick: false,
                didOpen: () => {
                    MySwal.showLoading();
                }
            });

            const thumbnailImageUrl = thumbnailImage ? await handleImageUpload(thumbnailImage) : '';
            const hoverImageUrl = thumbnailHoverImage ? await handleImageUpload(thumbnailHoverImage) : '';

            const catalogImageUrls = await Promise.all(
                Array.from(catalogImages).map(file => handleImageUpload(file))
            );

            const dataToSubmit = {
                ...rest,
                thumbnailImage: thumbnailImageUrl,
                hoverImageUrl: hoverImageUrl,
                catalogImages: catalogImageUrls,
            };

            const response = await fetch('http://localhost:3000/products/clothings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataToSubmit),
            });

            if (response.ok) {
                MySwal.fire({
                    title: 'Success!',
                    text: 'Product added successfully.',
                    icon: 'success',
                });
            } else {
                MySwal.fire({
                    title: 'Error!',
                    text: 'Failed to add product.',
                    icon: 'error',
                });
            }
        } catch (error) {
            MySwal.fire({
                title: 'Error!',
                text: 'An error occurred while adding the product.',
                icon: 'error',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className='max-w-4xl mx-auto p-10 bg-white shadow-xl rounded-lg border border-gray-300'>
            <h2 className='text-4xl font-extrabold mb-8 text-center text-gray-800'>Add New Product</h2>

            {isSubmitting && (
                <div className='w-full flex items-center justify-center mt-4'>
                    <FontAwesomeIcon icon={faSpinner} className='h-6 w-6 text-blue-600 animate-spin' />
                    <span className='ml-2 text-gray-700'>Submitting...</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-8'>
                <div className='relative'>
                    <label className='block text-lg font-semibold text-gray-700 mb-2'>Product Name</label>
                    <input
                        type='text'
                        name='name'
                        value={formData.name}
                        onChange={handleChange}
                        placeholder='Enter product name'
                        className='p-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out'
                        required
                    />
                </div>

                <div className='relative'>
                    <label className='block text-lg font-semibold text-gray-700 mb-2'>Product Description</label>
                    <ReactQuill
                        ref={quillRef}
                        value={formData.description}
                        onChange={handleEditorChange}
                        className='border border-gray-300 rounded-lg w-full'
                        theme='snow'
                    />
                </div>

                <div className='relative'>
                    <label className='block text-lg font-semibold text-gray-700 mb-2'>Category</label>
                    <div className='flex items-center gap-2'>
                        <select
                            name='category'
                            value={formData.category}
                            onChange={handleChange}
                            className='p-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out'
                            required
                        >
                            <option value=''>Select Category</option>
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                        <button
                            type='button'
                            onClick={() => setShowCategoryInput(prev => !prev)}
                            className={`flex items-center px-4 py-2 rounded-lg shadow-md transition duration-300 ease-in-out ${showCategoryInput
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-orange-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            {showCategoryInput ? (
                                <>
                                    <FontAwesomeIcon icon={faTimes} className='h-5 w-5 ' />

                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faPlus} className='h-5 w-5  ' />
                                </>
                            )}
                        </button>
                    </div>
                    {showCategoryInput && (
                        <div className='flex items-center gap-2 mt-2'>
                            <input
                                type='text'
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder='Add new category'
                                className='p-3 border border-gray-300 rounded-lg w-full'
                            />
                            <button
                                type='button'
                                onClick={() => handleAddPreset('category', newCategory)}
                                className='bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out'
                            >
                                Add
                            </button>
                        </div>
                    )}
                </div>

                <div className='relative'>
                    <label className='block text-lg font-semibold text-gray-700 mb-2'>Price</label>
                    <input
                        type='number'
                        name='price'
                        value={formData.price}
                        onChange={handleChange}
                        placeholder='Enter product price'
                        className='p-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out'
                        required
                    />
                </div>

                <div className='relative'>
                    <label className='block text-lg font-semibold text-gray-700 mb-2'>Stock</label>
                    <input
                        type='number'
                        name='stock'
                        value={formData.stock}
                        onChange={handleChange}
                        placeholder='Enter stock quantity'
                        className='p-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out'
                        required
                    />
                </div>


                <div className='relative'>
                    <label className='block text-lg font-semibold text-gray-700 mb-2'>Available Sizes</label>
                    <div className='flex items-center gap-7'>
                        <div className='flex flex-wrap gap-4 '>
                            {sizes.map(size => (
                                <label key={size} className='inline-flex items-center cursor-pointer'>
                                    <input
                                        type='checkbox'
                                        name='sizes'
                                        value={size}
                                        checked={formData.sizes.includes(size)}
                                        onChange={handleChange}
                                        className='form-checkbox text-blue-500 transition duration-200 ease-in-out'
                                    />
                                    <span className='ml-2 text-gray-800'>{size}</span>
                                </label>
                            ))}
                        </div>
                        <button
                            type='button'
                            onClick={() => setShowSizeInput(prev => !prev)}
                            className={`flex items-center px-4 py-2 rounded-lg shadow-md transition duration-300 ease-in-out ${showSizeInput
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-orange-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            {showSizeInput ? (
                                <>
                                    <FontAwesomeIcon icon={faTimes} className='h-5 w-5 ' />

                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faPlus} className='h-5 w-5  ' />
                                </>
                            )}
                        </button>
                    </div>
                    {showSizeInput && (
                        <div className='flex items-center gap-2 mt-2'>
                            <input
                                type='text'
                                value={newSize}
                                onChange={(e) => setNewSize(e.target.value)}
                                placeholder='Add new size'
                                className='p-3 border border-gray-300 rounded-lg w-full'
                            />
                            <button
                                type='button'
                                onClick={() => handleAddPreset('size', newSize)}
                                className='bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out'
                            >
                                Add
                            </button>
                        </div>
                    )}
                </div>


                <div className='relative'>
                    <label className='block text-lg font-semibold text-gray-700 mb-2'>Available Colors</label>
                    <div className='flex items-center gap-2'>
                        <div className='flex flex-wrap gap-4'>
                            {colors.map(color => (
                                <label key={color} className='inline-flex items-center cursor-pointer'>
                                    <input
                                        type='checkbox'
                                        name='colors'
                                        value={color}
                                        checked={formData.colors.includes(color)}
                                        onChange={handleChange}
                                        className='form-checkbox text-blue-500 transition duration-200 ease-in-out'
                                    />
                                    <span className='ml-2 text-gray-800'>{color}</span>
                                </label>
                            ))}
                        </div>
                        <button
                            type='button'
                            onClick={() => setShowColorInput(prev => !prev)}
                            className={`flex items-center px-4 py-2 rounded-lg shadow-md transition duration-300 ease-in-out ${showColorInput
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-orange-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            {showColorInput ? (
                                <>
                                    <FontAwesomeIcon icon={faTimes} className='h-5 w-5 ' />

                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faPlus} className='h-5 w-5  ' />
                                </>
                            )}
                        </button>
                    </div>
                    {showColorInput && (
                        <div className='flex items-center gap-2 mt-2'>
                            <input
                                type='text'
                                value={newColor}
                                onChange={(e) => setNewColor(e.target.value)}
                                placeholder='Add new color'
                                className='p-3 border border-gray-300 rounded-lg w-full'
                            />
                            <button
                                type='button'
                                onClick={() => handleAddPreset('color', newColor)}
                                className='bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out'
                            >
                                Add
                            </button>
                        </div>
                    )}
                </div>

                <div className='relative'>
                    <label className='block text-lg font-semibold text-gray-700 mb-2'>Available Brands</label>
                    <div className='flex items-center gap-2'>
                        <select
                            name='brand'
                            value={formData.brand}
                            onChange={handleChange}
                            className='p-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out'
                        >
                            <option value=''>Select Brand</option>
                            {brands.map(brand => (
                                <option key={brand} value={brand}>{brand}</option>
                            ))}
                        </select>
                        <button
                            type='button'
                            onClick={() => setShowBrandInput(prev => !prev)}
                            className={`flex items-center px-4 py-2 rounded-lg shadow-md transition duration-300 ease-in-out ${showBrandInput
                                ? 'bg-red-600 text-white hover:bg-red-700'
                                : 'bg-orange-600 text-white hover:bg-blue-700'
                                }`}
                        >
                            {showBrandInput ? (
                                <>
                                    <FontAwesomeIcon icon={faTimes} className='h-5 w-5 ' />

                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faPlus} className='h-5 w-5  ' />
                                </>
                            )}
                        </button>
                    </div>
                    {showBrandInput && (
                        <div className='flex items-center gap-2 mt-2'>
                            <input
                                type='text'
                                value={newBrand}
                                onChange={(e) => setNewBrand(e.target.value)}
                                placeholder='Add new brand'
                                className='p-3 border border-gray-300 rounded-lg w-full'
                            />
                            <button
                                type='button'
                                onClick={() => handleAddPreset('brand', newBrand)}
                                className='bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-300 ease-in-out'
                            >
                                Add
                            </button>
                        </div>
                    )}
                </div>

                <div className='relative'>
                    <label className='block text-lg font-semibold text-gray-700 mb-2'>Material</label>
                    <input
                        type='text'
                        name='material'
                        value={formData.material}
                        onChange={handleChange}
                        placeholder='Enter material'
                        className='p-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out'
                    />
                </div>

                <div className='relative'>
                    <label className='block text-lg font-semibold text-gray-700 mb-2'>Tags</label>
                    <input
                        type='text'
                        name='tags'
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder='Enter tags (comma-separated)'
                        className='p-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out'
                    />
                </div>

                <div className='relative'>
                    <label className='block text-lg font-semibold text-gray-700 mb-2'>Thumbnail Image</label>
                    <input
                        type='file'
                        name='thumbnailImage'
                        onChange={handleChange}
                        className='p-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out'
                    />
                </div>
                <div className='relative'>
                    <label className='block text-lg font-semibold text-gray-700 mb-2'>Thumbnail Hover Image</label>
                    <input
                        type='file'
                        name='thumbnailHoverImage'
                        onChange={handleChange}
                        className='p-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out'
                    />
                </div>
                <div className='relative'>
                    <label className='block text-lg font-semibold text-gray-700 mb-2'>Catalog Images (Choose Multiple)</label>
                    <input
                        type='file'
                        name='catalogImages'
                        multiple
                        onChange={handleChange}
                        className='p-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out'
                    />
                </div>

                <div className='relative'>
                    <label className='block text-lg font-semibold text-gray-700 mb-2'>Discount Amount</label>
                    <input
                        type='number'
                        name='discountAmount'
                        value={formData.discountAmount}
                        onChange={handleChange}
                        placeholder='Enter discount amount'
                        className='p-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out'
                    />
                </div>

                <div className='relative'>
                    <label className='block text-lg font-semibold text-gray-700 mb-2'>Discount Valid Until</label>
                    <input
                        type='date'
                        name='discountValidUntil'
                        value={formData.discountValidUntil}
                        onChange={handleChange}
                        className='p-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out'
                    />
                </div>

                <button
                    type='submit'
                    className='px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out'
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Add Product'}
                </button>
            </form>
        </div>
    );
};


export default AddProduct;
