import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/constants";

interface Todo {
  _id: string;
  title: string;
  submit: boolean;
  author?: { username: string };
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const auth = useAuth();

  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    try {
      const response = await fetch(`${API_URL}/todos`, {
        headers: {
          "Content-Type": "application/json",
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

  async function handleCreateTodo(event: React.FormEvent) {
    event.preventDefault();

    if (newTodo.trim().length > 3) {
      try {
        const response = await fetch(`${API_URL}/todos`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.getAccessToken()}`,
          },
          body: JSON.stringify({ title: newTodo, submit: true }),
        });

        if (response.ok) {
          const createdTodo = await response.json();
          setTodos([...todos, createdTodo]);
          setNewTodo("");
        } else {
          console.error("Error al crear el todo");
        }
      } catch (error) {
        console.error("Error al crear el todo", error);
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-purple-600 p-4 shadow-lg">
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
        <h1 className="text-3xl font-bold mb-4 text-purple-600 text-center">
          Home de {auth.getUser()?.username || ""}
        </h1>
        <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
          <form onSubmit={handleCreateTodo} className="mb-4">
            <textarea
              className="w-full p-4 border border-gray-700 bg-gray-700 text-white rounded-lg mb-2 focus:ring-2 focus:ring-purple-600 focus:outline-none shadow-md transition duration-200"
              rows={4}
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="What's on your mind today?"
              required
            />
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-200"
              >
                Post Tweet
              </button>
            </div>
          </form>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold mb-4 text-purple-600 text-center">Tweets</h2>
            {todos.map((todo) => (
              <div key={todo._id} className="p-4 bg-gray-700 rounded-lg shadow-md">
                <div className="text-lg text-center mb-4">{todo.title}</div>
                <div className="text-sm text-gray-400 text-center">
                  By {auth.getUser()?.username || ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}