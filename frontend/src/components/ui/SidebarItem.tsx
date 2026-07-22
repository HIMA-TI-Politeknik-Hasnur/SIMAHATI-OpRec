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
      className={`w-full flex items-center gap-3 px-5 py-3 text-left text-sm font-medium transition-all duration-200
        ${active
          ? 'bg-orange-50 text-orange-600 border-l-[3px] border-orange-500 font-semibold'
          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border-l-[3px] border-transparent'
        }`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={active ? 2.5 : 2} />
      <span>{label}</span>
    </button>
  );
}
