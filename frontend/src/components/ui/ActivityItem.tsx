import type { LucideIcon } from 'lucide-react';

interface ActivityItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  isLast?: boolean;
}

const dotColors: Record<string, string> = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
  purple: 'bg-purple-500',
};

const iconColors: Record<string, string> = {
  blue: 'text-blue-600 bg-blue-50',
  green: 'text-green-600 bg-green-50',
  red: 'text-red-600 bg-red-50',
  yellow: 'text-yellow-600 bg-yellow-50',
  purple: 'text-purple-600 bg-purple-50',
};

export function ActivityItem({ icon: Icon, title, description, time, color = 'blue', isLast }: ActivityItemProps) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className={`w-[6px] h-[6px] rounded-full mt-1.5 ${dotColors[color]}`} />
        {!isLast && <div className="w-[2px] flex-1 bg-gray-200 mt-1" />}
      </div>
      <div className="flex items-start gap-3 flex-1 pb-4">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColors[color]}`}>
          <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{time}</span>
          </div>
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="text-xs text-gray-500">{description}</p>
        </div>
      </div>
    </div>
  );
}
