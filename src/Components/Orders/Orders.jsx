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
        <div className='container overflow-scroll'>
            <h1 className='text-3xl font-bold mb-5'>All Orders</h1>
            <table className="container divide-y divide-gray-200">
                <thead className='border-2 border-black'>
                    <tr>
                        <th className="px-6 py-3  text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Index</th>
                        <th className="px-6 py-3  text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Order Id</th>
                        <th className="px-6 py-3  text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Confirmed At</th>
                        <th className="px-6 py-3  text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3  text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                        <th className="px-6 py-3  text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                        <th className="px-6 py-3  text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3  text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3  text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3  text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                        <th className="px-6 py-3  text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Shipping Address</th>
                        <th className="px-6 py-3  text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Contact Number</th>
                        <th className="px-6 py-3  text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thumbnail</th>
                        <th className="px-6 py-3  text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Change Status</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {orders.slice().reverse().map((order, index) => {  
                        const product = productsMap[order._id]; 
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
                        return (
                            <tr className={`${order.status === "pending" ? "bg-slate-200 text-black font-bold" : ""} ${order.status === "delivered" ? "bg-green-200 text-black font-bold" : ""} ${order.status === "shipped" ? "bg-blue-200 text-black font-bold" : ""}${order.status === "cancelled" ? "bg-red-200 text-black font-bold" : ""} border-black border-2`} key={index}>
                                <td className="px-6 border-2 font-bold border-black py-4 text-center whitespace-nowrap text-xl">{orders.length - index}</td> {/* Adjust index display */}
                                <td className="px-6 border-2 border-black py-4 text-center whitespace-nowrap text-sm font-medium">{order._id}</td>
                                <td className="px-6 border-2 border-black py-4 text-center whitespace-nowrap text-sm font-medium"> {order?.confirmedAt ? formatDate(order.confirmedAt) : "No date Available"}</td>
                                <td className="px-6 border-2 border-black py-4 text-center whitespace-nowrap text-sm">{order.items.map(i => <p key={i._id}>{i.name} <br /></p>)}</td>
                                <td className="px-6 border-2 border-black py-4 text-center whitespace-nowrap text-sm">{order.items.map(i => <p key={i._id}>{i.size} <br /></p>)}</td>
                                <td className="px-6 border-2 border-black py-4 text-center whitespace-nowrap text-sm">{order.items.map(i => <p key={i._id}>{i.color} <br /></p>)}</td>
                                <td className="px-6 border-2 border-black py-4 text-center whitespace-nowrap text-sm ">${order.price.toFixed(2)}</td>
                                <td className="px-6 border-2 border-black py-4 text-center whitespace-nowrap text-sm">{order.quantity}</td>
                                <td className={`${order.status === "pending" ? "bg-slate-800 text-white font-bold" : ""} ${order.status === "delivered" ? "bg-green-600 text-white font-bold" : ""} ${order.status === "shipped" ? "bg-blue-800 text-white font-bold" : ""}${order.status === "cancelled" ? "bg-red-600 text-white font-bold" : ""} uppercase px-6 border-2 border-black py-4 text-center whitespace-nowrap text-sm`}>{order.status}</td>
                                <td className="px-6 border-2 border-black py-4 text-center whitespace-nowrap text-sm">{order.transactionId}</td>
                                <td className="px-6 border-2 border-black py-4 text-center whitespace-nowrap text-sm">{order.shippingAddress}</td>
                                <td className="px-6 border-2 border-black py-4 text-center whitespace-nowrap text-sm">{order.phoneNumber}</td>
                                <td className="px-6 border-2 border-black py-4 text-center whitespace-nowrap text-sm">
                                    <div className='flex flex-col gap-2 items-center justify-center'>
                                        {order.items.map(i => <img key={i._id} className='h-14' src={i.thumbnailImage} alt={i.name} />)}
                                    </div>
                                </td>
                                <td className="px-6 border-black border-2 py-4 whitespace-nowrap text-sm text-gray-500">
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
