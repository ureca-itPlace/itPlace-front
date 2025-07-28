import React, { useEffect, useState, useCallback, useRef } from 'react';
import { getBenefitDetail } from '../../../api/benefitDetail';
import { Platform } from '../../../types';
import { BenefitDetailResponse } from '../../../types/api';
import StoreDetailHeader from './StoreDetailHeader';
import StoreDetailInfo from './StoreDetailInfo';
import StoreDetailBenefits from './StoreDetailBenefits';
import StoreDetailUsageGuide from './StoreDetailUsageGuide';
import StoreDetailActionButton from './StoreDetailActionButton';

interface StoreDetailCardProps {
  platform: Platform;
  onClose: () => void;
}

const StoreDetailCard: React.FC<StoreDetailCardProps> = ({ platform, onClose }) => {
  const [activeTab, setActiveTab] = useState<'default' | 'vipkok'>('default');
  const [detailData, setDetailData] = useState<BenefitDetailResponse | null>(null);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // platform 참조를 ref로 저장 (의존성 배열 최적화)
  const platformRef = useRef(platform);
  platformRef.current = platform;

  // 중복 호출 방지를 위한 ref (다른 API들과 동일한 패턴)
  const lastFetchParamsRef = useRef<string>('');

  const fetchDetail = useCallback(async () => {
    const category = activeTab === 'vipkok' ? 'VIP_COCK' : 'BASIC_BENEFIT';
    const currentPlatform = platformRef.current;

    // 중복 호출 방지: 같은 파라미터로 이미 호출했으면 스킵
    const currentParams = `${currentPlatform.storeId}-${currentPlatform.partnerId}-${category}`;
    if (lastFetchParamsRef.current === currentParams) {
      return;
    }
    lastFetchParamsRef.current = currentParams;

    try {
      const res = await getBenefitDetail({
        storeId: currentPlatform.storeId,
        partnerId: currentPlatform.partnerId,
        mainCategory: category,
      });

      setDetailData(res);

      // API 응답에서 isFavorite 상태 업데이트
      if (res?.data?.isFavorite !== undefined) {
        setIsFavorite(res.data.isFavorite);
      }
    } catch (e) {
      console.error('상세 혜택 API 호출 실패:', e);
      setDetailData(null);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  // 즐겨찾기 상태 변경 핸들러
  const handleFavoriteChange = (newIsFavorite: boolean) => {
    setIsFavorite(newIsFavorite);
  };

  return (
    <div className="w-full bg-white rounded-t-[20px] shadow-lg flex flex-col h-full max-md:rounded-t-[15px]">
      {/* 고정 영역 */}
      <div className="px-6 pt-6 flex-shrink-0 max-md:px-4 max-md:pt-4">
        <StoreDetailHeader platform={platform} onClose={onClose} />
        <StoreDetailInfo
          url={detailData?.data.url}
          roadAddress={platform.roadAddress}
          address={platform.address}
          postCode={platform.postCode}
        />
        <StoreDetailBenefits
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          detailData={detailData}
        />
      </div>

      {/* 스크롤 영역 - 이용 방법만 */}
      <div
        className={`flex-1 overflow-y-auto ${detailData?.data.manual ? 'px-6 max-md:px-4' : ''}`}
      >
        <StoreDetailUsageGuide detailData={detailData} />
      </div>

      {/* 고정 버튼 */}
      <div className="px-6 pb-2 flex-shrink-0 max-md:px-4 max-md:pb-2">
        <StoreDetailActionButton
          benefitId={detailData?.data?.benefitId}
          isFavorite={isFavorite}
          onFavoriteChange={handleFavoriteChange}
        />
      </div>
    </div>
  );
};

export default StoreDetailCard;
