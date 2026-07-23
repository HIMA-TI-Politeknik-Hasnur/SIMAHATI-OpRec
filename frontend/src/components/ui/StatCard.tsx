import { MaterialSymbol } from './MaterialSymbol';

interface StatCardProps {
  icon?: string;
  title: string;
  value: number | string;
  description?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red';
  trend?: { direction: 'up' | 'down' | 'neutral'; value: string };
}

const colorMap = {
  blue:   { border: 'hover:border-primary/30',       bg: 'bg-primary/10',           text: 'text-primary',   iconHover: 'group-hover:bg-primary',    trendText: 'text-primary'   },
  green:  { border: 'hover:border-tertiary/30',       bg: 'bg-tertiary-fixed/30',    text: 'text-tertiary',  iconHover: 'group-hover:bg-tertiary',   trendText: 'text-tertiary'  },
  yellow: { border: 'hover:border-tertiary/30',       bg: 'bg-tertiary-fixed/30',    text: 'text-tertiary',  iconHover: 'group-hover:bg-tertiary',   trendText: 'text-tertiary'  },
  red:    { border: 'hover:border-error/30',          bg: 'bg-error-container/30',   text: 'text-error',     iconHover: 'group-hover:bg-error',      trendText: 'text-error'     },
};

export function StatCard({ icon, title, value, description, color = 'blue', trend }: StatCardProps) {
  const c = colorMap[color];

  return (
    <div className={`group bg-white p-5 rounded-2xl border border-outline-variant/40 ${c.border} transition-all duration-200 cursor-default hover:shadow-lg hover:-translate-y-0.5`}>
      <div className="flex items-start justify-between gap-3">
        {/* Text */}
        <div className="flex-1 min-w-0 space-y-2">
          <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider leading-none truncate">
            {title}
          </p>
          <p className="text-3xl font-black text-on-background tabular-nums leading-none">
            {value}
          </p>
          {trend ? (
            <div className={`inline-flex items-center gap-1 text-[11px] font-bold ${trend.direction === 'neutral' ? 'text-on-surface-variant' : c.trendText}`}>
              <MaterialSymbol
                icon={trend.direction === 'up' ? 'trending_up' : trend.direction === 'down' ? 'trending_down' : 'remove'}
                className="text-[14px]"
              />
              {trend.value}
            </div>
          ) : description ? (
            <p className="text-xs text-on-surface-variant">{description}</p>
          ) : null}
        </div>

        {/* Icon */}
        {icon && (
          <div className={`
            w-11 h-11 rounded-xl flex items-center justify-center shrink-0
            ${c.bg} ${c.text}
            ${c.iconHover} group-hover:text-white
            transition-all duration-200 group-hover:scale-110
          `}>
            <MaterialSymbol icon={icon} className="text-[22px]" />
          </div>
        )}
      </div>
    </div>
  );
}
