import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: number | string;
  description?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down';
  };
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

const iconClasses: Record<string, string> = {
  blue: 'from-blue-50 to-cyan-50 text-blue-600',
  green: 'from-emerald-50 to-green-50 text-emerald-600',
  red: 'from-red-50 to-rose-50 text-red-600',
  yellow: 'from-amber-50 to-yellow-50 text-amber-600',
  purple: 'from-violet-50 to-purple-50 text-violet-600',
};

export function StatCard({ icon: Icon, title, value, description, trend, color = 'blue' }: StatCardProps) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 relative flex flex-col min-h-[130px]">
      <div className="flex items-start justify-between mb-auto">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </p>
        <div className={`p-2.5 rounded-xl bg-gradient-to-br flex-shrink-0 ml-3 transition-all duration-200 group-hover:scale-110 group-hover:rotate-3 ${iconClasses[color]}`}>
          <Icon className="w-5 h-5" strokeWidth={2.5} />
        </div>
      </div>
      <div className="mt-2">
        <p className="text-[32px] font-extrabold text-gray-900 leading-none tracking-tight">
          {value}
        </p>
        {description && (
          <p className="text-sm text-gray-400 mt-1.5 font-medium">{description}</p>
        )}
      </div>
      {trend && (
        <div className="flex items-center gap-1.5 mt-3">
          <span className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
            trend.direction === 'up' ? 'text-green-600' : 'text-red-500'
          }`}>
            <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
            <span>{trend.value}</span>
          </span>
          <span className="text-xs text-gray-400 font-medium">vs bulan lalu</span>
        </div>
      )}
    </div>
  );
}
