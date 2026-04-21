import Button from '../ui/Button';

function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-[18px] border border-[var(--border)] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] p-8 text-center shadow-[0_18px_40px_-34px_rgba(31,42,68,0.12)] sm:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#eef2ff] text-[#4c42e8]">
        <span className="text-xl font-black">+</span>
      </div>
      <h3 className="mt-5 text-[22px] font-black tracking-[-0.03em] text-[#1f2a44]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#6d7890]">{description}</p>
      {actionLabel ? (
        <div className="mt-6">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      ) : null}
    </div>
  );
}

export default EmptyState;
