import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import Layout from './Layout.jsx';
import Dashboard from './Components/Dashboard/Dashboard.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout></Layout>, 
    children: [
      {
        path: "/",
        element: <Dashboard></Dashboard> ,
      },
      {
        path: "/products",
        element: <h2>products</h2> ,
      },
      {
        path: "/order",
        element: <h2>order</h2> ,
      },
      {
        path: "/shipping",
        element: <h2>shipping</h2> ,
      },
      {
        path: "/payments",
        element: <h2>Payments</h2> ,
      },
      {
        path: "/settings",
        element: <h2>Settings</h2> ,
      },
    ],
  },
]);
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
