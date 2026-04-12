import Button from '../ui/Button';

function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="surface-card panel-outline p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-brand-50 text-brand-600">
        <span className="text-2xl">+</span>
      </div>
      <h3 className="mt-5 text-xl font-extrabold text-[var(--text)]">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{description}</p>
      {actionLabel ? (
        <div className="mt-6">
          <Button onClick={onAction}>{actionLabel}</Button>
        </div>
      ) : null}
    </div>
  );
}

export default EmptyState;
