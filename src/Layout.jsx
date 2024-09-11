/* eslint-disable no-unused-vars */
import React from 'react';
import DashboardNavbar from './Components/DashboardNavbar/DashboardNavbar';
import DashboardHeader from './Components/DashboardHeader/DashboardHeader';
import bg from './assets/bg.jpg'
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div style={{ backgroundImage: `url(${bg})` }} className={`  bg-cover py-10 text-black min-h-screen`}>
            <div className='container mx-auto my-10 p-10 bg-white/95 rounded-xl shadow-2xl shadow-yellow-300  backdrop-blur-2xl '>
                <div className="flex gap-5 ">
                    <DashboardNavbar></DashboardNavbar>
                    <div className='bg-[#F8F7FC] w-full rounded-lg shadow-xl p-5'>
                        <DashboardHeader></DashboardHeader>
                        <Outlet></Outlet>
                    </div>

                </div>

            </div>
        </div>

    );
}


export default Layout;