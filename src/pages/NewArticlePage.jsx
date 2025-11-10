import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ArticleForm from '../components/ArticleForm';
import { Api } from '../services/api';
import { useAuth } from '../state/AuthContext';

export default function NewArticlePage() {
  const { token } = useAuth();
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState('');
  const [serverFieldErrors, setServerFieldErrors] = useState(null);
  const [errorField, setErrorField] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);
      setApiError('');
      setServerFieldErrors(null);
      setErrorField(null);

      // (Optional) keep unique title to avoid duplicate error during testing
      const articlePayload = {
        ...payload,
        title: payload.title.trim(),
        description: payload.description.trim(),
        body: payload.body.trim(),
      };

      const { article } = await Api.createArticle(token, articlePayload);
      navigate(`/articles/${article.slug}`, { replace: true });
    } catch (e) {
      // e looks like: { status, message, errors?: { body: ["SQLiteError: UNIQUE constraint failed: articles.slug"] } }
      let fieldErrors = e?.errors || null;
      let banner = e?.message || 'Request failed';
      let errorField = null;

      // Normalize any duplicate-slug signal (often shoved under "body") -> title error
      const bodyMsg = Array.isArray(fieldErrors?.body) ? fieldErrors.body[0] : '';
      const joined = `${banner} ${bodyMsg}`.toLowerCase();

      if (/unique/.test(joined) && /slug/.test(joined)) {
        fieldErrors = { ...(fieldErrors || {}) };
        delete fieldErrors.body; // stop showing error under Body
        fieldErrors.title = ['has already been taken']; // show under Title instead
        errorField = 'title';
        banner = 'An article with this title already exists. Please choose a different title.';
      }

      setServerFieldErrors(fieldErrors);
      setErrorField(errorField);
      setApiError(banner);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 760 }}>
      <h2>Create New Article</h2>

      {apiError && (
        <div
          className="alert error"
          role="alert"
          style={{ background: '#fff3f3', color: '#b00020', padding: 8 }}
        >
          {apiError}
        </div>
      )}

      <ArticleForm
        onSubmit={handleSubmit}
        submitting={saving}
        fieldErrors={serverFieldErrors}
        errorField={errorField}
      />
    </div>
  );
}
