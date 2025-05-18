import React from 'react';
import * as Iconsax from 'iconsax-react';

// Type for icon variants
type IconVariant = 'Linear' | 'Bold' | 'Outline' | 'TwoTone' | 'Broken';

interface IconProps {
  name: keyof typeof Iconsax;
  size?: number;
  variant?: IconVariant;
  color?: string;
  className?: string;
  onClick?: () => void;
}

export const Icon = ({ 
  name, 
  size = 24, 
  variant = 'Linear', 
  color, 
  className = '',
  onClick
}: IconProps) => {
  // Get the icon component from Iconsax
  const IconComponent = Iconsax[name];
  
  if (!IconComponent) {
    console.warn(`Icon ${name} not found in Iconsax library`);
    return null;
  }
  
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

// Export all icon names for easy autocomplete
export const IconNames = Object.keys(Iconsax).filter(
  key => typeof Iconsax[key as keyof typeof Iconsax] === 'function'
) as Array<keyof typeof Iconsax>;