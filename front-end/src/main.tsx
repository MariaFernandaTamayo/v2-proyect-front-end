import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Login from './routes/Login.tsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Register from './routes/Register.tsx'
import Dashboard from './routes/Dashboard.tsx'
import ProtectedRoute from './routes/ProtectedRoute.tsx'
import { AuthProvider } from './auth/AuthProvider.tsx'
const router = createBrowserRouter([
  {
    path:"/", element:<Login />,
  },
  {
    path:"/register", element:<Register/>,
  },
  {
    path:"/", element:<ProtectedRoute />,
    children:[
      {
        path:"/dashboard",
        element: <Dashboard />
      }
    ]
  }

])
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
