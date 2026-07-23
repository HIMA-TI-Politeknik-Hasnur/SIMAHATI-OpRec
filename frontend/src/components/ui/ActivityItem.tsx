import { MaterialSymbol } from './MaterialSymbol';

interface ActivityItemProps {
  icon: string;
  title: string;
  description: string;
  time: string;
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

const dotColors: Record<string, string> = {
  blue:   'bg-primary',
  green:  'bg-tertiary',
  yellow: 'bg-tertiary',
  red:    'bg-error',
};

export function ActivityItem({ icon, title, description, time, color = 'blue' }: ActivityItemProps) {
  return (
    <div className="flex gap-3 pb-6 last:pb-0">
      {/* Left: dot + line */}
      <div className="flex flex-col items-center shrink-0">
        <div className={`
          w-8 h-8 rounded-full ${dotColors[color] ?? 'bg-primary'}
          flex items-center justify-center text-white
          ring-4 ring-white shrink-0
        `}>
          <MaterialSymbol icon={icon} className="text-[14px]" />
        </div>
        {/* vertical line */}
        <div className="w-0.5 flex-1 bg-outline-variant/40 mt-1 last:hidden" />
      </div>

      {/* Right: content */}
      <div className="flex-1 min-w-0 pt-1">
        <p className="text-sm font-bold text-on-background leading-snug truncate">{title}</p>
        <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{description}</p>
        <p className="text-[10px] text-outline font-semibold uppercase tracking-wider mt-1">{time}</p>
      </div>
    </div>
  );
}
