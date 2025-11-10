import React from 'react';
import { useAuth } from '../state/AuthContext';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="container">
        <h2>Profile</h2>
        <div className="card">
          <p>Not logged in.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <h2>Profile</h2>

      <div className="card" style={{ padding: 16 }}>
        <p>
          <strong>Username: </strong>
          {user.username}
        </p>
        <p>
          <strong>Email: </strong>
          {user.email}
        </p>
        {user.bio && (
          <p>
            <strong>Bio: </strong>
            {user.bio}
          </p>
        )}
        {user.image && (
          <p>
            <img
              src={user.image}
              alt="profile avatar"
              style={{
                width: 100,
                height: 100,
                borderRadius: '50%',
                objectFit: 'cover',
                marginTop: 10,
              }}
            />
          </p>
        )}

        <div className="actions" style={{ marginTop: 16 }}>
          <Link to="/profile/edit" className="btn primary">
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
