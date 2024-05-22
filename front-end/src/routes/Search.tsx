import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/constants";

interface Todo {
  _id: string;
  title: string;
  submit: boolean;
  user: {
    username: string;
  };
}

export default function Home() {
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState<Todo | null>(null);
  const auth = useAuth();

  async function handleSearchById(event: React.FormEvent) {
    event.preventDefault();

    try {
      const response = await fetch(`${API_URL}/todos/${searchId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth.getAccessToken()}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResult(data);
      } else {
        setSearchResult(null);
        console.error("Error al buscar el tweet");
      }
    } catch (error) {
      setSearchResult(null);
      console.error("Error al buscar el tweet", error);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <nav className="bg-purple-600 p-4">
        <ul className="flex justify-around">
          <li>
            <Link to="/home" className="hover:text-gray-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/search" className="hover:text-gray-300">
              Search
            </Link>
          </li>
          <li>
            <Link to="/profile" className="hover:text-gray-300">
              Profile
            </Link>
          </li>
          <li>
            <button onClick={auth.logout} className="hover:text-gray-300">
              Logout
            </button>
          </li>
        </ul>
      </nav>
      <div className="container mx-auto p-4">
        <form onSubmit={handleSearchById} className="mb-4">
          <input
            type="text"
            className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-lg mb-2"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Search tweet by ID"
            required
          />
          <button
            type="submit"
            className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
          >
            Search
          </button>
        </form>
        {searchResult && (
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-4">
            <h2 className="text-xl font-semibold mb-2">{searchResult.title}</h2>
            <p className="text-gray-400 mb-2">Created by: {auth.getUser()?.username || ""}</p>
          </div>
        )}
      </div>
    </div>
  );
}