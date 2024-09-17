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

                // Extract unique product IDs from orders
                const productIds = [...new Set(data.map(order => order._id))]; // Use _id for product ID

                // Fetch product details for each product ID
                const productRequests = productIds.map(id =>
                    fetch(`http://localhost:3000/products/clothings/${id}`).then(res => res.json())
                );
                const products = await Promise.all(productRequests);

                // Create a map of product details by ID
                const productsMap = products.reduce((acc, product) => {
                    acc[product._id] = product; // Assuming _id is used as the product ID
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

            // Update local state with the new status
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
        <div className='max-w-screen-2xl overflow-scroll'>
            <h1>All Orders</h1>
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Id</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipping Address</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change Status</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order, index) => {
                        const product = productsMap[order._id]; // Ensure _id is used for product ID
                        return (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items.map(i => <p>{i.name} <br /></p>)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items.map(i => <p>{i.size} <br /></p>)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.items.map(i => <p>{i.color} <br /></p>)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.price.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.quantity}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.status}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.transactionId}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.shippingAddress}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className='flex flex-wrap'>
                                            {
                                                order.items.map(i => <img className='h-14' src={i.thumbnailImage} />)
                                            }
                                        </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value, order.user._id)} // Pass user ID
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Orders;
