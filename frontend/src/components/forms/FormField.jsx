function FormField({ label, error, hint, htmlFor, children }) {
  return (
    <label className="block" htmlFor={htmlFor}>
      <span className="mb-2 block text-sm font-extrabold text-[var(--text)]">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-sm font-semibold text-rose-600">{error}</span> : null}
      {!error && hint ? <span className="mt-2 block text-sm text-muted">{hint}</span> : null}
    </label>
  );
}

export default FormField;
