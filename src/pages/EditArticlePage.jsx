import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ArticleForm from "../components/ArticleForm";
import { Api } from "../services/api";
import { useAuth } from "../state/AuthContext";

export default function EditArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [initial, setInitial] = useState(null);
  const [saving, setSaving] = useState(false);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { article } = await Api.getArticle(slug);
        setInitial(article);
      } catch (e) {
        setApiError(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const handleSubmit = async (payload) => {
    try {
      setSaving(true);
      setApiError(null);
      const { article } = await Api.updateArticle(token, slug, payload);
      navigate(`/articles/${article.slug}`, { replace: true });
    } catch (err) {
      setApiError(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container">
      <h2>Edit Article</h2>
      {apiError && <div className="alert error">Error: {JSON.stringify(apiError)}</div>}
      {initial && <ArticleForm initialValues={initial} onSubmit={handleSubmit} submitting={saving} />}
    </div>
  );
}