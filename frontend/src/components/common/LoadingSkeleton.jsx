function LoadingSkeleton({ rows = 4, className = '' }) {
  return (
    <div className={`rounded-[18px] border border-[var(--border)] bg-white p-6 shadow-[0_18px_40px_-34px_rgba(31,42,68,0.12)] ${className}`}>
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-40 rounded-[12px] bg-[#edf1fb]" />
        {Array.from({ length: rows }).map((_, index) => (
          <div className="h-4 rounded-[10px] bg-[#edf1fb]" key={index} />
        ))}
      </div>
    </div>
  );
}

export default LoadingSkeleton;
