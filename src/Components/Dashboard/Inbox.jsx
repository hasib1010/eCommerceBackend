import React from 'react'; 
 
const Inbox = () => {
    return (
        <div className=' h-fit rounded-lg  bg-white w-[496px] p-5'>
           <h4 className='text-xl font-bold flex justify-between'> Inbox <span className='text-blue-600 cursor-pointer'>View Details</span></h4>
           <p>Group: Support</p>
           <h4 className='text-md  mt-10 flex justify-between'> Waiting for order#12345 <span className='text-blue-600'>4:39</span></h4>
           <h4 className='text-md  mt-3  flex justify-between'> Customer support id#22234 <span className='text-blue-600'>3:39</span></h4>

        </div>
    );
}
  
 
export default Inbox;