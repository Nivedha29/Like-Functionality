// src/components/TaskPanel.jsx
import React, { useState } from "react";

export default function TaskPanel() {
  const [tasks, setTasks] = useState([
    { id: 1, text: "Check API (GET /articles)", done: false },
    { id: 2, text: "Verify login & private routes", done: true },
  ]);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    const value = input.trim();
    if (!value) {
      setError("Task cannot be empty.");
      return;
    }
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: value,
        done: false,
      },
    ]);
    setInput("");
    setError("");
  };

  const handleToggle = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div
      className="task-panel"
      style={{
        background: "#fff",
        borderRadius: "1rem",
        padding: "1rem 1.25rem",
        boxShadow: "0 10px 30px rgba(15,23,42,0.05)",
        border: "1px solid rgba(148, 163, 184, 0.2)",
      }}
    >
      <h3 style={{ marginBottom: "0.75rem" }}>Tasks</h3>
      <form
        onSubmit={handleAdd}
        style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new task…"
          style={{
            flex: 1,
            border: "1px solid #d1d5db",
            borderRadius: "0.5rem",
            padding: "0.4rem 0.6rem",
          }}
        />
        <button
          type="submit"
          style={{
            background: "#16a34a",
            color: "#fff",
            border: "none",
            borderRadius: "0.5rem",
            padding: "0 0.9rem",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Add
        </button>
      </form>
      {error ? (
        <p style={{ color: "#b91c1c", fontSize: "0.78rem", marginBottom: 8 }}>
          {error}
        </p>
      ) : null}

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem",
        }}
      >
        {tasks.length === 0 ? (
          <p style={{ color: "#6b7280", fontSize: "0.85rem" }}>
            No tasks. Add one above.
          </p>
        ) : (
          tasks.map((task) => (
            <li
              key={task.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "#f8fafc",
                borderRadius: "0.5rem",
                padding: "0.4rem 0.6rem",
              }}
            >
              <label style={{ display: "flex", gap: "0.5rem" }}>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => handleToggle(task.id)}
                />
                <span
                  style={{
                    textDecoration: task.done ? "line-through" : "none",
                    color: task.done ? "#94a3b8" : "#1f2937",
                  }}
                >
                  {task.text}
                </span>
              </label>
              <button
                onClick={() => handleDelete(task.id)}
                type="button"
                style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    color: "#ef4444",
                    fontSize: "1rem",
                }}
              >
                ✕
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
