const API_ROOT = "https://realworld.habsida.net/api";

function authHeaders(token) {
  return token ? { Authorization: `Token ${token}` } : {};
}

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const error = body?.errors || { message: res.statusText, status: res.status };
    throw error;
  }
  return res.json();
}

export const Api = {
  // Auth
  async login({ email, password }) {
    const res = await fetch(`${API_ROOT}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: { email, password } }),
    });
    return handle(res);
  },
  async register({ username, email, password }) {
    const res = await fetch(`${API_ROOT}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: { username, email, password } }),
    });
    return handle(res);
  },
  async currentUser(token) {
    const res = await fetch(`${API_ROOT}/user`, {
      headers: { "Content-Type": "application/json", ...authHeaders(token) },
    });
    return handle(res);
  },

  // Articles
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
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders(token) },
      body: JSON.stringify({ article: { title, description, body, tagList } }),
    });
    return handle(res);
  },
  async updateArticle(token, slug, { title, description, body, tagList = [] }) {
    const res = await fetch(`${API_ROOT}/articles/${encodeURIComponent(slug)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders(token) },
      body: JSON.stringify({ article: { title, description, body, tagList } }),
    });
    return handle(res);
  },
  async deleteArticle(token, slug) {
    const res = await fetch(`${API_ROOT}/articles/${encodeURIComponent(slug)}`, {
      method: "DELETE",
      headers: { ...authHeaders(token) },
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      const error = body?.errors || { message: res.statusText, status: res.status };
      throw error;
    }
    return true;
  },
};