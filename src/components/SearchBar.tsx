import React from 'react';
import { TbSearch, TbX } from 'react-icons/tb';
interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  className?: string;
  backgroundColor?: string;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}
const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  value,
  onChange,
  onClear,
  className = '',
  backgroundColor,
  onKeyDown,
}) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <TbSearch size={18} className="text-purple04" />
      </div>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        className={`w-full h-full pl-12 pr-10 rounded-[10px] text-black text-base max-xl:text-body-3 placeholder-grey03 placeholder:text-body-2 max-xl:placeholder:text-body-3 focus:outline-none focus:ring-0 focus:border-gray-300 ${backgroundColor || ''}`}
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-grey03 hover:text-grey03 focus:outline-none"
          tabIndex={-1}
        >
          <TbX size={24} className="text-grey03" />
        </button>
      )}
    </div>
  );
};
export default SearchBar;
