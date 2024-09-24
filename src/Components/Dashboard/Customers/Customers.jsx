import React, { useEffect, useState } from 'react';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [orders, setOrders] = useState([]);   

    useEffect(() => {
        // Fetch users
        fetch("https://e-commerce-server-alpha.vercel.app/users")
            .then(res => res.json())
            .then(data => setCustomers(data))
            .catch(err => console.error("Error fetching users:", err));

        // Fetch orders
        fetch("https://e-commerce-server-alpha.vercel.app/admin/orders")
            .then(res => res.json())
            .then(data => setOrders(data))
            .catch(err => console.error("Error fetching orders:", err));
    }, []);

    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        return new Date(dateString).toLocaleString(undefined, options);
    };

    const calculateTotalSpent = (userId) => {
        if (!Array.isArray(orders)) {
            console.error("Orders is not an array:", orders);
            return 0;
        }
        return orders
            .filter(order => order.user?._id === userId)  
            .reduce((total, order) => total + order.price, 0);  
    };

    return (
        <div>
            <h3 className='text-2xl font-bold'>All Customers <span className='text-gray-500 font-medium'>{customers.length}</span></h3>
            <div className='grid grid-cols-2 gap-3 mt-10'>
                {
                    customers.map(user => {
                        const totalSpent = calculateTotalSpent(user?._id);  
                        return (
                            <div className='border w-full shadow-md rounded-md flex flex-col p-3' key={user?._id}>
                                <span className='font-bold'>Name</span>
                                <h2 className='text-xl'>{user?.firstName} {user?.lastName}</h2>

                                <span className='font-bold'>Email</span>
                                <h2 className='text-xl'>{user?.email}</h2>

                                <span className='font-bold'>Joined Us</span>
                                <h2 className='text-xl'>{formatDate(user?.createdAt)}</h2>

                                <span className='font-bold'>Total Spent</span>
                                <h2 className='text-xl'>${totalSpent.toFixed(2)}</h2> {/* Display total spent */}
                            </div>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default Customers;
