import Button from '../ui/Button';

function ErrorState({ title = 'Something went wrong', description, onRetry }) {
  return (
    <div className="surface-card panel-outline p-8 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-rose-50 text-rose-600">
        <span className="text-xl font-bold">!</span>
      </div>
      <h3 className="mt-5 text-xl font-extrabold text-[var(--text)]">{title}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm text-muted">{description}</p>
      {onRetry ? (
        <div className="mt-6">
          <Button onClick={onRetry} variant="secondary">
            Try again
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default ErrorState;
