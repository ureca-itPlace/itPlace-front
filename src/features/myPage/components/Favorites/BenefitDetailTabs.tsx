import { useState, useEffect } from 'react';
import { mockTierBenefits, mockUser } from '../../mock/mockData';

// interface TierBenefitItem {
//   benefitId: number;
//   grade?: string;
//   isAll?: boolean;
//   content: string;
// }

export default function BenefitDetailTabs({
  benefitId,
  image,
  name,
}: {
  benefitId: number;
  image: string;
  name: string;
}) {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  const benefitList = mockTierBenefits.filter((b) => b.benefitId === benefitId);

  // 조건 1: isAll인 경우
  const allBenefit = benefitList.find((b) => b.isAll);

  // 조건 2: VIP콕 전용인지 확인
  const isVipKok = benefitList.every((b) => b.grade === 'VIP콕');

  // 초기 선택 등급
  useEffect(() => {
    if (allBenefit) {
      setSelectedGrade(null);
    } else if (isVipKok) {
      setSelectedGrade('VIP콕');
    } else {
      // VVIP/VIP/BASIC 중에서 유저 등급에 맞춰 선택
      const myGrade = mockUser.membershipGrade;
      setSelectedGrade(myGrade);
    }
  }, [benefitId, allBenefit, isVipKok]);

  // 🔹 공통된 스타일: 로고 카드
  function LogoBox({ image, alt }: { image: string; alt: string }) {
    return (
      <div className="w-full h-[142px] flex items-center justify-center border border-grey02 rounded-[10px] mb-5">
        <img src={image} alt={alt} className="h-[108px] object-contain" />
      </div>
    );
  }

  // 🔹 모든등급
  if (allBenefit) {
    return (
      <div className="w-full">
        <LogoBox image={image} alt={name} />
        <div className="flex items-center justify-center h-[50px] rounded-[12px]  bg-orange04 text-white text-center text-body-0 font-medium w-full mb-4">
          모든 등급
        </div>
        <p className="mt-4 whitespace-pre-line text-body-0 text-grey05">{allBenefit.content}</p>
      </div>
    );
  }

  // 🔹 VIP콕
  if (isVipKok) {
    // 유저가 VVIP 또는 VIP인 경우만 색상 활성화
    const active = mockUser.membershipGrade === 'VVIP' || mockUser.membershipGrade === 'VIP';
    const vipContent = benefitList.find((b) => b.grade === 'VIP콕');
    return (
      <div className="w-full">
        <LogoBox image={image} alt={name} />
        <div
          className={`flex items-center justify-center h-[50px] rounded-[12px] text-body-0 text-center font-medium mb-4 w-full ${
            active ? 'bg-gradient-myPage text-white' : 'bg-grey01 text-grey03'
          }`}
        >
          VIP콕
        </div>
        <p className="mt-4 whitespace-pre-line text-body-0 text-grey05">{vipContent?.content}</p>
      </div>
    );
  }

  // 🔹 VVIP/VIP/우수 탭
  const gradeTabs = ['VVIP', 'VIP', 'BASIC'];
  const content = benefitList.find((b) => b.grade === selectedGrade);

  return (
    <div className="w-full">
      <LogoBox image={image} alt={name} />
      <div className="flex w-full mb-4 bg-grey01 rounded-[12px] p-[4px]">
        {gradeTabs.map((g) => (
          <button
            key={g}
            onClick={() => setSelectedGrade(g)}
            className={`h-[42px] flex-1 text-body-0 font-medium transition-colors rounded-[8px] ${
              selectedGrade === g
                ? 'bg-white text-orange04 shadow-sm'
                : 'bg-transparent text-grey03'
            }`}
          >
            {g === 'BASIC' ? '우수' : g}
          </button>
        ))}
      </div>
      <p className="mt-4 whitespace-pre-line text-body-0 text-grey05">{content?.content}</p>
    </div>
  );
}
