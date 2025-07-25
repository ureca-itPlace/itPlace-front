import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Platform } from '../../../types';
import { TbChevronDown, TbCheck, TbChevronUp } from 'react-icons/tb';
import { RootState } from '../../../../../store';
import AddressTooltip from './AddressTooltip';
import { showToast } from '../../../../../utils/toast';

interface StoreCardProps {
  platform: Platform;
  isSelected: boolean;
  onSelect: (platform: Platform) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ platform, onSelect }) => {
  // Redux에서 사용자 등급 가져오기
  const membershipGrade = useSelector((state: RootState) => state.auth.user?.membershipGrade);

  // 사용자 등급 확인 헬퍼 함수
  const isUserGrade = (grade: string) => {
    if (!membershipGrade) return false;

    const userGrade = membershipGrade.toUpperCase();
    const benefitGrade = grade.toUpperCase();

    // 기본 매칭
    if (userGrade === benefitGrade) return true;

    // VIP/VVIP → "VIP 콕" 혜택도 포함
    if ((userGrade === 'VIP' || userGrade === 'VVIP') && benefitGrade === 'VIP콕') return true;

    return false;
  };

  // 등급 표시명 변환 헬퍼 함수
  const getGradeDisplayName = (grade: string) => {
    return grade === 'BASIC' ? '우수' : grade;
  };

  // 주소 툴팁 상태 관리
  const [showAddressTooltip, setShowAddressTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // 복사 기능
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast('복사가 완료되었습니다.', 'success');
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  // 툴팁 외부 클릭시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setShowAddressTooltip(false);
      }
    };

    if (showAddressTooltip) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAddressTooltip]);

  return (
    <div
      className="group cursor-pointer transition-colors duration-200 w-[370px] px-5 bg-white hover:bg-grey01"
      onClick={() => onSelect(platform)}
    >
      <div className="py-4">
        {/* 상단부: 가맹점 정보 + 로고 */}
        <div className="flex justify-between items-start mb-4">
          {/* 왼쪽: 가맹점 정보 2줄 */}
          <div className="flex flex-col">
            {/* 1줄: 가맹점명 + 카테고리 */}
            <div className="flex items-center gap-4 mb-2">
              <span className="text-title-7 font-bold text-grey06">{platform.name}</span>
              <span className="text-body-5 text-grey04">{platform.category}</span>
            </div>
            {/* 2줄: 거리 + 주소 */}
            <div className="flex items-center gap-3 mb-1 relative">
              <span className="text-body-3-bold text-black">{platform.distance}km</span>
              <span className="text-body-3 text-grey04 truncate w-[20ch]">{platform.roadName}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddressTooltip(!showAddressTooltip);
                }}
                className="hover:text-grey05 transition-colors"
              >
                {showAddressTooltip ? (
                  <TbChevronUp size={16} className="text-grey04" />
                ) : (
                  <TbChevronDown size={16} className="text-grey04" />
                )}
              </button>

              {/* 주소 툴팁 */}
              {showAddressTooltip && (
                <div ref={tooltipRef} className="absolute top-full left-0 mt-2 z-50">
                  <AddressTooltip
                    roadAddress={platform.roadAddress}
                    lotAddress={platform.address}
                    onCopy={handleCopy}
                    onClose={() => setShowAddressTooltip(false)}
                  />
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽: 브랜드 로고 */}
          <div className="w-[45px] h-[45px] flex items-center justify-center flex-shrink-0">
            {platform.imageUrl ? (
              <img
                src={platform.imageUrl}
                alt={`${platform.name} 로고`}
                className="w-full h-full object-contain rounded"
              />
            ) : (
              <div className="w-full h-full bg-red-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">{platform.name.charAt(0)}</span>
              </div>
            )}
          </div>
        </div>

        {/* 하단부: 혜택 내용 박스 */}
        <div className="rounded-[10px] p-3 w-[330px] bg-grey01 group-hover:bg-white">
          <div className="text-body-3-bold text-grey05 mb-2">혜택 내용</div>

          <div className="space-y-1">
            {platform.benefits.length > 0 ? (
              platform.benefits.map((benefit, benefitIndex) => {
                const [grade, content] = benefit.split(': ');

                return (
                  <div
                    key={benefitIndex}
                    className="grid grid-cols-[20px_60px_1fr] gap-2 items-center"
                  >
                    <TbCheck size={16} className="text-grey04" />
                    <span
                      className={`text-body-4 ${isUserGrade(grade) ? 'text-orange04 font-bold' : 'text-grey05'}`}
                    >
                      {getGradeDisplayName(grade)}
                    </span>
                    <span
                      className={`text-body-4 truncate ${isUserGrade(grade) ? 'text-orange04 font-bold' : 'text-grey05'}`}
                    >
                      {content}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="grid grid-cols-[20px_60px_1fr] gap-2 items-center">
                <TbCheck size={16} className="text-grey04" />
                <span className="text-body-4 text-grey05">혜택 정보가</span>
                <span className="text-body-4 text-grey05">없습니다</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreCard;
