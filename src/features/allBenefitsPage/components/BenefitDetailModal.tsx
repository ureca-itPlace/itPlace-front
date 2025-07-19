import React, { useEffect, useState } from 'react';
import Modal from '../../../components/common/AdminModal';
import { BenefitItem, BenefitDetailResponse, getBenefitDetail } from '../apis/allBenefitsApi';
import { showToast } from '../../../utils/toast';

interface InfoSectionProps {
  label: string;
  value: string;
  className?: string;
}

const InfoSection: React.FC<InfoSectionProps> = ({ label, value, className = '' }) => (
  <div className="flex mb-8 ml-[16px]">
    <h5 className="text-title-5 text-black mb-4 w-[100px] flex-shrink-0">{label}</h5>
    <div className="pl-[24px] flex-1">
      <div className="space-y-3">
        <div className={`text-body-0 text-grey05 whitespace-pre-line ${className}`}>{value}</div>
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

  // 혜택 정보 표시 (API 데이터 우선, 없으면 기본 데이터)
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
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-[400px]">
              <div className="text-grey03">상세 정보를 불러오는 중...</div>
            </div>
          ) : (
            <>
              {/* 브랜드 정보 */}
              <div className="flex items-center justify-between mb-[28px]">
                <div className="flex items-center ml-[16px]">
                  <div>
                    <h4 className="text-title-2 text-black mb-1">{displayName}</h4>
                    <p className="text-body-0 text-grey05 mt-1">{displayDescription}</p>
                  </div>
                </div>
                <div className="w-[120px] h-[120px] bg-white flex items-center justify-center">
                  <img
                    src={displayImage}
                    alt={`${displayName} 로고`}
                    className="w-[120px] h-[120px] object-contain"
                  />
                </div>
              </div>

              {/* 제공 횟수 섹션 */}
              <InfoSection label="제공 횟수" value={getBenefitInfo()} />

              {/* 이용방법 섹션 */}
              <InfoSection label="이용 방법" value={getUsageMethod()} />
            </>
          )}
        </div>

        {/* 하단 고정 버튼 */}
        <div className="flex justify-center py-2 mt-2 gap-3">
          <button
            onClick={() => {
              if (benefitDetail?.url) {
                window.open(benefitDetail.url, '_blank');
              } else {
                showToast('홈페이지 URL이 제공되지 않습니다', 'info');
              }
            }}
            className="w-[218px] h-[52px] bg-white text-grey05 rounded-[30px] text-body-0 font-medium border border-grey03"
          >
            홈페이지
          </button>
          <button
            onClick={onClose}
            className="w-[218px] h-[52px] bg-purple04 text-white rounded-[30px] text-body-0 font-medium"
          >
            지도로 가기
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BenefitDetailModal;
