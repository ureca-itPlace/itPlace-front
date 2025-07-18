// src/features/myPage/components/FavoritesDeleteModal.tsx
import Modal from '../../../../components/Modal';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
export default function FavoritesDeleteModal({ isOpen, onClose, onConfirm }: Props) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="선택한 혜택을 삭제하시겠습니까?"
      message="삭제하신 혜택은 다시 복구할 수 없습니다."
      buttons={[
        { label: '아니오', type: 'secondary', onClick: onClose },
        { label: '삭제하기', type: 'primary', onClick: onConfirm },
      ]}
    />
  );
}
