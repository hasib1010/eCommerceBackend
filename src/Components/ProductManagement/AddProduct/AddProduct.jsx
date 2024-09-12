import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';

const INITIAL_CATEGORIES = ['T-Shirts', 'Jeans', 'Jackets', 'Hats'];
const INITIAL_SIZES = ['S', 'M', 'L', 'XL'];
const INITIAL_COLORS = ['Red', 'Blue', 'Green', 'Black', 'White'];
const INITIAL_BRANDS = ['Brand A', 'Brand B', 'Brand C'];

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

    const [categories, setCategories] = useState(INITIAL_CATEGORIES);
    const [sizes, setSizes] = useState(INITIAL_SIZES);
    const [colors, setColors] = useState(INITIAL_COLORS);
    const [brands, setBrands] = useState(INITIAL_BRANDS);

    const [newCategory, setNewCategory] = useState('');
    const [newSize, setNewSize] = useState('');
    const [newColor, setNewColor] = useState('');
    const [newBrand, setNewBrand] = useState('');

    const [showCategoryInput, setShowCategoryInput] = useState(false);
    const [showSizeInput, setShowSizeInput] = useState(false);
    const [showColorInput, setShowColorInput] = useState(false);
    const [showBrandInput, setShowBrandInput] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'checkbox') {
            setFormData(prevData => {
                const updatedValues = prevData[name].includes(value)
                    ? prevData[name].filter(item => item !== value)
                    : [...prevData[name], value];

                return { ...prevData, [name]: updatedValues };
            });
        } else if (type === 'file') {
            if (name === 'catalogImages') {
                setFormData(prevData => ({
                    ...prevData,
                    catalogImages: [...files]
                }));
            } else {
                setFormData(prevData => ({
                    ...prevData,
                    [name]: files[0],
                }));
            }
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleAddPreset = (type, newValue) => {
        if (newValue.trim() === '') return;

        switch (type) {
            case 'category':
                setCategories(prev => [...prev, newValue]);
                setNewCategory('');
                break;
            case 'size':
                setSizes(prev => [...prev, newValue]);
                setNewSize('');
                break;
            case 'color':
                setColors(prev => [...prev, newValue]);
                setNewColor('');
                break;
            case 'brand':
                setBrands(prev => [...prev, newValue]);
                setNewBrand('');
                break;
            default:
                break;
        }
    };

    const handleFileUpload = async (files) => {
        const imageUrls = [];
        for (const file of files) {
            const imageFormData = new FormData();
            imageFormData.append('image', file);

            try {
                const imageResponse = await fetch('https://api.imgbb.com/1/upload?key=82ff77cd3e7d27c63fdaf8824d1d2d3e', {
                    method: 'POST',
                    body: imageFormData,
                });

                if (!imageResponse.ok) {
                    throw new Error('Image upload failed');
                }

                const imageResult = await imageResponse.json();
                imageUrls.push(imageResult.data.url);
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
        return imageUrls;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { thumbnailImage, thumbnailHoverImage, catalogImages, ...rest } = formData;

        try {
            const imageUrls = await handleFileUpload([thumbnailImage]);
            const hoverImageUrls = await handleFileUpload([thumbnailHoverImage]);
            const catalogImageUrls = await handleFileUpload(catalogImages);

            const dataToSubmit = {
                ...rest,
                thumbnailImage: imageUrls[0] || '',
                hoverImageUrl: hoverImageUrls[0] || '',
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
                console.log('Product added successfully');
            } else {
                console.error('Failed to add product');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className='max-w-4xl mx-auto p-10 bg-white shadow-xl rounded-lg border border-gray-300'>
            <h2 className='text-4xl font-extrabold mb-8 text-center text-gray-800'>Add New Product</h2>
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
                    <textarea
                        name='description'
                        value={formData.description}
                        onChange={handleChange}
                        placeholder='Enter product description'
                        className='p-4 border border-gray-300 rounded-lg w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-300 ease-in-out'
                        rows='4'
                        required
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
                    className='w-full px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition duration-300 ease-in-out'
                >
                    Add Product
                </button>
            </form>
        </div>
    );
};

export default AddProduct;
