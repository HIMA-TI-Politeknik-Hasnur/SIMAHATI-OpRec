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

const colorClasses: Record<string, { bg: string; icon: string; gradient: string }> = {
  blue: { 
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100', 
    icon: 'text-blue-600',
    gradient: 'from-blue-500 to-cyan-500'
  },
  green: { 
    bg: 'bg-gradient-to-br from-green-50 to-emerald-100', 
    icon: 'text-green-600',
    gradient: 'from-green-500 to-emerald-500'
  },
  red: { 
    bg: 'bg-gradient-to-br from-red-50 to-rose-100', 
    icon: 'text-red-600',
    gradient: 'from-red-500 to-rose-500'
  },
  yellow: { 
    bg: 'bg-gradient-to-br from-yellow-50 to-amber-100', 
    icon: 'text-yellow-600',
    gradient: 'from-yellow-500 to-amber-500'
  },
  purple: { 
    bg: 'bg-gradient-to-br from-purple-50 to-violet-100', 
    icon: 'text-purple-600',
    gradient: 'from-purple-500 to-violet-500'
  },
};

export function StatCard({ icon: Icon, title, value, trend, color = 'blue' }: StatCardProps) {
  const { bg, icon: iconColor, gradient } = colorClasses[color];

  return (
    <Card hover>
      <div className="relative overflow-hidden">
        {/* Decorative gradient background */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-5 rounded-full blur-2xl -mr-16 -mt-16`} />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-500 mb-2 truncate uppercase tracking-wide">
              {title}
            </p>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              {value}
            </p>
            {trend && (
              <div className={`inline-flex items-center gap-1.5 mt-3 px-2.5 py-1 rounded-full text-xs font-bold ${
                trend.direction === 'up' 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
              }`}>
                <span className="text-base">
                  {trend.direction === 'up' ? '↗' : '↘'}
                </span>
                <span>{trend.value}</span>
              </div>
            )}
          </div>
          <div className={`relative p-4 rounded-2xl ${bg} ${iconColor} flex-shrink-0 ml-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6`}>
            <Icon className="w-8 h-8" strokeWidth={2.5} />
            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
          </div>
        </div>
      </div>
    </Card>
  );
}
