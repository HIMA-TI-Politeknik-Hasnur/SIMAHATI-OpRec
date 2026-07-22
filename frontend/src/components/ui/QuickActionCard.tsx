import type { LucideIcon } from 'lucide-react';
import { Card } from './Card';

interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

export function QuickActionCard({ icon: Icon, label, onClick }: QuickActionCardProps) {
  return (
    <Card hover className="p-4 relative overflow-hidden">
      <button
        onClick={onClick}
        className="w-full flex flex-col items-center gap-3 relative z-10"
      >
        <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 group-hover:from-orange-100 group-hover:to-amber-100 transition-all duration-300 relative">
          <Icon className="w-7 h-7 text-orange-600 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" strokeWidth={2.5} />
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </div>
        <span className="text-sm font-bold text-gray-700 group-hover:text-orange-600 text-center transition-colors duration-300">
          {label}
        </span>
      </button>
      {/* Decorative element */}
      <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-500 opacity-0 group-hover:opacity-5 rounded-full blur-xl transition-opacity duration-300" />
    </Card>
  );
}
