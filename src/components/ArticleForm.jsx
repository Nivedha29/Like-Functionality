import React, { useEffect, useState } from "react";

const initial = { title: "", description: "", body: "", tags: "" };

export default function ArticleForm({
  initialValues,
  onSubmit,
  submitting = false,
}) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialValues) {
      setValues({
        title: initialValues.title || "",
        description: initialValues.description || "",
        body: initialValues.body || "",
        tags: (initialValues.tagList || []).join(", "),
      });
    }
  }, [initialValues]);

  const validate = () => {
    const e = {};
    if (!values.title.trim()) e.title = "Title is required.";
    if (!values.description.trim()) e.description = "Description is required.";
    if (!values.body.trim()) e.body = "Body is required.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (evt) => {
    setValues((v) => ({ ...v, [evt.target.name]: evt.target.value }));
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!validate()) return;
    const tagList = values.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      body: values.body.trim(),
      tagList,
    });
  };

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label>Title</label>
        <input
          name="title"
          value={values.title}
          onChange={handleChange}
          placeholder="Amazing post title"
        />
        {errors.title && <div className="error">{errors.title}</div>}
      </div>

      <div className="field">
        <label>Description</label>
        <input
          name="description"
          value={values.description}
          onChange={handleChange}
          placeholder="Short summary of your article"
        />
        {errors.description && <div className="error">{errors.description}</div>}
      </div>

      <div className="field">
        <label>Body</label>
        <textarea
          name="body"
          rows={12}
          value={values.body}
          onChange={handleChange}
          placeholder="Write your article (Markdown supported in API consumers)"
        />
        {errors.body && <div className="error">{errors.body}</div>}
      </div>

      <div className="field">
        <label>Tags (comma-separated)</label>
        <input
          name="tags"
          value={values.tags}
          onChange={handleChange}
          placeholder="react, javascript, css"
        />
      </div>

      <div className="actions">
        <button className="btn primary" type="submit" disabled={submitting}>
          {submitting ? "Saving..." : "Save Article"}
        </button>
      </div>
    </form>
  );
}