import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/constants";
import icon from '../icon.png'; // Importamos la imagen

interface Tweet {
  _id: string;
  title: string;
  submit: boolean;
}

export default function Profile() {
  const [profileData, setProfileData] = useState<any>(null);
  const [userTweets, setUserTweets] = useState<Tweet[]>([]);
  const [editingTweet, setEditingTweet] = useState<Tweet | null>(null);
  const [editTitle, setEditTitle] = useState("");
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

  async function handleDeleteTweet(id: string) {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.getAccessToken()}`,
        },
      });

      if (response.ok) {
        setUserTweets(userTweets.filter((tweet) => tweet._id !== id));
      } else {
        console.error("Error al eliminar el tweet");
      }
    } catch (error) {
      console.error("Error al eliminar el tweet", error);
    }
  }

  async function handleUpdateTweet() {
    if (editingTweet) {
      try {
        const response = await fetch(`${API_URL}/todos/${editingTweet._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.getAccessToken()}`,
          },
          body: JSON.stringify({ title: editTitle, submit: editingTweet.submit }),
        });

        if (response.ok) {
          const updatedTweet = await response.json();
          setUserTweets(userTweets.map((tweet) => (tweet._id === updatedTweet._id ? updatedTweet : tweet)));
          setEditingTweet(null);
          setEditTitle("");
        } else {
          console.error("Error al actualizar el tweet");
        }
      } catch (error) {
        console.error("Error al actualizar el tweet", error);
      }
    }
  }

  function openEditModal(tweet: Tweet) {
    setEditingTweet(tweet);
    setEditTitle(tweet.title);
  }

  function closeEditModal() {
    setEditingTweet(null);
    setEditTitle("");
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
                  <div className="mt-4 flex justify-center space-x-2">
                    <button
                      onClick={() => handleDeleteTweet(tweet._id)}
                      className="bg-red-600 text-white py-1 px-2 text-sm rounded-lg hover:bg-red-700 transition duration-200"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => openEditModal(tweet)}
                      className="bg-blue-600 text-white py-1 px-2 text-sm rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                      Update
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-lg">No has publicado ningún tweet.</p>
          )}
        </div>
      </div>
      {editingTweet && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Edit Tweet</h2>
            <textarea
              className="w-full p-4 border border-gray-700 bg-gray-900 text-white rounded-lg mb-4 focus:ring-2 focus:ring-purple-600 focus:outline-none"
              rows={4}
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Edit tweet..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={closeEditModal}
                className="bg-red-600 text-white py-1 px-2 text-sm rounded-lg hover:bg-red-700 transition duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateTweet}
                className="bg-blue-600 text-white py-1 px-2 text-sm rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}