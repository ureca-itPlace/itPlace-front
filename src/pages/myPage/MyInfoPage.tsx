// src/pages/myPage/MyInfoPage.tsx
import { useEffect, useState } from 'react';
import MyPageContentLayout from '../../features/myPage/layout/MyPageContentLayout';
import UserInfoForm from '../../features/myPage/components/MyInfo/UserInfoForm';
import MembershipInfo from '../../features/myPage/components/MyInfo/MembershipInfo';
import FadeWrapper from '../../features/myPage/components/FadeWrapper';
import { mockUser } from '../../features/myPage/mock/mockData';
import PasswordChangeModal from '../../features/myPage/components/MyInfo/PasswordChangeModal';
import UserDeleteModal from '../../features/myPage/components/MyInfo/UserDeleteModal';
import UplusLinkModal from '../../features/myPage/components/MyInfo/UplusLinkModal';
import { loadUplusData } from '../../features/myPage/apis/uplus';

export default function MyInfoPage() {
  // 실제로는 전역 상태에서 로그인 여부를 가져오면 됨
  const [user, setUser] = useState<any>(null);
  const [isPwModalOpen, setIsPwModalOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [showUplusModal, setShowUplusModal] = useState(false);
  const [grade, setGrade] = useState<string | undefined>(user?.grade); // 초기 grade

  useEffect(() => {
    // API 미연결로 mockData 사용
    setUser(mockUser);
  }, []);

  // 데이터 로딩 중일 때 MainContentWrapper를 유지하면서 로딩 메시지 노출
  if (!user) {
    return (
      <div className="flex flex-row gap-[24px] w-full h-full">
        <MyPageContentLayout
          main={<div className="text-center mt-10 text-lg text-gray-500">Loading...</div>}
          aside={<></>}
          bottomImage="/images/myPage/bunny-info.webp"
          bottomImageFallback="/images/myPage/bunny-info.png"
          bottomImageAlt="회원 정보 토끼"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-[24px] w-full h-full">
      <MyPageContentLayout
        main={
          <div>
            <h1 className="text-title-2 text-black mb-8">회원 정보</h1>
            <UserInfoForm
              name={user.name}
              gender={user.gender}
              birthday={user.birthday}
              phoneNumber={user.phoneNumber}
              email={user.email}
              onChangePasswordClick={() => setIsPwModalOpen(true)}
              onDeleteClick={() => setDeleteModalOpen(true)}
            />
          </div>
        }
        aside={
          <FadeWrapper changeKey={user.grade}>
            <MembershipInfo
              name={user.name}
              grade={grade} //user.grade로 바꾸면 mockData상에서 멤버십등급을 가져와 변경된 UI 보기 가능
              onClickLink={() => setShowUplusModal(true)}
            />
          </FadeWrapper>
        }
        bottomImage="/images/myPage/bunny-info.webp"
        bottomImageFallback="/images/myPage/bunny-info.png"
        bottomImageAlt="회원 정보 토끼"
      />

      <UplusLinkModal
        isOpen={showUplusModal}
        phone={user.phoneNumber}
        onClose={() => setShowUplusModal(false)}
        onVerified={(newGrade) => setGrade(newGrade)}
        loadUplusData={loadUplusData}
      />

      <PasswordChangeModal
        isOpen={isPwModalOpen}
        currentPassword={currentPw}
        newPassword={newPw}
        confirmPassword={confirmPw}
        onCurrentChange={setCurrentPw}
        onNewChange={setNewPw}
        onConfirmChange={setConfirmPw}
        onCancel={() => {
          setIsPwModalOpen(false);
          setCurrentPw('');
          setNewPw('');
          setConfirmPw('');
        }}
        onSubmit={() => {
          // 🚨 여기서 비밀번호 변경 API 호출
          console.log('비밀번호 변경 요청', { currentPw, newPw, confirmPw });
          setIsPwModalOpen(false);
          setCurrentPw('');
          setNewPw('');
          setConfirmPw('');
        }}
      />

      <UserDeleteModal
        isOpen={deleteModalOpen}
        password={password}
        onPasswordChange={setPassword}
        onCancel={() => setDeleteModalOpen(false)}
        onDelete={() => {
          // 🚨 탈퇴 API 호출
          setDeleteModalOpen(false);
        }}
      />
    </div>
  );
}
