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

  // 초기 로드 상태 관리 (nearby 방식과 완전히 동일)
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const isInitialLoadRef = useRef(isInitialLoad);
  isInitialLoadRef.current = isInitialLoad;

  const fetchDetail = useCallback(async () => {
    const category = activeTab === 'vipkok' ? 'VIP_COCK' : 'BASIC_BENEFIT';
    const currentPlatform = platformRef.current;

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
      // 중복 호출 방지 에러는 100ms 후 재시도
      if (e instanceof Error && e.message === 'Duplicate request prevented') {
        setTimeout(() => fetchDetailRef.current(), 100);
        return;
      }
      console.error('상세 혜택 API 호출 실패:', e);
      setDetailData(null);
    }
  }, [activeTab]);

  // fetchDetail 참조를 ref로 저장 (의존성 배열 최적화)
  const fetchDetailRef = useRef(fetchDetail);
  fetchDetailRef.current = fetchDetail;

  // 초기 로드만 (nearby 패턴과 동일)
  useEffect(() => {
    const initializeDetail = () => {
      fetchDetailRef.current();
    };

    initializeDetail();
  }, []); // 빈 의존성 배열로 초기 로드만

  // 초기 로드 완료 감지 (nearby 패턴과 동일 - detailData가 로드된 후에 완료 처리)
  useEffect(() => {
    if (detailData !== null && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [detailData, isInitialLoad]);

  // activeTab 변경 시에만 실행 (초기 로드 제외)
  useEffect(() => {
    if (isInitialLoadRef.current) {
      return;
    }
    fetchDetailRef.current();
  }, [activeTab]);

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
