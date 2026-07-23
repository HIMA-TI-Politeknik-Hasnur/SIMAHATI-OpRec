import type { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  icon?: LucideIcon;
  emoji?: string;
  label: string;
  active?: boolean;
  section?: boolean;
  onClick?: () => void;
}

function SidebarItemSection({ label }: { label: string }) {
  return (
    <div className="px-4 py-1.5">
      <span className="text-[0.65rem] font-semibold uppercase tracking-widest text-gray-400">
        {label}
      </span>
    </div>
  );
}

function SidebarItemComponent({ icon: Icon, emoji, label, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-all duration-150 ${
        active
          ? 'bg-orange-50 text-orange-600 font-medium'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      {emoji ? (
        <span className="text-lg leading-none">{emoji}</span>
      ) : Icon ? (
        <Icon size={18} className={active ? 'text-orange-500' : 'text-gray-400'} />
      ) : null}
      <span>{label}</span>
    </button>
  );
}

export const SidebarItem = Object.assign(SidebarItemComponent, { Section: SidebarItemSection });
