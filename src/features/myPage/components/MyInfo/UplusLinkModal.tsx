// src/features/myPage/components/MyInfo/UplusLinkModal.tsx
import React from 'react';
import Modal from '../../../../components/Modal';

interface UplusLinkModalProps {
  isOpen: boolean;
  phone: string;
  onClose: () => void;
  onVerified: (grade: string) => void;
  loadUplusData: (phone: string) => Promise<any>; // 실제 API 타입 맞게 수정
}

const UplusLinkModal: React.FC<UplusLinkModalProps> = ({
  isOpen,
  phone,
  onClose,
  onVerified,
  loadUplusData,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      title="유플러스 회원이시군요!"
      message="기존 가입 정보를 불러오시겠습니까?"
      onClose={onClose}
      buttons={[
        {
          label: '아니요',
          type: 'secondary',
          onClick: onClose,
        },
        {
          label: '예',
          type: 'primary',
          onClick: async () => {
            try {
              const res = await loadUplusData(phone);
              const { membershipId } = res.data.data;
              // 여기서 등급을 계산
              const grade = membershipId ? 'VVIP' : '';
              onVerified(grade);
              onClose();
            } catch (e) {
              console.error(e);
              onClose();
            }
          },
        },
      ]}
    />
  );
};

export default UplusLinkModal;
