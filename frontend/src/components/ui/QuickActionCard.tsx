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
      className="group flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-200 hover:border-orange-200 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 text-left w-full"
    >
      <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 group-hover:from-orange-100 group-hover:to-amber-100 transition-all duration-200 flex-shrink-0">
        <Icon className="w-6 h-6 text-orange-600 group-hover:scale-110 transition-all duration-200" strokeWidth={2.5} />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-semibold text-gray-700 group-hover:text-orange-600 transition-colors duration-200 block">
          {label}
        </span>
        {description && (
          <span className="text-xs text-gray-400 mt-0.5 block leading-relaxed">
            {description}
          </span>
        )}
      </div>
      <div className="h-10 w-px bg-gray-200 flex-shrink-0 mx-1" />
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-orange-50 transition-colors duration-200 flex-shrink-0">
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-orange-500 transition-all duration-200 group-hover:translate-x-0.5" />
      </div>
    </button>
  );
}
