import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Api } from '../services/api';

export default function NewArticle() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [body, setBody] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // const { token } = useAuth();
  const token = localStorage.getItem('token'); // example; use your real token source

  const toTagList = (s) =>
    Array.from(
      new Set(
        s
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      )
    );

  // ✅ Move your async logic inside this function
  async function onSubmit(e) {
    e.preventDefault();
    setError('');

    try {
      // call your API (either custom Api.createArticle or fetch)
      const { article } = await Api.createArticle(token, {
        title,
        description,
        body,
        tagList: toTagList(tags), // ✅ key must be tagList (array)
      });

      // ✅ navigate after success
      router.push(`/article/${article.slug}`);
    } catch (err) {
      // handle error
      const msg =
        err?.message ||
        (err?.body && JSON.stringify(err.body)) ||
        (err?.errors && JSON.stringify(err.errors)) ||
        'Could not save article. Please try again.';
      setError(msg);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <textarea placeholder="Body" value={body} onChange={(e) => setBody(e.target.value)} />
      <input
        placeholder="Tags (comma-separated)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <button type="submit">Save Article</button>
    </form>
  );
}
