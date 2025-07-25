import React from 'react';

interface Tab {
  id: string;
  label: string;
}

interface NavigationTabsSectionProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const NavigationTabsSection: React.FC<NavigationTabsSectionProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex gap-2 max-md:gap-1.5">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`text-title-7 text-center h-9 w-[105px] rounded-[10px] mt-5 max-md:text-body-2 max-md:h-8 max-md:w-[90px] max-md:mt-3 ${
            activeTab === tab.id
              ? 'bg-purple04 text-white'
              : 'bg-grey01 text-grey05 hover:bg-grey02'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default NavigationTabsSection;
