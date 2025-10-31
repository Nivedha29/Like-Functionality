// src/pages/registerPage.jsx
import React from "react";
import { useForm } from "react-hook-form";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [serverError, setServerError] = React.useState("");

  const onSubmit = async (formData) => {
    try {
      // TODO: call your API here
      // await fetch("/api/register", { ... });
      console.log("formData", formData);
      setServerError(""); // clear old error on success
    } catch {
      setServerError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="page auth-page">
      <h1>Sign up</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label>
          Username
          <input
            {...register("username", { required: "Username is required" })}
            type="text"
          />
          {errors.username && <p className="error">{errors.username.message}</p>}
        </label>

        <label>
          Email
          <input
            {...register("email", { required: "Email is required" })}
            type="email"
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </label>

        <label>
          Password
          <input
            {...register("password", { required: "Password is required" })}
            type="password"
          />
          {errors.password && <p className="error">{errors.password.message}</p>}
        </label>

        <button type="submit">Create account</button>
      </form>

      {serverError ? <p className="error">{serverError}</p> : null}
    </div>
  );
}
