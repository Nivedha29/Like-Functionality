const API_ROOT = 'https://realworld.habsida.net/api';

function authHeaders(token) {
  return token ? { Authorization: `Token ${token}` } : {};
}

async function handle(res) {
  const isJson = res.headers.get('content-type')?.toLowerCase().includes('application/json');
  const body = isJson ? await res.json().catch(() => ({})) : {};

  if (!res.ok) {
    throw {
      status: res.status,
      message: body?.message || res.statusText || 'Request failed',
      errors: body?.errors || null,
    };
  }
  return body;
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
      user: {
        ...(username != null ? { username: username.trim() } : {}),
        ...(email != null ? { email: email.trim() } : {}),
        ...(bio != null ? { bio } : {}),
        ...(image != null ? { image: image.trim() } : {}),
        // password is optional; only send if provided
        ...(password ? { password } : {}),
      },
    };

    const res = await fetch(`${API_ROOT}/user`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...authHeaders(token) },
      body: JSON.stringify(payload),
    });
    return handle(res); // -> { user: {...} }
  },
};
