import React, { useRef, useEffect } from 'react';
import { TbFilter } from 'react-icons/tb';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterGroup {
  title: string;
  options: FilterOption[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
}

interface FilterDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  filterGroups: FilterGroup[];
  onReset: () => void;
  hasActiveFilters: boolean;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  isOpen,
  onToggle,
  filterGroups,
  onReset,
  hasActiveFilters,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onToggle();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onToggle]);

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        className={`flex items-center justify-center border border-grey02 rounded-[12px] transition-colors duration-200 ${
          hasActiveFilters ? 'bg-purple04 hover:bg-purple05' : 'bg-grey01 hover:bg-grey02'
        }`}
        style={{ width: 50, height: 50 }}
      >
        <TbFilter size={20} className={hasActiveFilters ? 'text-white' : 'text-grey05'} />
      </button>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute top-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 min-w-[280px]"
        >
          <div className="space-y-4">
            {filterGroups.map((group, index) => (
              <div key={index}>
                <h4 className="text-body-2 font-medium text-grey05 mb-2">{group.title}</h4>
                <div className="flex flex-wrap gap-2">
                  {group.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => group.onSelect(option.value)}
                      className={`px-3 py-1 text-body-3 rounded-lg transition-colors duration-150 ${
                        group.selectedValue === option.value
                          ? 'bg-purple04 text-white'
                          : 'bg-grey01 text-grey05 hover:bg-grey02'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-grey02">
            <button
              onClick={onReset}
              className="w-full px-3 py-2 text-body-3 bg-grey01 text-grey05 rounded-lg hover:bg-grey02 transition-colors duration-150"
            >
              필터 초기화
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
