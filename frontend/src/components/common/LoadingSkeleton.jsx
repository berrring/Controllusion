function LoadingSkeleton({ rows = 4, className = '' }) {
  return (
    <div className={`animate-pulse space-y-6 ${className}`}>
      <div className="grid gap-4 lg:grid-cols-4">
        {Array.from({ length: Math.min(rows, 4) }).map((_, index) => (
          <div className="h-28 rounded-[12px] bg-white" key={index}>
            <div className="p-5">
              <div className="h-4 w-24 rounded-full bg-[#eaf0fb]" />
              <div className="mt-5 h-7 w-28 rounded-full bg-[#eaf0fb]" />
              <div className="mt-3 h-3 w-20 rounded-full bg-[#eaf0fb]" />
            </div>
          </div>
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-[1fr_280px]">
        <div className="h-[420px] rounded-[12px] bg-white p-6">
          <div className="h-5 w-44 rounded-full bg-[#eaf0fb]" />
          <div className="mt-7 h-[330px] rounded-[10px] bg-[#eaf0fb]" />
        </div>
        <div className="hidden h-[420px] rounded-[12px] bg-[#edf3ff] p-6 xl:block">
          {Array.from({ length: 5 }).map((_, index) => (
            <div className="mb-6 flex gap-3" key={index}>
              <div className="h-9 w-9 rounded-full bg-[#dfe8fa]" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-28 rounded-full bg-[#dfe8fa]" />
                <div className="h-3 w-40 rounded-full bg-[#dfe8fa]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LoadingSkeleton;
