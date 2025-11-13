import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';

import PrivateRoute from './routes/PrivateRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/registerPage.jsx';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage.jsx';
import ArticlePage from './pages/ArticlePage';
import NewArticlePage from './pages/NewArticlePage';
import EditArticlePage from './pages/EditArticlePage';
import Profile from './pages/Profile.jsx';
import { useAuth } from './state/AuthContext';

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

          {user ? (
            <>
              <Link to="/new-article" className="btn">
                New Article
              </Link>

              {/* avatar + username */}
              <Link to="/profile" className="user-info">
                <img
                  src={
                    user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`
                  }
                  alt={user.username}
                  className="avatar"
                />

                <span>{user.username}</span>
              </Link>

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
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/sign-in" element={<LoginPage />} />
          <Route path="/sign-up" element={<RegisterPage />} />

          {/* Public profile by username */}
          <Route path="/profile/:username" element={<Profile />} />

          {/* Auth-protected routes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />

          <Route
            path="/profile/edit"
            element={
              <PrivateRoute>
                <EditProfilePage />
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

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
