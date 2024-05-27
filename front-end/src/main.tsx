import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Login from './routes/Login.tsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Register from './routes/Register.tsx'
import Home from './routes/Home.tsx'
import ProtectedRoute from './routes/ProtectedRoute.tsx'
import { AuthProvider } from './auth/AuthProvider.tsx'
import Search from './routes/Search.tsx';
import Profile from './routes/Profile.tsx';
import { Navigate } from 'react-router-dom';

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
        path:"/home",
        element: <Home/>
      },
      {
        path:"/search",
        element: <Search/>
      },
      {
        path:"/profile",
        element: <Profile/>
      },
      {
        path: "*",
        element: <Navigate to="/" />,
      },
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
