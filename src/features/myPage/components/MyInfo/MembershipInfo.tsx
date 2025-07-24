// src/features/myPage/components/MyInfo/MembershipInfo.tsx
import React from 'react';

type Props = {
  name: string;
  grade?: string;
  onClickLink?: () => void;
};

const gradeMapping: Record<string, string> = {
  BASIC: '우수',
};

const MembershipInfo: React.FC<Props> = ({ name, grade, onClickLink }) => {
  const displayGrade = grade ? (gradeMapping[grade] ?? grade) : undefined;
  return (
    <div className="flex flex-col gap-4">
      {grade ? (
        <>
          <p className="text-black text-title-2 mb-8 max-xl:text-title-4 max-xl:mb-4 max-xl:font-semibold">
            안녕하세요{' '}
            <span className="text-purple04 text-title-2 max-xl:text-title-4 max-xl:font-semibold">
              {name.slice(1)}
            </span>
            님🐰
          </p>
          <p className="text-grey05 text-body-0 max-xl:text-body-2">
            {name.slice(1)}님의 멤버십 등급은{' '}
            <span className="text-purple03 text-body-0-bold max-xl:text-body-2">
              {displayGrade}
            </span>{' '}
            입니다.
            <br /> 놓치기 아까운 혜택이 가득해요!
          </p>
          <div className="bg-gradient-myPage text-white text-[96px] font-bold text-center rounded-[18px] px-6 pb-0 pt-4 mt-10 max-xl:text-[70px] max-xl:px-3 max-xl:mt-4">
            {displayGrade}
          </div>
        </>
      ) : (
        <>
          <p className="text-black text-title-2 mb-8 max-xl:text-title-4 max-xl:mb-4 max-xl:font-semibold">
            안녕하세요{' '}
            <span className="text-purple04 text-title-2 max-xl:text-title-4 max-xl:mb-4 max-xl:font-semibold">
              {name.slice(1)}
            </span>
            님🐰
          </p>
          <p className="text-grey05 text-body-0 max-xl:text-body-2">
            지금은{' '}
            <span className="text-purple03 text-body-0-bold max-xl:text-body-2-bold">
              멤버십 등급 없이
            </span>{' '}
            이용 중이에요.
          </p>
          <p className="text-grey05 text-body-0 max-xl:text-body-2">
            LG U+ 회원이시라면, <br /> 연동 후 고객님의 등급이 자동 적용됩니다.
          </p>
          <button
            onClick={onClickLink}
            className="bg-purple04 text-white rounded-[10px] px-2 py-3 mt-10 text-body-0-bold hover:bg-purple05 max-xl:text-body-2-bold max-xl:mt-6"
          >
            연동하기
          </button>
        </>
      )}
    </div>
  );
};

export default MembershipInfo;
