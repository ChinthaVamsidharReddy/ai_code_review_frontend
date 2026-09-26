import clsx from 'clsx';
import { Severity } from '@/types/api';

const STYLES: Record<Severity, string> = {
  critical: 'bg-critical/15 text-critical border-critical/30',
  high: 'bg-high/15 text-high border-high/30',
  medium: 'bg-medium/15 text-medium border-medium/30',
  low: 'bg-low/15 text-low border-low/30',
};

export default function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium border uppercase tracking-wide', STYLES[severity])}>
      {severity}
    </span>
  );
}
