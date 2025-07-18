import React from 'react';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import AuthButton from '../common/AuthButton';
import AuthFooter from '../common/AuthFooter';

interface FindEmailFormProps {
  email: string;
  createdAt: string;
  onClickResetPassword: () => void;
  onClickLogin: () => void;
  onClickTabEmail?: () => void;
  onClickTabPassword?: () => void; // 상단 탭 클릭 시 비밀번호 찾기로 전환
}

const FindEmailForm: React.FC<FindEmailFormProps> = ({
  email,
  createdAt,
  onClickResetPassword,
  onClickLogin,
  onClickTabPassword,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      wrapperRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.out' }
    );
  }, []);

  return (
    <div ref={wrapperRef} className="w-[320px] mx-auto flex flex-col items-center">
      {/* 상단 토글 탭 */}
      <div className="relative w-[320px] h-[50px] flex justify-between items-center bg-grey01 rounded-[18px] p-[4px]">
        <button className="w-[153px] h-[42px] bg-white text-purple04 rounded-[18px] text-title-6">
          아이디 찾기
        </button>
        <button
          className="w-[153px] h-[42px] text-grey05 rounded-[18px] text-title-6"
          onClick={onClickTabPassword}
        >
          비밀번호 찾기
        </button>
      </div>

      {/* 안내 문구 */}
      <p className="text-title-6 text-grey05 mt-[40px]">휴대폰 번호와 일치하는 아이디입니다.</p>

      {/* 이메일 및 가입일 박스 */}
      <div className="w-[320px] h-[90px] bg-white border border-grey03 rounded-[18px] px-[20px] py-[16px] text-left mt-[20px] flex flex-col justify-center">
        <p className="text-body-2 text-black">
          아이디 : <span className="text-purple04 break-all">{email}</span>
        </p>
        <p className="text-body-2 text-grey04 mt-[4px]">가입일 : {createdAt}</p>
      </div>

      {/* 비밀번호 재설정 버튼 */}
      <AuthButton className="mt-[150px]" label="비밀번호 재설정" onClick={onClickResetPassword} />

      {/* 하단 로그인 링크 */}
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

export default FindEmailForm;
