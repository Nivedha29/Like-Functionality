function capitalize(s) {
  return typeof s === "string" && s.length ? s[0].toUpperCase() + s.slice(1) : s;
}

export default function errorText(err) {
  // Network/fetch Error instance
  if (err && typeof err.message === "string" && !err.errors) {
    return err.message;
  }

  // If server returned JSON already parsed
  const data = err && err.errors ? err : (err && err.data) ? err.data : err;

  // RealWorld API pattern
  if (data && data.errors && typeof data.errors === "object") {
    // Pick the first field + first message
    const [[field, messages] = []] = Object.entries(data.errors);
    if (field && Array.isArray(messages) && messages.length) {
      // Friendly override for the most common case
      if (field.toLowerCase() === "email or password" && messages[0] === "is invalid") {
        return "Invalid email or password.";
      }
      // Generic: "Email is invalid", "Username can't be blank", etc.
      return `${capitalize(field)} ${messages.join(", ")}`;
    }
  }

  // If backend sent a plain string somewhere
  if (typeof data === "string") return data;

  // Nothing recognizable
  return null;
}