const STORAGE_KEY = 'liked-articles';

export function getLikedArticles() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function isArticleLiked(slug) {
  const liked = getLikedArticles();
  return liked.includes(slug);
}

export function toggleArticleLike(slug) {
  const liked = getLikedArticles();
  let next;
  if (liked.includes(slug)) {
    next = liked.filter((s) => s !== slug);
  } else {
    next = [...liked, slug];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}
