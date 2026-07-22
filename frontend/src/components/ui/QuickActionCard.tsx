import type { LucideIcon } from 'lucide-react';
import { Card } from './Card';

interface QuickActionCardProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
}

export function QuickActionCard({ icon: Icon, label, onClick }: QuickActionCardProps) {
  return (
    <Card hover className="p-4">
      <button
        onClick={onClick}
        className="w-full flex flex-col items-center gap-2"
      >
        <div className="p-3 rounded-full bg-blue-50">
          <Icon className="w-6 h-6 text-blue-600" />
        </div>
        <span className="text-sm font-medium text-gray-700 text-center">{label}</span>
      </button>
    </Card>
  );
}
