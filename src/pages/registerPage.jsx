import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const API_ROOT = "https://realworld.habsida.net/api";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [serverError, setServerError] = React.useState("");
  const navigate = useNavigate(); // if you have react-router

  const onSubmit = async (formData) => {
    setServerError("");

    try {
      const res = await fetch(`${API_ROOT}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: {
            username: formData.username,
            email: formData.email,
            password: formData.password,
          },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        // RealWorld error format: { errors: { email: ["has already been taken"], ... } }
        if (data && data.errors) {
          const messages = Object.entries(data.errors)
            .map(
              ([field, msgs]) =>
                `${field} ${Array.isArray(msgs) ? msgs.join(", ") : msgs}`
            )
            .join(" | ");
          setServerError(messages || "Registration failed. Please try again.");
        } else {
          setServerError("Registration failed. Please try again.");
        }
        return;
      }

      // Success – data.user contains token, email, username
      const user = data.user;
      // Save token for later requests
      localStorage.setItem("token", user.token);

      // Redirect to home (or wherever you like)
      navigate("/");
    } catch (e) {
      console.error(e);
      setServerError("Network error. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign up</h2>

        {serverError ? <div className="alert error">{serverError}</div> : null}

        <form className="card form" onSubmit={handleSubmit(onSubmit)}>
          <div className="field">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              {...register("username", { required: "Username is required" })}
            />
            {errors.username && (
              <p className="error-text">{errors.username.message}</p>
            )}
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...register("email", { required: "Email is required" })}
            />
            {errors.email && (
              <p className="error-text">{errors.email.message}</p>
            )}
          </div>

          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
            {errors.password && (
              <p className="error-text">{errors.password.message}</p>
            )}
          </div>

          <button type="submit" className="btn primary">
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}
