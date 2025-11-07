import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import PrivateRoute from './routes/PrivateRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/registerPage.jsx';
import ProfilePage from './pages/ProfilePage';
import ArticlePage from './pages/ArticlePage';
import NewArticlePage from './pages/NewArticlePage';
import EditArticlePage from './pages/EditArticlePage';
import { useAuth } from './state/AuthContext';
import Profile from './pages/Profile.jsx';
import TaskPage from './pages/TaskPage';

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div className="app-shell">
      <header className="topbar">
        <Link to="/" className="brand">
          RealWorld Blog
        </Link>
        <nav className="nav">
          <Link to="/">Home</Link>
          {user && <Link to="/tasks">Tasks</Link>} {/* Show only if logged in */}
          {user ? (
            <>
              <Link to="/new-article" className="btn">
                New Article
              </Link>
              <Link to="/profile">Profile</Link>
              <button className="btn linklike" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/sign-in">Sign in</Link>
              <Link to="/sign-up">Sign up</Link>
            </>
          )}
        </nav>
      </header>

      <main className="main">
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Protected Task Page */}
          <Route
            path="/tasks"
            element={
              <PrivateRoute>
                <TaskPage />
              </PrivateRoute>
            }
          />

          <Route path="/sign-in" element={<LoginPage />} />
          <Route path="/sign-up" element={<RegisterPage />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route path="/articles/:slug" element={<ArticlePage />} />
          <Route
            path="/new-article"
            element={
              <PrivateRoute>
                <NewArticlePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/articles/:slug/edit"
            element={
              <PrivateRoute>
                <EditArticlePage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
