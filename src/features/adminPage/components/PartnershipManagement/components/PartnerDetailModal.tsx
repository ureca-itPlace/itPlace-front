import React, { useState } from 'react';
import Modal from '../../../../../components/common/AdminModal';
import { Partner } from '../apis/PartnershipManagementApis';

interface EditingSectionProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  isEditing: boolean;
  className?: string;
}

const EditingSection: React.FC<EditingSectionProps> = ({
  label,
  value,
  onChange,
  placeholder,
  isEditing,
  className = '',
}) => (
  <div className="flex mb-8 ml-[16px]">
    <h5 className="text-title-5 text-black mb-4 w-[100px] flex-shrink-0">{label}</h5>
    <div className="pl-[24px] flex-1">
      <div className="space-y-3">
        <div>
          {isEditing ? (
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className={`text-body-0 text-grey05 bg-grey01 border border-grey02 rounded-[10px] px-2 py-1 w-full h-[150px] resize-none ${className}`}
              placeholder={placeholder}
            />
          ) : (
            <div className="text-body-0 text-grey05 whitespace-pre-line">{value}</div>
          )}
        </div>
      </div>
    </div>
  </div>
);

interface PartnerDetailModalProps {
  isOpen: boolean;
  partner: Partner | null;
  onClose: () => void;
}

const PartnerDetailModal: React.FC<PartnerDetailModalProps> = ({ isOpen, partner, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    benefitContent:
      '① VVIP/VIP: 4천원 할인\n우수: 2천원 할인\n② 오리지널/카라멜팝콘 L 4천원 구매권\nor 콤보 3천원 할인권(예매 건당 1매)',
    benefitInfo:
      'VVIP/VIP 등급 정보\nVIP관 내 무료예매 연3회/1+1예매 연9회(총 12회)\n(월 1회 사용 가능, CGV/메가박스 중 택 1)',
    usageMethod:
      '메가박스 웹/앱 > 영화예매 > 제휴포인트 > U+멤버십 > VIP콕 할인 > 멤버십 조회 > VIP콕 3개 헤택 중 1개 선택 > 예매\n\n*꼭 확인하세요\n- VIP콕 무료/1+1 혜택은 2D, 일반컨텐츠에 한하여 적용 가능하며, 일반관, 컴포트관만 예매 할 수 있습니다.- VIP콕 특별관 6천원 할인 혜택은 더부티크, Dolby Atmos, 더부티크스위트, Dolby Cinema, MX4D관에 한하여 적용 가능합니다.',
  });

  if (!partner) return null;

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // 저장 로직 추가
    console.log('저장된 데이터:', editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // 원래 데이터로 복원
    setEditData({
      benefitContent:
        '① VVIP/VIP: 4천원 할인\n우수: 2천원 할인\n② 오리지널/카라멜팝콘 L 4천원 구매권\nor 콤보 3천원 할인권(예매 건당 1매)',
      benefitInfo:
        'VVIP/VIP 등급 정보\nVIP관 내 무료예매 연3회/1+1예매 연9회(총 12회)\n(월 1회 사용 가능, CGV/메가박스 중 택 1)',
      usageMethod:
        '메가박스 웹/앱 > 영화예매 > 제휴포인트 > U+멤버십 > VIP콕 할인 > 멤버십 조회 > VIP콕 3개 헤택 중 1개 선택 > 예매\n\n*꼭 확인하세요\n- VIP콕 무료/1+1 혜택은 2D, 일반컨텐츠에 한하여 적용 가능하며, 일반관, 컴포트관만 예매 할 수 있습니다.- VIP콕 특별관 6천원 할인 혜택은 더부티크, Dolby Atmos, 더부티크스위트, Dolby Cinema, MX4D관에 한하여 적용 가능합니다.',
    });
  };

  const handleInputChange = (field: keyof typeof editData, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="제휴처 상세정보">
      <div className="relative h-full flex flex-col">
        {/* 내용 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* 브랜드 정보 */}
          <div className="flex items-center justify-between mb-[28px]">
            <div className="flex items-center ml-[16px]">
              <div>
                <h4 className="text-title-2 text-black mb-1">{partner.partnerName}</h4>
                <p className="text-body-0 text-grey05 mt-1">
                  영화보다 멋진 당신의 일상을 위하여, 라이프스타일 매거진스!
                </p>
              </div>
            </div>
            <div className="w-[120px] h-[120px]  bg-white  flex items-center justify-center">
              <img
                src={partner.image}
                alt={`${partner.partnerName} 로고`}
                className="w-[120px] h-[120px] object-contain"
              />
            </div>
          </div>
          {/*제공 혜택 섹션*/}
          <EditingSection
            label="제공 횟수"
            value={editData.benefitInfo}
            onChange={(v) => handleInputChange('benefitInfo', v)}
            placeholder="제공 횟수 정보를 입력하세요"
            isEditing={isEditing}
          />
          {/*혜택 내용 섹션*/}
          <EditingSection
            label="혜택 내용"
            value={editData.benefitContent}
            onChange={(v) => handleInputChange('benefitContent', v)}
            placeholder="혜택 내용을 입력하세요"
            isEditing={isEditing}
          />
          {/*이용방법 섹션*/}
          <EditingSection
            label="이용 방법"
            value={editData.usageMethod}
            onChange={(v) => handleInputChange('usageMethod', v)}
            placeholder="이용 방법을 입력하세요"
            isEditing={isEditing}
          />
        </div>
        {/* 하단 고정 버튼 */}
        <div className="flex justify-center py-2 mt-2 gap-3">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="w-[218px] h-[52px] bg-white text-grey05 rounded-[30px] text-body-0 font-medium border border-grey03"
              >
                취소하기
              </button>
              <button
                onClick={handleSave}
                className="w-[218px] h-[52px] bg-purple04 text-white rounded-[30px] text-body-0 font-medium"
              >
                저장하기
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="w-[218px] h-[52px] bg-purple04 text-white rounded-[30px] text-body-0 font-medium "
            >
              수정하기
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default PartnerDetailModal;
