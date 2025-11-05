import { deleteTodo, updateTodo } from "../api/todoService";

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

interface TodoListProps {
  todos: Todo[];
  refresh: () => void;
}

export default function TodoList({ todos = [], refresh }: TodoListProps) {
  const handleDelete = async (id: number) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");
    try {
      await deleteTodo(id, token);
      refresh();
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  const handleToggleComplete = async (todo: Todo) => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first");
    try {
      await updateTodo(
        { ...todo, completed: !todo.completed },
        todo.id,
        token
      );
      refresh();
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  if (!todos || todos.length === 0) {
    return <p className="text-gray-500">No todos yet. Add one above!</p>;
  }

  return (
    <ul className="space-y-3 mt-4">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className={`flex justify-between items-center p-3 border rounded ${
            todo.completed ? "bg-green-100" : "bg-white"
          }`}
        >
          <div>
            <span
              className={`cursor-pointer ${
                todo.completed ? "line-through text-gray-400" : ""
              }`}
              onClick={() => handleToggleComplete(todo)}
            >
              {todo.title}
            </span>
            <p className="text-xs text-gray-500">
              by {todo.user?.username || "Unknown"}
            </p>
          </div>
          <button
            onClick={() => handleDelete(todo.id)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
