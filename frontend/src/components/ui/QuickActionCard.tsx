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
      className="bg-white rounded-2xl shadow-sm p-5 text-left hover:shadow-md hover:-translate-y-1 hover:border-orange-500 border border-transparent transition-all duration-200 group flex flex-col"
    >
      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center mb-3 group-hover:bg-orange-50 transition-colors">
        <Icon size={20} className="text-gray-500 group-hover:text-orange-500 transition-colors" />
      </div>
      <p className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
        {label}
      </p>
      {description && (
        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">{description}</p>
      )}
      <div className="border-t border-gray-100 my-3" />
      <div className="flex items-center gap-1 text-sm font-medium text-gray-900 group-hover:text-orange-600 transition-colors">
        <span>Buka</span>
        <span className="group-hover:translate-x-0.5 transition-transform">→</span>
      </div>
    </button>
  );
}
