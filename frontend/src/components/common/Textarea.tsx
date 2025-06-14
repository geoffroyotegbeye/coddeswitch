import React, { forwardRef } from 'react';
import { LucideIcon } from 'lucide-react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
  fullWidth?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, icon: Icon, fullWidth = false, className = '', ...props }, ref) => {
    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-gray-300 mb-1">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute top-3 left-3 flex items-center pointer-events-none">
              <Icon className="h-5 w-5 text-gray-400" />
            </div>
          )}
          <textarea
            ref={ref}
            className={`
              block w-full rounded-lg border bg-gray-800 text-white
              ${Icon ? 'pl-10' : 'pl-4'}
              pr-4 py-2.5
              ${error 
                ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-700 focus:border-purple-500 focus:ring-purple-500'
              }
              focus:outline-none focus:ring-2 focus:ring-opacity-50
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors duration-200
              resize-y min-h-[100px]
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-1 text-sm text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  }
); 