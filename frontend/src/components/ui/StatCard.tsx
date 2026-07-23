import { MaterialSymbol } from './MaterialSymbol';

interface StatCardProps {
  icon?: string;
  title: string;
  value: number | string;
  description?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  trend?: { direction: 'up' | 'down' | 'neutral'; value: string };
}

const colorMap: Record<string, { border: string; bg: string; text: string; hoverBg: string }> = {
  blue:    { border: 'hover:border-primary/20',     bg: 'bg-primary/10',   text: 'text-primary',   hoverBg: 'group-hover:bg-primary' },
  green:   { border: 'hover:border-primary/20',     bg: 'bg-primary/10',   text: 'text-primary',   hoverBg: 'group-hover:bg-primary' },
  yellow:  { border: 'hover:border-tertiary/20',    bg: 'bg-tertiary-fixed/40', text: 'text-tertiary', hoverBg: 'group-hover:bg-tertiary' },
  red:     { border: 'hover:border-error/20',       bg: 'bg-error-container/40', text: 'text-error', hoverBg: 'group-hover:bg-error' },
};

export function StatCard({ icon, title, value, description, color = 'blue', trend }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className={`bg-white p-6 rounded-xl border border-white ${c.border} transition-all group cursor-default`}>
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="font-label-md text-on-surface-variant">{title}</p>
          <h3 className="text-headline-lg font-bold text-on-background">{value}</h3>
          {trend ? (
            <div className="flex items-center gap-1 font-bold text-[11px]">
              <MaterialSymbol icon={trend.direction === 'up' ? 'trending_up' : trend.direction === 'down' ? 'trending_down' : 'remove'} className={`text-[14px] ${trend.direction === 'neutral' ? 'text-outline' : c.text}`} />
              <span className={trend.direction === 'neutral' ? 'text-outline' : c.text}>{trend.value}</span>
            </div>
          ) : description ? (
            <p className="text-body-sm text-outline">{description}</p>
          ) : null}
        </div>
        {icon && (
          <div className={`w-12 h-12 rounded-lg ${c.bg} flex items-center justify-center ${c.text} ${c.hoverBg} group-hover:text-white transition-all`}>
            <MaterialSymbol icon={icon} />
          </div>
        )}
      </div>
    </div>
  );
}
