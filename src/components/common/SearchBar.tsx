import React from 'react';
import { TbSearch, TbX } from 'react-icons/tb';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  width?: number;
  height?: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  value,
  onChange,
  onClear,
  width = 344,
  height = 50,
}) => {
  return (
    <div className="relative" style={{ width, height }}>
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <TbSearch size={16} className="text-purple04" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full h-full pl-12 pr-10 border border-gray-300 rounded-[12px] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
          tabIndex={-1}
        >
          <TbX size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
