import clsx from 'clsx';

export default function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={clsx('inline-block animate-spin rounded-full border-2 border-current border-t-transparent', className ?? 'w-4 h-4')}
      role="status"
      aria-label="Loading"
    />
  );
}
