// src/features/myPage/components/Favorites/BenefitDetailTabs.tsx
import { useEffect, useState } from 'react';
import { fetchFavoriteDetail } from '../../apis/favorites';
import { FavoriteDetail } from './../../../../types/favorites';
interface Props {
  benefitId: number;
  image: string;
  name: string;
  userGrade?: string; // 현재 로그인한 유저 등급
}

export default function BenefitDetailTabs({ benefitId, image, name, userGrade }: Props) {
  const [detail, setDetail] = useState<FavoriteDetail | null>(null);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchFavoriteDetail(benefitId);
        setDetail(res.data);

        const tiers = res.data.tiers;
        const allBenefit = tiers.find((t) => t.isAll);
        const isVipKok = tiers.every((t) => t.grade === 'VIP콕');

        if (allBenefit) {
          setSelectedGrade(null);
        } else if (isVipKok) {
          setSelectedGrade('VIP콕');
        } else if (userGrade) {
          setSelectedGrade(userGrade);
        } else {
          setSelectedGrade('BASIC');
        }
      } catch (e) {
        console.error('상세 조회 실패', e);
      }
    })();
  }, [benefitId, userGrade]);

  if (!detail) {
    return <p className="text-center mt-4 text-grey05">상세정보를 불러오는 중입니다...</p>;
  }

  const allBenefit = detail.tiers.find((t) => t.isAll);
  const isVipKok = detail.tiers.every((t) => t.grade === 'VIP콕');

  const LogoBox = ({ image, alt }: { image: string; alt: string }) => (
    <div className="w-full h-[142px] flex items-center justify-center border border-grey02 rounded-[10px] mb-5">
      <img src={image} alt={alt} className="h-[108px] object-contain" />
    </div>
  );

  // 🔹 모든등급
  if (allBenefit) {
    return (
      <div className="w-full">
        <LogoBox image={image} alt={name} />
        <div className="flex items-center justify-center h-[50px] rounded-[12px] bg-orange04 text-white text-center text-body-0 font-medium w-full mb-4">
          모든 등급
        </div>
        <p className="mt-4 whitespace-pre-line text-body-0 text-grey05">{allBenefit.context}</p>
      </div>
    );
  }

  // 🔹 VIP콕
  if (isVipKok) {
    const active = userGrade === 'VVIP' || userGrade === 'VIP';
    const vipContent = detail.tiers.find((b) => b.grade === 'VIP콕');
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
        <p className="mt-4 whitespace-pre-line text-body-0 text-grey05">{vipContent?.context}</p>
      </div>
    );
  }

  // 🔹 VVIP/VIP/BASIC
  const gradeTabs = ['VVIP', 'VIP', 'BASIC'];
  const content = detail.tiers.find((b) => b.grade === selectedGrade);

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
      <p className="mt-4 whitespace-pre-line text-body-0 text-grey05">{content?.context}</p>
    </div>
  );
}
