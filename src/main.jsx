import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './Layout';
import Dashboard from './Components/Dashboard/Dashboard';
import Products from './Components/ProductManagement/Products'; 
import UpdateProduct from './Components/ProductManagement/UpdateProducts/UpdateProducts';
import './index.css';
import AddProduct from './Components/ProductManagement/AddProduct/AddProduct';
import Orders from './Components/Orders/Orders';
import Customers from './Components/Dashboard/Customers/Customers';
import AddFeaturedProducts from './Components/ProductManagement/FeaturedProducts/AddFeaturedProducts';  
import TrendingProducts from './Components/ProductManagement/Trending/TrendingProducts';
import UpdateForm from './Components/ProductManagement/UpdateProducts/UpdateForm';
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
        element: <UpdateProduct></UpdateProduct> ,
      },
      {
        path: "/products/update/:id",
        element: <UpdateForm></UpdateForm>
      
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
        path: "/products/featured/add",
        element:  <AddFeaturedProducts></AddFeaturedProducts>,
      },
      {
        path: "/products/trending/manage",
        element:   <TrendingProducts></TrendingProducts>
      },
      {
        path: "/order",
        element: <Orders></Orders>
      },
      {
        path: "/customers",
        element:<Customers></Customers>
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
