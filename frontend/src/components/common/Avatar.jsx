import { getInitials } from '../../utils/formatters';

function Avatar({ name, size = 'md' }) {
  const sizeClassName = {
    sm: 'h-9 w-9 text-xs',
    md: 'h-11 w-11 text-sm',
    lg: 'h-14 w-14 text-base',
    xl: 'h-16 w-16 text-lg',
  }[size];

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-[linear-gradient(180deg,#6a9bff_0%,#4f80ff_100%)] font-extrabold text-white shadow-[0_16px_28px_-18px_rgba(79,128,255,0.6)] ${sizeClassName}`}
    >
      {getInitials(name)}
    </div>
  );
}

export default Avatar;
