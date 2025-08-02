import React, { useEffect, useState } from 'react';
import Modal from '../../../../components/Modal';
import StarImg from '/images/event/event-star.png';
import EventModalButton from './EventModalButton';

interface StarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const getTodayString = () => {
  const today = new Date();
  return today.toISOString().split('T')[0]; // YYYY-MM-DD 형식으로 반환
};

const StarModal: React.FC<StarModalProps> = ({ isOpen, onClose }) => {
  const [isHidden, setIsHidden] = useState<boolean>(false);

  useEffect(() => {
    const hiddenDate = localStorage.getItem('starModalHiddenDate');
    if (hiddenDate === getTodayString()) {
      setIsHidden(true);
    }
  }, []);

  const handleHide = () => {
    localStorage.setItem('starModalHiddenDate', getTodayString()); // 오늘 날짜를 로컬 스토리지에 저장
    setIsHidden(true); // 상태 업데이트
    onClose(); // 모달 닫기
  };

  if (isHidden) {
    return null; // 모달이 숨겨져 있으면 아무것도 렌더링하지 않음
  }

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
        <button onClick={handleHide} className="underline mt-6 text-body-3 text-grey03 font-light">
          오늘 하루 보지 않기
        </button>
      </div>
    </Modal>
  );
};

export default StarModal;
