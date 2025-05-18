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
    <div className="w-96">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center relative">
          <div className="absolute left-4 z-10 pointer-events-none">
            <SearchNormal1 size={18} variant="Bold" className="text-gray-400" />
          </div>
          <input
            type="search"
            placeholder={placeholder}
            className={`input-standard w-full py-2 pl-12 pr-4 ${className}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
};