/* eslint-disable no-unused-vars */
import React from 'react';
import DashboardNavbar from './Components/DashboardNavbar/DashboardNavbar';
import DashboardHeader from './Components/DashboardHeader/DashboardHeader';
import bg from './assets/bg.jpg';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div style={{ backgroundImage: `url(${bg})` }} className=" py-10   bg-cover bg-center min-h-screen text-black">
            <div className="   px-4 lg:px-10 py-10 lg:py-12 bg-white/90 rounded-xl shadow-lg backdrop-blur-sm">
                <div className="flex    gap-6">
                    {/* Sidebar */}
                    <div className="   top-0 min-w-fit  bg-white shadow-md rounded-lg lg:rounded-none lg:border-r lg:border-gray-200 lg:overflow-y-auto p-4">
                        <DashboardNavbar />
                    </div>

                    {/* Main Content */}
                    <div className=" flex-1 bg-[#F8F7FC] p-4 lg:p-6 rounded-lg shadow-md">
                        <DashboardHeader />
                        <div className="mt-4">
                            <Outlet />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Layout;
