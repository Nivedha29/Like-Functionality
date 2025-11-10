import React, { useEffect, useRef, useState } from 'react';

const initial = { title: '', description: '', body: '', tags: '' };

export default function ArticleForm({
  initialValues,
  onSubmit,
  submitting = false,
  fieldErrors = null, // 👈 server-side: { title: ["has already been taken"] }
  errorField = null, // 👈 server-side: "title" | "description" | "body"
  autoFocusOnError = true,
}) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({}); // client-side errors only

  // Refs for focusing
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const bodyRef = useRef(null);
  const tagsRef = useRef(null);

  useEffect(() => {
    if (initialValues) {
      setValues({
        title: initialValues.title || '',
        description: initialValues.description || '',
        body: initialValues.body || '',
        tags: (initialValues.tagList || []).join(', '),
      });
    }
  }, [initialValues]);

  // Autofocus on first error (server > client)
  useEffect(() => {
    if (!autoFocusOnError) return;

    // Prefer server error field
    if (errorField === 'title') {
      titleRef.current?.focus();
      return;
    }
    if (errorField === 'description') {
      descRef.current?.focus();
      return;
    }
    if (errorField === 'body') {
      bodyRef.current?.focus();
      return;
    }

    // Otherwise first client error
    if (errors.title) {
      titleRef.current?.focus();
      return;
    }
    if (errors.description) {
      descRef.current?.focus();
      return;
    }
    if (errors.body) {
      bodyRef.current?.focus();
      return;
    }
  }, [errorField, errors, autoFocusOnError]);

  const validate = () => {
    const e = {};
    if (!values.title.trim()) e.title = 'Title is required.';
    if (!values.description.trim()) e.description = 'Description is required.';
    if (!values.body.trim()) e.body = 'Body is required.';
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
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    onSubmit({
      title: values.title.trim(),
      description: values.description.trim(),
      body: values.body.trim(),
      tagList,
    });
  };

  // Helpers to read server messages (join arrays safely)
  const sErr = (key) => (Array.isArray(fieldErrors?.[key]) ? fieldErrors[key].join(', ') : null);

  const titleErr = errors.title || sErr('title');
  const descErr = errors.description || sErr('description');
  const bodyErr = errors.body || sErr('body');

  return (
    <form className="card form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          name="title"
          ref={titleRef}
          value={values.title}
          onChange={handleChange}
          placeholder="Amazing post title"
          aria-invalid={Boolean(titleErr)}
          aria-describedby={titleErr ? 'title-error' : undefined}
        />
        {titleErr && (
          <div id="title-error" className="error">
            {titleErr}
          </div>
        )}
      </div>

      <div className="field">
        <label htmlFor="description">Description</label>
        <input
          id="description"
          name="description"
          ref={descRef}
          value={values.description}
          onChange={handleChange}
          placeholder="Short summary of your article"
          aria-invalid={Boolean(descErr)}
          aria-describedby={descErr ? 'description-error' : undefined}
        />
        {descErr && (
          <div id="description-error" className="error">
            {descErr}
          </div>
        )}
      </div>

      <div className="field">
        <label htmlFor="body">Body</label>
        <textarea
          id="body"
          name="body"
          rows={12}
          ref={bodyRef}
          value={values.body}
          onChange={handleChange}
          placeholder="Write your article (Markdown supported in API consumers)"
          aria-invalid={Boolean(bodyErr)}
          aria-describedby={bodyErr ? 'body-error' : undefined}
        />
        {bodyErr && (
          <div id="body-error" className="error">
            {bodyErr}
          </div>
        )}
      </div>

      <div className="field">
        <label htmlFor="tags">Tags (comma-separated)</label>
        <input
          id="tags"
          name="tags"
          ref={tagsRef}
          value={values.tags}
          onChange={handleChange}
          placeholder="react, javascript, css"
        />
      </div>

      <div className="actions">
        <button className="btn primary" type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Article'}
        </button>
      </div>
    </form>
  );
}
