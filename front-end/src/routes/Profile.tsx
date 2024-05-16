import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/constants";

export default function Profile() {
  const [profileData, setProfileData] = useState<any>(null);
  const auth = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchProfileData();
    }
  }, [auth.isAuthenticated]);

  async function fetchProfileData() {
    try {
      const response = await fetch(`${API_URL}/user`, {
        headers: {
          Authorization: `Bearer ${auth.getAccessToken()}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      } else {
        console.error("Error al cargar el perfil");
      }
    } catch (error) {
      console.error("Error al cargar el perfil", error);
    }
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
        <h1 className="text-2xl font-bold mb-4">
          Perfil de {auth.getUser()?.username || ""}
        </h1>
        {profileData ? (
          <div>
            <p>Nombre: {profileData.name}</p>
            <p>Correo electrónico: {profileData.email}</p>
            {/* Otros datos del perfil */}
          </div>
        ) : (
          <p>Cargando datos del perfil...</p>
        )}
      </div>
    </div>
  );
}