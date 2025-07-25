import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store';
import { addFavorite, removeFavorite } from '../../../api/favoriteApi';
import { showToast } from '../../../../../utils/toast';

interface StoreDetailActionButtonProps {
  benefitId?: string;
  isFavorite: boolean;
  onFavoriteChange: (newIsFavorite: boolean) => void;
}

const StoreDetailActionButton: React.FC<StoreDetailActionButtonProps> = ({
  benefitId,
  isFavorite,
  onFavoriteChange,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const handleFavoriteToggle = async () => {
    if (!isLoggedIn) {
      showToast('로그인이 필요한 서비스입니다.', 'error');
      return;
    }

    if (!benefitId) {
      showToast('혜택 정보가 없어 관심 혜택으로 추가할 수 없습니다.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const benefitIdNumber = parseInt(benefitId);

      if (isFavorite) {
        const response = await removeFavorite([benefitIdNumber]);
        showToast(response.message, 'success');
        onFavoriteChange(false);
      } else {
        const response = await addFavorite(benefitIdNumber);
        showToast(response.message, 'success');
        onFavoriteChange(true);
      }
    } catch (error: unknown) {
      console.error('즐겨찾기 토글 실패:', error);

      // Axios 에러 타입 가드
      const isAxiosError = (
        err: unknown
      ): err is { response?: { data?: { message?: string } } } => {
        return typeof err === 'object' && err !== null && 'response' in err;
      };

      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message;
        if (errorMessage) {
          showToast(errorMessage, 'error');
          return;
        }
      }

      // 기본 에러 메시지
      if (isFavorite) {
        showToast('관심 혜택 삭제에 실패했습니다.', 'error');
      } else {
        showToast('관심 혜택 추가에 실패했습니다.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getButtonText = () => {
    if (isLoading) return '처리 중...';
    return isFavorite ? '관심 혜택 삭제' : '관심 혜택 추가';
  };

  const getButtonClass = () => {
    const baseClass =
      'w-full py-3 mt-3 text-body-2-bold rounded-[10px] transition-colors duration-200 max-md:py-2.5 max-md:mt-2 max-md:text-body-3-bold max-md:rounded-[8px]';

    if (!isLoggedIn || !benefitId) {
      return `${baseClass} bg-grey03 text-grey04 cursor-not-allowed`;
    }

    // 추가든 삭제든 모두 같은 보라색으로 통일
    return `${baseClass} bg-purple04 hover:bg-purple05 text-white`;
  };

  return (
    <button
      className={getButtonClass()}
      onClick={handleFavoriteToggle}
      disabled={!isLoggedIn || !benefitId || isLoading}
    >
      {getButtonText()}
    </button>
  );
};

export default StoreDetailActionButton;
