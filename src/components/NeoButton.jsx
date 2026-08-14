import React from 'react';
import Link from 'next/link';

export default function NeoButton({ children, href, variant = 'primary', className = '', ...props }) {
  const baseClasses = `neo-button ${variant} ${className}`;
  
  if (href) {
    return (
      <Link href={href} className={baseClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={baseClasses} {...props}>
      {children}
    </button>
  );
}
