import { MaterialSymbol } from './MaterialSymbol';

interface ActivityItemProps {
  icon: string;
  title: string;
  description: string;
  time: string;
  color?: string;
  isLast?: boolean;
}

const dotColors: Record<string, string> = {
  blue: 'bg-primary',
  green: 'bg-primary',
  yellow: 'bg-tertiary',
  red: 'bg-error',
};

export function ActivityItem({ icon, title, description, time, color = 'blue' }: ActivityItemProps) {
  return (
    <div className="relative pl-10 pb-8 last:pb-0">
      <div className={`absolute left-0 top-0 w-6 h-6 rounded-full ${dotColors[color] || 'bg-primary'} flex items-center justify-center text-white ring-4 ring-white z-10`}>
        <MaterialSymbol icon={icon} className="text-[14px]" />
      </div>
      <div className="space-y-0.5">
        <p className="font-bold text-body-md text-on-background">{title}</p>
        <p className="text-body-md text-on-surface-variant">{description}</p>
        <p className="text-[10px] text-outline font-label-md uppercase tracking-wider">{time}</p>
      </div>
    </div>
  );
}
