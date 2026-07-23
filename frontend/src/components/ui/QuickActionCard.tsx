import { MaterialSymbol } from './MaterialSymbol';

interface QuickActionCardProps {
  icon: string;
  label: string;
  description: string;
  onClick?: () => void;
}

export function QuickActionCard({ icon, label, description, onClick }: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left bg-white p-5 rounded-2xl border border-outline-variant/40 hover:border-primary/30 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-all duration-200 shrink-0">
          <MaterialSymbol icon={icon} className="text-[22px]" />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <h5 className="font-bold text-sm text-on-background group-hover:text-primary transition-colors leading-none">
            {label}
          </h5>
          <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>

        {/* Arrow */}
        <MaterialSymbol
          icon="arrow_forward"
          className="text-[18px] text-on-surface-variant/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 shrink-0 mt-0.5"
        />
      </div>
    </button>
  );
}
