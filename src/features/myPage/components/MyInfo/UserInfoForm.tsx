// src/features/myPage/components/MyInfo/UserInfoForm.tsx
import React from 'react';

type Props = {
  name: string;
  gender: string;
  birthday: string;
  phoneNumber: string;
  email: string;
};

const UserInfoForm: React.FC<Props> = ({ name, gender, birthday, phoneNumber, email }) => {
  return (
    <div className="flex justify-center mt-[100px]">
      <div className="flex flex-col gap-4 w-[690px]">
        <InfoRow label="이름" value={name} />
        <InfoRow label="성별" value={gender === 'MALE' ? '남성' : '여성'} />
        <InfoRow label="생년월일" value={birthday.replace(/-/g, '.')} />
        <InfoRow label="휴대폰 번호" value={phoneNumber} />
        <InfoRow label="이메일" value={email} />

        {/* 비밀번호 row */}
        <div className="flex items-center">
          <div className="w-[140px] text-title-4 text-black font-bold">비밀번호</div>
          <div className="flex-1 flex items-center justify-between bg-grey01 rounded-[18px] px-6 py-4">
            <span className="tracking-widest select-none">●●●●●●●●</span>
            <button className="text-purple04 text-body-0">변경하기</button>
          </div>
        </div>

        {/* 회원탈퇴 버튼 */}
        <div className="flex justify-end mt-4">
          <button className="bg-purple06 hover:bg-grey01 text-white rounded-[18px] px-6 py-3 text-title-5">
            회원탈퇴
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex items-center">
    {/* 왼쪽 라벨 */}
    <div className="w-[140px] text-title-4 text-black font-bold">{label}</div>
    {/* 오른쪽 값 박스 */}
    <div className="flex-1 bg-grey01 rounded-[18px] px-6 py-4 text-body-0 text-grey05">{value}</div>
  </div>
);

export default UserInfoForm;
