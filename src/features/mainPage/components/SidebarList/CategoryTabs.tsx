import React from 'react';

interface Tab {
  id: string;
  label: string;
}

interface CategoryTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`text-sm font-medium text-center ${
            activeTab === tab.id
              ? 'bg-purple04 text-white'
              : 'bg-grey01 text-grey05 hover:bg-grey02'
          }`}
          style={{
            width: '105px',
            height: '36px',
            borderRadius: '10px',
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;