import React from 'react';
import Modal from '../../../../../components/common/AdminModal';
import { Member } from '../apis/MemberManagementApis';

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

  // 등급 변환 함수
  const getGradeDisplay = (grade: 'VVIP' | 'VIP' | 'BASIC' | null) => {
    if (grade === 'BASIC') return '우수';
    return grade || '-';
  };

  // 회원 구분 변환 함수
  const getUserTypeDisplay = (userType: 'LINKED' | 'STANDARD') => {
    return userType === 'LINKED' ? 'U+ 연동' : '일반';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="회원 상세정보">
      <div className="pt-[38px]">
        {/* 회원 정보 */}
        <div className="mb-6 ml-[40px]">
          <h4 className="text-title-2  mb-2">{member.name}</h4>
          <p className="text-body-0 text-grey05">
            {getGradeDisplay(member.grade)} | {getUserTypeDisplay(member.userType)} | 멤버십 번호:{' '}
            <span className="text-body-0-bold">{member.id}</span>
          </p>
        </div>

        {/* 제휴처 이용 내역 테이블 */}
        <div
          className="bg-grey01 rounded-[12px] overflow-hidden ml-[40px] mr-[40px]"
          style={{ height: 'calc(100% - 120px)' }}
        >
          <div className="bg-grey02 pl-[42px] py-4 border-b border-grey02">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4 text-left text-body-0  text-grey05">브랜드</div>
              <div className="col-span-4 text-center text-body-0  text-grey05">할인 금액</div>
              <div className="col-span-4 text-center text-body-0 text-grey05">날짜</div>
            </div>
          </div>
          <div className="overflow-y-auto" style={{ height: 'calc(100% - 48px)' }}>
            {partnerUsageData.map((usage, index) => (
              <div key={index} className="pl-[42px] py-4 border-b border-white">
                <div className="grid grid-cols-12 gap-8">
                  <div className="col-span-4 text-body-0 text-black truncate">{usage.brand}</div>
                  <div className="col-span-4 text-body-0 text-black text-center ">
                    {usage.amount}
                  </div>
                  <div className="col-span-4 text-body-0 text-black text-center ">{usage.date}</div>
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
