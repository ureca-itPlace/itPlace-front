import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Platform } from '../../../types';
import { TbX, TbMapPin, TbPhone, TbClock } from 'react-icons/tb';
import { RootState } from '../../../../../store';
import { getBenefitDetail } from '../../../api/benefitDetail';

interface StoreDetailCardProps {
  platform: Platform;
  onClose: () => void;
}

// 상세 혜택 데이터 타입 (API 응답 기반)
interface TierBenefit {
  grade: string;
  context: string;
  isAll: boolean;
}

interface BenefitDetailResponse {
  code: string;
  status: string;
  message: string;
  timestamp: string;
  data: {
    benefitId: string;
    benefitName: string;
    mainCategory: string;
    manual: string;
    url: string;
    tierBenefits: TierBenefit[];
  };
}

const StoreDetailCard: React.FC<StoreDetailCardProps> = ({ platform, onClose }) => {
  // Redux에서 사용자 등급 가져오기
  const membershipGrade = useSelector((state: RootState) => state.auth.user?.membershipGrade);

  // 혜택 필터 상태 - 탭 방식
  const [activeTab, setActiveTab] = useState<'basic' | 'vipkok'>('basic');

  // API 상태 관리
  const [detailData, setDetailData] = useState<BenefitDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // API 호출 함수
  const fetchBenefitDetail = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // activeTab에 따라 mainCategory 결정
      const mainCategory = activeTab === 'vipkok' ? 'VIP_COCK' : 'BASIC_BENEFIT';

      const response = await getBenefitDetail({
        storeId: platform.storeId,
        partnerId: platform.partnerId,
        mainCategory: mainCategory,
      });

      setDetailData(response);
    } catch (err) {
      console.error('혜택 상세 정보 조회 실패:', err);
      setError('혜택 정보를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 및 activeTab 변경 시 API 호출
  useEffect(() => {
    fetchBenefitDetail();
  }, [platform.storeId, platform.partnerId, activeTab]);

  // 필터된 혜택 반환
  const getFilteredBenefits = () => {
    // 안전한 접근을 위한 다중 체크
    if (!detailData || !detailData.data || !detailData.data.tierBenefits) {
      return [];
    }

    return detailData.data.tierBenefits;
  };

  // 사용자 등급에 맞는 혜택인지 확인
  const isUserBenefit = (benefitGrade: string): boolean => {
    if (!membershipGrade) return false;
    return membershipGrade.toLowerCase() === benefitGrade.toLowerCase();
  };

  return (
    <div className="w-[390px] bg-white rounded-t-[20px] shadow-lg">
      <div className="relative px-6 py-6">
        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-grey04 hover:text-grey06 transition-colors p-2"
        >
          <TbX size={24} />
        </button>

        {/* 브랜드 로고 */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 mb-4 bg-red-500 rounded-full flex items-center justify-center">
            {platform.imageUrl ? (
              <img
                src={platform.imageUrl}
                alt={`${platform.name} 로고`}
                className="w-full h-full object-contain rounded-full"
              />
            ) : (
              <span className="text-white text-xl font-bold">{platform.name.charAt(0)}</span>
            )}
          </div>

          <h2 className="text-xl font-bold text-grey06 mb-1">{platform.name}</h2>
          <p className="text-sm text-grey04 mb-4">{platform.name}</p>
        </div>

        {/* 매장 정보 */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3">
            <TbMapPin className="text-grey04 flex-shrink-0" size={16} />
            <span className="text-sm text-grey06">{platform.address}</span>
          </div>

          <div className="flex items-center gap-3">
            <TbPhone className="text-grey04 flex-shrink-0" size={16} />
            <span className="text-sm text-grey06">{platform.phone || '051-291-4446'}</span>
          </div>

          <div className="flex items-center gap-3">
            <TbClock className="text-grey04 flex-shrink-0" size={16} />
            <span className="text-sm text-grey06">{platform.hours || '월~일까지'}</span>
          </div>
        </div>

        {/* 혜택 탭 */}
        <div className="flex mb-4">
          <button
            onClick={() => setActiveTab('basic')}
            className={`flex-1 py-2 text-center border-b-2 transition-colors ${
              activeTab === 'basic'
                ? 'border-purple-500 text-purple-500 font-medium'
                : 'border-transparent text-grey04'
            }`}
          >
            기본 혜택
          </button>
          <button
            onClick={() => setActiveTab('vipkok')}
            className={`flex-1 py-2 text-center border-b-2 transition-colors ${
              activeTab === 'vipkok'
                ? 'border-purple-500 text-purple-500 font-medium'
                : 'border-transparent text-grey04'
            }`}
          >
            VIP 콕
          </button>
        </div>

        {/* 상세 혜택 */}
        <div className="mb-6">
          <h3 className="text-base font-medium text-grey06 mb-3">상세 혜택</h3>

          {isLoading ? (
            <div className="text-center text-grey04 py-8">
              <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2"></div>
              <div>혜택 정보를 불러오는 중...</div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-4">
              <div className="mb-2">⚠️</div>
              <div className="text-sm">{error}</div>
              <button
                onClick={fetchBenefitDetail}
                className="mt-2 px-3 py-1 text-xs bg-grey02 hover:bg-grey03 rounded transition-colors"
              >
                다시 시도
              </button>
            </div>
          ) : getFilteredBenefits().length > 0 ? (
            <div className="space-y-2">
              {getFilteredBenefits().map((benefit: TierBenefit, index: number) => {
                const isUserGrade = isUserBenefit(benefit.grade);
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-sm flex items-center justify-center text-xs ${
                        isUserGrade ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'
                      }`}
                    >
                      ✓
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-grey06">{benefit.grade}</span>
                        <span
                          className={`text-sm font-bold ${
                            isUserGrade ? 'text-orange-500' : 'text-green-500'
                          }`}
                        >
                          {benefit.context.split(' ')[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-grey04 py-4">
              {activeTab === 'basic' ? '기본 혜택 정보가 없습니다' : 'VIP콕 혜택 정보가 없습니다'}
            </div>
          )}
        </div>

        {/* 이용 방법 */}
        {detailData?.data.manual && (
          <div className="mb-6">
            <h3 className="text-base font-medium text-grey06 mb-3">이용 방법</h3>
            <div className="text-sm text-grey05 leading-relaxed space-y-1">
              {detailData.data.manual.split('\\n').map((line, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="text-grey04 mt-1">•</span>
                  <span>{line.trim()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 혜택 받아가기 버튼 */}
        <button className="w-full py-4 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors">
          혜택 받아가기
        </button>
      </div>
    </div>
  );
};

export default StoreDetailCard;
