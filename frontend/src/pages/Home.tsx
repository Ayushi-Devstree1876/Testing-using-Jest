import { useEffect, useState } from "react";
import { getTodos } from "../api/todoService";
import TodoForm from "../components/TodoForm";
import TodoList from "../components/TodoList";

export default function Home() {
  const [todos, setTodos] = useState<any[]>([]);
  const token = localStorage.getItem("token") || "";

  const loadTodos = async () => {
    try {
      if (!token) {
        console.warn("No token found. Please login first.");
        return;
      }
      const res = await getTodos(token);
      setTodos(res.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 border rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-4 text-center">Todo App</h1>
      <TodoForm onAdd={loadTodos} />
      <TodoList todos={todos} refresh={loadTodos} />
    </div>
  );
}
