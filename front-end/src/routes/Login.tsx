import { Link, Navigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../auth/AuthProvider";
export default function Login(){
    const[username,setUsername]=useState("");
    const[password,setPassword]=useState("");
    const auth=useAuth();
    if(auth.isAuthenticated){
        return <Navigate to="/dashboard" />
    }
    return (
        <div className="flex justify-center items-center h-screen">
            <form className="w-full max-w-sm bg-zinc-700 rounded-md shadow-md p-6">
                <h1>Login</h1>
                
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-zinc-700 text-white px-4 py-2 my-2 rounded-md border border-purple-500 focus:outline-none focus:border-purple-700 mb-2" 
            placeholder="Username"></input>
                               
               
                <input type="password" value= {password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-zinc-700 text-white px-4 py-2 my-2 rounded-md border border-purple-500 focus:outline-none focus:border-purple-700 mb-2" 
            placeholder="Password"></input>
            <button 
                type="submit" 
                className="w-full bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
            >
                Login
            </button>
            <p className="flex gap-x-2 justify-between">Do not you have an account yet?<Link to="/register" className="text-sky-500">Sign Up</Link></p>
            </form>
        </div>
    )
}