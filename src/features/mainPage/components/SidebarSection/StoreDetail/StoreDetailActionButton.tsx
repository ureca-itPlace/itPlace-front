import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useMediaQuery } from 'react-responsive';
import { TbStar, TbStarFilled } from 'react-icons/tb';
import { RootState } from '../../../../../store';
import { addFavorite, removeFavorite } from '../../../api/favoriteApi';
import { submitUsageAmount } from '../../../api/benefitDetail';
import { showToast } from '../../../../../utils/toast';
import { formatNumberWithCommas, removeCommas } from '../../../utils/numberFormat';
import Modal from '../../../../../components/Modal';
import CouponModal from '../../../../eventPage/components/Modal/CouponModal';
import { actionAnimations } from '../../../../../utils/Animation';

interface StoreDetailActionButtonProps {
  benefitId?: string;
  storeId: number;
  isFavorite: boolean;
  onFavoriteChange: (newIsFavorite: boolean) => void;
  partnerName?: string;
  distance: number;
  hasCoupon?: boolean;
}

const StoreDetailActionButton: React.FC<StoreDetailActionButtonProps> = ({
  benefitId,
  storeId,
  isFavorite,
  onFavoriteChange,
  partnerName,
  distance,
  hasCoupon = false,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usageAmount, setUsageAmount] = useState('');
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);

  const heartButtonRef = React.useRef<HTMLButtonElement | null>(null);

  const isDesktop = useMediaQuery({ query: '(min-width: 768px)' });

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

    if (heartButtonRef.current) {
      actionAnimations.clickScale(heartButtonRef.current);
    }

    setIsLoading(true);
    try {
      const benefitIdNumber = parseInt(benefitId);

      if (isFavorite) {
        const response = await removeFavorite([benefitIdNumber]);
        showToast(response.message, 'info');
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
      const response = await submitUsageAmount(parseInt(benefitId), numericAmount, storeId);

      // 서버에서 message 필드가 온다고 가정
      if (response?.data?.message) {
        showToast(response.data.message, 'success');
      } else {
        showToast('사용 내역이 등록되었습니다.', 'success');
      }

      // 입력값 초기화 & 모달 닫기
      setUsageAmount('');
      setIsModalOpen(false);

      // hasCoupon이 true인 경우에만 CouponModal 표시
      if (hasCoupon) {
        setIsCouponModalOpen(true);
      }
    } catch (error) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        '사용 내역 등록에 실패했습니다.';
      showToast(errorMessage, 'error');
    }
  };

  return (
    <>
      {/* 웹/모바일 공통 - 하트 + 사용 금액 입력하기 버튼 */}
      <div className="flex gap-2 max-md:mt-2">
        {/* 하트 버튼 */}
        <button
          className={`w-12 h-12 max-xl:w-10 max-xl:h-10 rounded-lg border-2 flex items-center justify-center transition-colors max-md:w-12 max-md:h-12 md:w-14 md:h-14 ${
            isFavorite
              ? 'border-purple04 bg-purple04/10'
              : isLoggedIn
                ? 'border-purple04 bg-white'
                : 'border-grey03 bg-white'
          }`}
          onClick={handleFavoriteToggle}
          disabled={!isLoggedIn || !benefitId || isLoading}
        >
          {isFavorite ? (
            <span ref={heartButtonRef} className="inline-block">
              <TbStarFilled className="w-5 h-5 text-purple04 max-md:w-5 max-md:h-5 md:w-6 md:h-6" />
            </span>
          ) : (
            <span ref={heartButtonRef} className="inline-block">
              <TbStar
                className={`w-5 h-5 max-md:w-5 max-md:h-5 md:w-6 md:h-6 ${isLoggedIn ? 'text-purple04' : 'text-grey03'}`}
              />
            </span>
          )}
        </button>

        {/* 사용 금액 입력하기 버튼 */}
        <button
          className={`flex-1 py-3 text-body-3-bold rounded-lg transition-colors max-xl:py-2 max-xl:text-body-3-bold md:text-body-2-bold max-md:py-3 md:py-3 ${
            !isDesktop && isDistanceValid && isLoggedIn && benefitId
              ? 'bg-purple04 hover:bg-purple05 text-white'
              : 'bg-grey03 text-grey04 cursor-not-allowed'
          }`}
          onClick={() => {
            if (!isLoggedIn) {
              showToast('로그인이 필요한 서비스입니다.', 'error');
              return;
            }
            if (!benefitId) {
              showToast('혜택 정보가 없습니다.', 'error');
              return;
            }
            if (isDesktop) {
              // 웹 버전에서는 모달을 열지 않음
              return;
            }
            if (isDistanceValid) {
              setIsModalOpen(true);
            }
          }}
          disabled={isDesktop || !isDistanceValid || !isLoggedIn || !benefitId}
        >
          {!isLoggedIn
            ? '로그인이 필요해요'
            : !benefitId
              ? '혜택 정보가 없어요'
              : isDistanceValid
                ? isDesktop
                  ? '모바일에서 사용 가능해요!'
                  : '혜택 사용 이력 등록하기'
                : '사용하기에 너무 멀어요'}
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

      {/* CouponModal - 사용 내역 등록 성공 시 표시 */}
      <CouponModal isOpen={isCouponModalOpen} onClose={() => setIsCouponModalOpen(false)} />
    </>
  );
};

export default StoreDetailActionButton;
