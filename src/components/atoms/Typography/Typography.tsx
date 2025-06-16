import React from 'react';
import './Typography.css';
import type { TypographyProps } from '../../../types';

export const Typography: React.FC<TypographyProps> = ({
  children,
  variant = 'body1',
  component,
  color = 'primary',
  align = 'left',
  weight = 'normal',
  className = '',
}) => {
  const getComponent = () => {
    if (component) return component;
    
    switch (variant) {
      case 'h1': return 'h1';
      case 'h2': return 'h2';
      case 'h3': return 'h3';
      case 'h4': return 'h4';
      case 'h5': return 'h5';
      case 'h6': return 'h6';
      case 'caption':
      case 'overline': return 'span';
      default: return 'p';
    }
  };

  const Component = getComponent();

  const classes = [
    'typography',
    `typography--${variant}`,
    `typography--color-${color}`,
    `typography--align-${align}`,
    `typography--weight-${weight}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes}>
      {children}
    </Component>
  );
};