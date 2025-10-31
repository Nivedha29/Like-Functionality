import React from "react";
import { useAuth } from "../state/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();
  return (
    <div className="container">
      <h2>Profile</h2>
      <div className="card">
        {user ? (
          <>
            <p><strong>Username: </strong>{user.username}</p>
            <p><strong>Email: </strong>{user.email}</p>
          </>
        ) : (
          <p>Not logged in.</p>
        )}
      </div>
    </div>
  );
}