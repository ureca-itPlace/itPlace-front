// src/features/myPage/components/MyInfo/UplusLinkModal.tsx
import React, { useState } from 'react';
import Modal from '../../../../components/Modal';
import { showToast } from '../../../../utils/toast';
import { UplusSuccessResponse, UplusErrorResponse } from '../../../../types/uplus'; // 타입 import
import { AxiosResponse } from 'axios';
import api from '../../../../apis/axiosInstance';

interface UplusLinkModalProps {
  isOpen: boolean;
  phone: string;
  name: string;
  onClose: () => void;
  onVerified: () => void;
}

const UplusLinkModal: React.FC<UplusLinkModalProps> = ({
  isOpen,
  name,
  phone,
  onClose,
  onVerified,
}) => {
  const [loading, setLoading] = useState(false);

  const handleLink = async () => {
    setLoading(true);
    try {
      const res: AxiosResponse<UplusSuccessResponse> = await api.post('api/v1/auth/loadUplusData', {
        name,
        phoneNumber: phone,
      });
      if (res.data.code === 'UPLUS_DATA_FOUND') {
        showToast('유플러스 정보 연동에 성공했습니다!', 'success');
        onVerified(); // ✅ MyInfoPage에서 fetchUser 실행
        onClose();
      }
    } catch (err: unknown) {
      // 서버가 400일 때
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        (err as { response?: { data?: UplusErrorResponse } }).response?.data
      ) {
        const data = (err as { response: { data: UplusErrorResponse } }).response.data;
        console.log(data.message);
        showToast('유플러스 회원이 아니신가요? 정보를 불러오지 못했습니다.', 'error');
      } else {
        showToast('유플러스 정보 연동 중 알 수 없는 오류가 발생했습니다.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      title="유플러스 회원이시군요!"
      message="기존 가입 정보를 불러오시겠습니까?"
      onClose={onClose}
      buttons={[
        { label: '아니요', type: 'secondary', onClick: onClose },
        {
          label: loading ? '불러오는 중...' : '예',
          type: 'primary',
          onClick: handleLink,
        },
      ]}
    />
  );
};

export default UplusLinkModal;
