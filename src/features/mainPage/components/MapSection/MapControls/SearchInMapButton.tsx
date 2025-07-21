import React from 'react';

interface SearchInMapButtonProps {
  onClick?: () => void;
}

const SearchInMapButton: React.FC<SearchInMapButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-purple04 text-white px-6 py-3 rounded-full shadow-lg hover:bg-purple05 transition-colors duration-200 flex items-center space-x-2"
    >
      <span>🔍</span>
      <span>현 지도에서 검색</span>
    </button>
  );
};

export default SearchInMapButton;
