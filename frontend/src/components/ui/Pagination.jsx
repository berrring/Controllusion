import Button from './Button';

function Pagination({ currentPage, pageCount, onPageChange }) {
  if (pageCount <= 1) {
    return null;
  }

  const pages = Array.from({ length: pageCount }, (_, index) => index + 1);

  return (
    <div className="flex flex-col gap-3 border-t border-[var(--border)] pt-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium text-[#7b86a0]">
        Page {currentPage} of {pageCount}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} size="sm" variant="secondary">
          Previous
        </Button>
        {pages.map((page) => (
          <button
            className={`h-9 min-w-[2.25rem] rounded-[12px] border px-3 text-sm font-bold transition ${
              page === currentPage
                ? 'border-[#4c42e8] bg-[#4c42e8] text-white'
                : 'border-[color:var(--border)] bg-white text-[#5f6a85] hover:border-[#d7def0] hover:bg-[#f8f9ff]'
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
