/* eslint-disable no-unused-vars */
import React from 'react';
import { BsChatRightTextFill } from 'react-icons/bs';
import { FaCaretDown, FaCaretUp, FaSearch } from 'react-icons/fa';
import { MdNotifications } from 'react-icons/md';

const DashboardHeader = () => {
    return (
        <div className='h-fit mb-10 border p-10 shadow-lg bg-red-400/10 rounded-xl flex items-center justify-between' >
            <div>
                <p className='text-xl'>Total Revenue</p>
                <h4 className='text-3xl font-bold'>$ 45,365.00</h4>
            </div>
            <p className='flex items-center text-green-600 font-bold'><FaCaretUp className='text-3xl' /> $1,294</p>
            <p className='flex items-center text-red-600 font-bold'><FaCaretDown className='text-3xl' /> $1,294</p>
            <div className='bg-white flex items-center px-5 w-96 h-12 rounded-xl'>
                <FaSearch className='text-xl text-gray-600'></FaSearch>
                <input className='pl-2 h-full w-full focus:outline-none' type="text"  placeholder='Search'/>
            </div>
            <BsChatRightTextFill className='text-3xl text-blue-700' />
            <MdNotifications className='text-4xl text-blue-700' />
            <div>
                <img className='h-12 rounded-full w-12' src="https://s3-alpha-sig.figma.com/img/a241/fc6a/0709018e31832e52ce56bd4028cffaf8?Expires=1727049600&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=lbMosoVWV81PFmlvU7Otr1gZidVlgp7SJjPQrF1Ti2faNFnaIyETS-2gMRctaa6jkZjEGE60920FilJdABXSW~ZzKgn4bd5wapmQV5GjChIgeaSAtcHqAXfH9cVdaZ49T5mCs4OcSGzmAEmHRcDPSRgD4x3nra5cteuOp~7dUBwfFSsFK-cGr4dsrgf7VKogc9QOJV73O7Gg4SVkJPnAYo9QysHEAytazhju2-9Cy867Qu5xy0ee3eAx-5H8BcJVeCjWrTu7-rlyPLgn2a-TTSFdkSGIP8UDIbq3eh~j4vvi6WVFCbquOm89U2WvbGcEx~FENVKjWCDBlZFjsWQrdw__" alt="" />
            </div>
        </div>
    );
}


export default DashboardHeader;