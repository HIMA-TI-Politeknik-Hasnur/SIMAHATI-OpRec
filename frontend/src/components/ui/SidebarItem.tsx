import { MaterialSymbol } from './MaterialSymbol';

interface SidebarItemProps {
  icon?: string;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function SidebarItemSection({ label }: { label: string }) {
  return (
    <div className="mb-2">
      <span className="font-label-md text-[10px] text-outline uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

function SidebarItemComponent({ icon, label, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 py-3 px-4 text-sm transition-all duration-150 ${
        active
          ? 'bg-primary/10 border-l-4 border-primary text-primary font-bold rounded-r-lg'
          : 'text-on-surface-variant hover:bg-surface-container-high rounded-lg border-l-4 border-transparent'
      }`}
    >
      {icon && <MaterialSymbol icon={icon} className="text-[20px]" />}
      <span className="font-label-md text-label-md">{label}</span>
    </button>
  );
}

export const SidebarItem = Object.assign(SidebarItemComponent, { Section: SidebarItemSection });
