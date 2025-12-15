import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "px-6 py-3.5 rounded-xl font-bold tracking-wide transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-soul-primary to-emerald-400 text-white shadow-lg shadow-teal-500/25 hover:shadow-teal-500/40 hover:brightness-110",
    secondary: "bg-soul-surface text-soul-text hover:bg-soul-surface/80",
    ghost: "bg-transparent text-soul-muted hover:text-soul-text hover:bg-soul-text/5",
    outline: "border-2 border-soul-primary text-soul-primary hover:bg-soul-primary/10"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};