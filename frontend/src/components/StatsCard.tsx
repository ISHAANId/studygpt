import React from 'react';

type StatsCardProps = {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
};

export default function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center space-x-4 hover:shadow-md transition-shadow">
      {icon && <div className="text-accent2 w-8 h-8">{icon}</div>}
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-primary">{value}</p>
      </div>
    </div>
  );
}
