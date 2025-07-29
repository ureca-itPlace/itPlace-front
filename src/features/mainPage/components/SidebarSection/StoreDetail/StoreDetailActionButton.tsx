import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { TbHeart, TbHeartFilled } from 'react-icons/tb';
import { RootState } from '../../../../../store';
import { addFavorite, removeFavorite } from '../../../api/favoriteApi';
import { submitUsageAmount } from '../../../api/benefitDetail';
import { showToast } from '../../../../../utils/toast';
import { formatNumberWithCommas, removeCommas } from '../../../utils/numberFormat';
import Modal from '../../../../../components/Modal';

interface StoreDetailActionButtonProps {
  benefitId?: string;
  isFavorite: boolean;
  onFavoriteChange: (newIsFavorite: boolean) => void;
  partnerName?: string;
  distance: number;
}

const StoreDetailActionButton: React.FC<StoreDetailActionButtonProps> = ({
  benefitId,
  isFavorite,
  onFavoriteChange,
  partnerName,
  distance,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usageAmount, setUsageAmount] = useState('');

  // input 값 변경 핸들러 (콤마 포맷팅 적용)
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatNumberWithCommas(e.target.value);
    setUsageAmount(formattedValue);
  };

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  // 거리 조건 체크 (0.1km 이하만 사용 가능)
  const isDistanceValid = distance <= 0.5;

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

  const handleUsageAmountSubmit = async () => {
    if (!usageAmount.trim()) {
      showToast('사용 금액을 입력해주세요.', 'error');
      return;
    }

    if (!benefitId) {
      showToast('혜택 ID가 없습니다.', 'error');
      return;
    }

    try {
      // 콤마 제거 후 숫자로 변환
      const numericAmount = parseInt(removeCommas(usageAmount));
      // API 호출
      const response = await submitUsageAmount(parseInt(benefitId), numericAmount);

      // 서버에서 message 필드가 온다고 가정
      if (response?.data?.message) {
        showToast(response.data.message, 'success');
      } else {
        showToast('사용 내역이 등록되었습니다.', 'success');
      }

      // 입력값 초기화 & 모달 닫기
      setUsageAmount('');
      setIsModalOpen(false);
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        '사용 내역 등록에 실패했습니다.';
      showToast(errorMessage, 'error');
    }
  };

  const getButtonClass = () => {
    const baseClass =
      'w-full py-3 text-body-2-bold rounded-[10px] transition-colors duration-200 max-md:py-2.5 max-md:text-body-3-bold max-md:rounded-[8px]';

    if (!isLoggedIn || !benefitId) {
      return `${baseClass} bg-grey03 text-grey04 cursor-not-allowed`;
    }

    // 추가든 삭제든 모두 같은 보라색으로 통일
    return `${baseClass} bg-purple04 hover:bg-purple05 text-white`;
  };

  return (
    <>
      {/* 데스크톱 버전 - 기존 버튼 */}
      <button
        className={`${getButtonClass()} md:block hidden`}
        onClick={handleFavoriteToggle}
        disabled={!isLoggedIn || !benefitId || isLoading}
      >
        {getButtonText()}
      </button>

      {/* 모바일 버전 - 하트 + 사용 금액 입력하기 버튼 */}
      <div className="md:hidden flex gap-2">
        {/* 하트 버튼 */}
        <button
          className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center transition-colors ${
            isFavorite ? 'border-purple04 bg-purple04/10' : 'border-grey03 bg-white'
          }`}
          onClick={handleFavoriteToggle}
          disabled={!isLoggedIn || !benefitId || isLoading}
        >
          {isFavorite ? (
            <TbHeartFilled className="w-5 h-5 text-purple04" />
          ) : (
            <TbHeart className="w-5 h-5 text-grey03" />
          )}
        </button>

        {/* 사용 금액 입력하기 버튼 */}
        <button
          className={`flex-1 py-3 text-body-3-bold rounded-lg transition-colors ${
            isDistanceValid
              ? 'bg-purple04 hover:bg-purple05 text-white'
              : 'bg-grey03 text-grey04 cursor-not-allowed'
          }`}
          onClick={() => isDistanceValid && setIsModalOpen(true)}
          disabled={!isDistanceValid}
        >
          {isDistanceValid ? '사용 금액 입력하기' : '사용하기에 너무 멀어요'}
        </button>
      </div>

      {/* 사용 금액 입력 모달 */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="w-full max-w-[320px] -mx-10">
          <h2 className="text-title-7 font-bold mb-6 text-center">
            <span className="text-purple04">{partnerName || '해당 가맹점'}</span> 에서 사용한 금액을
            입력해주세요.
          </h2>

          <div className="mb-6">
            <div className="flex items-center relative">
              <input
                type="text"
                value={usageAmount}
                onChange={handleAmountChange}
                placeholder="금액 입력"
                className="flex-1 py-2 pr-8 border border-grey03 rounded-[10px] focus:border-purple04 focus:outline-none text-center placeholder:text-center"
              />
              <span className="absolute right-3 text-grey04 pointer-events-none">원</span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              className="flex-1 px-5 py-2 border border-grey02 text-grey02 hover:border-grey04 hover:text-grey04 rounded-lg font-medium transition-colors"
              onClick={() => setIsModalOpen(false)}
            >
              취소
            </button>
            <button
              className={`flex-1 px-5 py-2 rounded-lg font-medium transition-colors ${
                usageAmount.trim()
                  ? 'bg-purple04 text-white hover:bg-purple05'
                  : 'bg-grey02 text-white cursor-not-allowed'
              }`}
              onClick={handleUsageAmountSubmit}
              disabled={!usageAmount.trim()}
            >
              등록
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default StoreDetailActionButton;
