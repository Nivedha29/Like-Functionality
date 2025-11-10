export function normalizeApiError(err) {
  // Common Axios shapes
  const status = err?.response?.status;
  const data = err?.response?.data;

  // RealWorld/Conduit-style: { errors: { title: ["has already been taken"] } }
  if (data?.errors && typeof data.errors === 'object') {
    const field = Object.keys(data.errors)[0]; // e.g., "title" or "description"
    const firstMsg = data.errors[field]?.[0] || '';
    const msgLower = `${firstMsg}`.toLowerCase();

    if (msgLower.includes('taken') || msgLower.includes('duplicate')) {
      return {
        userMessage: `An article with this ${field} already exists. Please choose a different ${field}.`,
        field,
        code: 'DUPLICATE',
        status: status || 422,
      };
    }

    // Generic validation
    return {
      userMessage: 'Please check the highlighted fields and try again.',
      fieldErrors: data.errors, // pass to form if you want per-field display
      code: 'VALIDATION',
      status: status || 422,
    };
  }

  // Some backends return { message: "duplicate key..." } or 409 Conflict
  const msg = data?.message || err.message || '';
  const lower = msg.toLowerCase();
  if (status === 409 || lower.includes('duplicate') || lower.includes('already exists')) {
    // Try to guess the field mentioned
    const field = lower.includes('title')
      ? 'title'
      : lower.includes('description')
        ? 'description'
        : undefined;
    return {
      userMessage: field
        ? `An article with this ${field} already exists. Please choose a different ${field}.`
        : 'An article with the same title or description already exists. Please choose a different one.',
      field,
      code: 'DUPLICATE',
      status: status || 409,
    };
  }

  // Fallback
  return {
    userMessage: 'Something went wrong while saving the article. Please try again.',
    code: 'UNKNOWN',
    status: status || 500,
  };
}
