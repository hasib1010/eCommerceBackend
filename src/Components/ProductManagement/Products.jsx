import React from 'react';
import { Link } from 'react-router-dom';
import {
    PlusIcon,
    PencilSquareIcon,
    EyeIcon,
    ArchiveBoxIcon,
    ArrowPathIcon,
    TagIcon,
    TrashIcon
} from '@heroicons/react/24/outline';

const Products = () => {
    return (
        <div className='flex flex-wrap items-center justify-center gap-10 p-10'>
            {/* Add Product Card */}
            <div className='w-[250px] bg-white shadow-lg rounded-lg flex flex-col items-center p-5 border'>
                <h3 className='text-lg font-bold mb-4 flex items-center'>
                    <PlusIcon className='h-6 w-6 text-blue-500 mr-2' />
                    Add Products
                </h3>
                <p className='text-gray-500'>Easily add new products to your inventory.</p>
                <Link to="/products/add">
                    <button className='mt-5 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600'>
                        Add
                    </button>
                </Link>
            </div>

            {/* Update Product Card */}
            <div className='w-[250px] bg-white shadow-lg rounded-lg flex flex-col items-center p-5 border'>
                <h3 className='text-lg font-bold mb-4 flex items-center'>
                    <PencilSquareIcon className='h-6 w-6 text-green-500 mr-2' />
                    Update Products
                </h3>
                <p className='text-gray-500'>Modify existing products or update their information.</p>
                <Link to="/products/update">
                    <button className='mt-5 px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600'>
                        Update
                    </button>
                </Link>
            </div>

            {/* Delete Product Card */}
            <div className='w-[250px] bg-white shadow-lg rounded-lg flex flex-col items-center p-5 border'>
                <h3 className='text-lg font-bold mb-4 flex items-center'>
                    <TrashIcon className='h-6 w-6 text-red-500 mr-2' />
                    Delete Products
                </h3>
                <p className='text-gray-500'>Remove products from your inventory.</p>
                <Link to="/products/delete">
                    <button className='mt-5 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600'>
                        Delete
                    </button>
                </Link>
            </div>

            {/* View Product Card */}
            <div className='w-[250px] bg-white shadow-lg rounded-lg flex flex-col items-center p-5 border'>
                <h3 className='text-lg font-bold mb-4 flex items-center'>
                    <EyeIcon className='h-6 w-6 text-purple-500 mr-2' />
                    View Products
                </h3>
                <p className='text-gray-500'>Browse your inventory and view detailed product info.</p>
                <Link to="/products/view">
                    <button className='mt-5 px-4 py-2 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600'>
                        View
                    </button>
                </Link>
            </div>

            {/* Manage Inventory Card */}
            <div className='w-[250px] bg-white shadow-lg rounded-lg flex flex-col items-center p-5 border'>
                <h3 className='text-lg font-bold mb-4 flex items-center'>
                    <ArchiveBoxIcon className='h-6 w-6 text-yellow-500 mr-2' />
                    Manage Inventory
                </h3>
                <p className='text-gray-500'>Keep track of stock levels and update inventory counts.</p>
                <Link to="/products/manage-inventory">
                    <button className='mt-5 px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600'>
                        Manage
                    </button>
                </Link>
            </div>

            {/* Bulk Update Products Card */}
            <div className='w-[250px] bg-white shadow-lg rounded-lg flex flex-col items-center p-5 border'>
                <h3 className='text-lg font-bold mb-4 flex items-center'>
                    <ArrowPathIcon className='h-6 w-6 text-red-500 mr-2' />
                    Bulk Update Products
                </h3>
                <p className='text-gray-500'>Apply changes to multiple products at once.</p>
                <Link to="/products/bulk-update">
                    <button className='mt-5 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600'>
                        Bulk Update
                    </button>
                </Link>
            </div>

            {/* Manage Discounts Card */}
            <div className='w-[250px] bg-white shadow-lg rounded-lg flex flex-col items-center p-5 border'>
                <h3 className='text-lg font-bold mb-4 flex items-center'>
                    <TagIcon className='h-6 w-6 text-indigo-500 mr-2' />
                    Manage Discounts
                </h3>
                <p className='text-gray-500'>Create and apply discounts or promotions to products.</p>
                <Link to="/products/manage-discounts">
                    <button className='mt-5 px-4 py-2 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600'>
                        Manage Discounts
                    </button>
                </Link>
            </div>

            {/* Add Featured Products Card */}
            <div className='w-[250px] bg-white shadow-lg rounded-lg flex flex-col items-center p-5 border'>
                <h3 className='text-lg font-bold mb-4 flex items-center'>
                    <PlusIcon className='h-6 w-6 text-blue-500 mr-2' />
                    Add Featured Products
                </h3>
                <p className='text-gray-500'>Highlight specific products by adding them as featured.</p>
                <Link to="/products/featured/add">
                    <button className='mt-5 px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600'>
                        Add Featured
                    </button>
                </Link>
            </div>

            {/* Manage Trending Products Card */}
            <div className='w-[250px] bg-white shadow-lg rounded-lg flex flex-col items-center p-5 border'>
                <h3 className='text-lg font-bold mb-4 flex items-center'>
                    <TagIcon className='h-6 w-6 text-orange-500 mr-2' />
                    Manage Trending Products
                </h3>
                <p className='text-gray-500'>Highlight specific products by marking them as trending.</p>
                <Link to="/products/trending/manage">
                    <button className='mt-5 px-4 py-2 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600'>
                        Manage Trending
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Products;
