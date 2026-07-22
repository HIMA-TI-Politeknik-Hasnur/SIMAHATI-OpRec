import type { LucideIcon } from 'lucide-react';

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

const palettes: Record<string, { bg: string; icon: string; gradient: string }> = {
  blue: { bg: 'from-blue-500 to-cyan-500', icon: 'text-blue-600', gradient: 'from-blue-500 to-cyan-500' },
  green: { bg: 'from-green-500 to-emerald-500', icon: 'text-green-600', gradient: 'from-green-500 to-emerald-500' },
  red: { bg: 'from-red-500 to-rose-500', icon: 'text-red-600', gradient: 'from-red-500 to-rose-500' },
  yellow: { bg: 'from-yellow-500 to-amber-500', icon: 'text-yellow-600', gradient: 'from-yellow-500 to-amber-500' },
  purple: { bg: 'from-purple-500 to-violet-500', icon: 'text-purple-600', gradient: 'from-purple-500 to-violet-500' },
};

export function StatCard({ icon: Icon, title, value, trend, color = 'blue' }: StatCardProps) {
  const { gradient } = palettes[color];

  return (
    <div className="group bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">
            {title}
          </p>
          <p className="text-4xl font-extrabold text-gray-900">
            {value}
          </p>
          {trend && (
            <div className={`inline-flex items-center gap-1 mt-3 px-2.5 py-1 rounded-full text-xs font-bold ${
              trend.direction === 'up'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}>
              <span>{trend.direction === 'up' ? '↑' : '↓'}</span>
              <span>{trend.value}</span>
            </div>
          )}
        </div>
        <div className={`relative p-3.5 rounded-2xl bg-gradient-to-br ${gradient} bg-opacity-10 flex-shrink-0 ml-4 transition-all duration-200 group-hover:scale-110 group-hover:rotate-3`}
          style={{ background: `linear-gradient(135deg, ${color === 'blue' ? '#3b82f6' : color === 'green' ? '#22c55e' : color === 'red' ? '#ef4444' : color === 'yellow' ? '#eab308' : '#a855f7'}15, ${color === 'blue' ? '#06b6d4' : color === 'green' ? '#10b981' : color === 'red' ? '#f43f5e' : color === 'yellow' ? '#f59e0b' : '#8b5cf6'}15)` }}
        >
          <Icon className={`w-8 h-8 ${palettes[color].icon}`} strokeWidth={2.5} />
        </div>
      </div>
    </div>
  );
}
