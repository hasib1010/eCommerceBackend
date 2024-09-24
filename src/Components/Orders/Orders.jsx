import React, { useEffect, useState } from 'react';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [productsMap, setProductsMap] = useState({});

    useEffect(() => {
        async function fetchOrders() {
            try {
                const response = await fetch('https://e-commerce-server-alpha.vercel.app/admin/orders');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setOrders(data);

                const productIds = [...new Set(data.map(order => order._id))];
                const productRequests = productIds.map(id =>
                    fetch(`https://e-commerce-server-alpha.vercel.app/products/clothings/${id}`).then(res => res.json())
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
            const response = await fetch(`https://e-commerce-server-alpha.vercel.app/admin/orders/${orderId}/status`, {
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
        <div className='container mx-auto overflow-scroll p-6'>
            <h1 className='text-4xl font-bold text-center mb-8'>All Orders</h1>
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className='bg-gray-800 text-white'>
                    <tr>
                        <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">Index</th>
                        <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">Order Id</th>
                        <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">Confirmed At</th>
                        <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">User Name</th>
                        <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">Product Name</th>
                        <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">Size</th>
                        <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">Color</th>
                        <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">Price</th>
                        <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">Transaction ID</th>
                        <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">Shipping Address</th>
                        <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">Contact Number</th>
                        <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">Thumbnail</th>
                        <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">Change Status</th>
                    </tr>
                </thead>
                <tbody className="bg-gray-100 divide-y divide-gray-300">
                    {orders.slice().reverse().map((order, index) => {
                        const product = productsMap[order._id];
                        const formatDate = (dateString) => {
                            const options = {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: false
                            };
                            return new Date(dateString).toLocaleString(undefined, options);
                        };
                        return (
                            <tr key={order._id} className={`border-b transition duration-300 ease-in-out hover:bg-gray-200 ${order.status === "pending" ? "bg-slate-200" : order.status === "delivered" ? "bg-green-200" : order.status === "shipped" ? "bg-blue-200" : order.status === "cancelled" ? "bg-red-200" : ""}`}>
                                <td className="px-6 py-4 text-center text-sm font-medium">{orders.length - index}</td>
                                <td className="px-6 py-4 text-center text-sm">{order._id}</td>
                                <td className="px-6 py-4 text-center text-sm">{order.confirmedAt ? formatDate(order.confirmedAt) : "No date Available"}</td>
                                <td className="px-6 py-4 text-center text-sm">{order.user?.firstName}{" "}{order.user?.lastName}</td> {/* Display User Name */}
                                <td className="px-6 py-4 text-center text-sm">{order.items.map(i => <p key={i._id}>{i.name}</p>)}</td>
                                <td className="px-6 py-4 text-center text-sm">{order.items.map(i => <p key={i._id}>{i.size}</p>)}</td>
                                <td className="px-6 py-4 text-center text-sm">{order.items.map(i => <p key={i._id}>{i.color}</p>)}</td>
                                <td className="px-6 py-4 text-center text-sm">${order.price.toFixed(2)}</td>
                                <td className="px-6 py-4 text-center text-sm">{order.quantity}</td>
                                <td className={`px-6 py-4 text-center text-sm font-bold uppercase ${order.status === "pending" ? "text-slate-800" : order.status === "delivered" ? "text-green-600" : order.status === "shipped" ? "text-blue-800" : order.status === "cancelled" ? "text-red-600" : ""}`}>{order.status}</td>
                                <td className="px-6 py-4 text-center text-sm">{order.transactionId}</td>
                                <td className="px-6 py-4 text-center text-sm">{order.shippingAddress}</td>
                                <td className="px-6 py-4 text-center text-sm">{order.phoneNumber}</td>
                                <td className="px-6 py-4 text-center text-sm">
                                    <div className='flex flex-col gap-2 items-center'>
                                        {order.items.map(i => <img key={i._id} className='h-14 rounded-md shadow' src={i.thumbnailImage} alt={i.name} />)}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
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
