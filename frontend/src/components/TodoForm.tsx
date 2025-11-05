import { useState } from "react";
import { createTodo } from "../api/todoService";

interface TodoFormProps {
  onAdd: () => void;
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first!");
      return;
    }

    if (!title.trim()) {
      alert("Title cannot be empty!");
      return;
    }

    try {
      await createTodo({ title, description }, token); // ✅ correct payload
      setTitle("");
      setDescription("");
      onAdd();
    } catch (err: any) {
      console.error("Error creating todo:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to create todo");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 mb-6 p-4 border rounded shadow-sm bg-white"
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
      <button
        type="submit"
        className="bg-blue-600 text-white rounded py-2 hover:bg-blue-700"
      >
        Add Todo
      </button>
    </form>
  );
}
