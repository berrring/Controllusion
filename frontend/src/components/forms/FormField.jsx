function FormField({ label, error, hint, htmlFor, children }) {
  return (
    <label className="block" htmlFor={htmlFor}>
      <span className="mb-2 block text-[11px] font-bold text-[#52627b]">{label}</span>
      {children}
      {error ? <span className="mt-2 block text-[11px] font-semibold text-rose-600">{error}</span> : null}
      {!error && hint ? <span className="mt-2 block text-[11px] text-muted">{hint}</span> : null}
    </label>
  );
}

export default FormField;
