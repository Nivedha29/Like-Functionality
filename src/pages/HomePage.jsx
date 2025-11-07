import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Api } from '../services/api';
import Avatar from '../components/Avatar';
import LikeButton from '../components/LikeButton';

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [err, setErr] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await Api.listArticles({ limit: 10, offset: 0 });
        setArticles(res?.articles ?? []);
      } catch (e) {
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
          <Link key={a.slug} to={`/articles/${a.slug}`} className="card linkcard">
            {/* Author header */}
            {a?.author && (
              <div className="article-meta" style={{ marginBottom: 8, display: 'flex', gap: 8 }}>
                <Link
                  to={`/profile/${a.author?.username || a.author?.name || 'user'}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Avatar author={a.author} />
                </Link>
                <div className="info">
                  <Link
                    to={`/profile/${a.author?.username || a.author?.name || 'user'}`}
                    className="author"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {a.author?.username || a.author?.name || 'User'}
                  </Link>
                  <span className="date" style={{ display: 'block', fontSize: 12, opacity: 0.7 }}>
                    {a?.createdAt ? new Date(a.createdAt).toDateString() : ''}
                  </span>
                </div>
              </div>
            )}

            {/* Content */}
            <h3>{a.title}</h3>
            <p>{a.description}</p>

            {/* Like button */}
            <div
              style={{
                marginTop: 12,
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <LikeButton slug={a.slug} />
            </div>
          </Link>
        ))}

        {articles.length === 0 && !err && <p style={{ color: '#6b7280' }}>No articles yet.</p>}
      </div>
    </div>
  );
}
