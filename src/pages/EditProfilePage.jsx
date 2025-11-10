import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Api } from '../services/api';
import { useAuth } from '../state/AuthContext';

export default function EditProfilePage() {
  const { token, user, setUser } = useAuth(); // setUser must exist in your context (see note below)
  const [values, setValues] = useState({ username: '', email: '', bio: '', image: '' });
  const [password, setPassword] = useState('');
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');
  const [fieldErrors, setFieldErrors] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fill = (u) =>
      setValues({
        username: u?.username || '',
        email: u?.email || '',
        bio: u?.bio || '',
        image: u?.image || '',
      });

    if (user) fill(user);
    else {
      (async () => {
        try {
          const { user: u } = await Api.currentUser(token);
          fill(u);
        } catch {}
      })();
    }
  }, [user, token]);

  const handleChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setApiError('');
    setFieldErrors(null);

    try {
      const { user: updated } = await Api.updateUser(token, {
        ...values,
        password: password || undefined, // only send if entered
      });

      if (typeof setUser === 'function') setUser(updated); // update context
      navigate('/profile', { replace: true });
    } catch (err) {
      const banner =
        err?.errors && typeof err.errors === 'object'
          ? Object.entries(err.errors)
              .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : String(v)}`)
              .join(' • ')
          : err?.message || 'Request failed';

      // some servers return duplicate info in body; normalize a bit
      const bodyMsg = Array.isArray(err?.errors?.body) ? err.errors.body[0] : '';
      const joined = `${banner} ${bodyMsg}`.toLowerCase();
      let normalized = err?.errors || null;
      if (/unique/.test(joined) && /username/.test(joined)) {
        normalized = { ...normalized, username: ['has already been taken'] };
      }
      if (/unique/.test(joined) && /email/.test(joined)) {
        normalized = { ...normalized, email: ['has already been taken'] };
      }

      setApiError(banner);
      setFieldErrors(normalized);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 720 }}>
      <h2>Edit Profile</h2>

      {apiError && (
        <div
          className="alert error"
          role="alert"
          style={{ background: '#fff3f3', color: '#b00020', padding: 8 }}
        >
          {apiError}
        </div>
      )}

      <form className="card form" onSubmit={handleSubmit} noValidate>
        <div className="field">
          <label>Username</label>
          <input name="username" value={values.username} onChange={handleChange} />
          {fieldErrors?.username && <div className="error">{fieldErrors.username[0]}</div>}
        </div>

        <div className="field">
          <label>Email</label>
          <input name="email" type="email" value={values.email} onChange={handleChange} />
          {fieldErrors?.email && <div className="error">{fieldErrors.email[0]}</div>}
        </div>

        <div className="field">
          <label>Bio</label>
          <textarea name="bio" rows={5} value={values.bio} onChange={handleChange} />
        </div>

        <div className="field">
          <label>Image URL</label>
          <input name="image" value={values.image} onChange={handleChange} />
        </div>

        <div className="field">
          <label>New Password (optional)</label>
          <input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="actions">
          <button className="btn primary" type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
