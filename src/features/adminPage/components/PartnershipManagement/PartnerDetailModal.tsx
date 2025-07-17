import React from 'react';
import Modal from '../../../../components/common/AdminModal';

interface Partner {
  id: string;
  logo: string;
  brand: string;
  category: string;
  benefitType: string;
  searchRank: number;
  favoriteRank: number;
  usageRank: number;
}

interface PartnerDetailModalProps {
  isOpen: boolean;
  partner: Partner | null;
  onClose: () => void;
}

const PartnerDetailModal: React.FC<PartnerDetailModalProps> = ({ isOpen, partner, onClose }) => {
  if (!partner) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="제휴처 상세정보">
      <div className="relative h-full flex flex-col">
        {/* 내용 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 브랜드 정보 */}
          <div className="flex items-center justify-between mb-[28px]">
            <div className="flex items-center ml-[16px]">
              <div>
                <h4 className="text-title-2 text-black mb-1">{partner.brand}</h4>
                <p className="text-body-0 text-grey05 mt-1">
                  영화보다 멋진 당신의 일상을 위하여, 라이프스타일 매거진스!
                </p>
              </div>
            </div>
            <div className="w-[120px] h-[120px]  bg-white  flex items-center justify-center">
              <img
                src={partner.logo}
                alt={`${partner.brand} 로고`}
                className="w-[120px] h-[120px] object-contain"
              />
            </div>
          </div>
          {/* 제공 혜택 섹션 */}
          <div className="flex mb-8 ml-[16px]">
            <h5 className="text-title-5  text-black mb-4 w-[100px] flex-shrink-0">혜택 내용</h5>
            <div className=" pl-[24px]">
              <div className="space-y-3">
                <div>
                  <p className="text-body-0  text-grey05">① VVIP/VIP: 4천원 할인</p>
                  <p className="text-body-0 text-grey05">우수: 2천원 할인</p>
                  <p className="text-body-0 text-grey05">② 오리지널/카라멜팝콘 L 4천원 구매권</p>
                  <p className="text-body-0 text-grey05">or 콤보 3천원 할인권(예매 건당 1매)</p>
                </div>
              </div>
            </div>
          </div>
          {/* 제공 혜택 섹션 */}
          <div className="flex mb-8 ml-[16px]">
            <h5 className="text-title-5  text-black mb-4 w-[100px] flex-shrink-0">제공 횟수</h5>
            <div className=" pl-[24px]">
              <div className="space-y-3">
                <div>
                  <p className="text-body-0  text-grey05">VVIP/VIP 등급 정보</p>
                  <p className="text-body-0 text-grey05">
                    VIP관 내 무료예매 연3회/1+1예매 연9회(총 12회)
                  </p>
                  <p className="text-body-0 text-grey05">
                    (월 1회 사용 가능, CGV/메가박스 중 택 1)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 이용방법 섹션 */}
          <div className="flex mb-8 ml-[16px]">
            <h5 className="text-title-5  text-black mb-4 w-[100px] flex-shrink-0">이용 방법</h5>
            <div className="pl-[24px]">
              <div className="space-y-3">
                <div>
                  <p className="text-body-0  text-grey05">
                    메가박스 웹/앱 &gt; 영화예매 &gt; 제휴포인트 &gt; U+멤버십 &gt; VIP콕 할인 &gt;
                    멤버십 조회 &gt; VIP콕 3개 헤택 중 1개 선택 &gt; 예매
                  </p>
                  <p className="text-body-0 text-grey05">*꼭 확인하세요</p>
                  <p className="text-body-0 text-grey05">
                    - VIP콕 무료/1+1 혜택은 2D, 일반컨텐츠에 한하여 적용 가능하며, 일반관,
                    컴포트관만 예매 할 수 있습니다.- VIP콕 특별관 6천원 할인 혜택은 더부티크, Dolby
                    Atmos, 더부티크스위트, Dolby Cinema, MX4D관에 한하여 적용 가능합니다.- VIP콕
                    무료/1+1 혜택은 2D, 일반컨텐츠에 한하여 적용 가능하며, 일반관, 컴포트관만 예매
                    할 수 있습니다.- VIP콕 특별관 6천원 할인 혜택은 더부티크, Dolby Atmos,
                    더부티크스위트, Dolby Cinema, MX4D관에 한하여 적용 가능합니다.- VIP콕 무료/1+1
                    혜택은 2D, 일반컨텐츠에 한하여 적용 가능하며, 일반관, 컴포트관만 예매 할 수
                    있습니다.- VIP콕 특별관 6천원 할인 혜택은 더부티크, Dolby Atmos, 더부티크스위트,
                    Dolby Cinema, MX4D관에 한하여 적용 가능합니다.- VIP콕 무료/1+1 혜택은 2D,
                    일반컨텐츠에 한하여 적용 가능하며, 일반관, 컴포트관만 예매 할 수 있습니다.-
                    VIP콕 특별관 6천원 할인 혜택은 더부티크, Dolby Atmos, 더부티크스위트, Dolby
                    Cinema, MX4D관에 한하여 적용 가능합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* 하단 고정 버튼 */}
        <div className="flex justify-center py-2 mt-2">
          <button className="w-[218px] h-[52px] bg-purple04 text-white rounded-[30px] text-body-0  hover:bg-purple05 transition-colors sticky bottom-4">
            수정하기
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PartnerDetailModal;
