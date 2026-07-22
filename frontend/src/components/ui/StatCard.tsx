import type { LucideIcon } from 'lucide-react';
import { Card } from './Card';

interface StatCardProps {
  icon: LucideIcon;
  title: string;
  value: number | string;
  trend?: {
    value: string;
    direction: 'up' | 'down';
  };
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
}

const colorClasses: Record<string, { bg: string; icon: string }> = {
  blue: { bg: 'bg-blue-50', icon: 'text-blue-600' },
  green: { bg: 'bg-green-50', icon: 'text-green-600' },
  red: { bg: 'bg-red-50', icon: 'text-red-600' },
  yellow: { bg: 'bg-yellow-50', icon: 'text-yellow-600' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple-600' },
};

export function StatCard({ icon: Icon, title, value, trend, color = 'blue' }: StatCardProps) {
  const { bg, icon: iconColor } = colorClasses[color];

  return (
    <Card hover>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500 mb-1 truncate">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 flex items-center gap-1 ${
              trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
            }`}>
              <span>{trend.direction === 'up' ? '\u2191' : '\u2193'}</span>
              <span>{trend.value}</span>
            </p>
          )}
        </div>
        <div className={`p-3.5 rounded-full ${bg} ${iconColor} flex-shrink-0 ml-4`}>
          <Icon className="w-7 h-7" />
        </div>
      </div>
    </Card>
  );
}
