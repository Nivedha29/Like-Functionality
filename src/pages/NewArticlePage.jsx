import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ArticleForm from "../components/ArticleForm";
import { Api } from "../services/api";
import { useAuth } from "../state/AuthContext";

export default function NewArticlePage() {
  const { token } = useAuth();
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);
      setApiError(null);
      const { article } = await Api.createArticle(token, payload);
      navigate(`/articles/${article.slug}`, { replace: true });
    } catch (err) {
      setApiError(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <h2>Create New Article</h2>
      {apiError && <div className="alert error">Failed to save: {JSON.stringify(apiError)}</div>}
      <ArticleForm onSubmit={handleSubmit} submitting={saving} />
    </div>
  );
}