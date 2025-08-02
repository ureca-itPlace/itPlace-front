import React from 'react';
import Modal from '../../../components/Modal';
import StarImg from '/images/event/event-star.png';
import EventModalButton from '../EventModalButton';

interface StarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StarModal: React.FC<StarModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} widthClass="w-[624px]">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-title-4 font-bold">숨겨진 별을 찾아 행운 쿠폰을 잡아보세요!</h2>
        <img src={StarImg} alt="별 이미지" className="mt-4 w-[100px] h-[100px]" />
        <p className="text-body-0 text-[#000000] mt-2">
          지도에서 별을 찾아 해당 혜택에
          <br /> 사용 이력을 등록하면 이벤트에 참여할 수 있어요.
        </p>
        <EventModalButton onClick={onClose} label="확인" />
      </div>
    </Modal>
  );
};

export default StarModal;
