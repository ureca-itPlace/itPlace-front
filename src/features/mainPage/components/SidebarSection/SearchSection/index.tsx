import React, { useState } from 'react';
import SearchBar from '../../../../../components/SearchBar';

interface SearchSectionProps {
  onSearchChange?: (query: string) => void;
}

const SearchSection: React.FC<SearchSectionProps> = ({ onSearchChange }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearchChange?.(query);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    onSearchChange?.('');
  };

  return (
    <div className="mb-4">
      <SearchBar
        placeholder="장소 검색"
        value={searchQuery}
        onChange={handleSearchChange}
        onClear={handleSearchClear}
        backgroundColor="bg-grey01"
        className="w-[330px] h-[50px]"
      />
    </div>
  );
};

export default SearchSection;
