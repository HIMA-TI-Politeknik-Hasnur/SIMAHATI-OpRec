import type { LucideIcon } from 'lucide-react';

interface ActivityItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

const iconBg: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-emerald-50 text-emerald-600',
  red: 'bg-rose-50 text-rose-600',
  yellow: 'bg-amber-50 text-amber-600',
  purple: 'bg-violet-50 text-violet-600',
};

export function ActivityItem({ icon: Icon, title, description, time, color = 'blue' }: ActivityItemProps) {
  return (
    <div className="group flex items-start gap-4 px-4 py-3.5 rounded-xl hover:bg-gray-50 transition-all duration-200">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 ${iconBg[color]}`}>
        <Icon className="w-4.5 h-4.5" strokeWidth={2.5} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm">{title}</p>
        <p className="text-sm text-gray-500 mt-0.5">{description}</p>
        <p className="text-xs text-gray-400 mt-1.5 font-medium">{time}</p>
      </div>
    </div>
  );
}
