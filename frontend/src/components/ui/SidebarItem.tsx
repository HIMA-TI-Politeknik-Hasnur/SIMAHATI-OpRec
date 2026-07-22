import type { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick: () => void;
}

export function SidebarItem({ icon: Icon, label, active = false, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-5 py-3 text-left text-sm font-medium transition-colors
        ${active
          ? 'bg-orange-600/20 border-l-[3px] border-orange-500 text-orange-400'
          : 'text-gray-400 hover:bg-gray-700 hover:text-white border-l-[3px] border-transparent'
        }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <span>{label}</span>
    </button>
  );
}
