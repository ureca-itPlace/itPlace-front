import React, { useEffect, useRef } from 'react';
import { tabAnimations } from '../../../../../utils/tabAnimation';
import { useTabClickAnimation } from '../../../hooks/useTabClickAnimation';

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
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  const animationRef = useRef<gsap.core.Tween | null>(null);

  const { handleTabClick } = useTabClickAnimation({
    tabRefs,
    onTabChange,
  });

  useEffect(() => {
    // AI 탭인 경우 애니메이션 적용
    const aiTabElement = tabRefs.current['ai'];

    if (aiTabElement) {
      // 이전 애니메이션 정리
      tabAnimations.killAnimation(animationRef.current);
      animationRef.current = null;

      // 항상 원위치로 리셋
      tabAnimations.resetPosition(aiTabElement);

      // AI 탭이 활성화되지 않은 경우 실행될 애니메이션 (통통 튀기기)
      if (activeTab !== 'ai') {
        animationRef.current = tabAnimations.bounceAnimation(aiTabElement);
      }
    }

    // 클린업
    return () => {
      tabAnimations.killAnimation(animationRef.current);
      animationRef.current = null;
    };
  }, [activeTab]);

  // 호버 시 애니메이션 정지
  const handleMouseEnter = (tabId: string) => {
    if (tabId === 'ai' && activeTab !== 'ai' && animationRef.current) {
      animationRef.current.pause();
      // 호버 시 원위치로 돌아가기
      const aiTabElement = tabRefs.current['ai'];
      if (aiTabElement) {
        tabAnimations.returnToPosition(aiTabElement);
      }
    }
  };

  // 호버 해제 시 애니메이션 다시 실행
  const handleMouseLeave = (tabId: string) => {
    if (tabId === 'ai' && activeTab !== 'ai' && animationRef.current) {
      animationRef.current.play();
    }
  };

  return (
    <div className="flex gap-2 max-md:w-auto max-md:overflow-visible max-md:px-4 max-sm:px-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          ref={(el) => void (tabRefs.current[tab.id] = el)}
          onClick={() => handleTabClick(tab.id)}
          onMouseEnter={() => handleMouseEnter(tab.id)}
          onMouseLeave={() => handleMouseLeave(tab.id)}
          className={`text-title-7 text-center h-9 pt-1 w-[105px] rounded-[10px] mt-5 max-md:text-body-2 max-md:h-10 max-md:flex-1 max-md:mt-3 max-sm:text-body-3 max-sm:h-8 max-sm:mt-2 ${
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
