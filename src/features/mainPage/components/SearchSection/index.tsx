import React, { useState } from 'react';
import SearchBar from '../../../../components/common/SearchBar';

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
        backgroundColor="grey01"
        width={330}
      />
    </div>
  );
};

export default SearchSection;
