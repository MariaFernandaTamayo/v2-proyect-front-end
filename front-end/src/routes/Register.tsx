import { useState } from "react"
import {Link, Navigate, useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/constants";
import { AuthResponseError } from "../types/types";
export default function Register(){
    const[username,setUsername]=useState("");
    const[email,setEmail]=useState("");
    const[password,setPassword]=useState("");
    const [errorResponse, setErrorResponse] = useState("");
    const auth=useAuth();

    const goTo=useNavigate();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // Validación de campos
        if (!username || !email || !password) {
            setErrorResponse("Fields are required.");
            return;
        }
        try {
            const response = await fetch(`${API_URL}/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            });
            if (response.ok) {
                console.log("User created successfully");
                setErrorResponse(""); 
                goTo("/");
            } else {
                console.log("Something went wrong");
                const json = (await response.json()) as AuthResponseError;
                setErrorResponse(json.body.error);
                return;
            }
        } catch (error) {
            console.log(error);
        }
    }

    if(auth.isAuthenticated){
        return <Navigate to="/dashboard" />
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <form className="w-full max-w-sm bg-zinc-700 rounded-md shadow-md p-6" onSubmit={handleSubmit}>
                <h1>Register</h1>
                {!! errorResponse && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{errorResponse}</div>}
                
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-zinc-700 text-white px-4 py-2 my-2 rounded-md border border-purple-500 focus:outline-none focus:border-purple-700 mb-2" 
            placeholder="Username"></input>

                
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-zinc-700 text-white px-4 py-2 my-2 rounded-md border border-purple-500 focus:outline-none focus:border-purple-700 mb-2" 
            placeholder="Email"></input>

                
                <input type="password" value= {password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-zinc-700 text-white px-4 py-2 my-2 rounded-md border border-purple-500 focus:outline-none focus:border-purple-700 mb-2" 
            placeholder="Password"></input>
            <button 
                type="submit" 
                className="w-full bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
            >
                Register
            </button>
            <p className="flex gap-x-2 justify-between">Do You already have an account?<Link to="/" className="text-sky-500">Sig In</Link></p>
            </form>
        </div>
    )
}