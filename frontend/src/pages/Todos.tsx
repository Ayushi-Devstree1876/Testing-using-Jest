import { useEffect, useState } from "react";
import { getTodos, createTodo, deleteTodo } from "../api/todoService";

export default function Todos() {
  const [todos, setTodos] = useState<any[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const token = localStorage.getItem("token") || "";

  const loadTodos = async () => {
    const res = await getTodos(token);
    setTodos(res.data);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const handleAdd = async () => {
    await createTodo({ title: newTodo }, token);
    setNewTodo("");
    loadTodos();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl mb-4">Your Todos</h2>
      <input
        className="border p-2 mr-2"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="New Todo"
      />
      <button className="bg-blue-500 text-white px-3 py-1" onClick={handleAdd}>
        Add
      </button>
      <ul className="mt-4">
        {todos.map((todo) => (
          <li key={todo.id} className="border p-2 flex justify-between my-2">
            {todo.title}
            <button
              onClick={() => deleteTodo(todo.id, token).then(loadTodos)}
              className="bg-red-500 text-white px-3"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
