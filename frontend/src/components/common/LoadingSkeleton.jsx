function LoadingSkeleton({ rows = 4, className = '' }) {
  return (
    <div className={`surface-card panel-outline p-6 ${className}`}>
      <div className="animate-pulse space-y-4">
        <div className="h-6 w-48 rounded-xl bg-slate-200" />
        {Array.from({ length: rows }).map((_, index) => (
          <div className="h-4 rounded-xl bg-slate-200" key={index} />
        ))}
      </div>
    </div>
  );
}

export default LoadingSkeleton;
