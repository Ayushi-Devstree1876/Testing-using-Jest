import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../api/todoService";

export default function Dashboard() {
  const [todos, setTodos] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  // ✅ Redirect if no token
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (!storedToken) {
      navigate("/login");
    } else {
      setToken(storedToken);
    }
  }, [navigate]);

  // ✅ Fetch todos
  const fetchTodos = async () => {
    if (!token) return;
    try {
      const data = await getTodos(token);
      if (Array.isArray(data)) setTodos(data);
      else if (data.todos) setTodos(data.todos);
    } catch (err) {
      console.error("Error fetching todos:", err);
    }
  };

  // ✅ Add new todo
  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return alert("Login first!");
    if (!title.trim()) return alert("Title cannot be empty!");
    try {
      await createTodo({ title, description, completed }, token);
      setTitle("");
      setDescription("");
      setCompleted(false);
      fetchTodos();
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  // ✅ Update todo
  const handleUpdate = async (id: number) => {
    if (!token) return;
    if (!editTitle.trim()) return alert("Title cannot be empty!");
    try {
      await updateTodo(id, { title: editTitle }, token);
      setEditingId(null);
      setEditTitle("");
      fetchTodos();
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  // ✅ Delete todo
  const handleDelete = async (id: number) => {
    if (!token) return;
    if (!confirm("Are you sure you want to delete this todo?")) return;
    try {
      await deleteTodo(id, token);
      fetchTodos();
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    alert("You have been logged out successfully!");
    navigate("/login");
  };

  useEffect(() => {
    if (token) fetchTodos();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-xl p-6">
        {/* ✅ Main Heading */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700">Todo Dashboard</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <form
          onSubmit={handleAddTodo}
          className="flex flex-col gap-3 mb-6 p-4 border rounded bg-gray-50"
        >
          <input
            type="text"
            placeholder="Enter todo title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 rounded"
          />
          <textarea
            placeholder="Enter description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded"
          ></textarea>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
            />
            Mark as Completed
          </label>
          <button
            type="submit"
            className="bg-blue-600 text-white rounded py-2 hover:bg-blue-700"
          >
            Add Todo
          </button>
        </form>

        {todos.length === 0 ? (
          <p className="text-gray-600 text-center">No todos found</p>
        ) : (
          <ul className="space-y-4">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm"
              >
                {editingId === todo.id ? (
                  <div className="flex items-center w-full gap-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-grow border rounded px-2 py-1"
                    />
                    <button
                      onClick={() => handleUpdate(todo.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditTitle("");
                      }}
                      className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col flex-grow">
                      <span
                        className={`font-semibold ${
                          todo.completed
                            ? "line-through text-gray-400"
                            : "text-gray-800"
                        }`}
                      >
                        {todo.title}
                      </span>
                      {todo.description && (
                        <span className="text-gray-500 text-sm">
                          {todo.description}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingId(todo.id);
                          setEditTitle(todo.title);
                        }}
                        className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
