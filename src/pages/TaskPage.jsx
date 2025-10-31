
import React from "react";

export default function TaskPage() {
  // you can later load this from API or localStorage
  const tasks = [
    {
      id: 1,
      title: "Perform linting checks",
      detail: "Run `npm run lint` and fix all ESLint warnings/errors to keep code clean.",
      done: false,
    },
    {
      id: 2,
      title: "Review routes in App.jsx",
      detail: "Confirm protected routes (tasks, profile, new article) are behind <PrivateRoute>.",
      done: true,
    },
  ];

  return (
    <div className="page page-tasks">
      <h1>Tasks</h1>
      <p style={{ marginBottom: "1rem", color: "#555" }}>
        These are internal dev tasks for this RealWorld Blog app.
      </p>
      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "0.75rem" }}>
        {tasks.map((task) => (
          <li
            key={task.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "0.5rem",
              padding: "0.75rem 1rem",
              background: "#fff",
            }}
          >
            <label style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <input type="checkbox" checked={task.done} readOnly />
              <div>
                <div style={{ fontWeight: 600 }}>{task.title}</div>
                {task.detail ? (
                  <p style={{ margin: "0.25rem 0 0", fontSize: "0.875rem", color: "#4b5563" }}>
                    {task.detail}
                  </p>
                ) : null}
              </div>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

