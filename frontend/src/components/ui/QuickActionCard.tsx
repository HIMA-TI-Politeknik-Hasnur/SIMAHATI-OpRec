import type { LucideIcon } from 'lucide-react';

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
      className="group flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border border-gray-200 hover:border-orange-200 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 text-left relative overflow-hidden"
    >
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 group-hover:from-orange-100 group-hover:to-amber-100 transition-all duration-200">
        <Icon className="w-7 h-7 text-orange-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-200" strokeWidth={2.5} />
      </div>
      <div className="text-center">
        <span className="text-sm font-semibold text-gray-700 group-hover:text-orange-600 transition-colors duration-200 block">
          {label}
        </span>
        {description && (
          <span className="text-xs text-gray-400 mt-1 block leading-relaxed">
            {description}
          </span>
        )}
      </div>
    </button>
  );
}
