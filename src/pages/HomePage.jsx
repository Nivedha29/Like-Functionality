import React, { useEffect, useState } from 'react';
import { Api } from '../services/api';
import Avatar from '../components/Avatar';
import LikeButton from '../components/LikeButton';
import { Link } from "react-router-dom";


export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await Api.listArticles({ limit: 10, offset: 0 });
        console.log('API /articles response:', res);
        setArticles(res?.articles ?? []);
      } catch (e) {
        console.error('listArticles error:', e);
        setErr(e);
      }
    })();
  }, []);

  return (
    <div className="container">
      <h2>Latest Articles</h2>
      {err && <div className="alert error">Error: {String(err.message || err)}</div>}

      <div className="grid">
        {articles.map((a) => (
          <article key={a.slug} className="card linkcard" style={{ padding: 16, marginBottom: 12 }}>
            {/* Author header */}
            {a?.author && (
              <div className="article-meta" style={{ marginBottom: 8, display: 'flex', gap: 8 }}>
                <Link to={`/profile/${a.author?.username || a.author?.name || 'user'}`}>
                  <Avatar author={a.author} />
                </Link>
                <div className="info">
                  <Link
                    to={`/profile/${a.author?.username || a.author?.name || 'user'}`}
                    className="author"
                  >
                    {a.author?.username || a.author?.name || 'User'}
                  </Link>
                  <span className="date" style={{ display: 'block', fontSize: 12, opacity: 0.7 }}>
                    {a?.createdAt ? new Date(a.createdAt).toDateString() : ''}
                  </span>
                </div>
              </div>
            )}

            {/* Title links to the article page */}
            <h3 style={{ margin: 0 }}>
              <Link to={`/articles/${a.slug}`}>{a.title}</Link>
            </h3>
            <p style={{ marginTop: 6 }}>{a.description}</p>

            <div style={{ marginTop: 12, display: 'flex', justifyContent: 'flex-end' }}>
              <LikeButton slug={a.slug} />
            </div>
          </article>
        ))}
        {articles.length === 0 && !err && <p style={{ color: '#6b7280' }}>No articles yet.</p>}
      </div>
    </div>
  );
}
