import React, { useState, FormEvent } from "react";
import { SearchNormal1 } from "iconsax-react";
import { Icon } from "./icon";

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
  className = "",
}: SearchInputProps) => {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <div className={`w-72  ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative w-full">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
            {/* <SearchNormal1 size={18} color="#94A3B8" variant="Bold" /> */}
            <Icon name="SearchNormal1" size={18} color="#737373" />
          </div>
          <input
            type="search"
            placeholder={placeholder}
            className={`input-standard w-full bg-[#F0F4F9] focus:bg-white placeholder:text-text-secondary focus:ring-1 focus:ring-surface-brand focus:border-2 transition-all duration-300 ease-in-out ${className}`}
            style={{
              paddingLeft: "48px",
              // backgroundColor: "#F0F4F9",
              outline: "none",
              border: "none",
            }}
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
};
