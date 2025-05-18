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
        <div className="relative w-full">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
            <SearchNormal1 size={18} color="#94A3B8" variant="Bold" />
          </div>
          <input
            type="search"
            placeholder={placeholder}
            className={`input-standard w-full pl-12 ${className}`}
            style={{ paddingLeft: "48px" }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
};