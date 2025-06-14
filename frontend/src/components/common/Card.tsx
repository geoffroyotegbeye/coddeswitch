import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Card: React.FC<CardProps> = ({ className = '', ...props }) => {
  return (
    <div className={`bg-gray-800 rounded-lg shadow p-4 ${className}`} {...props} />
  );
};