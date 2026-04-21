import EmptyState from './EmptyState';

function DataTable({
  columns,
  data,
  emptyTitle,
  emptyDescription,
  selectedIds = [],
  onToggleAll,
  onToggleRow,
  renderMobileCard,
}) {
  if (!data.length) {
    return <EmptyState description={emptyDescription} title={emptyTitle} />;
  }

  const allSelected = data.length > 0 && data.every((item) => selectedIds.includes(item.id));

  return (
    <>
      <div className="hidden overflow-hidden rounded-[24px] border border-[color:var(--border)] bg-white shadow-[0_22px_44px_-36px_rgba(17,24,39,0.16)] lg:block">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="min-w-full">
            <thead className="bg-[#f8f9fc]">
              <tr>
                {onToggleRow ? (
                  <th className="px-5 py-4 text-left">
                    <input checked={allSelected} onChange={(event) => onToggleAll?.(event.target.checked)} type="checkbox" />
                  </th>
                ) : null}
                {columns.map((column) => (
                  <th
                    className="px-5 py-4 text-left text-[11px] font-extrabold uppercase tracking-[0.14em] text-slate-500"
                    key={column.key}
                  >
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--border)]">
              {data.map((item) => (
                <tr className="transition hover:bg-slate-50/70" key={item.id}>
                  {onToggleRow ? (
                    <td className="px-5 py-4">
                      <input checked={selectedIds.includes(item.id)} onChange={() => onToggleRow(item.id)} type="checkbox" />
                    </td>
                  ) : null}
                  {columns.map((column) => (
                    <td className="px-5 py-4 align-top text-sm text-slate-700" key={column.key}>
                      {column.render(item)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-4 lg:hidden">
        {data.map((item) => (
          <div
            className="rounded-[16px] border border-[var(--border)] bg-white p-4 shadow-[0_18px_40px_-34px_rgba(31,42,68,0.12)]"
            key={item.id}
          >
            {renderMobileCard(item)}
          </div>
        ))}
      </div>
    </>
  );
}

export default DataTable;
