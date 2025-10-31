import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Api } from "../services/api";
import { useAuth } from "../state/AuthContext";
import ConfirmModal from "../components/ConfirmModal";

export default function ArticlePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { article } = await Api.getArticle(slug);
        setArticle(article);
      } catch (e) {
        setErr(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  const canEdit = user && article && user.username === article.author?.username;

  const confirmDelete = async () => {
    try {
      await Api.deleteArticle(token, slug);
      navigate("/", { replace: true });
    } catch (e) {
      setErr(e);
    } finally {
      setShowDelete(false);
    }
  };

  if (loading) return <div className="container">Loading...</div>;
  if (err) return <div className="container"><div className="alert error">Error: {JSON.stringify(err)}</div></div>;
  if (!article) return <div className="container">Not found</div>;

  return (
    <div className="container">
      <article className="card">
        <h1 className="article-title">{article.title}</h1>
        <div className="meta">
          <span>by {article.author?.username}</span>
          <span> • {new Date(article.createdAt).toLocaleString()}</span>
        </div>

        {canEdit && (
          <div className="actions">
            <Link className="btn" to={`/articles/${article.slug}/edit`}>Edit</Link>
            <button className="btn danger" onClick={() => setShowDelete(true)}>Delete</button>
          </div>
        )}

        <p className="desc">{article.description}</p>
        <div className="body">{article.body}</div>

        {article.tagList?.length > 0 && (
          <div className="tags">
            {article.tagList.map((t) => (
              <span className="tag" key={t}>{t}</span>
            ))}
          </div>
        )}
      </article>

      <ConfirmModal
        open={showDelete}
        title="Delete article?"
        message="This action cannot be undone."
        onCancel={() => setShowDelete(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}