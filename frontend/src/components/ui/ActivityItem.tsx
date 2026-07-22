import type { LucideIcon } from 'lucide-react';

interface ActivityItemProps {
  icon: LucideIcon;
  title: string;
  description: string;
  time: string;
}

export function ActivityItem({ icon: Icon, title, description, time }: ActivityItemProps) {
  return (
    <div className="group flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-orange-50 hover:to-amber-50 transition-all duration-300 border border-transparent hover:border-orange-200">
      <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 group-hover:from-orange-100 group-hover:to-amber-100 flex-shrink-0 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 relative">
        <Icon className="w-5 h-5 text-orange-600" strokeWidth={2.5} />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 text-sm group-hover:text-orange-600 transition-colors duration-300">
          {title}
        </p>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{description}</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{time}</p>
        </div>
      </div>
    </div>
  );
}
