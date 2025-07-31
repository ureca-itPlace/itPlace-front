import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../components/AllBenefitsModal';
import {
  BenefitItem,
  BenefitDetailResponse,
  getBenefitDetail,
  TierBenefit,
} from '../apis/allBenefitsApi';
import { showToast } from '../../../utils/toast';

interface InfoSectionProps {
  label: string;
  value: string;
  className?: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({ label, value, className = '' }) => (
  <div className="flex mb-8 max-md:mb-6 ml-[16px] max-md:ml-0 max-md:flex-col">
    <h5 className="text-title-5 max-md:text-title-8 text-black mb-4 max-md:mb-2 w-[100px] max-md:w-full flex-shrink-0">
      {label}
    </h5>
    <div className="pl-[24px] max-md:pl-0 flex-1">
      <div className="space-y-3 max-md:space-y-2">
        <div
          className={`text-body-0 max-md:text-body-4 text-grey05 whitespace-pre-line ${className}`}
        >
          {value}
        </div>
      </div>
    </div>
  </div>
);

interface BenefitDetailModalProps {
  isOpen: boolean;
  benefit: BenefitItem | null;
  onClose: () => void;
}

const BenefitDetailModal: React.FC<BenefitDetailModalProps> = ({ isOpen, benefit, onClose }) => {
  const navigate = useNavigate();
  const [benefitDetail, setBenefitDetail] = useState<BenefitDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 혜택 상세 정보 로드
  useEffect(() => {
    if (isOpen && benefit) {
      const fetchBenefitDetail = async () => {
        setIsLoading(true);
        try {
          const detail = await getBenefitDetail(benefit.benefitId);
          setBenefitDetail(detail);
        } catch (error) {
          console.error('혜택 상세 정보 로드 실패:', error);
          showToast('혜택 상세 정보를 불러오는 중 오류가 발생했습니다', 'error');
        } finally {
          setIsLoading(false);
        }
      };

      fetchBenefitDetail();
    }
  }, [isOpen, benefit]);

  // 모달이 열릴 때 배경 스크롤 방지
  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 body 스크롤 막기
      document.body.style.overflow = 'hidden';
    } else {
      // 모달이 닫힐 때 body 스크롤 복원
      document.body.style.overflow = 'unset';
    }

    // 컴포넌트 언마운트 시 스크롤 복원
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!benefit) return null;

  // 혜택 설명 표시를 위한 헬퍼 함수
  const getBenefitDescription = (tierBenefits: TierBenefit[]) => {
    if (!tierBenefits || tierBenefits.length === 0) {
      return '혜택 정보가 없습니다.';
    }

    // 등급별로 모든 혜택을 표시
    return tierBenefits
      .map((benefit) => {
        const gradeText =
          benefit.grade === 'BASIC'
            ? '우수'
            : benefit.grade === 'VIP'
              ? 'VIP'
              : benefit.grade === 'VVIP'
                ? 'VVIP'
                : benefit.grade;

        return `[${gradeText}]\n${benefit.context}`;
      })
      .join('\n\n');
  }; // 혜택 정보 표시 (API 데이터 우선, 없으면 기본 데이터)
  const displayName = benefitDetail?.benefitName || benefit.benefitName;
  const displayDescription =
    benefitDetail?.description ||
    `${benefit.category} • ${benefit.usageType === 'ONLINE' ? '온라인' : '오프라인'}`;
  const displayImage = benefitDetail?.image || benefit.image || '/images/mock/cgv.png';

  // 제공 횟수 정보
  const getBenefitInfo = () => {
    if (benefitDetail?.benefitLimit) {
      return benefitDetail.benefitLimit;
    }
    return `월 이용 제한: 무제한\n연 이용 제한: 무제한\n등급별 차등 혜택 제공`;
  };

  // 이용 방법 정보
  const getUsageMethod = () => {
    if (benefitDetail?.manual) {
      return benefitDetail.manual;
    }
    // 기본 이용 방법 (API 데이터가 없을 경우)
    if (benefit.usageType === 'ONLINE') {
      return `온라인 이용 방법:\n1. VIP콕 앱 또는 웹사이트 접속\n2. 해당 제휴처 혜택 선택\n3. 본인 인증 후 혜택 적용\n4. 온라인에서 바로 이용 가능\n\n*주의사항:\n- 다른 할인과 중복 적용 불가\n- 일부 상품 제외될 수 있음`;
    } else {
      return `오프라인 이용 방법:\n1. VIP콕 앱에서 쿠폰 발급\n2. 매장 방문 시 쿠폰 제시\n3. 직원에게 VIP콕 혜택 이용 의사 전달\n4. 본인 인증 후 혜택 적용\n\n*주의사항:\n- 매장 방문 시에만 이용 가능\n- 다른 할인과 중복 적용 불가\n- 일부 메뉴 제외될 수 있음`;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="제휴처 상세정보">
      <div className="relative h-full flex flex-col">
        {/* 내용 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto p-6 max-md:p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-[400px] max-md:h-[300px]">
              <div className="text-grey03 max-md:text-sm">상세 정보를 불러오는 중...</div>
            </div>
          ) : (
            <>
              {/* 브랜드 정보 */}
              <div className="flex items-center justify-between mb-[28px] max-md:mb-4 max-md:flex-row max-md:items-start max-md:mt-2">
                <div className="flex flex-col justify-center ml-[16px] max-md:ml-0 max-md:mr-2 flex-1 max-md:mb-4">
                  <h4 className="text-title-2 max-md:text-title-5 max-md:font-bold text-black mb-1">
                    {displayName}
                  </h4>
                  <p className="text-body-0 max-md:text-body-4 text-grey05 mt-1">
                    {displayDescription}
                  </p>
                </div>
                <div className="w-[120px] h-[120px] max-md:w-[80px] max-md:h-[80px] bg-white flex items-center justify-center ml-4 max-md:ml-0">
                  <img
                    src={displayImage}
                    alt={`${displayName} 로고`}
                    className="w-[120px] h-[120px] max-md:w-[80px] max-md:h-[80px] object-contain"
                  />
                </div>
              </div>

              {/* 제공 횟수 섹션 */}
              <InfoSection label="제공 횟수" value={getBenefitInfo()} />

              {/* 혜택 내용 섹션 */}
              <InfoSection
                label="혜택 내용"
                value={
                  benefitDetail?.tierBenefits
                    ? getBenefitDescription(benefitDetail.tierBenefits)
                    : getBenefitDescription(benefit.tierBenefits)
                }
              />

              {/* 이용방법 섹션 */}
              <InfoSection label="이용 방법" value={getUsageMethod()} />
            </>
          )}
        </div>

        {/* 하단 고정 버튼 */}
        <div className="flex justify-center py-2 mt-2 gap-3 max-md:flex-row max-md:gap-2 max-md:px-0 max-md:pb-3">
          <button
            onClick={() => {
              if (benefitDetail?.url) {
                window.open(benefitDetail.url, '_blank');
              } else {
                showToast('홈페이지 URL이 제공되지 않습니다', 'info');
              }
            }}
            className="w-[218px] h-[52px] bg-white text-grey05 rounded-[30px] text-body-0 font-medium border border-grey03 max-md:w-[140px] max-md:h-10 max-md:text-[15px] max-md:rounded-2xl"
          >
            홈페이지
          </button>
          <button
            onClick={() => {
              // 브랜드명으로 메인페이지에서 검색하도록 네비게이션
              const searchKeyword = displayName;
              navigate(`/main?search=${encodeURIComponent(searchKeyword)}`);
              onClose(); // 모달 닫기
            }}
            className="w-[218px] h-[52px] bg-purple04 text-white rounded-[30px] text-body-0 font-medium max-md:w-[140px] max-md:h-10 max-md:text-[15px] max-md:rounded-2xl"
          >
            지도로 가기
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BenefitDetailModal;
