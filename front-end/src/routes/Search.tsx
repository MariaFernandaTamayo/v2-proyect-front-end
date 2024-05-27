import React, { useState } from "react";
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

const Search: React.FC = () => {
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState<Todo | null>(null);
  const [loading, setLoading] = useState(false);
  const auth = useAuth();

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      let url = `${API_URL}/todos/`;
      if (searchId.startsWith("@")) {
        const username = searchId.substring(1);
        url += `user/${username}`;
      } else {
        url += searchId;
      }

      const response = await fetch(url, {
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
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
      <div className="container mx-auto p-4 max-w-md">
        <form onSubmit={handleSearch} className="mb-4 flex items-center">
          <input
            type="text"
            className="flex-1 py-2 px-4 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-600 bg-gray-800 text-white"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="Search tweet by ID or keyword"
            required
          />
          <button
            type="submit"
            className={`bg-purple-600 text-white py-2 px-4 rounded-r-lg ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700"
            }`}
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
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
};

export default Search;