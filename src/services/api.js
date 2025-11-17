const API_ROOT = 'https://realworld.habsida.net/api';

function authHeaders(token) {
  return token ? { Authorization: `Token ${token}` } : {};
}

async function handle(res) {
  const contentType = res.headers.get("content-type")?.toLowerCase() || "";
  const isJson = contentType.includes("application/json");

  let body = {};
  let text = "";

  // Parse JSON or plain text depending on response
  if (isJson) {
    body = await res.json().catch(() => ({}));
  } else {
    text = await res.text().catch(() => "");
  }

  if (!res.ok) {
    const errors = body?.errors || null;

    const message =
      body?.message ||
      (text && text.trim()) ||   // <- will catch "Invalid credentials"
      res.statusText ||
      "Request failed";

    throw {
      status: res.status,
      message,
      errors,
    };
  }

  // success: return JSON if there is one, otherwise raw text
  return Object.keys(body).length ? body : text;
}


export const Api = {
  async listArticles({ limit = 10, offset = 0 } = {}) {
    const res = await fetch(`${API_ROOT}/articles?limit=${limit}&offset=${offset}`);
    return handle(res);
  },
  async getArticle(slug) {
    const res = await fetch(`${API_ROOT}/articles/${encodeURIComponent(slug)}`);
    return handle(res);
  },
  async createArticle(token, { title, description, body, tagList = [] }) {
    const res = await fetch(`${API_ROOT}/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
      body: JSON.stringify({ article: { title, description, body, tagList } }),
    });
    return handle(res);
  },
  async updateArticle(token, slug, { title, description, body, tagList = [] }) {
    const res = await fetch(`${API_ROOT}/articles/${encodeURIComponent(slug)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
      body: JSON.stringify({ article: { title, description, body, tagList } }),
    });
    return handle(res);
  },
  async deleteArticle(token, slug) {
    const res = await fetch(`${API_ROOT}/articles/${encodeURIComponent(slug)}`, {
      method: 'DELETE',
      headers: { ...authHeaders(token) },
    });
    return handle(res);
  },
  async login({ email, password }) {
    const res = await fetch(`${API_ROOT}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: { email, password } }),
    });
    return handle(res);
  },
  async register({ username, email, password }) {
    const res = await fetch(`${API_ROOT}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: { username, email, password } }),
    });
    return handle(res);
  },
  async currentUser(token) {
    const res = await fetch(`${API_ROOT}/user`, {
      headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
    });
    return handle(res);
  },

  async updateUser(token, { username, email, bio, image, password }) {
    const payload = {
      // required
      username: (username ?? '').trim(),
      email: (email ?? '').trim(),
      // optional
      bio: bio ?? '',
      image: image ? image.trim() : '',
      ...(password ? { password } : {}), // only include password if user typed it
    };

    const res = await fetch(`${API_ROOT}/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(token),
      },
      body: JSON.stringify(payload),
    });

    return handle(res); // -> { user: {...} }
  },
};
