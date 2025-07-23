import React, { useState, useCallback, useEffect } from 'react';
import SearchBar from '../../../../../components/SearchBar';
import { useDebounce } from '../../../hooks/useDebounce';

interface SearchSectionProps {
  onSearchChange?: (query: string) => void;
  onKeywordSearch?: (keyword: string) => void;
  initialQuery?: string;
}

const SearchSection: React.FC<SearchSectionProps> = React.memo(
  ({ onSearchChange, onKeywordSearch, initialQuery }) => {
    const [searchQuery, setSearchQuery] = useState(initialQuery || '');

    // 1초 디바운스 적용
    const debouncedSearchQuery = useDebounce(searchQuery, 1000);

    // initialQuery가 변경되면 searchQuery도 업데이트
    useEffect(() => {
      setSearchQuery(initialQuery || '');
    }, [initialQuery]);

    // 디바운스된 검색어로 자동 검색
    useEffect(() => {
      if (debouncedSearchQuery.trim() && debouncedSearchQuery !== initialQuery) {
        onKeywordSearch?.(debouncedSearchQuery.trim());
      } else if (!debouncedSearchQuery.trim() && initialQuery) {
        // 검색어가 비어있고 이전에 검색어가 있었다면 전체 혜택 다시 로드
        onKeywordSearch?.('');
      }
    }, [debouncedSearchQuery, onKeywordSearch, initialQuery]);

    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);
        onSearchChange?.(query);
      },
      [onSearchChange]
    );

    const handleSearchClear = useCallback(() => {
      setSearchQuery('');
      onSearchChange?.('');
    }, [onSearchChange]);

    const handleSearchSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
          onKeywordSearch?.(searchQuery.trim());
        }
      },
      [searchQuery, onKeywordSearch]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
          onKeywordSearch?.(searchQuery.trim());
        }
      },
      [searchQuery, onKeywordSearch]
    );

    return (
      <div className="mb-4">
        <form onSubmit={handleSearchSubmit}>
          <SearchBar
            placeholder="장소 검색"
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={handleSearchClear}
            backgroundColor="bg-grey01"
            width={330}
            onKeyDown={handleKeyDown}
          />
        </form>
      </div>
    );
  }
);

export default SearchSection;
