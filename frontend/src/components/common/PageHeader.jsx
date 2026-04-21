import { Link } from 'react-router-dom';

function PageHeader({ title, description, actions, breadcrumbs = [], mobileHidden = false }) {
  return (
    <div
      className={`mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between ${
        mobileHidden ? 'hidden lg:flex' : ''
      }`}
    >
      <div>
        {breadcrumbs.length ? (
          <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-[#8d97ad]">
            {breadcrumbs.map((crumb, index) => (
              <span className="flex items-center gap-2" key={crumb.label}>
                {crumb.to ? (
                  <Link className="transition hover:text-[#4c42e8]" to={crumb.to}>
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-[#1f2a44]">{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 ? <span className="text-[#b1b9cc]">{'>'}</span> : null}
              </span>
            ))}
          </div>
        ) : null}

        <h1 className="text-[28px] font-black tracking-[-0.04em] text-[#1f2a44] sm:text-[34px] lg:text-[40px]">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-7 text-[#6d7890]">{description}</p> : null}
      </div>

      {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
    </div>
  );
}

export default PageHeader;
