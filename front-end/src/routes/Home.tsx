import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/constants";

interface Todo {
  id: string;
  title: string;
  submit: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTweet, setNewTweet] = useState("");
  const auth = useAuth();

  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    try {
      const response = await fetch(`${API_URL}/todos`, {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${auth.getAccessToken()}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTodos(data);
      } else {
        console.error("Error al cargar los todos");
      }
    } catch (error) {
      console.error("Error al cargar los todos", error);
    }
  }

  async function handleCreateTweet(event: React.FormEvent) {
    event.preventDefault();

    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${auth.getAccessToken()}`,
        },
        body: JSON.stringify({ title: newTweet, submit: true }),
      });

      if (response.ok) {
        // Actualizar la lista de tweets con el nuevo tweet
        const updatedTodos = [...todos, { id: Date.now().toString(), title: newTweet, submit: true }];
        setTodos(updatedTodos);

        // Cargar los tweets actualizados desde el servidor
        await loadTodos();

        // Limpiar el campo de nuevo tweet
        setNewTweet("");
      } else {
        console.error("Error al crear el tweet");
      }
    } catch (error) {
      console.error("Error al crear el tweet", error);
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
        await loadTodos();
      } else {
        console.error("Error al eliminar el tweet");
      }
    } catch (error) {
      console.error("Error al eliminar el tweet", error);
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
          Home de {auth.getUser()?.username || ""}
          {todos.map((todo) => (<div> {todo.title}</div>))}
        </h1>
        <form onSubmit={handleCreateTweet} className="mb-4">
          <textarea
            className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-lg mb-2"
            rows={4}
            value={newTweet}
            onChange={(e) => setNewTweet(e.target.value)}
            placeholder="What are you thinking?"
            required
          />
          <button
            type="submit"
            className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
          >
            Post Tweet
          </button>
        </form>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Mis Tweets</h2>
          {todos.map((todo) => (
            <div key={todo.id} className="p-2 border-b border-gray-700">
              <div>{todo.title}</div>
              <div>
                <button
                  onClick={() => handleDeleteTweet(todo.id)}
                  className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700 mr-2"
                >
                  Delete Tweet
                </button>
                <button className="bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700">
                  Update Tweet
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}