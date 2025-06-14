import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  color?: 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'blue' | 'green' | 'yellow' | 'red' | string;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ color = 'primary', className = '', ...props }) => {
  const colorClasses: Record<string, string> = {
    primary: 'bg-purple-600 text-white',
    secondary: 'bg-gray-600 text-white',
    error: 'bg-red-600 text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-500 text-white',
    blue: 'bg-blue-600 text-white',
    green: 'bg-green-600 text-white',
    yellow: 'bg-yellow-500 text-white',
    red: 'bg-red-600 text-white',
  };
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colorClasses[color] || color} ${className}`}
      {...props}
    />
  );
};