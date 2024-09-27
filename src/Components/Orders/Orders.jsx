import React, { useEffect, useState } from 'react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [productsMap, setProductsMap] = useState({});

    useEffect(() => {
        async function fetchOrders() {
            try {
                const response = await fetch('http://localhost:3000/admin/orders');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setOrders(data);

                const productIds = [...new Set(data.flatMap(order => order.items.map(item => item.id)))];
                const productRequests = productIds.map(id =>
                    fetch(`http://localhost:3000/products/clothings/${id}`).then(res => res.json())
                );
                const products = await Promise.all(productRequests);

                const productsMap = products.reduce((acc, product) => {
                    acc[product._id] = product;
                    return acc;
                }, {});

                setProductsMap(productsMap);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        }

        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus, userId) => {
        try {
            const response = await fetch(`http://localhost:3000/admin/orders/${orderId}/status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus, uid: userId }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    return (
        <div className='container mx-auto p-6'>
            <h1 className='text-4xl font-bold text-center mb-8'>All Orders</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {orders.map((order, index) => (
                    <div key={order._id} className={`border rounded-lg shadow-lg p-5 ${order.status === "pending" ? "bg-slate-200" : order.status === "delivered" ? "bg-green-200" : order.status === "shipped" ? "bg-blue-200" : order.status === "cancelled" ? "bg-red-200" : ""}`}>
                        <h2 className='text-lg font-bold'>Order ID: {order._id}</h2>
                        <p className='text-sm'>Confirmed At: {new Date(order.confirmedAt).toLocaleString()}</p>
                        <p className='text-xl bg-white w-fit p-1 rounded-xl'>User {order.user?.firstName} {order.user?.lastName}</p>
                        <p className='text-sm'>Phone: {order.phoneNumber}</p>
                        <p className='text-sm'>Shipping Address: {order.shippingAddress}</p>
                        <h3 className='font-semibold mt-4'>Items:</h3>
                        <ul className='list-disc list-inside'>
                            {order.items.map(item => (
                                <li key={item.id} className='flex items-center justify-between'>
                                    <img src={item.thumbnailImage} alt={item.name} className='h-12 w-12 rounded-md mr-2' />
                                    <div>
                                        <p>{item.name} - Size: {item.size} - Color: {item.color}</p>
                                        <p className='font-medium'>Price: ${parseFloat(item.price).toFixed(2)} x {item.quantity}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <p className='font-bold mt-2'>Total Price: ${parseFloat(order.price).toFixed(2)}</p>
                        <div className='mt-4'>
                            <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order._id, e.target.value, order.user._id)} // Pass user ID
                                className="border border-gray-300 rounded p-1"
                            >
                                <option value="pending">Pending</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
