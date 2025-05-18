import React from 'react';
import { IconWrapper } from './icon-wrapper';

/**
 * Example component demonstrating how to use the IconWrapper
 * with various Iconsax icons and configurations
 */
export const ExampleIcons = () => {
  return (
    <div className="flex flex-col gap-6 p-6 border rounded-lg bg-white">
      <h2 className="text-lg font-bold">Icon Examples</h2>
      
      <div className="grid grid-cols-4 gap-4">
        {/* Basic icon usage */}
        <div className="flex flex-col items-center">
          <IconWrapper name="Home" size={24} />
          <span className="text-sm mt-2">Home</span>
        </div>
        
        {/* Icon with variant */}
        <div className="flex flex-col items-center">
          <IconWrapper name="User" size={24} variant="Bold" />
          <span className="text-sm mt-2">User (Bold)</span>
        </div>
        
        {/* Icon with custom color */}
        <div className="flex flex-col items-center">
          <IconWrapper name="Heart" size={24} color="#1476FF" />
          <span className="text-sm mt-2">Heart (Colored)</span>
        </div>
        
        {/* Icon with custom class and variant */}
        <div className="flex flex-col items-center">
          <IconWrapper 
            name="NotificationBing" 
            size={24} 
            variant="TwoTone" 
            className="text-red-500"
          />
          <span className="text-sm mt-2">Notification (TwoTone)</span>
        </div>
      </div>
      
      {/* Various icon sizes */}
      <div className="flex items-end gap-4 mt-4">
        <div className="flex flex-col items-center">
          <IconWrapper name="Star1" size={16} variant="Bold" color="#FFC107" />
          <span className="text-xs mt-2">16px</span>
        </div>
        
        <div className="flex flex-col items-center">
          <IconWrapper name="Star1" size={24} variant="Bold" color="#FFC107" />
          <span className="text-xs mt-2">24px</span>
        </div>
        
        <div className="flex flex-col items-center">
          <IconWrapper name="Star1" size={32} variant="Bold" color="#FFC107" />
          <span className="text-xs mt-2">32px</span>
        </div>
        
        <div className="flex flex-col items-center">
          <IconWrapper name="Star1" size={40} variant="Bold" color="#FFC107" />
          <span className="text-xs mt-2">40px</span>
        </div>
      </div>
      
      {/* Clickable icon */}
      <div className="flex flex-col items-center mt-4">
        <IconWrapper 
          name="AddCircle" 
          size={32} 
          variant="Bold" 
          color="#1476FF"
          className="cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => alert('Icon clicked!')}
        />
        <span className="text-sm mt-2">Clickable Icon</span>
      </div>
    </div>
  );
};