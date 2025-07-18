// src/features/myPage/components/MyInfo/UserDeleteModal.tsx
import Modal from '../../../../components/Modal';

interface UserDeleteModalProps {
  isOpen: boolean;
  password: string;
  onPasswordChange: (val: string) => void;
  onCancel: () => void;
  onDelete: () => void;
}

export default function UserDeleteModal({
  isOpen,
  password,
  onPasswordChange,
  onCancel,
  onDelete,
}: UserDeleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      title="정말 탈퇴하시겠습니까?"
      message="탈퇴를 위해 현재 비밀번호를 입력해주세요."
      input
      inputPlaceholder="현재 비밀번호 입력"
      inputValue={password}
      onInputChange={onPasswordChange}
      onClose={onCancel}
      buttons={[
        { label: '취소', type: 'secondary', onClick: onCancel },
        { label: '탈퇴하기', type: 'primary', onClick: onDelete },
      ]}
    />
  );
}
