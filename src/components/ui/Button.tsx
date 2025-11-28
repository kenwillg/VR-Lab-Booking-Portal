import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  fullWidth = false,
  children,
  className = '',
  ...props
}) => {
  const baseClasses = 'px-6 py-3 rounded-button font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'gradient-primary text-white hover:opacity-90 active:scale-95',
    secondary: 'bg-bg-card text-text-primary border border-slate-600 hover:bg-slate-700',
    danger: 'bg-status-booked text-white hover:bg-red-600 active:scale-95',
    outline: 'bg-transparent text-text-primary border-2 border-indigo-500 hover:bg-indigo-500/10',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

