import React from "react";
import * as IconsaxIcons from "iconsax-react";

export type IconName = keyof typeof IconsaxIcons;
export type IconVariant = "Linear" | "Bold" | "Outline" | "TwoTone" | "Broken";

export interface IconProps {
  name: IconName;
  size?: number;
  variant?: IconVariant;
  color?: string;
  className?: string;
  onClick?: () => void;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  variant = "Bold",
  color,
  className = "",
  onClick,
}) => {
  const IconComponent = IconsaxIcons[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Iconsax library`);
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

// Export all available icon names for reference
export const availableIcons = Object.keys(IconsaxIcons).filter(
  (key) => typeof IconsaxIcons[key as IconName] === "function"
) as IconName[];
