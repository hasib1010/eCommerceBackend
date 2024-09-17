import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './Components/Dashboard/Dashboard';
import Products from './Components/ProductManagement/Products'; 
// import UpdateProduct from './Components/ProductManagement/UpdateProduct';
// import DeleteProduct from './Components/ProductManagement/DeleteProduct';
// import ViewProduct from './Components/ProductManagement/ViewProduct';
// import ManageInventory from './Components/ProductManagement/ManageInventory';
// import BulkUpdate from './Components/ProductManagement/BulkUpdate';
// import ManageDiscounts from './Components/ProductManagement/ManageDiscounts';
import './index.css';
import AddProduct from './Components/ProductManagement/AddProduct/AddProduct';
import Orders from './Components/Orders/Orders';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/products",
        element: <Products />,
      },
      {
        path: "/products/add",
        element: <AddProduct />,
      },
      {
        path: "/products/update",
        // element: <UpdateProduct />,
      },
      {
        path: "/products/delete",
        // element: <DeleteProduct />,
      },
      {
        path: "/products/view",
        // element: <ViewProduct />,
      },
      {
        path: "/products/manage-inventory",
        // element: <ManageInventory />,
      },
      {
        path: "/products/bulk-update",
        // element: <BulkUpdate />,
      },
      {
        path: "/products/manage-discounts",
        // element: <ManageDiscounts />,
      },
      {
        path: "/order",
        element: <Orders></Orders>
      },
      {
        path: "/shipping",
        element: <h2>Shipping</h2>,
      },
      {
        path: "/payments",
        element: <h2>Payments</h2>,
      },
      {
        path: "/settings",
        element: <h2>Settings</h2>,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
