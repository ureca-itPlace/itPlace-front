// src/pages/myPage/MyInfoPage.tsx
import { useEffect, useState } from 'react';
import MyPageContentLayout from '../../features/myPage/layout/MyPageContentLayout';
import UserInfoForm from '../../features/myPage/components/MyInfo/UserInfoForm';
import MembershipInfo from '../../features/myPage/components/MyInfo/MembershipInfo';
import FadeWrapper from '../../features/myPage/components/FadeWrapper';
import PasswordChangeModal from '../../features/myPage/components/MyInfo/PasswordChangeModal';
import UserDeleteModal from '../../features/myPage/components/MyInfo/UserDeleteModal';
import UplusLinkModal from '../../features/myPage/components/MyInfo/UplusLinkModal';
import api from '../../apis/axiosInstance';
import LoadingSpinner from '../../components/LoadingSpinner';
import { showToast } from '../../utils/toast';

interface UserInfo {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  gender: string;
  birthday: string;
  membershipId: string;
  membershipGrade: string;
}

export default function MyInfoPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const [isPwModalOpen, setIsPwModalOpen] = useState(false);
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [password, setPassword] = useState('');

  const [showUplusModal, setShowUplusModal] = useState(false);

  // ✅ 사용자 정보 조회
  const fetchUser = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ data: UserInfo }>('api/v1/users');
      setUser(res.data.data);
    } catch (err) {
      console.error('사용자 정보 조회 실패', err);
      showToast('사용자 정보 조회에 실패했습니다.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // ✅ 로딩중일 경우
  if (loading) {
    return (
      <MyPageContentLayout
        main={
          <div className="flex justify-center items-center h-full">
            <LoadingSpinner />
          </div>
        }
        aside={<></>}
        bottomImage="/images/myPage/bunny-info.webp"
        bottomImageFallback="/images/myPage/bunny-info.png"
        bottomImageAlt="회원 정보 토끼"
      />
    );
  }

  // ✅ user가 없을 경우
  if (!user) {
    return (
      <MyPageContentLayout
        main={
          <div className="text-center mt-10 text-lg text-grey05">
            사용자 정보를 불러올 수 없습니다.
          </div>
        }
        aside={<></>}
        bottomImage="/images/myPage/bunny-info.webp"
        bottomImageFallback="/images/myPage/bunny-info.png"
        bottomImageAlt="회원 정보 토끼"
      />
    );
  }

  return (
    <div className="flex flex-row gap-[28px] w-full h-full">
      <MyPageContentLayout
        main={
          <div>
            <h1 className="text-title-2 text-black mb-8 max-xl:text-title-4 max-xl:font-semibold max-xl:mb-4">
              회원 정보
            </h1>
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
          <FadeWrapper changeKey={user.membershipGrade}>
            <MembershipInfo
              name={user.name}
              grade={user.membershipGrade}
              onClickLink={() => setShowUplusModal(true)}
            />
          </FadeWrapper>
        }
        bottomImage="/images/myPage/bunny-info.webp"
        bottomImageFallback="/images/myPage/bunny-info.png"
        bottomImageAlt="회원 정보 토끼"
      />
      {/* 유플러스 연동 모달 */}
      <UplusLinkModal
        isOpen={showUplusModal}
        phone={user.phoneNumber}
        name={user.name}
        onClose={() => setShowUplusModal(false)}
        onVerified={fetchUser} // 성공 후 사용자 정보 다시 조회
      />
      {/* 비밀번호 변경 */}
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
        onSubmit={async () => {
          try {
            await api.post('api/v1/users/resetPassword', {
              // resetPasswordToken은 필요 없다면 제거
              email: user.email,
              newPassword: newPw,
              newPasswordConfirm: confirmPw,
            });
            showToast('비밀번호가 변경되었습니다.', 'success');
          } catch (err) {
            console.error('비밀번호 변경 실패:', err);
            showToast('현재 비밀번호가 일치하지 않아 변경에 실패했습니다.', 'error');
          } finally {
            setIsPwModalOpen(false);
            setCurrentPw('');
            setNewPw('');
            setConfirmPw('');
          }
        }}
      />
      {/* 회원탈퇴 */}
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
