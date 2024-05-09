import { Link, Navigate,useNavigate } from "react-router-dom"
import { useState } from "react"
import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/constants";
import { AuthResponse, AuthResponseError } from "../types/types";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorResponse, setErrorResponse] = useState("");
    const goTo = useNavigate();
    const auth = useAuth();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        // Validación de campos
        if (!username || !password) {
            setErrorResponse("Fields are required.");
            return;
        }
        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password,
                })
            });
            if (response.ok) {
                console.log("User Login successfully");
                setErrorResponse(""); 
                const json = (await response.json()) as AuthResponse;
                
                if (json.body.accessToken && json.body.refreshToken) {
                    auth.saveUser(json);
                    goTo('/home'); // Redirige al usuario a la página de inicio
                }
                
            } else {
                console.log("Something went wrong");
                const json = (await response.json()) as AuthResponseError;
                setErrorResponse(json.body.error);
            }
        } catch (error) {
            console.log(error);
        }
    }

    if (auth.isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <form className="w-full max-w-sm bg-zinc-700 rounded-md shadow-md p-6" onSubmit={handleSubmit}>
                <h1>Login</h1>
                {!!errorResponse && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">{errorResponse}</div>}
                
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-zinc-700 text-white px-4 py-2 my-2 rounded-md border border-purple-500 focus:outline-none focus:border-purple-700 mb-2" placeholder="Username" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-zinc-700 text-white px-4 py-2 my-2 rounded-md border border-purple-500 focus:outline-none focus:border-purple-700 mb-2" placeholder="Password" />
                <button type="submit" className="w-full bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
                    Login
                </button>
                <p className="flex gap-x-2 justify-between">Do not you have an account yet? <Link to="/register" className="text-sky-500">Sign Up</Link></p>
            </form>
        </div>
    );
}