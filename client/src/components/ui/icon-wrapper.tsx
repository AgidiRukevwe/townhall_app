import React from 'react';
import * as Iconsax from 'iconsax-react';

// Define the props for the IconWrapper component
interface IconWrapperProps {
  name: keyof typeof Iconsax;
  size?: number;
  variant?: 'Linear' | 'Bold' | 'Outline' | 'TwoTone' | 'Broken';
  color?: string;
  className?: string;
  onClick?: () => void;
}

// Create a wrapper component for Iconsax icons
export const IconWrapper = ({
  name,
  size = 24,
  variant = 'Linear',
  color,
  className = '',
  onClick,
}: IconWrapperProps) => {
  // Dynamically access the icon component from Iconsax
  const IconComponent = Iconsax[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Iconsax library`);
    return null;
  }
  
  // Render the icon component with the provided props
  return (
    <IconComponent 
      size={size} 
      variant={variant} 
      color={color} 
      className={className}
      onClick={onClick}
    />
  );
};

// Export a list of available icon names for easy reference
export const iconNames = Object.keys(Iconsax).filter(
  (key) => typeof Iconsax[key as keyof typeof Iconsax] === 'function'
);