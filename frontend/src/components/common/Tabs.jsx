function Tabs({ activeTab, items, onChange }) {
  return (
    <div className="overflow-x-auto">
      <div className="inline-flex min-w-full gap-1.5 rounded-[18px] border border-[color:var(--border)] bg-[#f7f8fc] p-1.5">
        {items.map((item) => (
          <button
            className={`rounded-[14px] px-4 py-2.5 text-sm font-extrabold transition ${
              activeTab === item.value
                ? 'bg-brand-600 text-white shadow-soft'
                : 'text-slate-500 hover:bg-white hover:text-slate-900'
            }`}
            key={item.value}
            onClick={() => onChange(item.value)}
            type="button"
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Tabs;
