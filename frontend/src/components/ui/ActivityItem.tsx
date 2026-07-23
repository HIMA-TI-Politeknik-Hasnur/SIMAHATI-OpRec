import { MaterialSymbol } from './MaterialSymbol';

interface ActivityItemProps {
  icon: string;
  title: string;
  description: string;
  time: string;
  color?: 'blue' | 'green' | 'yellow' | 'red';
}

const dotColors = {
  blue:   'bg-primary',
  green:  'bg-tertiary',
  yellow: 'bg-tertiary',
  red:    'bg-error',
};

export function ActivityItem({ icon, title, description, time, color = 'blue' }: ActivityItemProps) {
  return (
    <div className="relative pl-9 pb-7 last:pb-0">
      {/* Timeline line - hanya tampil jika bukan last */}
      <div className="absolute left-[10px] top-6 bottom-0 w-0.5 bg-outline-variant/40 last:hidden" />

      {/* Dot */}
      <div className={`
        absolute left-0 top-0 w-[22px] h-[22px] rounded-full
        ${dotColors[color]} flex items-center justify-center
        text-white z-10 ring-[3px] ring-white shrink-0
      `}>
        <MaterialSymbol icon={icon} className="text-[12px]" />
      </div>

      {/* Content */}
      <div>
        <p className="text-sm font-bold text-on-background leading-snug">{title}</p>
        <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">{description}</p>
        <p className="text-[10px] text-outline font-semibold uppercase tracking-wider mt-1.5">{time}</p>
      </div>
    </div>
  );
}
