import React from 'react';

interface StatusBadgeProps {
  status: 'available' | 'booked' | 'full';
  text: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  text,
  className = '',
}) => {
  const statusClasses = {
    available: 'bg-status-available/20 text-status-available border border-status-available/50',
    booked: 'bg-status-booked/20 text-status-booked border border-status-booked/50',
    full: 'bg-status-full/20 text-status-full border border-status-full/50',
  };

  const emoji = {
    available: '🟢',
    booked: '🔴',
    full: '🔴',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status]} ${className}`}
    >
      <span>{emoji[status]}</span>
      <span>{text}</span>
    </span>
  );
};

