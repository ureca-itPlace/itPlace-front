import { useCallback } from 'react';
import { tabAnimations } from '../../../utils/tabAnimation';

interface UseTabClickAnimationProps {
  tabRefs: { current: { [key: string]: HTMLButtonElement | null } };
  onTabChange: (tabId: string) => void;
}

export const useTabClickAnimation = ({ tabRefs, onTabChange }: UseTabClickAnimationProps) => {
  const handleTabClick = useCallback(
    (tabId: string) => {
      // 탭 전환
      onTabChange(tabId);

      // 클릭된 탭에 스케일 애니메이션 적용
      const tabElement = tabRefs.current[tabId];
      if (tabElement) {
        tabAnimations.clickScale(tabElement);
      }
    },
    [tabRefs, onTabChange]
  );

  return { handleTabClick };
};
