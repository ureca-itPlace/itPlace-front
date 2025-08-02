import React from 'react';
import Modal from '../../../components/Modal';
import GiftImg from '../../../../public/images/event/modal-gift.webp';
import EventModalButton from '../EventModalButton';

interface StarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StarModal: React.FC<StarModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} widthClass="w-[624px]">
      <div className="relative w-full flex flex-col items-center text-center">
        <div className="absolute -top-[136.5%] left-1/2 -translate-x-1/2 w-[380px] h-[292px]">
          <img src={GiftImg} alt="꽝 일러스트" className="w-full h-full object-contain" />
        </div>
        <h2 className="text-title-4 font-bold">행운의 스크래치 쿠폰 1장을 드렸어요!</h2>
        <p className="text-body-0 text-[#000000] mt-3 mb-2">
          어떤 상품이 당첨될지 몰라요🍀
          <br />
          이벤트 페이지에서 확인해보세요!
        </p>
        <EventModalButton onClick={onClose} label="확인" />
      </div>
    </Modal>
  );
};

export default StarModal;
