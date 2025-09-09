'use client';

import React from 'react';
import Link from 'next/link';
import styles from './NavTextItem.module.scss';

// Type definitions
export interface NavTextItemProps {
  /** Text content of the navigation item */
  children: React.ReactNode;
  /** URL or path to navigate to */
  href: string;
  /** Whether this nav item is currently active */
  isActive?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Click handler for custom navigation logic */
  onClick?: (event: React.MouseEvent) => void;
  /** Accessible label for screen readers */
  'aria-label'?: string;
  /** Test identifier for automated testing */
  'data-testid'?: string;
}

export const NavTextItem: React.FC<NavTextItemProps> = ({
  children,
  href,
  isActive = false,
  className = '',
  onClick,
  'aria-label': ariaLabel,
  'data-testid': dataTestId,
}) => {
  const navItemClasses = [
    styles.navTextItem,
    isActive && styles['navTextItem--active'],
    className
  ]
    .filter(Boolean)
    .join(' ');

  const handleClick = (event: React.MouseEvent) => {
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <Link
      href={href}
      className={navItemClasses}
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-current={isActive ? 'page' : undefined}
      data-testid={dataTestId}
    >
      {children}
    </Link>
  );
};

export default NavTextItem;