
import React from 'react';
import { AiTwotoneShopping } from 'react-icons/ai';
import { BsCart4 } from 'react-icons/bs';
import { FaPowerOff } from 'react-icons/fa';
import { IoSettings } from 'react-icons/io5';
import { LuWallet } from 'react-icons/lu';
import { MdDashboard, MdLocalShipping } from 'react-icons/md';
import { NavLink } from 'react-router-dom';

const DashboardNavbar = () => {
    return (
        <div className='border p-10 shadow-lg rounded-xl flex flex-col gap-10  bg-white'>
            <FaPowerOff className='cursor-pointer    bg-transparent hover:bg-red-600 hover:text-white hover:p-2 hover:rounded-full  text-7xl w-fit mx-auto' />
            <NavLink to={'/'} className={"text-xl font-semibold flex items-center gap-4  text-gray-600"}><MdDashboard className='text-3xl' /> Dashboard</NavLink>
            <NavLink to={'/order'} className={"text-xl  flex items-center gap-4 font-semibold text-gray-600"}><BsCart4 className='text-3xl' />Order</NavLink>
            <NavLink to={'/products'} className={"text-xl flex items-center gap-4  font-semibold text-gray-600"}><AiTwotoneShopping className='text-3xl' /> Products</NavLink>
            <NavLink to={'/shipping'} className={"text-xl flex items-center gap-4  font-semibold text-gray-600"}><MdLocalShipping className='text-3xl'></MdLocalShipping>Shipping</NavLink>
            <NavLink to={'/payments'} className={"text-xl flex items-center gap-4  font-semibold text-gray-600"}><LuWallet className='text-3xl'></LuWallet>Payments</NavLink>
            <NavLink to={'/settings'} className={"text-xl flex items-center gap-4  font-semibold text-gray-600"}> <IoSettings className='text-3xl' />Settings</NavLink>
            <div className='flex flex-col gap-10 items-start'>
                <p className='text-2xl font-bold'>Customer Support</p>
                <p className='max-w-52'>Ask you query , place
                    requests or important
                    issues. Our support
                    team will contact 24/7
                    to you. </p>
                <button>Connect Now</button>
            </div>
        </div>
    );
}

export default DashboardNavbar 