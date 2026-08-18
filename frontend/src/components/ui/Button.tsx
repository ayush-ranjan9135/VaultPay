import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-danger',
    ghost: 'btn-ghost' // we might need to add this to CSS if it doesn't exist
  };
  
  const sizeClasses = {
    sm: 'padding-0.5rem font-size-0.875rem', // example mapping, usually handled in CSS via .btn-sm
    md: '',
    lg: 'padding-1rem font-size-1.125rem'
  };

  const fullWidthClass = fullWidth ? 'w-full' : '';
  const loadingClass = isLoading ? 'opacity-70 cursor-wait' : '';

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidthClass} ${loadingClass} ${className}`.trim();

  return (
    <button 
      className={combinedClasses} 
      disabled={disabled || isLoading} 
      style={fullWidth ? { width: '100%' } : {}}
      {...props}
    >
      {isLoading && (
        <span className="mr-2 animate-spin">
          {/* Simple SVG spinner */}
          <svg className="w-4 h-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
      )}
      {!isLoading && leftIcon && <span className="mr-2" style={{ display: 'inline-flex', alignItems: 'center' }}>{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="ml-2" style={{ display: 'inline-flex', alignItems: 'center' }}>{rightIcon}</span>}
    </button>
  );
};
