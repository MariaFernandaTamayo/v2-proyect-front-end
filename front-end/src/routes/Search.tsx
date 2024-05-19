import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";


export default function Search() {
  const [query, setQuery] = useState("");
  const auth = useAuth();

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    // Aquí se podría añadir la lógica de búsqueda
  }

  return (
    <div className="min-h-screen bg-zinc text-white">
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
        <h1 className="text-2xl font-bold mb-4">Search Page</h1>
        <form onSubmit={handleSearch} className="mb-4">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by ID or name"
            className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-lg mb-2"
          />
          <button
            type="submit"
            className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
          >
            Search
          </button>
        </form>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="p-4 border border-gray-700 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Results 1</h2>
            {/* Aquí se mostrarían los resultados de la búsqueda */}
          </div>
          <div className="p-4 border border-gray-700 bg-gray-800 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Results 2</h2>
            {/* Aquí se mostrarían los resultados de la búsqueda */}
          </div>
        </div>
      </div>
    </div>
  );
}