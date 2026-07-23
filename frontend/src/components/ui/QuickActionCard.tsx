import type { LucideIcon } from 'lucide-react';
import { ArrowRight } from 'lucide-react';

interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  description?: string;
  onClick: () => void;
}

export function QuickActionCard({ icon: Icon, label, description, onClick }: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="group flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-gray-200 hover:border-orange-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 text-center relative"
    >
      <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 group-hover:from-orange-100 group-hover:to-amber-100 transition-all duration-200 relative">
        <Icon className="w-6 h-6 text-orange-600 group-hover:scale-110 transition-all duration-200" strokeWidth={2.5} />
      </div>
      <div>
        <span className="text-sm font-semibold text-gray-700 group-hover:text-orange-600 transition-colors duration-200 block">
          {label}
        </span>
        {description && (
          <span className="text-xs text-gray-400 mt-1.5 block leading-relaxed">
            {description}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1 text-xs font-medium text-gray-400 group-hover:text-orange-500 transition-colors duration-200 mt-auto">
        <span>Buka</span>
        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </div>
    </button>
  );
}
