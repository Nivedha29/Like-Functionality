import React, { useEffect, useState } from "react";
import { Api } from "../services/api";
import Avatar from "../components/Avatar";
import LikeButton from "../components/LikeButton";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";

const PAGE_SIZE = 10;

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        const offset = (page - 1) * PAGE_SIZE;
        const res = await Api.listArticles({ limit: PAGE_SIZE, offset });

        console.log("API /articles response:", res);
        setArticles(res?.articles ?? []);
        setTotalCount(res?.articlesCount ?? 0);
      } catch (e) {
        console.error("listArticles error:", e);
        setErr(e);
      } finally {
        setLoading(false);
      }
    })();
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div className="container">
      <div className="latest-header">
    <h2 className="latest-title">Latest Articles</h2>
  </div>
      {err && (
        <div className="alert error">
          Error: {String(err.message || err)}
        </div>
      )}

      {loading && <p>Loading...</p>}

      <div className="grid">
        {!loading &&
          articles.map((a) => (
            <article
              key={a.slug}
              className="card linkcard"
              style={{ padding: 16, marginBottom: 12 }}
            >
              {/* Author header */}
              {a?.author && (
                <div
                  className="article-meta"
                  style={{
                    marginBottom: 8,
                    display: "flex",
                    gap: 8,
                  }}
                >
                  <Link
                    to={`/profile/${
                      a.author?.username || a.author?.name || "user"
                    }`}
                  >
                    <Avatar author={a.author} />
                  </Link>
                  <div className="info">
                    <Link
                      to={`/profile/${
                        a.author?.username || a.author?.name || "user"
                      }`}
                      className="author"
                    >
                      {a.author?.username || a.author?.name || "User"}
                    </Link>
                    <span
                      className="date"
                      style={{
                        display: "block",
                        fontSize: 12,
                        opacity: 0.7,
                      }}
                    >
                      {a?.createdAt
                        ? new Date(a.createdAt).toDateString()
                        : ""}
                    </span>
                  </div>
                </div>
              )}

              {/* Title links to the article page */}
              <h3 style={{ margin: 0 }}>
                <Link to={`/articles/${a.slug}`}>{a.title}</Link>
              </h3>
              <p style={{ marginTop: 6 }}>{a.description}</p>

              <div
                style={{
                  marginTop: 12,
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <LikeButton slug={a.slug} />
              </div>
            </article>
          ))}

        {!loading && articles.length === 0 && !err && (
          <p style={{ color: "#6b7280" }}>No articles yet.</p>
        )}
      </div>

      {/* Pagination under the grid */}
      <Pagination
        page={page}
        totalItems={totalCount}
        pageSize={PAGE_SIZE}
        onChange={handlePageChange}
      />
    </div>
  );
}
