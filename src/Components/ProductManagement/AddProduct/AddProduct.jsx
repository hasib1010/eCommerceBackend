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
        variants: [],
        material: '',
        brand: '',
        tags: '',
        thumbnailImage: null,
        thumbnailHoverImage: null,
        discountAmount: '',
        discountValidUntil: '',
        catalogImages: [],
    });
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [stock, setStock] = useState(0);

    const [categories, setCategories] = useState(['T-Shirts', 'Jeans', 'Jackets', 'Hats']);
    const [sizes, setSizes] = useState(['S', 'M', 'L', 'XL', "XXL"]);
    const [colors, setColors] = useState(['Red', 'Blue', 'Green', 'Black', 'White', "Purple"]);
    const [brands, setBrands] = useState(['FabYoh', 'Adidas', 'Gucci', "Armani"]);
    const handleAddVariant = () => {
        if (selectedSize && selectedColor && stock >= 0) {
            const newVariant = {
                size: selectedSize,
                color: selectedColor,
                stock: parseInt(stock),
            };
            setFormData(prevData => ({
                ...prevData,
                variants: [...prevData.variants, newVariant],
            }));
            // Reset fields after adding
            setSelectedSize('');
            setSelectedColor('');
            setStock(0);
        } else {
            MySwal.fire({
                title: 'Error!',
                text: 'Please select size, color, and provide a valid stock amount.',
                icon: 'error',
            });
        }
    };
    const handleDeleteVariant = (index) => {
        setFormData(prevData => {
            const updatedVariants = prevData.variants.filter((_, i) => i !== index);
            return { ...prevData, variants: updatedVariants };
        });
    };

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

    const handleAddPreset = (type, value) => {
        if (value.trim() === '') {
            MySwal.fire({
                title: 'Error!',
                text: 'Please enter a valid value.',
                icon: 'error',
            });
            return;
        }

        switch (type) {
            case 'category':
                setCategories(prev => [...prev, value]);
                setFormData(prev => ({ ...prev, category: value }));
                setNewCategory('');
                break;
            case 'size':
                setSizes(prev => [...prev, value]);
                setFormData(prev => ({
                    ...prev,
                    variants: prev.variants.map(variant => ({
                        ...variant,
                        sizes: [...(variant.sizes || []), value], // Ensure sizes is an array
                    })),
                }));
                setNewSize('');
                break;
            case 'color':
                setColors(prev => [...prev, value]);
                setFormData(prev => ({
                    ...prev,
                    variants: prev.variants.map(variant => ({
                        ...variant,
                        colors: [...(variant.colors || []), value], // Ensure colors is an array
                    })),
                }));
                setNewColor('');
                break;
            case 'brand':
                setBrands(prev => [...prev, value]);
                setNewBrand('');
                break;
            default:
                break;
        }
    };


    // In your JSX for sizes and colors, just ensure you call this function correctly


    const handleChange = (e) => {
        const { name, value, type, files, checked } = e.target;

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
        } else if (type === 'checkbox') {
            const isChecked = checked;
            const updateArray = (array) => {
                if (isChecked) {
                    return [...array, value];
                } else {
                    return array.filter(item => item !== value);
                }
            };

            if (name === 'sizes') {
                setFormData(prevData => ({
                    ...prevData,
                    sizes: updateArray(prevData.sizes),
                }));
            } else if (name === 'colors') {
                setFormData(prevData => ({
                    ...prevData,
                    colors: updateArray(prevData.colors),
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
                                <FontAwesomeIcon icon={faTimes} className='h-5 w-5 ' />
                            ) : (
                                <FontAwesomeIcon icon={faPlus} className='h-5 w-5 ' />
                            )}
                        </button>
                    </div>
                    {showCategoryInput && (
                        <div className='flex items-center gap-2 mt-2'>
                            <input
                                type='text'
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder='New category'
                                className='p-4 border border-gray-300 rounded-lg w-full'
                            />
                            <button
                                type='button'
                                onClick={() => handleAddPreset('category', newCategory)}
                                className='px-4 py-2 bg-green-600 text-white rounded-lg'
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
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                <h3 className="text-3xl font-bold mb-6 text-center text-blue-700">Add Variants</h3>
<div className="flex flex-wrap gap-6 mb-4">
    {/* Sizes Section */}
    <div className="relative flex-1">
        <label className="block text-lg font-semibold text-gray-700 mb-2">Sizes</label>
        <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required={formData.variants.length === 0} // Conditionally set required
        >
            <option value="">Select Size</option>
            {sizes.map(size => (
                <option key={size} value={size}>{size}</option>
            ))}
        </select>
        <button onClick={() => setShowSizeInput(prev => !prev)} className="mt-2 text-blue-600 hover:text-blue-800 transition">
            {showSizeInput ? 'Cancel' : 'Add Size'}
        </button>
        {showSizeInput && (
            <div className="flex items-center gap-2 mt-2">
                <input
                    type="text"
                    value={newSize}
                    onChange={(e) => setNewSize(e.target.value)}
                    placeholder="New size"
                    className="p-2 border border-gray-300 rounded-md w-full"
                />
                <button
                    onClick={() => {
                        if (newSize.trim() !== '') {
                            handleAddPreset('size', newSize);
                        }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg transition hover:bg-green-700"
                >
                    Add
                </button>
            </div>
        )}
    </div>

    {/* Colors Section */}
    <div className="relative flex-1">
        <label className="block text-lg font-semibold text-gray-700 mb-2">Colors</label>
        <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            required={formData.variants.length === 0} // Conditionally set required
        >
            <option value="">Select Color</option>
            {colors.map(color => (
                <option key={color} value={color}>{color}</option>
            ))}
        </select>
        <button onClick={() => setShowColorInput(prev => !prev)} className="mt-2 text-blue-600 hover:text-blue-800 transition">
            {showColorInput ? 'Cancel' : 'Add Color'}
        </button>
        {showColorInput && (
            <div className="flex items-center gap-2 mt-2">
                <input
                    type="text"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    placeholder="New color"
                    className="p-2 border border-gray-300 rounded-md w-full"
                />
                <button
                    onClick={() => {
                        if (newColor.trim() !== '') {
                            handleAddPreset('color', newColor);
                        }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg transition hover:bg-green-700"
                >
                    Add
                </button>
            </div>
        )}
    </div>

    {/* Stock Section */}
    <div className="flex-1">
        <label className="block text-lg font-semibold text-gray-700 mb-2">Stock</label>
        <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            min="0"
            className="p-2 border border-gray-300 rounded-md w-full"
            placeholder="Enter stock quantity"
            required={formData.variants.length === 0} // Conditionally set required
        />
    </div>
</div>

<button
    type="button"
    onClick={handleAddVariant}
    className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg shadow transition hover:bg-blue-700"
>
    Add Variant
</button>

{/* Display Added Variants */}
{formData.variants.length > 0 && (
    <div className="mt-6 bg-white p-4 rounded-lg shadow border border-gray-300">
        <h4 className="text-lg font-semibold mb-2">Added Variants:</h4>
        <ul className="list-disc list-inside">
            {formData.variants.map((variant, index) => (
                <li key={index} className="flex justify-between items-center mb-2">
                    <span className="text-gray-800">
                        Size: {variant.size}, Color: {variant.color}, Stock: {variant.stock}
                    </span>
                    <button
                        onClick={() => handleDeleteVariant(index)}
                        className="ml-4 text-red-600 hover:text-red-800 transition"
                    >
                        Delete
                    </button>
                </li>
            ))}
        </ul>
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
