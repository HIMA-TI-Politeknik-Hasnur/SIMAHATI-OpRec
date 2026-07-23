interface MaterialSymbolProps {
  icon: string;
  className?: string;
  fill?: boolean;
  weight?: number;
}

export function MaterialSymbol({ icon, className = '', fill, weight }: MaterialSymbolProps) {
  return (
    <span
      className={`material-symbols-outlined leading-none ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${fill ? 1 : 0}, 'wght' ${weight ?? 400}`,
      }}
    >
      {icon}
    </span>
  );
}
