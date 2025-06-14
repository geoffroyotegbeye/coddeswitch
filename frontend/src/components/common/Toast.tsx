import React from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: 'text-green-500',
  error: 'text-red-500',
  info: 'text-blue-500',
  warning: 'text-yellow-500',
};

const bgColors = {
  success: 'bg-green-500',
  error: 'bg-red-500',
  info: 'bg-blue-500',
  warning: 'bg-yellow-500',
};

export function Toast() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-4">
      {notifications.map((notification) => {
        const Icon = icons[notification.type];
        const color = colors[notification.type];
        const bgColor = bgColors[notification.type];

        return (
          <div
            key={notification.id}
            className={`
              flex items-center p-4 rounded-lg shadow-lg
              bg-white dark:bg-gray-800
              border-l-4 ${bgColor}
              transform transition-all duration-300 ease-in-out
              hover:translate-x-[-4px]
            `}
          >
            <Icon className={`h-5 w-5 ${color} mr-3`} />
            <p className="flex-1 text-gray-800 dark:text-gray-200">
              {notification.message}
            </p>
            <button
              onClick={() => removeNotification(notification.id)}
              className="ml-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}