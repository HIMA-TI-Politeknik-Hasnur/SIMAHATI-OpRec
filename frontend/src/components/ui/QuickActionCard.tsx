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
      className="w-full text-left bg-white p-6 rounded-xl border border-white hover:border-primary/30 transition-all group cursor-pointer"
    >
      <div className="flex gap-4 items-start">
        <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:bg-primary/10 group-hover:text-primary transition-colors flex-shrink-0">
          <MaterialSymbol icon={icon} />
        </div>
        <div className="flex-1 min-w-0">
          <h5 className="font-bold text-on-background group-hover:text-primary transition-colors">{label}</h5>
          <p className="text-body-md text-on-surface-variant mt-1">{description}</p>
          <div className="mt-3 flex items-center gap-1 text-primary font-bold font-label-md">
            <span>Buka</span>
            <MaterialSymbol icon="arrow_forward" className="text-[18px] group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </button>
  );
}
