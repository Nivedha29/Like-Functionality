import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewArticle() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function onSubmit(e) {
    e.preventDefault();

    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, body, tags }),
    });

    if (!res.ok) {
      let data = {};
      try {
        data = await res.json();
      } catch {}
      if (res.status === 409) {
        setError(data.message || "Duplicate title. Please use a different one.");
      } else {
        setError("Could not save article. Please try again.");
      }
      return;
    }

    const article = await res.json();
    router.push(`/article/${article.slug}`);
  }

  return (
    <form onSubmit={onSubmit}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <textarea
        placeholder="Body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <input
        placeholder="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <button type="submit">Save Article</button>
    </form>
  );
}