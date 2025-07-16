import React from 'react';
import Modal from '../../../../components/common/AdminModal';

interface Member {
  id: string;
  name: string;
  nickname: string;
  email: string;
  phone: string;
  grade: 'VIP' | 'VVIP' | '우수';
  joinDate: string;
}

interface PartnerUsage {
  brand: string;
  amount: string;
  date: string;
}

interface MemberDetailModalProps {
  isOpen: boolean;
  member: Member | null;
  onClose: () => void;
  partnerUsageData: PartnerUsage[];
}

const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  isOpen,
  member,
  onClose,
  partnerUsageData,
}) => {
  if (!member) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="회원 상세정보">
      <div className="pt-[38px]">
        {/* 회원 정보 */}
        <div className="mb-6 ml-[40px]">
          <h4 className="text-title-2 font-semibold mb-2">{member.nickname}</h4>
          <p className="text-body-0 text-grey05">
            {member.grade} | 멤버십 번호: 123875793487594857
          </p>
        </div>

        {/* 제휴처 이용 내역 테이블 */}
        <div
          className="bg-grey01 rounded-[12px] overflow-hidden ml-[40px] mr-[40px]"
          style={{ height: 'calc(100% - 120px)' }}
        >
          <div className="bg-gray-200 px-4 py-3 border-b border-gray-300">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4 text-left text-body-2 font-medium text-gray-700">
                브랜드
              </div>
              <div className="col-span-4 text-center text-body-2 font-medium text-gray-700">
                할인 금액
              </div>
              <div className="col-span-4 text-center text-body-2 font-medium text-gray-700">
                날짜
              </div>
            </div>
          </div>
          <div className="overflow-y-auto" style={{ height: 'calc(100% - 48px)' }}>
            {partnerUsageData.map((usage, index) => (
              <div
                key={index}
                className="px-4 py-3 border-b border-gray-200 hover:bg-gray-100 transition-colors duration-150"
              >
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-4 text-body-2 text-gray-900 truncate">{usage.brand}</div>
                  <div className="col-span-4 text-body-2 text-gray-900 text-center pl-4">
                    {usage.amount}
                  </div>
                  <div className="col-span-4 text-body-2 text-gray-900 text-center pl-4">
                    {usage.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MemberDetailModal;
