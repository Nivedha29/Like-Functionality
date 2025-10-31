import { Link } from "react-router-dom";

export default function Avatar({ author, size = 40, className = "" }) {
  const name = author?.username || author?.name || "User";
  const url =
    author?.image ||
    `https://i.pravatar.cc/${size * 2}?u=${encodeURIComponent(name)}`;

  return (
    <Link to={`/profile/${name}`} style={{ display: "inline-block" }}>
      <img
        src={url}
        alt={`${name} avatar`}
        width={size}
        height={size}
        className={`avatar ${className}`}
        style={{ cursor: "pointer" }}
      />
    </Link>
  );
}