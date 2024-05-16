import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function Search() {
  const auth = useAuth();

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
        {/* Contenido de la página de búsqueda */}
      </div>
    </div>
  );
}