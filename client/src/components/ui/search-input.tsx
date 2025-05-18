import React, { useState, FormEvent } from 'react';
import { SearchNormal1 } from 'iconsax-react';

interface SearchInputProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
  className?: string;
}

export const SearchInput = ({ 
  onSearch, 
  placeholder = "Search...", 
  initialValue = "", 
  className = ""
}: SearchInputProps) => {
  const [value, setValue] = useState(initialValue);
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <div className="relative w-96">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="search"
            placeholder={placeholder}
            className={`input-standard w-full pl-16 pr-4 ${className}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <SearchNormal1 size={18} variant="Bold" className="text-gray-400" />
          </div>
        </div>
      </form>
    </div>
  );
};