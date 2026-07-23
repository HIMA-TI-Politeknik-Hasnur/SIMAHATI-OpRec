import type { LucideIcon } from 'lucide-react';

interface ActivityItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  isLast?: boolean;
}

const dotClasses: Record<string, string> = {
  blue: 'bg-blue-500 border-blue-200',
  green: 'bg-emerald-500 border-emerald-200',
  red: 'bg-rose-500 border-rose-200',
  yellow: 'bg-amber-500 border-amber-200',
  purple: 'bg-violet-500 border-violet-200',
};

const iconBg: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-emerald-50 text-emerald-600',
  red: 'bg-rose-50 text-rose-600',
  yellow: 'bg-amber-50 text-amber-600',
  purple: 'bg-violet-50 text-violet-600',
};

export function ActivityItem({ icon: Icon, title, description, time, color = 'blue', isLast = false }: ActivityItemProps) {
  return (
    <div className="group flex items-start gap-4 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 relative">
      <div className="relative flex flex-col items-center flex-shrink-0">
        <div className={`w-3 h-3 rounded-full border-2 ${dotClasses[color]} z-10`} />
        {!isLast && (
          <div className="w-px h-full bg-gray-200 absolute top-3" />
        )}
      </div>
      <div className="flex items-start gap-3 flex-1 min-w-0 pt-0.5">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBg[color]}`}>
          <Icon className="w-4 h-4" strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm">{title}</p>
          <p className="text-sm text-gray-500 mt-0.5">{description}</p>
          <p className="text-xs text-gray-400 mt-1 font-medium">{time}</p>
        </div>
      </div>
    </div>
  );
}
