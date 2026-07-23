import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: number | string;
  description?: string;
  trend?: { value: string; direction: 'up' | 'down' };
  trendLabel?: string;
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

const colorMap: Record<string, string> = {
  blue: 'text-blue-600 bg-blue-50',
  green: 'text-green-600 bg-green-50',
  red: 'text-red-600 bg-red-50',
  yellow: 'text-yellow-600 bg-yellow-50',
  purple: 'text-purple-600 bg-purple-50',
};

export function StatCard({ icon: Icon, title, value, trend, trendLabel, color = 'blue' }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colorMap[color]}`}>
        <Icon size={20} />
      </div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {trend && (
        <p className={`text-sm font-medium flex items-center gap-1 ${
          trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
        }`}>
          <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
          <span>{trend.value}</span>
          {trendLabel && <span className="text-xs text-gray-400 font-normal">{trendLabel}</span>}
        </p>
      )}
    </div>
  );
}
