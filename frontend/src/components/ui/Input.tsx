import React, { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  rightElement,
  fullWidth = true,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  return (
    <div className={`form-group ${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
        </label>
      )}
      <div className={icon ? 'input-with-icon' : 'relative'}>
        {icon && (
          <span className="input-icon">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`form-input ${error ? 'border-error' : ''}`}
          style={rightElement ? { paddingRight: '2.5rem', width: '100%' } : { width: '100%' }}
          {...props}
        />
        {rightElement && (
          <div style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
            {rightElement}
          </div>
        )}
      </div>
      {error && <span className="text-error text-caption mt-1 block">{error}</span>}
    </div>
  );
};
