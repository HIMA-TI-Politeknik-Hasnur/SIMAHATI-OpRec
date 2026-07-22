import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`group bg-white rounded-xl border border-gray-200 p-6 ${
        hover ? 'hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer hover:border-orange-200' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
