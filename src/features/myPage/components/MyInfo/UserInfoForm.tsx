// src/features/myPage/components/MyInfo/UserInfoForm.tsx
import React from 'react';

type Props = {
  name: string;
  gender: string;
  birthday: string;
  phoneNumber: string;
  email: string;
  onChangePasswordClick?: () => void;
  onDeleteClick?: () => void;
};

const UserInfoForm: React.FC<Props> = ({
  name,
  gender,
  birthday,
  phoneNumber,
  email,
  onChangePasswordClick,
  onDeleteClick,
}) => {
  return (
    <div className="flex justify-center mt-[100px] max-xl:mt-[60px] max-xlg:mt-[30px] max-md:mt-0">
      <div className="flex flex-col gap-4 w-full max-w-[690px] min-w-[590px] max-xl:max-w-[30.625rem] max-xl:min-w-[370px] max-xlg:w-full">
        <InfoRow label="이름" value={name} />
        <InfoRow label="성별" value={gender === 'MALE' ? '남성' : '여성'} />
        <InfoRow label="생년월일" value={birthday.replace(/-/g, '.')} />
        <InfoRow label="휴대폰 번호" value={phoneNumber} />
        <InfoRow label="이메일" value={email} />

        {/* 비밀번호 row */}
        <div className="flex items-center max-md:flex-col max-md:items-start">
          <div className="w-full max-w-[140px] text-title-4 text-black font-bold max-xl:text-title-6 max-xl:max-w-[120px] max-xl:font-bold max-md:text-grey05">
            비밀번호
          </div>
          <div className="flex-1 w-full mt-0">
            <div className="flex-1 flex items-center justify-between bg-grey01 rounded-[18px] px-6 py-4 max-xl:py-3 max-md:bg-white max-md:px-0">
              <span className="tracking-widest select-none max-md:text-grey04">●●●●●●●●</span>
              <button
                className="text-purple04 text-body-0 max-xl:text-body-2 max-md:right"
                onClick={onChangePasswordClick}
              >
                변경하기
              </button>
            </div>
          </div>
        </div>

        {/* 회원탈퇴 버튼 */}
        <div className="flex justify-end mt-4">
          <button
            className="bg-purple06 hover:bg-purple04 text-white rounded-[18px] px-6 py-3 text-title-5 max-xl:text-title-8 max-xl:px-5 max-xl:py-3 max-md:w-full max-md:rounded-[10px]"
            onClick={onDeleteClick}
          >
            회원탈퇴
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center max-md:flex-col max-md:items-start max-md:border-b-[1px]">
    {/* 왼쪽 라벨 */}
    <div className="w-full max-w-[140px] text-title-4 text-black font-bold max-xl:text-title-6 max-xl:max-w-[120px] max-xl:font-bold max-md:text-grey05">
      {label}
    </div>
    {/* 오른쪽 값 박스 */}
    <div className="flex-1 w-full bg-grey01 rounded-[18px] px-6 py-4 text-body-0 text-grey05 max-xl:text-body-2 max-xl:py-3 max-md:bg-white max-md:px-0 max-md:text-grey04">
      {value}
    </div>
  </div>
);

export default UserInfoForm;
