import React, { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { Api } from "../services/api";
import { useAuth } from "../state/AuthContext";
import errorText from "../errorText"; 

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [err, setErr] = useState("");       
  const [loading, setLoading] = useState(false);

  if (user) return <Navigate to={from} replace />;

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErr("");

      const { user } = await Api.login(form);
      login(user, user.token);
      navigate(from, { replace: true });
    } catch (e2) {
      
      const nice = errorText(e2) || "Login failed. Please check your email or password and try again.";
      setErr(nice);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Sign in</h2>

        {/* friendly error text */}
        {err ? <div className="alert error">{err}</div> : null}

        <form className="card form" onSubmit={submit}>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              required
            />
          </div>

          <button className="btn primary" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}