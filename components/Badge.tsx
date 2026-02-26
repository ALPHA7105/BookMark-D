
import React from 'react';

interface BadgeProps {
  label: string;
  icon?: string;
  colorClass?: string;
}

const Badge: React.FC<BadgeProps> = ({ label, icon, colorClass = "bg-pink-500/20 text-pink-300 border-pink-500/50" }) => {
  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${colorClass} backdrop-blur-md shadow-lg animate-pulse`}>
      {icon && <span className="mr-1.5">{icon}</span>}
      {label}
    </div>
  );
};

export default Badge;
