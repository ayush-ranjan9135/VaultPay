import React from 'react';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
  interactive?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  noPadding = false,
  interactive = false,
  onClick,
  style
}) => {
  const paddingClass = noPadding ? 'p-0' : 'padding-6'; // Note: inline styles or utility classes in index.css
  const interactiveClass = interactive ? 'card-interactive cursor-pointer' : '';
  
  return (
    <div 
      className={`card ${interactiveClass} ${className}`.trim()} 
      onClick={onClick}
      style={{
        padding: noPadding ? 0 : undefined,
        ...style
      }}
    >
      {children}
    </div>
  );
};
