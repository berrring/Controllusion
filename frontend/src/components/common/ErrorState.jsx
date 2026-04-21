import Button from '../ui/Button';

function ErrorState({ title = 'Something went wrong', description, onRetry }) {
  return (
    <div className="rounded-[18px] border border-[var(--border)] bg-[linear-gradient(180deg,#ffffff_0%,#fbfcff_100%)] p-8 text-center shadow-[0_18px_40px_-34px_rgba(31,42,68,0.12)]">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[18px] bg-[#fff1ee] text-[#ec6a60]">
        <span className="text-lg font-black">!</span>
      </div>
      <h3 className="mt-5 text-[22px] font-black tracking-[-0.03em] text-[#1f2a44]">{title}</h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-7 text-[#6d7890]">{description}</p>
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
