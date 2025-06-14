import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { Card } from '../common/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  color?: 'purple' | 'blue' | 'green' | 'orange';
}

export function StatsCard({ title, value, change, icon: Icon, color = 'purple' }: StatsCardProps) {
  const colorClasses = {
    purple: 'text-purple-400 bg-purple-500/10',
    blue: 'text-blue-400 bg-blue-500/10',
    green: 'text-green-400 bg-green-500/10',
    orange: 'text-orange-400 bg-orange-500/10'
  };

  return (
    <Card>
      <div className="flex items-center">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold text-white">{value}</p>
            {change && (
              <p className="ml-2 text-sm font-medium text-green-400">
                {change}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}