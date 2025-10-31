import { useEffect, useState } from "react";
import {
  isArticleLiked,
  toggleArticleLike,
} from "../utils/likes";

export default function LikeButton({ slug }) {
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (slug) {
      setLiked(isArticleLiked(slug));
    }
  }, [slug]);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const after = toggleArticleLike(slug);
    setLiked(after.includes(slug));
  };

  return (
    <button
      onClick={handleClick}
      className={`like-btn ${liked ? "liked" : ""}`}
      style={{
        border: "none",
        background: "transparent",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        fontSize: 14,
      }}
      aria-pressed={liked}
    >
      <span style={{ fontSize: "1rem" }}>{liked ? "❤️" : "🤍"}</span>
      <span>{liked ? "Liked" : "Like"}</span>
    </button>
  );
}
