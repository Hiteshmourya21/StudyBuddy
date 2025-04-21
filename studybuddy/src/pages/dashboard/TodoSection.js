
import React, { createContext, useContext, useEffect, useState } from "react";

const TODOContexts = createContext();
const useTODO = () => useContext(TODOContexts);

const TodoSection = () => {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("todos"));
    if (stored?.length > 0) setTodos(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todo) => {
    setTodos((prev) => [{ id: Date.now(), ...todo }, ...prev]);
  };
  const updateTodo = (id, todo) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...todo } : t))
    );
  };
  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };
  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  };

  return (
    <TODOContexts.Provider
      value={{ todos, addTodo, updateTodo, deleteTodo, toggleComplete }}
    >
      <div className="bg-orange-50 p-4 rounded-2xl">
        <TodoForm />
        <div className="flex flex-col gap-3 mt-4">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </div>
      </div>
    </TODOContexts.Provider>
  );
};

const TodoForm = () => {
  const [todo, setTodo] = useState("");
  const { addTodo } = useTODO();

  const submit = (e) => {
    e.preventDefault();
    if (!todo.trim()) return;
    addTodo({ todo, completed: false });
    setTodo("");
  };

  return (
    <form onSubmit={submit} className="flex">
      <input
        type="text"
        placeholder="Write something..."
        className="flex-1 border border-orange-200 bg-orange-100 rounded-l-xl px-3 py-2 outline-none"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
      />
      <button
        type="submit"
        className="bg-orange-500 text-white px-4 py-2 rounded-r-xl hover:bg-orange-600 transition"
      >
        Add
      </button>
    </form>
  );
};
const TodoItem = ({ todo }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [msg, setMsg] = useState(todo.todo);
  const { updateTodo, deleteTodo, toggleComplete } = useTODO();

  const edit = () => {
    updateTodo(todo.id, { ...todo, todo: msg });
    setIsEdit(false);
  };

  return (
    <div
      className={`flex items-center justify-between gap-2 border border-orange-100 p-3 rounded-xl shadow-sm ${
        todo.completed ? "bg-lime-100" : "bg-orange-100"
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleComplete(todo.id)}
          className="accent-orange-500 w-5 h-5 cursor-pointer"
        />
        <input
          type="text"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          readOnly={!isEdit}
          className={`w-full bg-transparent outline-none border-b-2 ${
            isEdit ? "border-orange-300" : "border-transparent"
          } ${todo.completed ? "line-through text-gray-500" : ""}`}
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => {
            if (todo.completed) return;
            isEdit ? edit() : setIsEdit(true);
          }}
          className="px-2 py-1 text-sm rounded border bg-white hover:bg-orange-100 disabled:opacity-50"
          disabled={todo.completed}
        >
          {isEdit ? "💾" : "✏️"}
        </button>
        <button
          onClick={() => deleteTodo(todo.id)}
          className="px-2 py-1 text-sm rounded border bg-white hover:bg-red-100"
        >
          ❌
        </button>
      </div>
    </div>
  );
};

export default TodoSection;