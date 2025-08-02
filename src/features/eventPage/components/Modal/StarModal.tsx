import React from 'react';
import Modal from '../../../../components/Modal';
import StarImg from '/images/event/event-star.png';
import EventModalButton from './EventModalButton';

interface StarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StarModal: React.FC<StarModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} widthClass="w-[624px] max-md:max-w-[calc(100%-32px)]">
      <div className="flex flex-col items-center text-center">
        <h2 className="text-title-4 font-bold pt-2 max-sm:text-title-7 max-sm:font-bold">
          숨겨진 별을 찾아 행운 쿠폰을 잡아보세요!
        </h2>
        <img
          src={StarImg}
          alt="별 이미지"
          className="mt-4 w-[100px] h-[100px] max-sm:w-[80px] max-sm:h-[80px] object-contain max-sm:mt-2"
        />
        <p className="text-body-0 text-[#000000] mt-2 max-sm:text-body-3">
          지도에서 별을 찾아 해당 혜택에
          <br /> 사용 이력을 등록하면 이벤트에 참여할 수 있어요.
        </p>
        <EventModalButton onClick={onClose} label="확인" />
        <button onClick={onClose} className="underline mt-6 text-body-3 text-grey03 font-light">
          다시 보지 않기
        </button>
      </div>
    </Modal>
  );
};

export default StarModal;
