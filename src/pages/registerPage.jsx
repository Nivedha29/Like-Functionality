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
      // await Api.register(formData);
      console.log("formData", formData);
      setServerError("");
    } catch (e) {
      setServerError("Registration failed. Please try again.");
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
              {...register("password", { required: "Password is required" })}
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
