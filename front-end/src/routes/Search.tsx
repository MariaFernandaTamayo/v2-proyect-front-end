import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";
import { API_URL } from "../auth/constants";

interface Todo {
  _id: string;
  title: string;
  submit: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState("");
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

  async function handleDeleteTodo(id: string) {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${auth.getAccessToken()}`,
        },
      });

      if (response.ok) {
        setTodos(todos.filter((todo) => todo._id !== id));
      } else {
        console.error("Error al eliminar el todo");
      }
    } catch (error) {
      console.error("Error al eliminar el todo", error);
    }
  }

  async function handleUpdateTodo() {
    if (editingTodo) {
      try {
        const response = await fetch(`${API_URL}/todos/${editingTodo._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.getAccessToken()}`,
          },
          body: JSON.stringify({ title: editTitle, submit: editingTodo.submit }),
        });

        if (response.ok) {
          const updatedTodo = await response.json();
          setTodos(todos.map((todo) => (todo._id === updatedTodo._id ? updatedTodo : todo)));
          setEditingTodo(null);
          setEditTitle("");
        } else {
          console.error("Error al actualizar el todo");
        }
      } catch (error) {
        console.error("Error al actualizar el todo", error);
      }
    }
  }

  function openEditModal(todo: Todo) {
    setEditingTodo(todo);
    setEditTitle(todo.title);
  }

  function closeEditModal() {
    setEditingTodo(null);
    setEditTitle("");
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
        </h1>
        <form onSubmit={handleCreateTodo} className="mb-4">
          <textarea
            className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-lg mb-2"
            rows={4}
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="New task to do..."
            required
          />
          <button
            type="submit"
            className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
          >
            Add Todo
          </button>
        </form>
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">My Todos</h2>
          {todos.map((todo) => (
            <div key={todo._id} className="p-2 border-b border-gray-700">
              <div>{todo.title}</div>
              <div>
                <button
                  onClick={() => handleDeleteTodo(todo._id)}
                  className="bg-red-600 text-white py-1 px-2 rounded hover:bg-red-700 mr-2"
                >
                  Delete
                </button>
                <button
                  onClick={() => openEditModal(todo)}
                  className="bg-blue-600 text-white py-1 px-2 rounded hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>
        {editingTodo && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-800 p-4 rounded">
              <h2 className="text-xl font-semibold mb-4">Edit Todo</h2>
              <textarea
                className="w-full p-2 border border-gray-700 bg-gray-800 text-white rounded-lg mb-4"
                rows={4}
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Edit task..."
              />
              <div className="flex justify-end">
                <button
                  onClick={closeEditModal}
                  className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateTodo}
                  className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}