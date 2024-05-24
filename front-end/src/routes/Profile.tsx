import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/constants";
import icon from '../icon.png'; // Importamos la imagen

export default function Profile() {
  const [profileData, setProfileData] = useState<any>(null);
  const [userTweets, setUserTweets] = useState<any[]>([]);
  const auth = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated) {
      fetchProfileData();
      fetchUserTweets();
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

  async function fetchUserTweets() {
    try {
      const response = await fetch(`${API_URL}/todos`, {
        headers: {
          Authorization: `Bearer ${auth.getAccessToken()}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserTweets(data);
      } else {
        console.error("Error al cargar los tweets del usuario");
      }
    } catch (error) {
      console.error("Error al cargar los tweets del usuario", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center">
      <nav className="bg-purple-600 p-4 w-full shadow-lg">
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
      <div className="container mx-auto p-4 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-4 text-purple-600">
          Perfil de {auth.getUser()?.username || ""}
        </h1>
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 w-full max-w-md shadow-md relative">
          {profileData ? (
            <div>
              <p className="text-lg mb-2"><strong>Nombre:</strong> {auth.getUser()?.username || ""}</p>
              <p className="text-lg"><strong>Correo electrónico:</strong> {auth.getUser()?.email || ""}</p>
              {/* Otros datos del perfil */}
            </div>
          ) : (
            <p className="text-lg">Cargando datos del perfil...</p>
          )}
          <img src={icon} alt="Icon" className="absolute top-4 right-4 w-12 h-12 rounded-full border-2 border-gray-700" />
        </div>
        <div className="bg-gray-800 p-6 mt-4 rounded-lg border border-gray-700 w-full max-w-md shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-purple-600">Mis Tweets</h2>
          {userTweets.length > 0 ? (
            <ul className="space-y-4">
              {userTweets.map((tweet) => (
                <li key={tweet._id} className="p-4 border border-gray-700 rounded-lg bg-gray-700 shadow-sm">
                  <p className="text-lg font-semibold text-center">{tweet.title}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-lg">No has publicado ningún tweet.</p>
          )}
        </div>
      </div>
    </div>
  );
}