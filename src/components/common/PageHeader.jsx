import { Link } from 'react-router-dom';

function PageHeader({ title, description, actions, breadcrumbs = [] }) {
  return (
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {breadcrumbs.length ? (
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm font-bold text-muted">
            {breadcrumbs.map((crumb, index) => (
              <span className="flex items-center gap-2" key={crumb.label}>
                {crumb.to ? (
                  <Link className="rounded-full bg-white px-3 py-1.5 transition hover:text-brand-600" to={crumb.to}>
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="rounded-full bg-white px-3 py-1.5 text-slate-500">{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 ? <span className="text-soft">/</span> : null}
              </span>
            ))}
          </div>
        ) : null}
        <h1 className="text-[34px] font-black tracking-tight text-[var(--text)] sm:text-[40px]">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-7 text-muted sm:text-base">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}

export default PageHeader;
