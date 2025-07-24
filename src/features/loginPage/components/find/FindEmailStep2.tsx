// components/find/FindEmailStep2.tsx
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import ToggleTab from '../common/FindToggleTab';
import AuthButton from '../common/AuthButton';
import AuthFooter from '../common/AuthFooter';

type Props = {
  email: string;
  createdAt: string;
  onClickResetPassword: () => void;
  onClickLogin: () => void;
  onClickTabPassword: () => void;
};

const FindEmailStep2 = ({
  email,
  createdAt,
  onClickResetPassword,
  onClickLogin,
  onClickTabPassword,
}: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(wrapperRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 });
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="w-[320px] max-xl:w-[274px] max-lg:w-[205px] mx-auto flex flex-col items-center"
    >
      <ToggleTab active="email" onClickEmail={() => {}} onClickPassword={onClickTabPassword} />

      {/* 안내 문구 */}
      <p className="text-title-6 max-xl:text-title-7 max-lg:text-title-8 text-grey05 mt-[40px] max-xl:mt-[34px] max-lg:mt-[27px]">
        휴대폰 번호와 일치하는 아이디입니다.
      </p>

      {/* 이메일 및 가입일 박스 */}
      <div className="w-[320px] max-xl:w-[274px] max-lg:w-[205px] h-[90px] max-xl:h-[77px] max-lg:h-[61px] bg-white border border-grey03 rounded-[18px] max-xl:rounded-[15px] max-lg:rounded-[12px] px-[20px] max-xl:px-[17px] max-lg:px-[13px] py-[16px] max-xl:py-[14px] max-lg:py-[11px] text-left mt-[20px] max-xl:mt-[17px] max-lg:mt-[13px] flex flex-col justify-center">
        <p className="text-body-2 text-black">
          아이디 : <span className="text-purple04 break-all">{email}</span>
        </p>
        <p className="text-body-2 text-grey04 mt-[4px]">가입일 : {createdAt ? createdAt : '-'}</p>
      </div>

      {/* 비밀번호 재설정 버튼 */}
      <AuthButton className="mt-[150px]" label="비밀번호 재설정" onClick={onClickResetPassword} />

      {/* 로그인 링크 */}
      <div className="mt-[8px] flex justify-center">
        <AuthFooter
          leftText="이미 회원이신가요?"
          rightText="로그인 하러 가기"
          onRightClick={onClickLogin}
        />
      </div>
    </div>
  );
};

export default FindEmailStep2;
