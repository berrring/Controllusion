import Button from './Button';

function Pagination({ currentPage, pageCount, onPageChange }) {
  if (pageCount <= 1) {
    return null;
  }

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-muted">
        Page {currentPage} of {pageCount}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} size="sm" variant="secondary">
          Previous
        </Button>
        {pages.map((page) => (
          <button
            className={`h-10 min-w-10 rounded-[14px] border px-3 text-sm font-extrabold transition ${
              page === currentPage
                ? 'border-brand-600 bg-brand-600 text-white'
                : 'border-[color:var(--border)] bg-white text-slate-700 hover:border-brand-200 hover:bg-brand-50'
            }`}
            key={page}
            onClick={() => onPageChange(page)}
            type="button"
          >
            {page}
          </button>
        ))}
        <Button
          disabled={currentPage === pageCount}
          onClick={() => onPageChange(currentPage + 1)}
          size="sm"
          variant="secondary"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default Pagination;
