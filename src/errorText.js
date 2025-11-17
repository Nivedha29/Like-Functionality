function capitalize(s) {
  return typeof s === "string" && s.length
    ? s[0].toUpperCase() + s.slice(1)
    : s;
}

export default function errorText(err) {
  if (!err) return null;

  // 1) Prefer server-side "errors" object (RealWorld style)
  const errorsObj =
    err.errors ||
    (err.data && err.data.errors) ||
    null;

  if (errorsObj && typeof errorsObj === "object") {
    const [[field, messages] = []] = Object.entries(errorsObj);

    if (Array.isArray(messages) && messages.length) {
      const joined = messages.join(", ");

      // Any variant of "Invalid credentials" → show friendly text
      if (/invalid credentials/i.test(joined)) {
        return "Invalid email or password.";
      }

      return `${capitalize(field)} ${joined}`;
    }
  }

  // 2) If err is a plain string
  if (typeof err === "string") {
    if (/invalid credentials/i.test(err)) {
      return "Invalid email or password.";
    }
    return err;
  }

  // 3) If err has a message string
  if (typeof err.message === "string") {
    if (/invalid credentials/i.test(err.message)) {
      return "Invalid email or password.";
    }
    return err.message;
  }

  return "Something went wrong.";
}
